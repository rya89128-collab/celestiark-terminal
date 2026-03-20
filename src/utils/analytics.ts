declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_SCRIPT_ID = 'ga4-script';

function getMeasurementId(): string | null {
  const value = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function createGtag() {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
}

function ensureAnalyticsScript(measurementId: string) {
  if (document.getElementById(GA_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement('script');
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

export function initializeAnalytics() {
  const measurementId = getMeasurementId();

  if (!measurementId || typeof window === 'undefined') {
    return false;
  }

  createGtag();
  ensureAnalyticsScript(measurementId);

  window.gtag?.('js', new Date());
  window.gtag?.('config', measurementId, {
    page_title: document.title,
    page_path: window.location.pathname + window.location.search + window.location.hash,
  });

  return true;
}

