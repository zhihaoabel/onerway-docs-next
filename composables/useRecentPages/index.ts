import type {
  RouteLocationNormalizedLoaded,
  Router
} from "vue-router";
import type { RecentPage } from "./types";
import { computed, nextTick, readonly, ref } from "vue";
import { CacheManager } from "./classes/cache-manager";
import { DescriptionGenerator } from "./classes/description-generator";
import { PageMetadataExtractor } from "./classes/metadata-extractor";
import { PathParser } from "./classes/path-parser";
import { StorageManager } from "./classes/storage-manager";
import { TimeFormatter } from "./classes/time-formatter";
import { TitleGenerator } from "./classes/title-generator";
import { PAGE_ADD_DEBOUNCE_DELAY } from "./constants";
import { debounce } from "./utils";

// 工具函数：判断是否应该跳过路径记录
const shouldSkipPathRecording = (
  path: string,
  routeName?: string | symbol | null
): boolean => {
  return (
    path === "/" ||
    path === "/404" ||
    path.startsWith("/404?") ||
    String(routeName) === "404"
  );
};

// 创建实例的函数（优化后的 useRecentPages 逻辑）
function createRecentPagesInstance() {
  // 在顶层调用 composables
  const { locale } = useI18n();

  // 缓存 composables 调用结果
  let cachedRoute: RouteLocationNormalizedLoaded | null =
    null;
  let router: Router | null = null;

  // 获取当前路由（优化缓存机制）
  const getRoute =
    (): RouteLocationNormalizedLoaded | null => {
      if (!cachedRoute) {
        try {
          cachedRoute = useRoute();
        } catch {
          // 如果获取失败，返回 null
          return null;
        }
      }
      return cachedRoute;
    };

  // 更新路由缓存
  const updateRouteCache = (
    newRoute: RouteLocationNormalizedLoaded
  ): void => {
    cachedRoute = newRoute;
  };

  // 初始化组件
  const cache = new CacheManager();
  const parser = new PathParser();
  const extractor = new PageMetadataExtractor();
  const titleGenerator = new TitleGenerator(
    parser,
    extractor,
    cache
  );
  const descriptionGenerator = new DescriptionGenerator(
    parser,
    extractor,
    cache
  );
  const timeFormatter = new TimeFormatter();
  const storage = new StorageManager();

  // 响应式状态
  const recentPages = ref<RecentPage[]>(storage.getPages());
  let isInitialized = false;

  // 获取页面信息的函数
  const getPageTitle = (path: string): string => {
    const currentLocale = locale.value || "en";
    const currentRoute = getRoute();
    const isCurrentPath =
      currentRoute && path === currentRoute.path;

    return titleGenerator.generate(
      path,
      currentLocale,
      isCurrentPath || false
    );
  };

  const getPageDescription = (path: string): string => {
    const currentLocale = locale.value || "en";
    return descriptionGenerator.generate(
      path,
      currentLocale
    );
  };

  const getPageIcon = (path: string): string => {
    const parsed = parser.parse(path);
    return parsed.isMatched && parsed.config
      ? parsed.config.icon
      : "i-heroicons-document";
  };

  const getPageIconColor = (path: string): string => {
    const parsed = parser.parse(path);
    return parsed.isMatched && parsed.config
      ? parsed.config.iconColor
      : "text-primary";
  };

  const getTimeColor = (timestamp: number): string => {
    return timeFormatter.getColor(timestamp);
  };

  const formatTimeI18n = (timestamp: number): string => {
    const currentLocale = locale.value || "en";
    return timeFormatter.formatI18n(
      timestamp,
      currentLocale
    );
  };

  const formatTime = (timestamp: number): string => {
    return timeFormatter.format(timestamp);
  };

  // 防抖的添加页面函数
  const addCurrentPage = debounce(
    async (currentPath?: string) => {
      const route = getRoute();
      const currentLocale = locale.value || "en";
      const pathToAdd = currentPath || route?.path;

      if (!pathToAdd || shouldSkipPathRecording(pathToAdd))
        return;

      if (import.meta.dev) {
        console.log(
          "Adding page to recent:",
          pathToAdd,
          "locale:",
          currentLocale
        );
      }

      // 短暂延迟确保 DOM 更新完成
      if (import.meta.client) {
        await new Promise((resolve) =>
          setTimeout(resolve, 100)
        );
      }

      // 修复 isCurrentPath 判断：只有当路径完全匹配且不是 404 页面时才认为是当前路径
      const isCurrentPath =
        pathToAdd === route?.path &&
        !shouldSkipPathRecording(route.path, route.name);

      try {
        const currentPage: RecentPage = {
          title: titleGenerator.generate(
            pathToAdd,
            currentLocale,
            isCurrentPath
          ),
          description: descriptionGenerator.generate(
            pathToAdd,
            currentLocale
          ),
          path: pathToAdd,
          timestamp: Date.now(),
          icon: getPageIcon(pathToAdd)
        };

        storage.addPage(currentPage);
        recentPages.value = storage.getPages();

        if (import.meta.dev) {
          console.log(
            "Recent pages updated:",
            recentPages.value
          );
        }
      } catch (error) {
        console.error(
          "Failed to add page to recent:",
          error
        );
      }
    },
    PAGE_ADD_DEBOUNCE_DELAY
  );

  // 页面管理函数
  const clearRecentPages = (): void => {
    storage.clearPages();
    recentPages.value = [];
  };

  const removeRecentPage = (path: string): void => {
    storage.removePage(path);
    recentPages.value = storage.getPages();
  };

  // 简化的初始化函数
  const initialize = (): void => {
    if (isInitialized || !import.meta.client) return;

    const currentLocale = locale.value || "en";

    if (import.meta.dev) {
      console.log(
        "[useRecentPages] Initializing with locale:",
        currentLocale
      );
    }

    try {
      // 直接使用 useRouter()
      router = useRouter();
      const route = useRoute();

      // 设置路由监听
      router.afterEach(
        async (to: RouteLocationNormalizedLoaded) => {
          // 更新路由缓存
          updateRouteCache(to);

          // 过滤不需要记录的路径
          if (shouldSkipPathRecording(to.path, to.name)) {
            if (import.meta.dev) {
              console.log(
                "Skipping path recording for:",
                to.path,
                "name:",
                to.name
              );
            }
            return;
          }

          // 检查是否是从查询参数中获取的原始路径（404 页面的情况）
          let pathToRecord = to.path;
          if (to.name === "404" && to.query?.path) {
            pathToRecord = to.query.path as string;
            if (import.meta.dev) {
              console.log(
                "Using original path from 404 query:",
                pathToRecord
              );
            }
          }

          if (import.meta.dev) {
            console.log(
              "Route changed to:",
              to.path,
              "recording path:",
              pathToRecord,
              "locale:",
              locale.value
            );
          }

          await nextTick();
          addCurrentPage(pathToRecord);
        }
      );

      // 添加当前页面（如果不应该跳过）
      if (
        route &&
        !shouldSkipPathRecording(route.path, route.name)
      ) {
        nextTick(async () => {
          await addCurrentPage(route.path);
        });
      }

      isInitialized = true;

      if (import.meta.dev) {
        console.log(
          "[useRecentPages] Initialization completed"
        );
      }
    } catch (error) {
      console.error(
        "Failed to initialize useRecentPages:",
        error
      );
    }
  };

  // 计算属性
  const recentThreePages = computed(() =>
    recentPages.value.slice(0, 3)
  );

  return {
    // State
    recentPages: readonly(recentPages),
    recentThreePages,

    // Actions
    addCurrentPage,
    clearRecentPages,
    removeRecentPage,
    initialize,

    // Getters
    getPageTitle,
    getPageDescription,
    getPageIcon,
    getPageIconColor,
    getTimeColor,
    formatTimeI18n,
    formatTime,

    // Utils (dev only)
    ...(import.meta.dev
      ? {
          parsePath: parser.parse.bind(parser),
          debugInfo: cache.getDebugInfo.bind(cache)
        }
      : {})
  };
}

// 创建单例实例（在模块顶层）
let globalInstance: ReturnType<
  typeof createRecentPagesInstance
> | null = null;

// 单例访问函数
export const useRecentPages = () => {
  if (!globalInstance) {
    globalInstance = createRecentPagesInstance();
  }
  return globalInstance;
};

// 重新导出类型
export type {
  ParsedPath,
  PathConfig,
  RecentPage,
  SupportedLocale
} from "./types";
