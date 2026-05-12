import { useEffect } from "react";

const DEFAULT_TITLE =
  "Organic Profits Academy — Grow your trading. Cultivate real profits.";
const DEFAULT_DESCRIPTION =
  "A premium trading academy teaching crypto, forex, and options. Lifetime access, live webinars, on-demand library, and private community.";

/**
 * Sets the document title and (optionally) meta description for a page.
 * Falls back to the brand default on unmount so the home page reads cleanly.
 *
 * Usage:
 *   useDocumentTitle("Pricing", "Lifetime access for $1,100 — pay in full or in installments.");
 */
export function useDocumentTitle(pageTitle?: string, description?: string) {
  useEffect(() => {
    const title = pageTitle
      ? `${pageTitle} · Organic Profits Academy`
      : DEFAULT_TITLE;
    document.title = title;

    if (description) {
      let tag = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]',
      );
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = "description";
        document.head.appendChild(tag);
      }
      tag.content = description;
    }

    return () => {
      document.title = DEFAULT_TITLE;
      const tag = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]',
      );
      if (tag) tag.content = DEFAULT_DESCRIPTION;
    };
  }, [pageTitle, description]);
}
