/**
 * Google Ads and Analytics Conversion Tracking & Campaign Attribution Utility
 * Handles conversion events, Enhanced Conversions (user_data), UTM/gclid campaign attribution,
 * and smart WhatsApp reference tags across VitaBlue.
 */

export interface CampaignAttribution {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_path?: string;
  captured_at?: string;
  [key: string]: string | undefined;
}

export interface EnhancedUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  postalCode?: string;
  country?: string;
}

export interface ConversionParams {
  contact_method?: 'form' | 'whatsapp' | 'call' | 'email' | 'wizard';
  profile?: string;
  category?: string;
  source_page?: string;
  campaign_tag?: string;
  [key: string]: unknown;
}

const ATTRIBUTION_STORAGE_KEY = 'vb_campaign_attribution';

/**
 * Normalizes email according to Google Ads Enhanced Conversions spec (trimmed, lowercase).
 */
export const normalizeEmail = (email?: string): string | undefined => {
  if (!email) return undefined;
  const cleaned = email.trim().toLowerCase();
  return cleaned.includes('@') ? cleaned : undefined;
};

/**
 * Normalizes phone numbers according to E.164 format (+34XXXXXXXXX by default for Spain).
 */
export const normalizePhone = (phone?: string): string | undefined => {
  if (!phone) return undefined;
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned) return undefined;

  // If starts with 00, convert to +
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.slice(2);
  }

  // If standard 9-digit Spanish mobile/landline without country code, add +34
  if (!cleaned.startsWith('+')) {
    if (cleaned.length === 9 && (cleaned.startsWith('6') || cleaned.startsWith('7') || cleaned.startsWith('8') || cleaned.startsWith('9'))) {
      cleaned = '+34' + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }

  return cleaned;
};

/**
 * Captures and stores campaign parameters (gclid, UTMs, referrer) from current URL.
 * Persists in sessionStorage and localStorage for multi-session lead attribution.
 */
export const initAttributionCapture = (): CampaignAttribution => {
  if (typeof window === 'undefined') return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const gclid = urlParams.get('gclid') || undefined;
    const gbraid = urlParams.get('gbraid') || undefined;
    const wbraid = urlParams.get('wbraid') || undefined;
    const fbclid = urlParams.get('fbclid') || undefined;
    const utm_source = urlParams.get('utm_source') || undefined;
    const utm_medium = urlParams.get('utm_medium') || undefined;
    const utm_campaign = urlParams.get('utm_campaign') || undefined;
    const utm_term = urlParams.get('utm_term') || undefined;
    const utm_content = urlParams.get('utm_content') || undefined;

    const hasNewParams = Boolean(
      gclid || gbraid || wbraid || fbclid || utm_source || utm_medium || utm_campaign || utm_term || utm_content
    );

    // Retrieve existing attribution if present
    let existing: CampaignAttribution = {};
    const stored = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) || window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (stored) {
      try {
        existing = JSON.parse(stored);
      } catch {
        existing = {};
      }
    }

    if (hasNewParams) {
      const currentAttribution: CampaignAttribution = {
        ...existing,
        gclid: gclid || existing.gclid,
        gbraid: gbraid || existing.gbraid,
        wbraid: wbraid || existing.wbraid,
        fbclid: fbclid || existing.fbclid,
        utm_source: utm_source || existing.utm_source,
        utm_medium: utm_medium || existing.utm_medium,
        utm_campaign: utm_campaign || existing.utm_campaign,
        utm_term: utm_term || existing.utm_term,
        utm_content: utm_content || existing.utm_content,
        referrer: document.referrer || existing.referrer || undefined,
        landing_path: window.location.pathname,
        captured_at: new Date().toISOString(),
      };

      window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(currentAttribution));
      window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(currentAttribution));
      return currentAttribution;
    }

    // If no params in URL but external referrer on first visit
    if (!existing.referrer && document.referrer && !document.referrer.includes(window.location.hostname)) {
      const organicAttribution: CampaignAttribution = {
        ...existing,
        referrer: document.referrer,
        landing_path: window.location.pathname,
        captured_at: new Date().toISOString(),
      };
      window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(organicAttribution));
      window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(organicAttribution));
      return organicAttribution;
    }

    return existing;
  } catch (e) {
    console.warn('[Analytics] Error capturing campaign attribution:', e);
    return {};
  }
};

/**
 * Retrieves the active campaign attribution data from storage.
 */
export const getCampaignAttribution = (): CampaignAttribution => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) || window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('[Analytics] Error reading campaign attribution:', e);
  }
  return {};
};

/**
 * Builds a unique reference tag for WhatsApp messages (e.g. `[Ref: GADS-EST-93f8]` or `[Ref: WEB-BLOG]`).
 */
export const generateAttributionTag = (contextTag?: string): string => {
  const attr = getCampaignAttribution();

  if (attr.gclid) {
    const shortGclid = attr.gclid.slice(0, 5);
    const campaign = attr.utm_campaign ? `-${attr.utm_campaign.toUpperCase().slice(0, 8)}` : (contextTag ? `-${contextTag.toUpperCase()}` : '');
    return `[Ref: GADS${campaign}-${shortGclid}]`;
  }

  if (attr.utm_source) {
    const src = attr.utm_source.toUpperCase().slice(0, 6);
    const camp = attr.utm_campaign ? `-${attr.utm_campaign.toUpperCase().slice(0, 8)}` : (contextTag ? `-${contextTag.toUpperCase()}` : '');
    return `[Ref: ${src}${camp}]`;
  }

  if (contextTag) {
    return `[Ref: WEB-${contextTag.toUpperCase()}]`;
  }

  return '[Ref: WEB-DIRECT]';
};

