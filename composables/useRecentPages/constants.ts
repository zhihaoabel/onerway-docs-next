import type { PathConfig } from "./types";

export const STORAGE_KEYS = {
  RECENT_PAGES: "onerway-recent-pages",
  TITLE_CACHE: "onerway-title-cache",
  DESC_CACHE: "onerway-desc-cache",
} as const;

export const VERSION_PATTERN = /^v\d+(?:\.\d+)*$/;
export const MAX_RECENT_PAGES = 10;
export const CACHE_DEBOUNCE_DELAY = 500;
export const PAGE_ADD_DEBOUNCE_DELAY = 200;

export const PATH_CONFIGS: PathConfig[] = [
  {
    pattern: "/get-started",
    titleKey: {
      en: "Get Started",
      "zh-CN": "快速开始",
      "zh-TW": "快速開始",
    },
    descriptionKey: {
      en: "Quick start guide and setup instructions for integrating our platform",
      "zh-CN": "平台集成的快速入门指南和设置说明",
      "zh-TW": "平台整合的快速入門指南和設定說明",
    },
    icon: "i-heroicons-rocket-launch",
    iconColor: "text-blue-500",
    supportVersions: true,
    category: "get-started",
  },
  {
    pattern: "/payments",
    titleKey: {
      en: "Payments",
      "zh-CN": "支付服务",
      "zh-TW": "支付服務",
    },
    descriptionKey: {
      en: "Payment processing solutions, integration guides, and API documentation",
      "zh-CN": "支付处理解决方案、集成指南和 API 文档",
      "zh-TW": "支付處理解決方案、整合指南和 API 文件",
    },
    icon: "i-heroicons-credit-card",
    iconColor: "text-green-500",
    supportVersions: true,
    category: "payments",
  },
  {
    pattern: "/payouts",
    titleKey: {
      en: "Payouts",
      "zh-CN": "提现服务",
      "zh-TW": "提現服務",
    },
    descriptionKey: {
      en: "Payout services, disbursement solutions, and withdrawal management",
      "zh-CN": "提现服务、资金分发解决方案和提取管理",
      "zh-TW": "提現服務、資金分發解決方案和提取管理",
    },
    icon: "i-heroicons-banknotes",
    iconColor: "text-purple-500",
    supportVersions: true,
    category: "payouts",
  },
  {
    pattern: "/changelog",
    titleKey: {
      en: "Changelog",
      "zh-CN": "更新日志",
      "zh-TW": "更新日誌",
    },
    descriptionKey: {
      en: "Product updates, release notes, and feature announcements",
      "zh-CN": "产品更新、发布说明和功能公告",
      "zh-TW": "產品更新、發佈說明和功能公告",
    },
    icon: "i-heroicons-clock",
    iconColor: "text-orange-500",
    supportVersions: false,
    category: "changelog",
  },
  {
    pattern: "/404",
    titleKey: {
      en: "404 Not Found",
      "zh-CN": "404 未找到",
      "zh-TW": "404 未找到",
    },
    descriptionKey: {
      en: "The page you are looking for does not exist",
      "zh-CN": "您访问的页面不存在",
      "zh-TW": "您訪問的頁面不存在",
    },
    icon: "i-heroicons-exclamation-triangle",
    iconColor: "text-red-500",
    supportVersions: false,
    category: "404",
  },
];
