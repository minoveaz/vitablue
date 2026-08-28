import { toPng } from 'html-to-image';
import type { ImageProject } from '../types/imageStudio';
import { getCarouselAspectRatio, getCarouselGeometry, isCarouselProject, validateCarouselGeometry } from './imageDesignSystem';

export type CarouselExportFormat = 'zip' | 'pdf' | 'png' | 'panorama' | 'full';

export interface CarouselSliceRect {
  index: number;
  sourceX: number;
  sourceY: 0;
  width: number;
  height: number;
}

/** Integer-only source rectangles prevent anti-aliased seams at slide cuts. */
export const getCarouselSliceRect = (
  plan: CarouselExportPlan,
  index: number,
): CarouselSliceRect => {
  if (
    !Number.isInteger(plan.slideCount) ||
    !Number.isInteger(plan.slideWidth) ||
    !Number.isInteger(plan.slideHeight) ||
    plan.slideCount < 1 ||
    plan.slideWidth < 1 ||
    plan.slideHeight < 1 ||
    plan.panoramaWidth !== plan.slideWidth * plan.slideCount ||
    plan.panoramaHeight !== plan.slideHeight
  ) {
    throw new RangeError('Carousel export plan must use positive integer, gapless geometry');
  }
  if (!Number.isInteger(index) || index < 0 || index >= plan.slideCount) {
    throw new RangeError(`Carousel slide index ${index} is out of bounds`);
  }
  return {
    index,
    sourceX: index * plan.slideWidth,
    sourceY: 0,
    width: plan.slideWidth,
    height: plan.slideHeight,
  };
};

export const isCarouselExportExcluded = (node: Node): boolean => {
  let current: Node | null = node;
  while (current) {
    const element = current as Node & {
      dataset?: { editorOverlay?: string; exportExclude?: string };
      getAttribute?: (name: string) => string | null;
    };
    if (
      element.dataset?.editorOverlay === 'true' ||
      element.dataset?.exportExclude === 'true' ||
      element.getAttribute?.('data-editor-overlay') === 'true' ||
      element.getAttribute?.('data-export-exclude') === 'true'
    ) {
        return true;
    }
    current = current.parentNode;
  }
  return false;
};

/** Removes only editor-selection utility classes; user layer classes stay intact. */
export const getCarouselExportSafeClassName = (className: string): string =>
  className
    .split(/\s+/)
    .filter((token) => token && !token.startsWith('ring-') && token !== 'shadow-2xl')
    .join(' ');

/**
 * Temporarily removes editor chrome that is applied as a style on a content
 * layer (selection rings and handles). The DOM is restored even when the
 * renderer rejects, so exporting never changes the editor state.
 */
const prepareCarouselExportDom = (root: HTMLElement): (() => void) => {
  const hiddenNodes = Array.from(
    root.querySelectorAll<HTMLElement>('[data-editor-overlay="true"], [data-export-exclude="true"]'),
  );
  const hiddenStyles = hiddenNodes.map((node) => ({
    node,
    display: node.style.display,
    visibility: node.style.visibility,
  }));
  hiddenNodes.forEach((node) => {
    node.style.display = 'none';
    node.style.visibility = 'hidden';
  });

  const selectedLayers = Array.from(root.querySelectorAll<HTMLElement>('.canvas-layer-item')).filter((layer) =>
    Array.from(layer.classList).some((className) => className.startsWith('ring-')),
  );
  const selectionStyles = selectedLayers.map((layer) => ({
    layer,
    className: layer.className,
    boxShadow: layer.style.boxShadow,
  }));
  selectedLayers.forEach((layer) => {
    layer.className = getCarouselExportSafeClassName(layer.className);
    layer.style.boxShadow = 'none';
  });

  return () => {
    hiddenStyles.forEach(({ node, display, visibility }) => {
      node.style.display = display;
      node.style.visibility = visibility;
    });
    selectionStyles.forEach(({ layer, className, boxShadow }) => {
      layer.className = className;
      layer.style.boxShadow = boxShadow;
    });
  };
};

export const dataUrlToBytes = (dataUrl: string): Uint8Array => {
  const encoded = dataUrl.split(',', 2)[1] ?? '';
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
};

const compressForZip = async (data: Uint8Array): Promise<{ data: Uint8Array; method: 0 | 8 }> => {
  if (typeof CompressionStream === 'undefined') {
    return { data, method: 0 };
  }

  const stream = new CompressionStream('deflate');
  const writer = stream.writable.getWriter();
  await writer.write(data);
  await writer.close();
  const compressed = new Uint8Array(await new Response(stream.readable).arrayBuffer());

  // ZIP expects a raw DEFLATE stream; CompressionStream('deflate') wraps it in zlib.
  if (compressed.length < 6) {
    throw new Error('ZIP compression returned an invalid DEFLATE stream');
  }
  return { data: compressed.slice(2, -4), method: 8 };
};