/**
 * Builds an attributed WhatsApp link with pre-filled message and reference tag appended.
 */
export const buildAttributedWhatsAppUrl = (
  phoneOrBase: string = '34694583452',
  baseMessage: string = 'Hola! Vengo de la web de VitaBlue. Necesito asesoramiento sobre seguros.',
  contextTag?: string
): string => {
  let phone = '34694583452';

  if (phoneOrBase.startsWith('http') || phoneOrBase.includes('wa.me')) {
    const urlMatch = phoneOrBase.match(/wa\.me\/(\d+)/);
    if (urlMatch) {
      phone = urlMatch[1];
    }
  } else {
    phone = phoneOrBase.replace(/\D/g, '') || '34694583452';
  }

  const tag = generateAttributionTag(contextTag);
  const finalMessage = baseMessage.includes('[Ref:')
    ? baseMessage
    : `${baseMessage.trim()}\n\n${tag}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(finalMessage)}`;
};

/**
 * Sets Enhanced Conversion user_data for Google Ads (SHA-256 / Google Tag handling).
 */
export const setEnhancedUserData = (userData: EnhancedUserData): void => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  try {
    const normalizedData: Record<string, unknown> = {};

    const normEmail = normalizeEmail(userData.email);
    if (normEmail) normalizedData.email = normEmail;

    const normPhone = normalizePhone(userData.phone);
    if (normPhone) normalizedData.phone_number = normPhone;

    if (userData.firstName || userData.lastName || userData.postalCode) {
      normalizedData.address = {
        first_name: userData.firstName?.trim().toLowerCase(),
        last_name: userData.lastName?.trim().toLowerCase(),
        postal_code: userData.postalCode?.trim(),
        country: userData.country || 'ES',
      };
    }

    if (Object.keys(normalizedData).length > 0) {
      window.gtag('set', 'user_data', normalizedData);
    }
  } catch (e) {
    console.warn('[Analytics] Error setting enhanced conversion user_data:', e);
  }
};

/**
 * Sends a conversion event to Google Ads and Google Analytics / dataLayer safely,
 * automatically enriching with campaign attribution (gclid, UTMs).
 */
export const trackConversion = (
  eventName: string = 'conversion_event_contact',
  params: ConversionParams = {}
): void => {
  if (typeof window === 'undefined') return;

  const attribution = getCampaignAttribution();

  const eventPayload = {
    ...attribution,
    ...params,
    campaign_tag: params.campaign_tag || generateAttributionTag(params.category as string || params.profile as string),
    page_location: window.location.href,
    page_path: window.location.pathname,
    timestamp: new Date().toISOString(),
  };

  // Push to Google Tag (gtag.js) if loaded
  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, eventPayload);
    } catch (e) {
      console.warn('[Analytics] Error calling gtag event:', e);
    }
  }

  // Push to dataLayer for GTM & GA4 backup
  if (Array.isArray(window.dataLayer)) {
    try {
      window.dataLayer.push({
        event: eventName,
        ...eventPayload,
      });
    } catch (e) {
      console.warn('[Analytics] Error pushing to dataLayer:', e);
    }
  }
};

/**
 * Convenience method for tracking any contact lead event (Google Ads conversion).
 * Optionally accepts user contact info for Enhanced Conversions.
 */
export const trackContactConversion = (
  method: 'form' | 'whatsapp' | 'call' | 'email' | 'wizard',
  details: ConversionParams = {},
  userData?: EnhancedUserData
): void => {
  if (userData) {
    setEnhancedUserData(userData);
  }

  trackConversion('conversion_event_contact', {
    contact_method: method,
    ...details,
  });
};

/**
 * Global click listener that attaches to document to intercept all WhatsApp, Phone and Email
 * conversion links across the entire site, ensuring attribution tags are injected into WhatsApp chats.
 */
export const initGlobalConversionTracking = (): (() => void) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  // Ensure attribution is captured from landing URL
  initAttributionCapture();

  const handleGlobalClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const anchor = target.closest('a') as HTMLAnchorElement | null;
    if (!anchor || !anchor.href) return;

    const href = anchor.href;

    // Check for WhatsApp links
    if (href.includes('wa.me') || href.includes('api.whatsapp.com') || href.includes('whatsapp.com/send')) {
      // If the link does not have an attribution tag, dynamically append it before leaving
      try {
        const url = new URL(href);
        const currentText = url.searchParams.get('text') || '';
        if (currentText && !currentText.includes('[Ref:')) {
          const tag = generateAttributionTag();
          url.searchParams.set('text', `${currentText.trim()}\n\n${tag}`);
          anchor.href = url.toString();
        }
      } catch {
        // Safe fallback if URL parsing fails on custom protocols
      }

      trackContactConversion('whatsapp', {
        link_url: anchor.href,
        link_text: anchor.innerText?.trim() || anchor.getAttribute('aria-label') || 'WhatsApp Link',
      });
      return;
    }

    // Check for Phone calls
    if (href.startsWith('tel:')) {
      trackContactConversion('call', {
        link_url: href,
        phone_number: href.replace('tel:', ''),
      });
      return;
    }

    // Check for Mailto links
    if (href.startsWith('mailto:') && !href.includes('vitablue.es?subject=VitaBlue%20contact')) {
      trackContactConversion('email', {
        link_url: href,
      });
    }
  };

  // Attach in capturing phase to ensure catching all clicks
  document.addEventListener('click', handleGlobalClick, { capture: true, passive: true });

  return () => {
    document.removeEventListener('click', handleGlobalClick, { capture: true });
  };
};

