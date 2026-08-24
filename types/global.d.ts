export {};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}