class SimpleZipBuilder {
  private files: { name: string; data: Uint8Array }[] = [];

  public addFile(name: string, data: Uint8Array) {
    this.files.push({ name, data });
  }

  public async generateZip(): Promise<Blob> {
    const fileEntries: Uint8Array[] = [];
    const centralDirectoryEntries: Uint8Array[] = [];
    let currentOffset = 0;

    for (const file of this.files) {
      const nameBytes = new TextEncoder().encode(file.name);
      const dataBytes = file.data;
      const compressed = await compressForZip(dataBytes);
      const compressedData = compressed.data;
      const crc = this.computeCRC32(dataBytes);

      // Local file header (30 bytes + name + data)
      const localHeader = new Uint8Array(30 + nameBytes.length);
      const lv = new DataView(localHeader.buffer);
      lv.setUint32(0, 0x04034b50, true); // Local file header signature
      lv.setUint16(4, 20, true); // Version needed to extract
      lv.setUint16(6, 0, true); // General purpose bit flag
      lv.setUint16(8, compressed.method, true);
      lv.setUint16(10, 0, true); // Mod time
      lv.setUint16(12, 0, true); // Mod date
      lv.setUint32(14, crc, true); // CRC-32
      lv.setUint32(18, compressedData.length, true); // Compressed size
      lv.setUint32(22, dataBytes.length, true); // Uncompressed size
      lv.setUint16(26, nameBytes.length, true); // Filename length
      lv.setUint16(28, 0, true); // Extra field length
      localHeader.set(nameBytes, 30);

      // Central directory header (46 bytes + name)
      const cdHeader = new Uint8Array(46 + nameBytes.length);
      const cv = new DataView(cdHeader.buffer);
      cv.setUint32(0, 0x02014b50, true); // Central directory signature
      cv.setUint16(4, 20, true); // Version made by
      cv.setUint16(6, 20, true); // Version needed to extract
      cv.setUint16(8, 0, true); // General purpose bit flag
      cv.setUint16(10, compressed.method, true);
      cv.setUint16(12, 0, true); // Mod time
      cv.setUint16(14, 0, true); // Mod date
      cv.setUint32(16, crc, true); // CRC-32
      cv.setUint32(20, compressedData.length, true); // Compressed size
      cv.setUint32(24, dataBytes.length, true); // Uncompressed size
      cv.setUint16(28, nameBytes.length, true); // Filename length
      cv.setUint16(30, 0, true); // Extra field length
      cv.setUint16(32, 0, true); // Comment length
      cv.setUint16(34, 0, true); // Disk number
      cv.setUint16(36, 0, true); // Internal attributes
      cv.setUint32(38, 0, true); // External attributes
      cv.setUint32(42, currentOffset, true); // Relative offset of local header
      cdHeader.set(nameBytes, 46);

      fileEntries.push(localHeader, compressedData);
      centralDirectoryEntries.push(cdHeader);

      currentOffset += localHeader.length + compressedData.length;
    }

    const cdOffset = currentOffset;
    let cdSize = 0;
    for (const cde of centralDirectoryEntries) {
      cdSize += cde.length;
    }

    // End of central directory record (22 bytes)
    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true); // EOCD signature
    ev.setUint16(4, 0, true); // Disk number
    ev.setUint16(6, 0, true); // Start disk
    ev.setUint16(8, this.files.length, true); // Records on disk
    ev.setUint16(10, this.files.length, true); // Total records
    ev.setUint32(12, cdSize, true); // Size of central directory
    ev.setUint32(16, cdOffset, true); // Offset of central directory
    ev.setUint16(20, 0, true); // Comment length

    const allParts: BlobPart[] = [...fileEntries, ...centralDirectoryEntries, eocd];
    return new Blob(allParts, { type: 'application/zip' });
  }

  private computeCRC32(data: Uint8Array): number {
    let crc = 0 ^ -1;
    for (let i = 0; i < data.length; i++) {
      crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ data[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }
}

/** Creates a standards-compliant ZIP without touching the DOM or triggering a download. */
export const createCarouselZip = async (
  files: ReadonlyArray<{ name: string; data: Uint8Array }>,
): Promise<Blob> => {
  const zip = new SimpleZipBuilder();
  files.forEach((file) => zip.addFile(file.name, file.data));
  return zip.generateZip();
};

// CRC32 Lookup Table
const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC32_TABLE[i] = c;
}

