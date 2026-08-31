import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
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
    expect(mapped.footer).toMatchObject({
      props: {
        'aria-label': 'Área de trabajo inferior',
        children: ['slides'],
      },
    });
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

  it('assigns keys to generated element children without emitting React warnings', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      const mapped = mapCreativeStudioShellSlots({
        domain: 'image',
        state: { status: 'saved' },
        extensions: { domain: 'image', capabilities: [] },
        interaction: { focusedRegion: 'stage' },
        slots: {
          toolRail: React.createElement('span', null, 'tools'),
          resourcePanel: React.createElement('span', null, 'resources'),
          layersPanel: React.createElement('span', null, 'layers'),
          inspector: React.createElement('span', null, 'inspector'),
          stage: React.createElement('span', null, 'stage'),
        },
      });
      renderToStaticMarkup(React.createElement(React.Fragment, null, mapped.contextAside, mapped.aside));
      expect(error).not.toHaveBeenCalledWith(expect.stringContaining('unique "key" prop'));
    } finally {
      error.mockRestore();
    }
  });
});
