import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackConversion, trackContactConversion, initGlobalConversionTracking } from './analytics';

describe('analytics / conversion tracking', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  let mockGtag: ReturnType<typeof vi.fn>;
  let mockDataLayer: Array<Record<string, unknown>>;
  let listeners: Record<string, ((event: unknown) => void)[]> = {};

  beforeEach(() => {
    listeners = {};
    mockGtag = vi.fn();
    mockDataLayer = [];

    const mockDoc = {
      addEventListener: vi.fn((event: string, cb: (e: unknown) => void) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(cb);
      }),
      removeEventListener: vi.fn((event: string, cb: (e: unknown) => void) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((item) => item !== cb);
        }
      }),
    };

    const mockWin = {
      gtag: mockGtag,
      dataLayer: mockDataLayer,
      location: {
        href: 'https://www.vitablue.es/contacto',
        pathname: '/contacto',
      },
    };

    (globalThis as unknown as { window: unknown }).window = mockWin;
    (globalThis as unknown as { document: unknown }).document = mockDoc;
  });

  afterEach(() => {
    (globalThis as unknown as { window: unknown }).window = originalWindow;
    (globalThis as unknown as { document: unknown }).document = originalDocument;
    vi.restoreAllMocks();
  });

  it('tracks conversion event via window.gtag and dataLayer', () => {
    trackConversion('conversion_event_contact', { contact_method: 'form' });

    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      'conversion_event_contact',
      expect.objectContaining({
        contact_method: 'form',
        page_path: '/contacto',
        page_location: 'https://www.vitablue.es/contacto',
      })
    );

    expect(mockDataLayer).toContainEqual(
      expect.objectContaining({
        event: 'conversion_event_contact',
        contact_method: 'form',
      })
    );
  });

  it('trackContactConversion sends conversion_event_contact by default', () => {
    trackContactConversion('whatsapp', { source_page: 'results' });

    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      'conversion_event_contact',
      expect.objectContaining({
        contact_method: 'whatsapp',
        source_page: 'results',
      })
    );
  });

  it('initGlobalConversionTracking intercepts clicks on wa.me and tel: links', () => {
    const cleanup = initGlobalConversionTracking();

    const mockAnchor = {
      href: 'https://wa.me/34694583452',
      innerText: 'Hablar por WhatsApp',
      getAttribute: () => null,
    };

    const mockEvent = {
      target: {
        closest: (selector: string) => (selector === 'a' ? mockAnchor : null),
      },
    };

    const clickListeners = listeners['click'] || [];
    expect(clickListeners.length).toBeGreaterThan(0);

    clickListeners.forEach((listener) => listener(mockEvent));

    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      'conversion_event_contact',
      expect.objectContaining({
        contact_method: 'whatsapp',
        link_url: 'https://wa.me/34694583452',
      })
    );

    cleanup();
  });
});
