import { describe, expect, it } from 'vitest';
import CanonicalBackofficeShell from '../../layouts/BackofficeShell';
import LegacyBackofficeShell from '../BackofficeShell';
import { mapCreativeStudioShellSlots } from '../CreativeStudioShellAdapter.utils';
import type { CreativeStudioImageStudioExtension } from '../contracts';

describe('Creative Studio shell composition boundaries', () => {
  it('maps contract slots to the existing SuiteCanvas zones and resolves slot context', () => {
    const mapped = mapCreativeStudioShellSlots<CreativeStudioImageStudioExtension>({
      domain: 'image',
      state: { status: 'saving', message: 'Guardando' },
      extensions: { domain: 'image', capabilities: ['preview'] },
      interaction: { focusedRegion: 'stage' },
      slots: {
        toolRail: 'tools',
        resourcePanel: 'resources',
        layersPanel: 'layers',
        inspector: 'inspector',
        moduleHeader: ({ state }) => state.status,
        toolbar: ({ domain }) => domain,
        stage: ({ interaction }) => interaction.focusedRegion,
        bottomWorkspace: 'slides',
        overlays: 'overlay',
      },
    });

    expect(mapped.moduleHeader).toBe('saving');
    expect(mapped.toolbar).toBe('image');
    expect(mapped.stage).toBe('stage');
    expect(mapped.footer).toBe('slides');
    expect(mapped.overlays).toBe('overlay');
    expect(mapped.contextAside).toMatchObject({
      props: {
        'aria-label': 'Herramientas y recursos del editor',
        children: ['tools', 'resources'],
      },
    });
    expect(mapped.aside).toMatchObject({
      props: {
        'aria-label': 'Capas e inspector del editor',
        children: ['layers', 'inspector'],
      },
    });
  });

  it('keeps the old BackofficeShell import as an alias of the canonical layout adapter', () => {
    expect(LegacyBackofficeShell).toBe(CanonicalBackofficeShell);
  });
});
