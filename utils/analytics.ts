/**
 * Google Ads and Analytics Conversion Tracking Utility
 * Handles conversion events (e.g. conversion_event_contact) across the entire VitaBlue site.
 */

export interface ConversionParams {
  contact_method?: 'form' | 'whatsapp' | 'call' | 'email' | 'wizard';
  profile?: string;
  category?: string;
  source_page?: string;
  [key: string]: unknown;
}

/**
 * Sends a conversion event to Google Ads and Google Analytics / dataLayer safely.
 */
export const trackConversion = (
  eventName: string = 'conversion_event_contact',
  params: ConversionParams = {}
): void => {
  if (typeof window === 'undefined') return;

  const eventPayload = {
    ...params,
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
 */
export const trackContactConversion = (
  method: 'form' | 'whatsapp' | 'call' | 'email' | 'wizard',
  details: ConversionParams = {}
): void => {
  trackConversion('conversion_event_contact', {
    contact_method: method,
    ...details,
  });
};

/**
 * Global click listener that attaches to document to intercept all WhatsApp, Phone and Email
 * conversion links across the entire site automatically without missing dynamic components.
 */
export const initGlobalConversionTracking = (): (() => void) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const handleGlobalClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const anchor = target.closest('a') as HTMLAnchorElement | null;
    if (!anchor || !anchor.href) return;

    const href = anchor.href;

    // Check for WhatsApp links
    if (href.includes('wa.me') || href.includes('api.whatsapp.com') || href.includes('whatsapp.com/send')) {
      trackContactConversion('whatsapp', {
        link_url: href,
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

    // Check for Mailto links (standard email clicks)
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
