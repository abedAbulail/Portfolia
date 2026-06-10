import { normalizeExternalUrl } from "@/lib/normalize-url";

/** Rewrite global selectors so they target the shadow host, not the page. */
export function preprocessCustomHtml(html: string): string {
  return normalizeHtmlLinks(
    html
      .replace(/\bhtml\s*,\s*body\s*\{/gi, ":host {")
      .replace(/\bbody\s*\{/gi, ":host {")
      .replace(/\bhtml\s*\{/gi, ":host {")
      .replace(/(\d+(?:\.\d+)?)\s*vw/gi, "100%")
  );
}

function normalizeHtmlLinks(html: string): string {
  return html.replace(
    /href=(["'])(?!https?:|\/\/|mailto:|tel:|#|\/)([^"']+)\1/gi,
    (_match, quote: string, url: string) => `href=${quote}${normalizeExternalUrl(url)}${quote}`
  );
}

export const SHADOW_HOST_BASE = `
<style>
  :host {
    display: block;
    width: 100%;
    max-width: 100%;
    margin-inline: auto;
    box-sizing: border-box;
    overflow-x: hidden;
    color: inherit;
    font-family: inherit;
  }
  :host *, :host *::before, :host *::after {
    box-sizing: border-box;
    max-width: 100%;
  }
</style>
`;
