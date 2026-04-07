/**
 * Google Tag Manager DataLayer Helper
 */

/**
 * Push a page view event to GTM dataLayer
 * @param {string} url - The page URL/path
 */
export const trackPageLoaded = (url) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "page_loaded",
      page_location: window.location.href,
      page_path: url,
      page_title: document.title
    });
  }
};
