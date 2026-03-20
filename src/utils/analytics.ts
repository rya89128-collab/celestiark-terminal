declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type AnalyticsValue = string | number | boolean;
type AnalyticsParams = Record<string, AnalyticsValue | null | undefined>;

export function trackAnalyticsEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  const payload = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== undefined),
  );

  window.gtag('event', eventName, payload);
}

