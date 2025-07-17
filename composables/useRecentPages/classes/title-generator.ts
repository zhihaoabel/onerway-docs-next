import type { CacheManager } from "./cache-manager";
import type { PageMetadataExtractor } from "./metadata-extractor";
import type { PathParser } from "./path-parser";
import { getLocalizedText } from "../utils";

export class TitleGenerator {
  constructor(
    private parser: PathParser,
    private extractor: PageMetadataExtractor,
    private cache: CacheManager
  ) {}

  generate(
    path: string,
    locale: string,
    isCurrentPath: boolean
  ): string {
    const cacheKey = `${path}-${locale}`;
    const cached = this.cache.getTitle(cacheKey);
    if (cached) return cached;

    if (import.meta.dev) {
      console.log("generating title for path", path);
    }

    let title = "";

    // 尝试从当前页面提取标题
    if (import.meta.client && isCurrentPath) {
      if (import.meta.dev) {
        console.log("extracting title from current page");
      }
      const extracted = this.extractor.extractTitle();
      if (extracted) {
        title = extracted;
      }
    }

    // 使用配置生成标题
    if (!title) {
      if (import.meta.dev) {
        console.log("extracting title from path");
      }
      const parsed = this.parser.parse(path);
      if (parsed.isMatched && parsed.config) {
        title = getLocalizedText(
          parsed.config.titleKey,
          locale
        );

        if (parsed.version) {
          title += ` ${parsed.version.toUpperCase()}`;
        }

        if (parsed.subPath) {
          const subPathTitle = parsed.subPath
            .split("/")
            .pop()
            ?.replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
          if (subPathTitle) {
            title += ` - ${subPathTitle}`;
          }
        }
      }
    }

    // 回退到智能生成
    if (!title) {
      console.log("extracting title from last segment");
      const parsed = this.parser.parse(path);
      if (parsed.rawSegments.length > 0) {
        const lastSegment =
          parsed.rawSegments[parsed.rawSegments.length - 1];
        title =
          lastSegment
            ?.replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()) ?? "";
      } else {
        title = "Unknown Page";
      }
    }

    this.cache.setTitle(cacheKey, title);
    return title;
  }
}
