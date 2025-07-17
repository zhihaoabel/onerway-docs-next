import type { CacheManager } from "./cache-manager";
import type { PageMetadataExtractor } from "./metadata-extractor";
import type { PathParser } from "./path-parser";
import { getLocalizedText } from "../utils";

export class DescriptionGenerator {
  constructor(
    private parser: PathParser,
    private extractor: PageMetadataExtractor,
    private cache: CacheManager
  ) {}

  generate(path: string, locale: string): string {
    const cacheKey = `${path}-${locale}-desc`;
    const cached = this.cache.getDescription(cacheKey);
    if (cached) return cached;

    let description = "";

    // 尝试从页面提取描述
    if (import.meta.client) {
      const extracted = this.extractor.extractDescription();
      if (extracted) {
        description = extracted;
      }
    }

    // 使用配置生成描述
    if (!description) {
      const parsed = this.parser.parse(path);
      if (parsed.isMatched && parsed.config) {
        description = getLocalizedText(
          parsed.config.descriptionKey,
          locale
        );

        if (parsed.version) {
          const versionSuffix =
            locale === "zh-CN"
              ? `（${parsed.version.toUpperCase()}）`
              : locale === "zh-TW"
                ? `（${parsed.version.toUpperCase()}）`
                : ` (${parsed.version.toUpperCase()})`;
          description += versionSuffix;
        }

        if (parsed.subPath) {
          const subPathDesc = parsed.subPath
            .split("/")
            .join(" and ")
            .replace(/-/g, " ");
          const separator = locale.startsWith("zh")
            ? " - "
            : " - ";
          description += `${separator}${subPathDesc}`;
        }
      }
    }

    // 回退描述
    if (!description) {
      const parsed = this.parser.parse(path);
      if (parsed.rawSegments.length > 0) {
        const lastSegment = parsed.rawSegments[
          parsed.rawSegments.length - 1
        ]!.replace(/-/g, " ").replace(/\b\w/g, (l) =>
          l.toUpperCase()
        );

        const prefix =
          locale === "zh-CN"
            ? "关于"
            : locale === "zh-TW"
              ? "關於"
              : "Information and resources about";

        description = `${prefix} ${lastSegment}`;
      } else {
        description =
          locale === "zh-CN"
            ? "页面内容和信息"
            : locale === "zh-TW"
              ? "頁面內容和資訊"
              : "Page content and information";
      }
    }

    this.cache.setDescription(cacheKey, description);
    return description;
  }
}
