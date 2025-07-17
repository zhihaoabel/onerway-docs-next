export interface RecentPage {
  title: string;
  description?: string;
  path: string;
  timestamp: number;
  icon?: string;
}

export interface PathConfig {
  pattern: string;
  titleKey: Record<string, string>;
  descriptionKey: Record<string, string>;
  icon: string;
  iconColor: string;
  supportVersions: boolean;
  category: string;
}

export interface ParsedPath {
  category: string;
  version?: string;
  subPath?: string;
  config?: PathConfig;
  isMatched: boolean;
  rawSegments: string[];
}

export type PathWarningType =
  | "UNMATCHED_PATH"
  | "INVALID_VERSION"
  | "MISSING_CONFIG";

export interface PathWarning {
  type: PathWarningType;
  path: string;
  message: string;
  suggestions?: string[];
}

export type SupportedLocale = "en" | "zh-CN" | "zh-TW";
