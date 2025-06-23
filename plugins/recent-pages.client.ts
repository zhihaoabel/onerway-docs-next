// plugins/recent-pages.client.ts
// 简化版本 - 不依赖插件系统
export default defineNuxtPlugin(() => {
  // 只在客户端运行
  if (!import.meta.client) return;

  // 使用 nextTick 确保在 Vue 应用完全初始化后运行
  nextTick(() => {
    // 延迟初始化，确保所有插件都已加载
    setTimeout(() => {
      try {
        const { initialize } = useRecentPages();

        // 简单的语言检测
        let locale = "en";

        // 尝试多种方式获取语言设置
        try {
          // 方法1: 从 HTML lang 属性
          const htmlLang = document.documentElement.lang;
          if (htmlLang) {
            locale = htmlLang;
          }

          // 方法2: 从 URL 路径
          const path = window.location.pathname;
          if (
            path.startsWith("/zh-cn") ||
            path.includes("/zh-cn/")
          ) {
            locale = "zh-CN";
          } else if (
            path.startsWith("/zh-tw") ||
            path.includes("/zh-tw/")
          ) {
            locale = "zh-TW";
          } else if (
            path.startsWith("/zh") ||
            path.includes("/zh/")
          ) {
            locale = "zh-CN";
          }

          // 方法3: 从 localStorage
          const storedLocale =
            localStorage.getItem("i18n_redirected") ||
            localStorage.getItem("locale");
          if (storedLocale) {
            locale = storedLocale;
          }

          // 方法4: 从浏览器语言
          if (locale === "en" && navigator.language) {
            const browserLang =
              navigator.language.toLowerCase();
            if (browserLang.startsWith("zh-cn")) {
              locale = "zh-CN";
            } else if (
              browserLang.startsWith("zh-tw") ||
              browserLang.startsWith("zh-hk")
            ) {
              locale = "zh-TW";
            } else if (browserLang.startsWith("zh")) {
              locale = "zh-CN";
            }
          }
        } catch (langError) {
          console.warn(
            "[RecentPages] Language detection failed, using default:",
            langError
          );
        }

        // 初始化
        initialize(locale);

        if (import.meta.dev) {
          console.log(
            "[RecentPages Plugin] Initialized with locale:",
            locale
          );
        }
      } catch (error) {
        console.error(
          "[RecentPages Plugin] Initialization failed:",
          error
        );
      }
    }, 300); // 延迟 300ms 确保其他插件已加载
  });
});
