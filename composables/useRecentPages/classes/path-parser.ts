import type { ParsedPath, PathConfig } from "../types";
import {
  PATH_CONFIGS,
  VERSION_PATTERN,
} from "../constants";
import { logPathWarning } from "../utils";

export class PathParser {
  private configMap = new Map<string, PathConfig>();

  constructor() {
    PATH_CONFIGS.forEach((config) => {
      this.configMap.set(config.pattern, config);
    });

    if (import.meta.dev) {
      this.validateConfigs();
    }
  }

  private validateConfigs(): void {
    const patterns = new Set<string>();
    const categories = new Set<string>();
    const requiredLanguages = ["en", "zh-CN", "zh-TW"];

    for (const config of PATH_CONFIGS) {
      if (patterns.has(config.pattern)) {
        logPathWarning({
          type: "MISSING_CONFIG",
          path: config.pattern,
          message: `Duplicate path pattern: ${config.pattern}`,
        });
      }
      patterns.add(config.pattern);

      if (categories.has(config.category)) {
        logPathWarning({
          type: "MISSING_CONFIG",
          path: config.pattern,
          message: `Duplicate category: ${config.category}`,
        });
      }
      categories.add(config.category);

      if (
        !config.titleKey ||
        !config.descriptionKey ||
        !config.icon
      ) {
        logPathWarning({
          type: "MISSING_CONFIG",
          path: config.pattern,
          message: `Incomplete configuration for ${config.pattern}`,
          suggestions: [
            "Check titleKey, descriptionKey, and icon fields",
          ],
        });
      }

      for (const lang of requiredLanguages) {
        if (
          !config.titleKey[lang] ||
          !config.descriptionKey[lang]
        ) {
          logPathWarning({
            type: "MISSING_CONFIG",
            path: config.pattern,
            message: `Missing ${lang} translation for ${config.pattern}`,
            suggestions: [
              `Add ${lang} translation to titleKey and descriptionKey`,
            ],
          });
        }
      }
    }
  }

  parse(path: string): ParsedPath {
    const segments = path.split("/").filter(Boolean);
    const result: ParsedPath = {
      category: "",
      isMatched: false,
      rawSegments: segments,
    };

    if (segments.length === 0) {
      return result;
    }

    const mainSegment = segments[0];
    const matchingConfig = this.configMap.get(
      `/${mainSegment}`
    );

    if (!matchingConfig) {
      logPathWarning({
        type: "UNMATCHED_PATH",
        path,
        message: `No configuration found for path: ${path}`,
        suggestions: PATH_CONFIGS.map(
          (config) => `Try: ${config.pattern}`
        ),
      });
      return result;
    }

    result.config = matchingConfig;
    result.category = matchingConfig.category;
    result.isMatched = true;

    if (segments.length > 1) {
      const versionCandidate = segments[1];

      if (
        versionCandidate &&
        VERSION_PATTERN.test(versionCandidate)
      ) {
        if (matchingConfig.supportVersions) {
          result.version = versionCandidate;
          if (segments.length > 2) {
            result.subPath = segments.slice(2).join("/");
          }
        } else {
          logPathWarning({
            type: "INVALID_VERSION",
            path,
            message: `Version ${versionCandidate} not supported for ${matchingConfig.pattern}`,
            suggestions: [
              `Remove version from path: ${matchingConfig.pattern}`,
            ],
          });
        }
      } else {
        result.subPath = segments.slice(1).join("/");
        if (versionCandidate?.startsWith("v")) {
          logPathWarning({
            type: "INVALID_VERSION",
            path,
            message: `Invalid version format: ${versionCandidate}`,
            suggestions: [
              "Use format: v1, v2, v1.0, v2.1, etc.",
            ],
          });
        }
      }
    }

    return result;
  }
}
