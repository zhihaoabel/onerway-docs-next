import { cleanTitle } from "../utils";

export class PageMetadataExtractor {
  private getElementContent(
    selectors: string[],
    attribute?: string
  ): string | null {
    if (!import.meta.client) return null;

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        const content = attribute
          ? element.getAttribute(attribute)
          : element.textContent;
        if (content?.trim()) {
          return content.trim();
        }
      }
    }
    return null;
  }

  extractTitle(): string | null {
    const currentTitle = document.title;
    if (
      currentTitle &&
      currentTitle !== "Nuxt" &&
      !currentTitle.includes("localhost")
    ) {
      const cleaned = cleanTitle(currentTitle);
      if (cleaned) return cleaned;
    }

    const metaTitle = this.getElementContent(
      ["title"],
      "content"
    );

    if (metaTitle) {
      const cleaned = cleanTitle(metaTitle);
      if (cleaned && cleaned !== "Nuxt") {
        return cleaned;
      }
    }

    return null;
  }

  extractDescription(): string | null {
    const metaDescription = this.getElementContent(
      ["meta[name='description']"],
      "content"
    );
    if (metaDescription && metaDescription.length > 10) {
      return metaDescription;
    }
    return null;
  }
}
