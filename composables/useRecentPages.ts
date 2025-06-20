export interface RecentPage {
  title: string;
  description?: string;
  path: string;
  timestamp: number;
  icon?: string;
}

// 全局状态
const recentPages = ref<RecentPage[]>([]);
let isInitialized = false;

export const useRecentPages = () => {
  const route = useRoute();

  // 根据路径获取页面标题
  const getPageTitle = (path: string): string => {
    // 首先尝试从 document.title 获取当前页面标题
    if (import.meta.client && path === route.path) {
      const currentTitle = document.title;
      if (
        currentTitle &&
        currentTitle !== "Nuxt" &&
        !currentTitle.includes("localhost")
      ) {
        // 移除常见的网站后缀，保留主要标题
        const cleanTitle = currentTitle
          .replace(
            /\s*[-|]\s*(Onerway|Documentation|Docs).*$/i,
            ""
          )
          .replace(/\s*[-|]\s*Nuxt.*$/i, "")
          .trim();
        if (cleanTitle) {
          return cleanTitle;
        }
      }
    }

    // 尝试从页面的 meta 标签获取标题
    if (import.meta.client) {
      const metaSelectors = [
        'meta[property="og:title"]',
        'meta[name="title"]',
        'meta[name="twitter:title"]',
        "h1", // 尝试获取页面的主标题
      ];

      for (const selector of metaSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          const content =
            element.getAttribute("content") ||
            element.textContent;
          if (content && content.trim()) {
            const cleanTitle = content
              .replace(
                /\s*[-|]\s*(Onerway|Documentation|Docs).*$/i,
                ""
              )
              .trim();
            if (cleanTitle && cleanTitle !== "Nuxt") {
              return cleanTitle;
            }
          }
        }
      }
    }

    // 回退到基于路径的智能标题生成
    const segments = path.split("/").filter(Boolean);

    // 特殊路径处理
    if (path.startsWith("/docs")) {
      const docPath = segments.slice(1).join(" ");
      return docPath
        ? `Docs: ${docPath.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
        : "Documentation";
    }
    if (path.startsWith("/api")) {
      const apiPath = segments.slice(1).join(" ");
      return apiPath
        ? `API: ${apiPath.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
        : "API Reference";
    }
    if (path.startsWith("/guides")) {
      const guidePath = segments.slice(1).join(" ");
      return guidePath
        ? `Guide: ${guidePath.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
        : "Guides";
    }
    if (path.startsWith("/payment")) {
      const paymentPath = segments.slice(1).join(" ");
      return paymentPath
        ? `Payment: ${paymentPath.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
        : "Payment";
    }

    // 通用路径处理
    const lastSegment = segments[segments.length - 1];
    if (lastSegment) {
      return lastSegment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }

    return "Unknown Page";
  };

  // 根据路径获取页面描述
  const getPageDescription = (path: string): string => {
    // 首先尝试从 meta 标签获取页面描述
    if (import.meta.client) {
      const metaSelectors = [
        'meta[name="description"]',
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
        'meta[property="description"]',
      ];

      for (const selector of metaSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          const content = element.getAttribute("content");
          if (content && content.trim()) {
            const cleanDescription = content.trim();
            // 确保描述不为空且有意义
            if (
              cleanDescription &&
              cleanDescription.length > 10
            ) {
              return cleanDescription;
            }
          }
        }
      }

      // 尝试从页面的第一个段落或摘要元素获取描述
      const contentSelectors = [
        ".page-description", // 自定义描述类
        ".lead", // Bootstrap lead 类
        ".intro", // 介绍段落
        "article p:first-of-type", // 文章的第一个段落
        ".content p:first-of-type", // 内容区域的第一个段落
        "main p:first-of-type", // 主要内容的第一个段落
        "h1 + p", // 紧跟在 h1 后的段落
        "h2 + p", // 紧跟在 h2 后的段落
      ];

      for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent) {
          const content = element.textContent.trim();
          // 确保内容有足够的长度且不是标题
          if (
            content &&
            content.length > 20 &&
            content.length < 300
          ) {
            // 截取前200个字符，避免描述过长
            return content.length > 200
              ? `${content.substring(0, 200)}...`
              : content;
          }
        }
      }
    }

    // 回退到基于路径的智能描述生成
    if (path.startsWith("/docs")) {
      const segments = path.split("/").filter(Boolean);
      const docPath = segments.slice(1);
      if (docPath.length > 0) {
        const category = docPath[0].replace(/-/g, " ");
        return `Documentation for ${category} - Learn how to integrate and use our ${category} features`;
      }
      return "Comprehensive documentation and guides for developers";
    }

    if (path.startsWith("/api")) {
      const segments = path.split("/").filter(Boolean);
      const apiPath = segments.slice(1);
      if (apiPath.length > 0) {
        const version = apiPath[0];
        const endpoint = apiPath
          .slice(1)
          .join(" ")
          .replace(/-/g, " ");
        if (endpoint) {
          return `API reference for ${endpoint} (${version}) - Detailed endpoint documentation with examples`;
        }
        return `API reference documentation for ${version} - Complete API specification and examples`;
      }
      return "Complete API reference with endpoints, parameters, and response examples";
    }

    if (path.startsWith("/guides")) {
      const segments = path.split("/").filter(Boolean);
      const guidePath = segments.slice(1);
      if (guidePath.length > 0) {
        const guide = guidePath
          .join(" ")
          .replace(/-/g, " ");
        return `Step-by-step guide for ${guide} - Implementation examples and best practices`;
      }
      return "Integration guides and tutorials with practical examples";
    }

    if (path.startsWith("/payment")) {
      const segments = path.split("/").filter(Boolean);
      const paymentPath = segments.slice(1);
      if (paymentPath.length > 0) {
        const product = paymentPath
          .join(" ")
          .replace(/-/g, " ");
        return `Payment solution for ${product} - Features, pricing, and integration details`;
      }
      return "Payment products and solutions for your business needs";
    }

    // 通用回退描述
    const segments = path.split("/").filter(Boolean);
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      return `Information and resources about ${lastSegment}`;
    }

    return "Page content and information";
  };

  // 根据路径获取页面图标
  const getPageIcon = (path: string): string => {
    if (path.startsWith("/docs"))
      return "i-heroicons-document-text";
    if (path.startsWith("/api"))
      return "i-heroicons-code-bracket";
    if (path.startsWith("/guides"))
      return "i-heroicons-academic-cap";
    if (path.startsWith("/payment"))
      return "i-heroicons-credit-card";
    return "i-heroicons-document";
  };

  // 从 localStorage 加载数据
  const loadRecentPages = () => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(
          "onerway-recent-pages"
        );
        if (stored) {
          recentPages.value = JSON.parse(stored);
        }
      } catch (error) {
        console.warn("Failed to load recent pages:", error);
      }
    }
  };

  // 保存数据到 localStorage
  const saveRecentPages = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(
          "onerway-recent-pages",
          JSON.stringify(recentPages.value)
        );
      } catch (error) {
        console.warn("Failed to save recent pages:", error);
      }
    }
  };

  // 添加当前页面到最近浏览
  const addCurrentPage = async (currentPath?: string) => {
    const pathToAdd = currentPath || route.path;

    // 跳过首页
    if (pathToAdd === "/") return;

    console.log("Adding page to recent:", pathToAdd); // 调试日志

    // 等待一小段时间，确保页面标题已经更新
    if (import.meta.client) {
      await new Promise((resolve) =>
        setTimeout(resolve, 100)
      );
    }

    const currentPage: RecentPage = {
      title: getPageTitle(pathToAdd),
      description: getPageDescription(pathToAdd),
      path: pathToAdd,
      timestamp: Date.now(),
      icon: getPageIcon(pathToAdd),
    };

    console.log("Page title captured:", currentPage.title); // 调试日志

    // 移除重复项
    recentPages.value = recentPages.value.filter(
      (page) => page.path !== currentPage.path
    );

    // 添加到开头
    recentPages.value.unshift(currentPage);

    // 只保留最近的 10 个
    recentPages.value = recentPages.value.slice(0, 10);

    saveRecentPages();

    console.log("Recent pages updated:", recentPages.value); // 调试日志
  };

  // 初始化（只执行一次）
  const initialize = () => {
    if (isInitialized) return;

    if (import.meta.client) {
      loadRecentPages();

      // 全局监听路由变化
      const router = useRouter();

      // 使用 router 的 afterEach 钩子来监听路由变化
      router.afterEach(async (to) => {
        console.log("Route changed to:", to.path); // 调试日志
        await nextTick();
        await addCurrentPage(to.path);
      });

      // 也监听当前路由，以防初始页面没有被记录
      if (route.path !== "/") {
        nextTick(async () => {
          await addCurrentPage(route.path);
        });
      }

      isInitialized = true;
    }
  };

  // 格式化时间（简化版本，不依赖 i18n）
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

  // 获取最近的 3 个页面
  const recentThreePages = computed(() =>
    recentPages.value.slice(0, 3)
  );

  return {
    recentPages: readonly(recentPages),
    recentThreePages,
    addCurrentPage,
    formatTime,
    initialize,
  };
};
