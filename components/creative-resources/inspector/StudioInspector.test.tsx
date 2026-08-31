import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { StudioInspector } from './StudioInspector';

describe('shared StudioInspector', () => {
  it('renders the same panel chrome and accessible empty state for both hosts', () => {
    const html = renderToStaticMarkup(
      <StudioInspector title="Propiedades" onClose={() => undefined}>
        <p>Selecciona una capa</p>
      </StudioInspector>,
    );

    expect(html).toContain('data-visual-contract="shared-studio-inspector-panel"');
    expect(html).toContain('aria-label="Cerrar Propiedades"');
    expect(html).toContain('Selecciona una capa');
    expect(html).toContain('custom-scrollbar');
  });

  it('renders common layer actions and delegates updates through the adapter contract', () => {
    const onUpdate = vi.fn();
    const html = renderToStaticMarkup(
      <StudioInspector
        title="Capa: TEXT"
        layer={{
          id: 'layer-1',
          title: 'Titular',
          type: 'text',
          visible: true,
          locked: false,
          position: { x: 25, y: 50 },
          width: 80,
          height: 20,
          rotation: 0,
          opacity: 1,
          onUpdate,
          onToggleVisibility: () => undefined,
          onToggleLock: () => undefined,
          onRemove: () => undefined,
        }}
        sections={[{
          id: 'timing',
          title: 'Timing y medios',
          controls: [{ kind: 'number', label: 'Frame de inicio', value: 0, onChange: () => undefined }],
        }]}
      />,
    );

    expect(html).toContain('Ocultar capa');
    expect(html).toContain('Bloquear capa');
    expect(html).toContain('Eliminar capa');
    expect(html).toContain('Transformación y posición');
    expect(html).toContain('Timing y medios');
    expect(html).toContain('min-h-11');
  });
});
