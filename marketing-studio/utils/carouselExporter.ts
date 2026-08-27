import { toPng } from 'html-to-image';
import { ImageProject } from '../types/imageStudio';
import { getCarouselGeometry, isCarouselProject } from './imageDesignSystem';

const compressForZip = async (data: Uint8Array): Promise<Uint8Array> => {
  if (typeof CompressionStream === 'undefined') {
    throw new Error('ZIP compression is not supported by this browser');
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
  return compressed.slice(2, -4);
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
      const compressedData = await compressForZip(dataBytes);
      const crc = this.computeCRC32(dataBytes);

      // Local file header (30 bytes + name + data)
      const localHeader = new Uint8Array(30 + nameBytes.length);
      const lv = new DataView(localHeader.buffer);
      lv.setUint32(0, 0x04034b50, true); // Local file header signature
      lv.setUint16(4, 20, true); // Version needed to extract
      lv.setUint16(6, 0, true); // General purpose bit flag
      lv.setUint16(8, 8, true); // Compression method (8 = deflate)
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
      cv.setUint16(10, 8, true); // Compression method (8 = deflate)
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

// CRC32 Lookup Table
const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC32_TABLE[i] = c;
}

/**
 * Pure client-side PDF Generator for multi-page slide documents (LinkedIn Carousels)
 */
function createMinimalPdf(slicesJpg: string[], widthPt: number, heightPt: number): Blob {
  const pdfChunks: string[] = [];
  const xref: number[] = [];

  let currentBytePos = 0;
  const addChunk = (str: string) => {
    pdfChunks.push(str);
    currentBytePos += new TextEncoder().encode(str).length;
  };

  addChunk('%PDF-1.4\n');

  const pageObjIds: number[] = [];
  let objIndex = 1;

  // Obj 1: Catalog
  xref.push(currentBytePos);
  addChunk(`${objIndex} 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
  objIndex++;

  // Obj 2: Pages container (placeholder, will fill refs)
  const pagesObjIndex = objIndex;
  objIndex++;

  const imageObjRefs: number[] = [];
  const contentObjRefs: number[] = [];

  // For each slide, create Image XObject, Content Stream, and Page Object
  for (let i = 0; i < slicesJpg.length; i++) {
    const rawDataUrl = slicesJpg[i];
    const base64Data = rawDataUrl.replace(/^data:image\/jpeg;base64,/, '');
    const binaryData = atob(base64Data);
    const dataLength = binaryData.length;

    // Image Object
    const imgObjId = objIndex++;
    imageObjRefs.push(imgObjId);
    xref.push(currentBytePos);
    addChunk(
      `${imgObjId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${Math.round(widthPt)} /Height ${Math.round(heightPt)} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${dataLength} >>\nstream\n`
    );
    addChunk(binaryData);
    addChunk('\nendstream\nendobj\n');

    // Content Stream (Draws image scaled to full page)
    const contentObjId = objIndex++;
    contentObjRefs.push(contentObjId);
    const streamContent = `q\n${widthPt} 0 0 ${heightPt} 0 0 cm\n/Im${i + 1} Do\nQ\n`;
    xref.push(currentBytePos);
    addChunk(
      `${contentObjId} 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}endstream\nendobj\n`
    );

    // Page Object
    const pageObjId = objIndex++;
    pageObjIds.push(pageObjId);
    xref.push(currentBytePos);
    addChunk(
      `${pageObjId} 0 obj\n<< /Type /Page /Parent ${pagesObjIndex} 0 R /MediaBox [0 0 ${widthPt} ${heightPt}] /Resources << /XObject << /Im${i + 1} ${imgObjId} 0 R >> >> /Contents ${contentObjId} 0 R >>\nendobj\n`
    );
  }

  // Backfill Obj 2: Pages
  const pagesKidsStr = pageObjIds.map((id) => `${id} 0 R`).join(' ');
  const pagesStr = `${pagesObjIndex} 0 obj\n<< /Type /Pages /Kids [${pagesKidsStr}] /Count ${pageObjIds.length} >>\nendobj\n`;
  // Insert Pages object at its recorded index
  xref.splice(1, 0, currentBytePos);
  addChunk(pagesStr);

  // XRef Table
  const startXref = currentBytePos;
  addChunk('xref\n');
  addChunk(`0 ${objIndex}\n`);
  addChunk('0000000000 65535 f \n');
  for (let i = 0; i < xref.length; i++) {
    const offsetStr = String(xref[i]).padStart(10, '0');
    addChunk(`${offsetStr} 00000 n \n`);
  }

  // Trailer
  addChunk(`trailer\n<< /Size ${objIndex} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`);

  return new Blob([new TextEncoder().encode(pdfChunks.join(''))], { type: 'application/pdf' });
}

export interface CarouselExportResult {
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

  return {
    slideCount: geometry.slideCount,
    slideWidth: project.carouselConfig?.slideWidth ?? geometry.slideWidth,
    slideHeight: project.carouselConfig?.slideHeight ?? geometry.slideHeight,
    panoramaWidth: (project.carouselConfig?.slideWidth ?? geometry.slideWidth) * geometry.slideCount,
    panoramaHeight: project.carouselConfig?.slideHeight ?? geometry.slideHeight,
  };
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
  targetFormat: 'zip' | 'pdf' | 'full' = 'zip'
): Promise<void> {
  const { slideCount, slideWidth, slideHeight, panoramaHeight } = getCarouselExportPlan(project);
  const totalHeight = panoramaHeight;

  // 1. Render the full panoramic stage to PNG with html-to-image at native resolution
  const fullDataUrl = await toPng(canvasElement, {
    pixelRatio: 1,
    cacheBust: true,
    filter: (domNode) => {
      // Ignore editor guides and overlays during capture
      if (domNode instanceof HTMLElement) {
        if (domNode.getAttribute('data-editor-overlay') === 'true') return false;
      }
      return true;
    },
  });

  // If full panoramic image is requested, download directly
  if (targetFormat === 'full') {
    const link = document.createElement('a');
    link.download = getCarouselDownloadName(project, 'panorama', 'png');
    link.href = fullDataUrl;
    link.click();
    return;
  }

  // 2. Load the captured image into an in-memory Canvas to perform slicing
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
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

    // Draw slice area from source image
    ctx.drawImage(
      img,
      idx * slideWidth, // sx
      0, // sy
      slideWidth, // sWidth
      slideHeight, // sHeight
      0, // dx
      0, // dy
      slideWidth, // dWidth
      slideHeight // dHeight
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
      const filename = `slide_${paddedIndex}_${slideWidth}x${totalHeight}.png`;
      zip.addFile(filename, bytes);
    }
  }

  // 4. Download file according to requested format
  if (targetFormat === 'pdf') {
    const pdfBlob = createMinimalPdf(jpgDataUrls, slideWidth * 0.75, slideHeight * 0.75);
    const link = document.createElement('a');
    link.download = getCarouselDownloadName(project, 'linkedin_carousel', 'pdf');
    link.href = URL.createObjectURL(pdfBlob);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 3000);
  } else {
    const zipBlob = await zip.generateZip();
    const link = document.createElement('a');
    link.download = getCarouselDownloadName(project, 'carousel_pack', 'zip');
    link.href = URL.createObjectURL(zipBlob);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 3000);
  }
}
