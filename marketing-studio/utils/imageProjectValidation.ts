import { ImageLayer, ImageProject } from '../types/imageStudio';

export interface ImageProjectValidationIssue {
  code: 'invalid-project' | 'invalid-layer' | 'out-of-bounds' | 'overlap' | 'incomplete-data';
  message: string;
  layerId?: string;
}

const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

export function validateImageProject(project: ImageProject): ImageProjectValidationIssue[] {
  const issues: ImageProjectValidationIssue[] = [];
  if (!project.id || !project.preset?.width || !project.preset?.height || !Array.isArray(project.layers)) {
    issues.push({ code: 'invalid-project', message: 'El proyecto no tiene una estructura válida.' });
    return issues;
  }

  project.layers.forEach((layer) => {
    if (!layer.id || !layer.title || !layer.props || !finite(layer.position?.x) || !finite(layer.position?.y)) {
      issues.push({ code: 'incomplete-data', message: 'La capa tiene datos incompletos.', layerId: layer.id });
      return;
    }
    if (!finite(layer.scale) || layer.scale <= 0 || (layer.width !== undefined && layer.width <= 0) ||
        (layer.height !== undefined && layer.height <= 0)) {
      issues.push({ code: 'invalid-layer', message: 'La capa tiene geometría inválida.', layerId: layer.id });
    }
    if (layer.position.x < 0 || layer.position.x > 100 || layer.position.y < 0 || layer.position.y > 100) {
      issues.push({ code: 'out-of-bounds', message: 'La capa está fuera de los límites del lienzo.', layerId: layer.id });
    }
  });

  const visible = project.layers.filter((layer) => layer.visible !== false && layer.width && layer.height);
  for (let i = 0; i < visible.length; i += 1) {
    for (let j = i + 1; j < visible.length; j += 1) {
      const a = visible[i];
      const b = visible[j];
      const aLeft = a.position.x - ((a.width ?? 0) * (a.scale ?? 1) / project.preset.width) * 50;
      const aRight = a.position.x + ((a.width ?? 0) * (a.scale ?? 1) / project.preset.width) * 50;
      const aTop = a.position.y - ((a.height ?? 0) * (a.scale ?? 1) / project.preset.height) * 50;
      const aBottom = a.position.y + ((a.height ?? 0) * (a.scale ?? 1) / project.preset.height) * 50;
      const bLeft = b.position.x - ((b.width ?? 0) * (b.scale ?? 1) / project.preset.width) * 50;
      const bRight = b.position.x + ((b.width ?? 0) * (b.scale ?? 1) / project.preset.width) * 50;
      const bTop = b.position.y - ((b.height ?? 0) * (b.scale ?? 1) / project.preset.height) * 50;
      const bBottom = b.position.y + ((b.height ?? 0) * (b.scale ?? 1) / project.preset.height) * 50;
      if (aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop) {
        issues.push({ code: 'overlap', message: 'Dos capas visibles se solapan.', layerId: `${a.id}:${b.id}` });
      }
    }
  }
  return issues;
}

export function clampLayerPosition(position: ImageLayer['position']): ImageLayer['position'] {
  return {
    // Permit compositions to intentionally bleed beyond the canvas edges.
    x: Math.max(-100, Math.min(200, position.x)),
    y: Math.max(-100, Math.min(200, position.y)),
  };
}
