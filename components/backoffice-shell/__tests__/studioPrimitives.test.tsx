import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  BottomWorkspace,
  CanvasGrid,
  CanvasChrome,
  LayerActionMenu,
  LiveStatus,
  SelectionOverlay,
  ShortcutManager,
  StudioInspectorPanel,
  StudioResourcePanel,
  StudioStageToolbar,
  StudioToolRail,
  ZoomPanControls,
  CANVAS_GRID_PATTERNS,
  createShortcutManager,
  handleShortcutEvent,
  matchesShortcut,
} from '../primitives';
import { SuiteCanvas } from '../SuiteCanvas';

describe('shared Creative Studio primitives', () => {
  it('renders tool rail slots, active state and accessible labels', () => {
    const html = renderToStaticMarkup(
      <StudioToolRail
        items={[{ id: 'assets', label: 'Assets', icon: <span>A</span> }]}
        activeToolId="assets"
        onSelect={() => undefined}
        footerSlot={<span>footer</span>}
      />,
    );

    expect(html).toContain('aria-label="Herramientas creativas"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('min-h-11');
    expect(html).toContain('footer');
    expect(html).toContain('data-creative-studio-region="tool-rail"');
  });

  it('keeps optional panels and bottom workspace opt-in', () => {
    expect(renderToStaticMarkup(<StudioResourcePanel visible={false}>resources</StudioResourcePanel>)).toBe('');
    expect(renderToStaticMarkup(<StudioInspectorPanel open={false}>inspector</StudioInspectorPanel>)).toBe('');

    const html = renderToStaticMarkup(
      <BottomWorkspace headerSlot={<span>header slot</span>} footerSlot={<span>footer slot</span>}>
        timeline
      </BottomWorkspace>,
    );
    expect(html).toContain('header slot');
    expect(html).toContain('timeline');
    expect(html).toContain('footer slot');
  });

  it('keeps resource and inspector panels on the same chrome contract', () => {
    const resource = renderToStaticMarkup(
      <StudioResourcePanel onClose={() => undefined}>resources</StudioResourcePanel>,
    );
    const inspector = renderToStaticMarkup(
      <StudioInspectorPanel as="div" onClose={() => undefined}>inspector</StudioInspectorPanel>,
    );

    for (const html of [resource, inspector]) {
      expect(html).toContain('min-h-12');
      expect(html).toContain('border-b');
      expect(html).toContain('p-4 custom-scrollbar');
      expect(html).toContain('min-h-11 min-w-11');
      expect(html).toContain('focus-visible:ring-2');
    }
    expect(resource).toContain('data-visual-contract="shared-studio-resource-panel"');
    expect(inspector).toContain('data-visual-contract="shared-studio-inspector-panel"');
    expect(inspector).toContain('role="complementary"');
  });

  it('renders an explicit mobile-safe state while keeping the editor tablet-first', () => {
    const canvas = renderToStaticMarkup(
      <SuiteCanvas mobileSafeMode mobileSafeModeTitle="Editor en tablet" aside={<span>Inspector</span>}>
        stage
      </SuiteCanvas>,
    );
    expect(canvas).toContain('md:hidden');
    expect(canvas).toContain('hidden md:flex');
    expect(canvas).toContain('role="region"');
    expect(canvas).toContain('w-[min(20rem,28vw)]');
  });

  it('composes canvas chrome slots without owning editor content', () => {
    const html = renderToStaticMarkup(
      <CanvasChrome toolbar={<span>toolbar</span>} topSlot={<span>top</span>} bottomSlot={<span>bottom</span>} overlays={<span>overlay</span>}>
        stage
      </CanvasChrome>,
    );
    expect(html).toContain('toolbar');
    expect(html).toContain('top');
    expect(html).toContain('stage');
    expect(html).toContain('bottom');
    expect(html).toContain('overlay');
    expect(html).toContain('role="region"');
    expect(html).toContain('aria-label="Lienzo de diseño"');
    expect(html).toContain('data-visual-contract="creative-studio-canvas-chrome"');
  });

  it('renders the configurable decorative grid without capturing input', () => {
    const html = renderToStaticMarkup(
      <CanvasGrid
        variant="dotted"
        spacing={32}
        color="var(--color-primary)"
        opacity="var(--canvas-grid-opacity, 0.72)"
        style={{ '--canvas-grid-background': 'var(--color-secondary)' }}
      />,
    );

    expect(html).toContain('pointer-events-none');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-visual-contract="creative-studio-canvas-grid"');
    expect(html).toContain('background-size:32px 32px');
    expect(html).toContain('--canvas-grid-color:var(--color-primary)');
    expect(CANVAS_GRID_PATTERNS.technical.backgroundImage).toContain('linear-gradient');
    expect(renderToStaticMarkup(<CanvasGrid visible={false} />)).toBe('');
  });

  it('keeps the grid in CanvasChrome and lets hosts opt out', () => {
    const withGrid = renderToStaticMarkup(<CanvasChrome>stage</CanvasChrome>);
    const withoutGrid = renderToStaticMarkup(<CanvasChrome grid={false}>stage</CanvasChrome>);

    expect(withGrid).toContain('background-image:radial-gradient');
    expect(withGrid).toContain('bg-primary-dark');
    expect(withGrid).toContain('stage');
    expect(withoutGrid).not.toContain('background-image:radial-gradient');
  });

  it('keeps stage controls on the shared visual contract', () => {
    const html = renderToStaticMarkup(
      <StudioStageToolbar data-visual-contract="image-studio-stage-toolbar">
        <button type="button">Zoom</button>
      </StudioStageToolbar>,
    );
    expect(html).toContain('role="toolbar"');
    expect(html).toContain('bottom-5');
    expect(html).toContain('bg-primary-dark/95');
    expect(html).toContain('Zoom');
  });

  it('exposes zoom callbacks and selection/action visibility contracts', () => {
    const onZoomChange = vi.fn();
    const html = renderToStaticMarkup(
      <ZoomPanControls zoom={1} onZoomChange={onZoomChange} onFitToScreen={() => undefined} onPanModeChange={() => undefined} />,
    );
    expect(html).toContain('aria-label="Nivel de zoom"');
    expect(html).toContain('aria-label="Ajustar al lienzo"');

    expect(renderToStaticMarkup(<SelectionOverlay visible={false} bounds={{ left: 0, top: 0, width: 10, height: 10 }} />)).toBe('');
    const menu = renderToStaticMarkup(
      <LayerActionMenu
        actions={[{ id: 'delete', label: 'Eliminar', hidden: true }, { id: 'duplicate', label: 'Duplicar' }]}
        onAction={() => undefined}
      />,
    );
    expect(menu).not.toContain('Eliminar');
    expect(menu).toContain('Duplicar');
  });

  it('matches shortcuts and invokes exactly one binding', () => {
    expect(matchesShortcut({ key: 's', metaKey: true, ctrlKey: false, altKey: false, shiftKey: false }, 'mod+s')).toBe(true);
    expect(matchesShortcut({ key: 's', metaKey: false, ctrlKey: true, altKey: false, shiftKey: false }, 'mod+s')).toBe(true);
    const trigger = vi.fn();
    const preventDefault = vi.fn();
    const event = {
      key: 'Escape',
      metaKey: false,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      target: null,
      preventDefault,
      stopPropagation: vi.fn(),
    } as unknown as KeyboardEvent;
    expect(handleShortcutEvent(event, [{ shortcut: 'Escape', onTrigger: trigger }])).toBe(true);
    expect(trigger).toHaveBeenCalledWith(event);
    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it('publishes lifecycle state through an accessible live region', () => {
    const html = renderToStaticMarkup(<LiveStatus status="saving" message="Guardando cambios" />);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('Guardando cambios');
  });

  it('keeps errors visible and exposes an explicit retry callback', () => {
    const html = renderToStaticMarkup(
      <LiveStatus politeness="assertive" state={{ status: 'error', error: { message: 'No se pudo guardar' } }} onRetry={() => undefined} />,
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain('No se pudo guardar');
    expect(html).toContain('Reintentar');
  });

  it('announces errors assertively by default and keeps retry targets touch-friendly', () => {
    const html = renderToStaticMarkup(
      <LiveStatus state={{ status: 'error', error: { message: 'Error de render' } }} onRetry={() => undefined} />,
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain('aria-live="assertive"');
    expect(html).toContain('min-h-11');
    expect(html).toContain('min-w-11');
  });

  it('keeps ShortcutManager render-transparent when disabled', () => {
    const html = renderToStaticMarkup(<ShortcutManager enabled={false} bindings={[]}>content</ShortcutManager>);
    expect(html).toBe('content');
  });

  it('scopes shortcut ownership, prevents duplicates and cleans up listeners', () => {
    const listeners = new Set<EventListener>();
    const target: EventTarget = {
      addEventListener: (_type, listener) => listeners.add(listener as EventListener),
      removeEventListener: (_type, listener) => listeners.delete(listener as EventListener),
      dispatchEvent: () => true,
    };
    const first = vi.fn();
    const duplicate = vi.fn();
    const manager = createShortcutManager({
      target,
      scope: 'stage',
      bindings: [{ shortcut: 'ArrowLeft', onTrigger: first }],
    });
    const duplicateManager = createShortcutManager({
      target,
      scope: 'stage',
      bindings: [{ shortcut: 'ArrowLeft', onTrigger: duplicate }],
    });
    const event = {
      key: 'ArrowLeft',
      metaKey: false,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      target: null,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as KeyboardEvent;

    for (const listener of listeners) listener(event);
    expect(first).toHaveBeenCalledOnce();
    expect(duplicate).not.toHaveBeenCalled();

    manager.dispose();
    for (const listener of listeners) listener({ ...event, preventDefault: vi.fn() });
    expect(duplicate).toHaveBeenCalledOnce();

    duplicateManager.setOptions({ bindings: [], enabled: false });
    expect(listeners).toHaveLength(0);
  });
});