/** Pure client-side PDF generator for multi-page slide documents. */
export function createCarouselPdf(
  slicesJpg: string[],
  widthPt: number,
  heightPt: number,
  imageWidth = Math.round(widthPt),
  imageHeight = Math.round(heightPt),
): Blob {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [encoder.encode('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n')];
  const offsets: number[] = [0];
  let byteOffset = chunks[0].length;
  const pageIds: number[] = [];
  const pageCount = slicesJpg.length;
  const pagesId = 2;
  let nextId = 3;

  const addObject = (id: number, header: string, body: Uint8Array | string, suffix = '\nendobj\n') => {
    const bodyBytes = typeof body === 'string' ? encoder.encode(body) : body;
    const prefix = encoder.encode(`${id} 0 obj\n${header}`);
    const end = encoder.encode(suffix);
    offsets[id] = byteOffset;
    chunks.push(prefix, bodyBytes, end);
    byteOffset += prefix.length + bodyBytes.length + end.length;
  };

  addObject(1, '<< /Type /Catalog /Pages 2 0 R >>\n', '');

  const imageIds = slicesJpg.map(() => nextId++);
  const contentIds = slicesJpg.map(() => nextId++);
  slicesJpg.forEach((slice, index) => {
    const image = dataUrlToBytes(slice);
    addObject(
      imageIds[index],
      `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`,
      image,
      '\nendstream\nendobj\n',
    );
    const content = `q\n${widthPt} 0 0 ${heightPt} 0 0 cm\n/Im${index + 1} Do\nQ\n`;
    addObject(contentIds[index], `<< /Length ${encoder.encode(content).length} >>\nstream\n`, content, 'endstream\nendobj\n');
    pageIds.push(nextId++);
  });

  addObject(
    pagesId,
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageCount} >>\n`,
    '',
  );

  pageIds.forEach((pageId, index) => {
    addObject(
      pageId,
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${widthPt} ${heightPt}] /Resources << /XObject << /Im${index + 1} ${imageIds[index]} 0 R >> >> /Contents ${contentIds[index]} 0 R >>\n`,
      '',
    );
  });

  const startXref = byteOffset;
  const xref = [`xref\n0 ${nextId}\n`, '0000000000 65535 f \n'];
  for (let id = 1; id < nextId; id += 1) {
    xref.push(`${String(offsets[id] ?? 0).padStart(10, '0')} 00000 n \n`);
  }
  const trailer = `trailer\n<< /Size ${nextId} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;
  chunks.push(encoder.encode(xref.join('')), encoder.encode(trailer));
  return new Blob(chunks, { type: 'application/pdf' });
}

export interface CarouselExportResult {
  panoramaBlob?: Blob;
  /** Alias kept for callers that label the panorama as a PNG export. */
  pngBlob?: Blob;
  zipBlob?: Blob;
  pdfBlob?: Blob;
  fullImageBlob?: Blob;
  slicesCount: number;
}

export interface CarouselExportPlan {
  slideCount: number;
  slideWidth: number;
  slideHeight: number;
  panoramaWidth: number;
  panoramaHeight: number;
}

export const getCarouselExportPlan = (project: ImageProject): CarouselExportPlan => {
  const isCarousel = isCarouselProject(project.preset, project.carouselConfig?.enabled);
  if (!isCarousel) {
    throw new Error('Cannot export a project that is not configured as a carousel');
  }

  const geometry = getCarouselGeometry(
    project.preset,
    project.carouselConfig?.slideCount,
    project.carouselConfig?.enabled,
  );

  const plan = {
    slideCount: geometry.slideCount,
    slideWidth: project.carouselConfig?.slideWidth ?? geometry.slideWidth,
    slideHeight: project.carouselConfig?.slideHeight ?? geometry.slideHeight,
    panoramaWidth: (project.carouselConfig?.slideWidth ?? geometry.slideWidth) * geometry.slideCount,
    panoramaHeight: project.carouselConfig?.slideHeight ?? geometry.slideHeight,
  };
  const validation = validateCarouselGeometry(plan, getCarouselAspectRatio(project.preset));
  if (!validation.valid) throw new Error(`Invalid carousel geometry: ${validation.errors.join('; ')}`);
  return plan;
};

export const getCarouselDownloadName = (
  project: ImageProject,
  suffix: 'panorama' | 'linkedin_carousel' | 'carousel_pack',
  extension: 'png' | 'pdf' | 'zip',
): string => {
  const title = project.title.trim().toLowerCase().replace(/\s+/g, '_') || 'carousel';
  return `${title}_${suffix}.${extension}`;
};

/**
 * Splits and exports a panoramic carousel into individual slices, ZIP archive or LinkedIn PDF
 */
export async function exportCarouselSlices(
  canvasElement: HTMLElement,
  project: ImageProject,
  targetFormat: CarouselExportFormat = 'zip',
): Promise<CarouselExportResult> {
  const { slideCount, slideWidth, slideHeight, panoramaHeight } = getCarouselExportPlan(project);

  // 1. Render the full panoramic stage to PNG with html-to-image at native resolution
  const restoreExportDom = prepareCarouselExportDom(canvasElement);
  let fullDataUrl: string;
  try {
    fullDataUrl = await toPng(canvasElement, {
      pixelRatio: 1,
      cacheBust: true,
      width: slideWidth * slideCount,
      height: panoramaHeight,
      canvasWidth: slideWidth * slideCount,
      canvasHeight: panoramaHeight,
      filter: (domNode) => {
        return !isCarouselExportExcluded(domNode);
      },
    });
  } finally {
    restoreExportDom();
  }

  // If full panoramic image is requested, download directly
  if (targetFormat === 'full' || targetFormat === 'png' || targetFormat === 'panorama') {
    const panoramaBlob = new Blob([dataUrlToBytes(fullDataUrl)], { type: 'image/png' });
    const link = document.createElement('a');
    link.download = getCarouselDownloadName(project, 'panorama', 'png');
    link.href = fullDataUrl;
    link.click();
    return { panoramaBlob, pngBlob: panoramaBlob, fullImageBlob: panoramaBlob, slicesCount: slideCount };
  }

  // 2. Load the captured image into an in-memory Canvas to perform slicing
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      if (img.naturalWidth !== slideWidth * slideCount || img.naturalHeight !== panoramaHeight) {
        reject(new Error(`Panorama raster is ${img.naturalWidth}×${img.naturalHeight}; expected ${slideWidth * slideCount}×${panoramaHeight}`));
        return;
      }
      resolve();
    };
    img.onerror = reject;
    img.src = fullDataUrl;
  });

  const zip = new SimpleZipBuilder();
  const jpgDataUrls: string[] = [];

  // 3. Slice each slide precisely
  for (let idx = 0; idx < slideCount; idx++) {
    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = slideWidth;
    sliceCanvas.height = slideHeight;
    const ctx = sliceCanvas.getContext('2d');
    if (!ctx) continue;
    // A source and destination rectangle of equal integer dimensions should
    // copy pixels verbatim, never interpolate neighbouring slide edges.
    ctx.imageSmoothingEnabled = false;

    const rect = getCarouselSliceRect({ slideCount, slideWidth, slideHeight, panoramaWidth: slideWidth * slideCount, panoramaHeight }, idx);
    // Draw integer-aligned source pixels; no overlap or interpolation at boundaries.
    ctx.drawImage(
      img,
      rect.sourceX,
      rect.sourceY,
      rect.width,
      rect.height,
      0,
      0,
      rect.width,
      rect.height,
    );

    if (targetFormat === 'pdf') {
      const jpgUrl = sliceCanvas.toDataURL('image/jpeg', 0.92);
      jpgDataUrls.push(jpgUrl);
    } else {
      // PNG format for ZIP
      const sliceDataUrl = sliceCanvas.toDataURL('image/png');
      const base64Data = sliceDataUrl.replace(/^data:image\/png;base64,/, '');
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let b = 0; b < binaryString.length; b++) {
        bytes[b] = binaryString.charCodeAt(b);
      }

      const paddedIndex = String(idx + 1).padStart(2, '0');
      const filename = `slide_${paddedIndex}.png`;
      zip.addFile(filename, bytes);
    }
  }

  // 4. Download file according to requested format
  if (targetFormat === 'pdf') {
    const pdfBlob = createCarouselPdf(jpgDataUrls, slideWidth * 0.75, slideHeight * 0.75, slideWidth, slideHeight);
    const link = document.createElement('a');
    link.download = getCarouselDownloadName(project, 'linkedin_carousel', 'pdf');
    link.href = URL.createObjectURL(pdfBlob);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 3000);
    return { pdfBlob, slicesCount: jpgDataUrls.length };
  } else {
    const zipBlob = await zip.generateZip();
    const link = document.createElement('a');
    link.download = getCarouselDownloadName(project, 'carousel_pack', 'zip');
    link.href = URL.createObjectURL(zipBlob);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 3000);
    return { zipBlob, slicesCount: slideCount };
  }
}
