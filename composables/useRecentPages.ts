/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, nextTick, readonly, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export interface RecentPage {
  title: string;
  description?: string;
  path: string;
  timestamp: number;
  icon?: string;
}

// 路径配置接口
interface PathConfig {
  pattern: string;
  titleKey: Record<string, string>;
  descriptionKey: Record<string, string>;
  icon: string;
  iconColor: string;
  supportVersions: boolean;
  category: string;
}

// 解析后的路径信息
interface ParsedPath {
  category: string;
  version?: string;
  subPath?: string;
  config?: PathConfig;
  isMatched: boolean;
  rawSegments: string[];
}

// 告警类型
interface PathWarning {
  type:
    | "UNMATCHED_PATH"
    | "INVALID_VERSION"
    | "MISSING_CONFIG";
  path: string;
  message: string;
  suggestions?: string[];
}

// 路径配置映射 - 使用 Map 提升查询性能
const PATH_CONFIGS_MAP = new Map<string, PathConfig>();

const PATH_CONFIGS: PathConfig[] = [
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
    category: "getting-started",
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
];

// 初始化配置映射
PATH_CONFIGS.forEach((config) => {
  PATH_CONFIGS_MAP.set(config.pattern, config);
});

// 版本号正则表达式
const VERSION_PATTERN = /^v\d+(?:\.\d+)*$/;

// 全局状态
const recentPages = ref<RecentPage[]>([]);
let isInitialized = false;

// 缓存优化
const pathCache = new Map<string, ParsedPath>();
const titleCache = new Map<string, string>();
const descriptionCache = new Map<string, string>();

// 防抖函数
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// 记录路径告警
function logPathWarning(warning: PathWarning): void {
  if (import.meta.dev) {
    console.warn(`[useRecentPages] ${warning.type}:`, {
      path: warning.path,
      message: warning.message,
      suggestions: warning.suggestions,
    });
  }
}

