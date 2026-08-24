import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  normalizeEmail,
  normalizePhone,
  initAttributionCapture,
  getCampaignAttribution,
  generateAttributionTag,
  buildAttributedWhatsAppUrl,
  setEnhancedUserData,
  trackConversion,
  trackContactConversion,
  initGlobalConversionTracking,
} from './analytics';

describe('Analytics & Campaign Attribution Module', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  let mockGtag: ReturnType<typeof vi.fn>;
  let mockDataLayer: Array<Record<string, unknown>>;
  let sessionStorageStore: Record<string, string> = {};
  let localStorageStore: Record<string, string> = {};
  let listeners: Record<string, ((event: unknown) => void)[]> = {};

  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorageStore = {};
    localStorageStore = {};
    listeners = {};
    mockGtag = vi.fn();
    mockDataLayer = [];

    const mockDoc = {
      referrer: '',
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
      location: {
        href: 'https://www.vitablue.es/',
        pathname: '/',
        search: '',
        hostname: 'www.vitablue.es',
      },
      gtag: mockGtag,
      dataLayer: mockDataLayer,
      sessionStorage: {
        getItem: vi.fn((k: string) => sessionStorageStore[k] || null),
        setItem: vi.fn((k: string, v: string) => { sessionStorageStore[k] = v; }),
        clear: vi.fn(() => { sessionStorageStore = {}; }),
      },
      localStorage: {
        getItem: vi.fn((k: string) => localStorageStore[k] || null),
        setItem: vi.fn((k: string, v: string) => { localStorageStore[k] = v; }),
        clear: vi.fn(() => { localStorageStore = {}; }),
      },
    };

    globalThis.window = mockWin as unknown as Window & typeof globalThis;
    globalThis.document = mockDoc as unknown as Document;
  });

  afterEach(() => {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  });

  describe('normalizeEmail and normalizePhone', () => {
    it('normalizes emails to lowercase and trimmed string', () => {
      expect(normalizeEmail('  Test.Lead@Example.COM ')).toBe('test.lead@example.com');
      expect(normalizeEmail('invalid-email')).toBeUndefined();
      expect(normalizeEmail('')).toBeUndefined();
      expect(normalizeEmail(undefined)).toBeUndefined();
    });

    it('normalizes spanish phone numbers to E.164 format', () => {
      expect(normalizePhone('694583452')).toBe('+34694583452');
      expect(normalizePhone('+34 694 58 34 52')).toBe('+34694583452');
      expect(normalizePhone('0034694583452')).toBe('+34694583452');
      expect(normalizePhone('1234567890')).toBe('+1234567890');
      expect(normalizePhone('')).toBeUndefined();
    });
  });

  describe('initAttributionCapture & getCampaignAttribution', () => {
    it('captures gclid and UTMs from window.location.search and stores in storage', () => {
      globalThis.window.location.search = '?gclid=Cj0KCQjwmOm3BhD8ARIs&utm_source=google&utm_medium=cpc&utm_campaign=visados_2026';
      globalThis.window.location.pathname = '/productos/seguros-salud/seguro-medico-estudiantes';

      const attr = initAttributionCapture();
      expect(attr.gclid).toBe('Cj0KCQjwmOm3BhD8ARIs');
      expect(attr.utm_source).toBe('google');
      expect(attr.utm_campaign).toBe('visados_2026');
      expect(attr.landing_path).toBe('/productos/seguros-salud/seguro-medico-estudiantes');

      const retrieved = getCampaignAttribution();
      expect(retrieved.gclid).toBe('Cj0KCQjwmOm3BhD8ARIs');
      expect(retrieved.utm_source).toBe('google');
    });
  });

  describe('generateAttributionTag', () => {
    it('generates GADS tag when gclid is present', () => {
      sessionStorageStore['vb_campaign_attribution'] = JSON.stringify({
        gclid: 'Cj0KCQjw12345',
        utm_campaign: 'estudiantes',
      });

      const tag = generateAttributionTag();
      expect(tag).toBe('[Ref: GADS-ESTUDIAN-Cj0KC]');
    });

    it('generates UTM tag when utm_source is present without gclid', () => {
      sessionStorageStore['vb_campaign_attribution'] = JSON.stringify({
        utm_source: 'facebook',
        utm_campaign: 'retargeting',
      });

      const tag = generateAttributionTag();
      expect(tag).toBe('[Ref: FACEBO-RETARGET]');
    });

    it('generates WEB context tag when no campaign params exist', () => {
      const tag = generateAttributionTag('ESTUDIANTES');
      expect(tag).toBe('[Ref: WEB-ESTUDIANTES]');
    });

    it('generates WEB-DIRECT when no context is provided', () => {
      const tag = generateAttributionTag();
      expect(tag).toBe('[Ref: WEB-DIRECT]');
    });
  });

  describe('buildAttributedWhatsAppUrl', () => {
    it('appends attribution tag to the WhatsApp message and encodes properly', () => {
      sessionStorageStore['vb_campaign_attribution'] = JSON.stringify({
        gclid: 'AbCdEfG123',
        utm_campaign: 'visado',
      });

      const url = buildAttributedWhatsAppUrl('34694583452', 'Hola! Quiero información.', 'VISADO');
      expect(url).toContain('https://wa.me/34694583452?text=');
      expect(decodeURIComponent(url)).toContain('Hola! Quiero información.');
      expect(decodeURIComponent(url)).toContain('[Ref: GADS-VISADO-AbCdE]');
    });
  });

  describe('setEnhancedUserData', () => {
    it('calls gtag set user_data with normalized fields', () => {
      setEnhancedUserData({
        email: '  Lead@VitaBlue.ES  ',
        phone: '694583452',
        firstName: ' Carlos ',
        lastName: ' Mendoza ',
        postalCode: '28001',
      });

      expect(mockGtag).toHaveBeenCalledWith('set', 'user_data', {
        email: 'lead@vitablue.es',
        phone_number: '+34694583452',
        address: {
          first_name: 'carlos',
          last_name: 'mendoza',
          postal_code: '28001',
          country: 'ES',
        },
      });
    });
  });

  describe('trackConversion & trackContactConversion', () => {
    it('calls trackConversion directly with custom event name', () => {
      trackConversion('custom_event', { step: 1 });
      expect(mockGtag).toHaveBeenCalledWith('event', 'custom_event', expect.objectContaining({ step: 1 }));
    });

    it('enriches conversion event with campaign attribution data', () => {

      sessionStorageStore['vb_campaign_attribution'] = JSON.stringify({
        gclid: '12345',
        utm_source: 'google',
        utm_campaign: 'estudiantes',
      });

      trackContactConversion(
        'form',
        { profile: 'student', category: 'salud' },
        { email: 'user@test.com', phone: '694583452' }
      );

      expect(mockGtag).toHaveBeenCalledWith('set', 'user_data', expect.any(Object));
      expect(mockGtag).toHaveBeenCalledWith(
        'event',
        'conversion_event_contact',
        expect.objectContaining({
          contact_method: 'form',
          profile: 'student',
          gclid: '12345',
          utm_source: 'google',
          utm_campaign: 'estudiantes',
        })
      );
      expect(mockDataLayer[0]).toMatchObject({
        event: 'conversion_event_contact',
        contact_method: 'form',
        gclid: '12345',
      });
    });
  });

  describe('initGlobalConversionTracking click listener', () => {
    it('intercepts WhatsApp links and tracks conversion', () => {
      sessionStorageStore['vb_campaign_attribution'] = JSON.stringify({
        gclid: '98765',
        utm_campaign: 'nomadas',
      });

      const cleanup = initGlobalConversionTracking();

      const mockAnchor = {
        href: 'https://wa.me/34694583452?text=Hola%20VitaBlue',
        innerText: 'Chatear por WhatsApp',
        getAttribute: vi.fn(),
        closest: vi.fn((sel: string) => (sel === 'a' ? mockAnchor : null)),
      };

      const clickHandler = listeners['click']?.[0];
      expect(clickHandler).toBeDefined();

      clickHandler({
        target: mockAnchor,
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'conversion_event_contact', expect.objectContaining({
        contact_method: 'whatsapp',
        gclid: '98765',
      }));

      cleanup();
    });
  });
});