// 验证路径配置
function validatePathConfigs(): void {
  if (!import.meta.dev) return;

  const patterns = new Set<string>();
  const categories = new Set<string>();
  const requiredLanguages = ["en", "zh-CN", "zh-TW"];

  for (const config of PATH_CONFIGS) {
    // 检查重复模式
    if (patterns.has(config.pattern)) {
      logPathWarning({
        type: "MISSING_CONFIG",
        path: config.pattern,
        message: `Duplicate path pattern: ${config.pattern}`,
      });
    }
    patterns.add(config.pattern);

    // 检查重复分类
    if (categories.has(config.category)) {
      logPathWarning({
        type: "MISSING_CONFIG",
        path: config.pattern,
        message: `Duplicate category: ${config.category}`,
      });
    }
    categories.add(config.category);

    // 检查配置完整性
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

    // 检查多语言配置完整性
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

// 解析路径 - 添加缓存
function parsePath(path: string): ParsedPath {
  // 检查缓存
  if (pathCache.has(path)) {
    return pathCache.get(path)!;
  }

  const segments = path.split("/").filter(Boolean);
  const result: ParsedPath = {
    category: "",
    isMatched: false,
    rawSegments: segments,
  };

  if (segments.length === 0) {
    pathCache.set(path, result);
    return result;
  }

  // 使用 Map 进行快速查找
  const mainSegment = segments[0];
  const matchingConfig = PATH_CONFIGS_MAP.get(
    `/${mainSegment}`
  );

  if (matchingConfig) {
    result.config = matchingConfig;
    result.category = matchingConfig.category;
    result.isMatched = true;

    // 检查版本号
    if (segments.length > 1) {
      const versionCandidate = segments[1];

      if (VERSION_PATTERN.test(versionCandidate)) {
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
        if (versionCandidate.startsWith("v")) {
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
  } else {
    logPathWarning({
      type: "UNMATCHED_PATH",
      path,
      message: `No configuration found for path: ${path}`,
      suggestions: PATH_CONFIGS.map(
        (config) => `Try: ${config.pattern}`
      ),
    });
  }

  // 缓存结果
  pathCache.set(path, result);
  return result;
}

// 获取本地化文本
function getLocalizedText(
  textMap: Record<string, string>,
  locale: string
): string {
  return (
    textMap[locale] ||
    textMap.en ||
    Object.values(textMap)[0] ||
    ""
  );
}

// 清理标题文本
function cleanTitle(title: string): string {
  return title
    .replace(
      /\s*[-|]\s*(Onerway|Documentation|Docs).*$/i,
      ""
    )
    .replace(/\s*[-|]\s*Nuxt.*$/i, "")
    .trim();
}

// 获取页面元数据
function getPageMetadata(
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

export const useRecentPages = () => {
  const route = useRoute();
  const router = useRouter();

  // 初始化时验证配置
  if (import.meta.dev && !isInitialized) {
    validatePathConfigs();
  }

  // 根据路径获取页面标题 - 添加缓存
  const getPageTitle = (
    path: string,
    locale = "en"
  ): string => {
    const cacheKey = `${path}-${locale}`;
    if (titleCache.has(cacheKey)) {
      return titleCache.get(cacheKey)!;
    }

    let title = "";

    // 首先尝试从 document.title 获取当前页面标题
    if (import.meta.client && path === route.path) {
      const currentTitle = document.title;
      if (
        currentTitle &&
        currentTitle !== "Nuxt" &&
        !currentTitle.includes("localhost")
      ) {
        const cleanedTitle = cleanTitle(currentTitle);
        if (cleanedTitle) {
          title = cleanedTitle;
        }
      }
    }

    // 尝试从页面的 meta 标签获取标题
    if (!title && import.meta.client) {
      const metaTitle = getPageMetadata(
        [
          'meta[property="og:title"]',
          'meta[name="title"]',
          'meta[name="twitter:title"]',
          "h1",
        ],
        "content"
      );

      if (metaTitle) {
        const cleanedTitle = cleanTitle(metaTitle);
        if (cleanedTitle && cleanedTitle !== "Nuxt") {
          title = cleanedTitle;
        }
      }
    }

    // 使用通用路径解析逻辑
    if (!title) {
      const parsed = parsePath(path);
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

    // 回退到基于路径的智能标题生成
    if (!title) {
      const parsed = parsePath(path);
      if (parsed.rawSegments.length > 0) {
        const lastSegment =
          parsed.rawSegments[parsed.rawSegments.length - 1];
        title = lastSegment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
      } else {
        title = "Unknown Page";
      }
    }

    // 缓存结果
    titleCache.set(cacheKey, title);
    return title;
  };

  // 根据路径获取页面描述 - 添加缓存
  const getPageDescription = (
    path: string,
    locale = "en"
  ): string => {
    const cacheKey = `${path}-${locale}-desc`;
    if (descriptionCache.has(cacheKey)) {
      return descriptionCache.get(cacheKey)!;
    }
    console.log("cacheKey", cacheKey);

    let description = "";

    // 首先尝试从 meta 标签获取页面描述
    if (import.meta.client) {
      const metaDescription = getPageMetadata(
        [
          'meta[name="description"]',
          'meta[property="og:description"]',
          'meta[name="twitter:description"]',
          'meta[property="description"]',
        ],
        "content"
      );

      if (metaDescription && metaDescription.length > 10) {
        description = metaDescription;
      }
    }

    // 尝试从页面内容获取描述
    if (!description && import.meta.client) {
      const contentDescription = getPageMetadata([
        ".page-description",
        ".lead",
        ".intro",
        "article p:first-of-type",
        ".content p:first-of-type",
        "main p:first-of-type",
        "h1 + p",
        "h2 + p",
      ]);

      if (
        contentDescription &&
        contentDescription.length > 20 &&
        contentDescription.length < 300
      ) {
        description =
          contentDescription.length > 200
            ? `${contentDescription.substring(0, 200)}...`
            : contentDescription;
      }
    }

    // 使用通用路径解析逻辑
    if (!description) {
      const parsed = parsePath(path);
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

    // 通用回退描述
    if (!description) {
      const parsed = parsePath(path);
      if (parsed.rawSegments.length > 0) {
        const lastSegment = parsed.rawSegments[
          parsed.rawSegments.length - 1
        ]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

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

    // 缓存结果
    descriptionCache.set(cacheKey, description);
    return description;
  };

  // 根据路径获取页面图标
  const getPageIcon = (path: string): string => {
    const parsed = parsePath(path);
    return parsed.isMatched && parsed.config
      ? parsed.config.icon
      : "i-heroicons-document";
  };

  // 根据路径获取页面图标颜色
  const getPageIconColor = (path: string): string => {
    const parsed = parsePath(path);
    return parsed.isMatched && parsed.config
      ? parsed.config.iconColor
      : "text-primary";
  };

  // 获取时间显示的颜色编码
  const getTimeColor = (timestamp: number): string => {
    const now = Date.now();
    const hours = Math.floor(
      (now - timestamp) / (1000 * 60 * 60)
    );

    if (hours < 1) return "text-green-500";
    if (hours < 24) return "text-blue-500";
    if (hours < 168) return "text-yellow-500";
    return "text-gray-400";
  };

  // 国际化的时间格式化
  const formatTimeI18n = (
    timestamp: number,
    locale = "en"
  ): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (locale.startsWith("zh")) {
      if (minutes < 1) return "刚刚";
      if (minutes < 60) return `${minutes} 分钟前`;
      if (hours < 24) return `${hours} 小时前`;
      return `${days} 天前`;
    } else {
      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes} minutes ago`;
      if (hours < 24) return `${hours} hours ago`;
      return `${days} days ago`;
    }
  };

  // 从 localStorage 加载数据
  const loadRecentPages = () => {
    if (!import.meta.client) return;

    try {
      const stored = localStorage.getItem(
        "onerway-recent-pages"
      );
      if (stored) {
        const parsed = JSON.parse(stored);
        // 验证数据结构
        if (Array.isArray(parsed)) {
          recentPages.value = parsed.filter(
            (page) =>
              page &&
              typeof page === "object" &&
              page.path &&
              page.title &&
              page.timestamp
          );
        }
      }
    } catch (error) {
      console.warn("Failed to load recent pages:", error);
      // 清除损坏的数据
      localStorage.removeItem("onerway-recent-pages");
    }
  };

  // 保存数据到 localStorage - 防抖处理
  const saveRecentPages = debounce(() => {
    if (!import.meta.client) return;

    try {
      localStorage.setItem(
        "onerway-recent-pages",
        JSON.stringify(recentPages.value)
      );
    } catch (error) {
      console.warn("Failed to save recent pages:", error);
    }
  }, 300);

  // 添加当前页面到最近浏览 - 防抖处理
  const addCurrentPage = debounce(
    async (currentPath?: string, locale = "en") => {
      const pathToAdd = currentPath || route.path;

      // 跳过首页和无效路径
      if (pathToAdd === "/" || !pathToAdd) return;

      if (import.meta.dev) {
        console.log("Adding page to recent:", pathToAdd);
      }

      // 等待页面标题更新
      if (import.meta.client) {
        await new Promise((resolve) =>
          setTimeout(resolve, 100)
        );
      }

      const currentPage: RecentPage = {
        title: getPageTitle(pathToAdd, locale),
        description: getPageDescription(pathToAdd, locale),
        path: pathToAdd,
        timestamp: Date.now(),
        icon: getPageIcon(pathToAdd),
      };

      // 移除重复项并添加到开头
      recentPages.value = [
        currentPage,
        ...recentPages.value.filter(
          (page) => page.path !== currentPage.path
        ),
      ].slice(0, 10); // 只保留最近的 10 个

      saveRecentPages();

      if (import.meta.dev) {
        console.log(
          "Recent pages updated:",
          recentPages.value
        );
      }
    },
    200
  );

  // 清除最近浏览记录
  const clearRecentPages = () => {
    recentPages.value = [];
    if (import.meta.client) {
      localStorage.removeItem("onerway-recent-pages");
    }
  };

  // 移除指定页面
  const removeRecentPage = (path: string) => {
    recentPages.value = recentPages.value.filter(
      (page) => page.path !== path
    );
    saveRecentPages();
  };

  // 初始化（只执行一次）
  const initialize = (locale = "en") => {
    if (isInitialized || !import.meta.client) return;

    loadRecentPages();

    // 监听路由变化
    router.afterEach(async (to) => {
      if (import.meta.dev) {
        console.log("Route changed to:", to.path);
      }
      await nextTick();
      addCurrentPage(to.path, locale);
    });

    // 记录当前路由
    if (route.path !== "/") {
      nextTick(async () => {
        await addCurrentPage(route.path, locale);
      });
    }

    isInitialized = true;
  };

  // 格式化时间（简化版本）
  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  // 计算属性
  const recentThreePages = computed(() =>
    recentPages.value.slice(0, 3)
  );

  return {
    recentPages: readonly(recentPages),
    recentThreePages,
    addCurrentPage,
    formatTime,
    initialize,
    getPageTitle,
    getPageDescription,
    getPageIcon,
    getPageIconColor,
    getTimeColor,
    formatTimeI18n,
    clearRecentPages,
    removeRecentPage,
    // 调试功能
    parsePath: import.meta.dev ? parsePath : undefined,
  };
};

// 带 i18n 集成的包装 composable
export const useRecentPagesWithI18n = () => {
  const { locale } = useI18n();
  const recentPages = useRecentPages();

  // 包装函数，自动传入当前 locale
  const addCurrentPage = async (currentPath?: string) => {
    return recentPages.addCurrentPage(
      currentPath,
      locale.value
    );
  };

  const initialize = () => {
    return recentPages.initialize(locale.value);
  };

  const getPageTitle = (path: string) => {
    return recentPages.getPageTitle(path, locale.value);
  };

  const getPageDescription = (path: string) => {
    return recentPages.getPageDescription(
      path,
      locale.value
    );
  };

  const formatTimeI18n = (timestamp: number) => {
    return recentPages.formatTimeI18n(
      timestamp,
      locale.value
    );
  };

  return {
    ...recentPages,
    addCurrentPage,
    initialize,
    getPageTitle,
    getPageDescription,
    formatTimeI18n,
  };
};
