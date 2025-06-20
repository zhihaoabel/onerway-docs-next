<script setup lang="ts">
const { t } = useI18n();
const { recentThreePages, initialize } = useRecentPages();

// 在组件中处理国际化的格式化时间
const formatTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1)
    return t("recentlyViewed.timeAgo.justNow");
  if (minutes < 60)
    return t("recentlyViewed.timeAgo.minutesAgo", {
      minutes,
    });
  if (hours < 24)
    return t("recentlyViewed.timeAgo.hoursAgo", { hours });
  return t("recentlyViewed.timeAgo.daysAgo", { days });
};

// 在组件中处理国际化的页面标题
const getLocalizedTitle = (page: RecentPage): string => {
  // 现在 composable 已经提供了真实的页面标题，我们应该直接使用它
  // 只有在标题是通用分类名称时才进行本地化处理
  const title = page.title || "Unknown Page";

  // 如果标题就是简单的分类名称，进行本地化
  if (title === "Documentation" || title === "Docs")
    return t("nav.docs");
  if (title === "API Reference" || title === "API")
    return t("nav.api");
  if (title === "Guides" || title === "Guide")
    return t("nav.guides");
  if (title === "Payment") return t("nav.payment");

  // 否则直接返回真实的页面标题
  return title;
};

// 在组件中处理国际化的页面描述
const getLocalizedDescription = (
  page: RecentPage
): string => {
  // 如果 composable 已经提供了高质量的描述，直接使用
  if (
    page.description &&
    page.description.length > 30 && // 提高质量门槛
    !page.description.startsWith(
      "Documentation and guides"
    ) && // 排除旧的简单描述
    !page.description.startsWith(
      "API reference documentation"
    ) &&
    !page.description.startsWith("Integration guides") &&
    !page.description.startsWith("Payment products")
  ) {
    return page.description;
  }

  // 只在必要时提供国际化回退（针对分类页面或质量不佳的描述）
  const path = page.path;
  if (path.startsWith("/docs"))
    return t("recentlyViewed.categories.docs");
  if (path.startsWith("/api"))
    return t("recentlyViewed.categories.api");
  if (path.startsWith("/guides"))
    return t("recentlyViewed.categories.guides");
  if (path.startsWith("/payment"))
    return t("recentlyViewed.categories.payment");

  // 最终回退
  return (
    page.description ||
    t("recentlyViewed.categories.default")
  );
};

// 获取页面类型对应的彩色图标
const getPageIcon = (page: RecentPage): string => {
  const path = page.path;
  if (path.startsWith("/docs"))
    return "i-heroicons-document-text";
  if (path.startsWith("/api"))
    return "i-heroicons-code-bracket";
  if (path.startsWith("/guides"))
    return "i-heroicons-academic-cap";
  if (path.startsWith("/payment"))
    return "i-heroicons-credit-card";
  return page.icon || "i-heroicons-document";
};

// 获取页面类型对应的图标颜色
const getPageIconColor = (page: RecentPage): string => {
  const path = page.path;
  if (path.startsWith("/docs")) return "text-blue-500";
  if (path.startsWith("/api")) return "text-green-500";
  if (path.startsWith("/guides")) return "text-purple-500";
  if (path.startsWith("/payment")) return "text-orange-500";
  return "text-primary";
};

// 获取时间显示的颜色编码
const getTimeColor = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return "text-green-500"; // 1小时内 - 绿色
  if (hours < 24) return "text-blue-500"; // 24小时内 - 蓝色
  if (hours < 168) return "text-yellow-500"; // 1周内 - 黄色
  return "text-gray-400"; // 超过1周 - 灰色
};

// 确保组件挂载时初始化
onMounted(() => {
  initialize();
});
</script>

<template>
  <!-- 最近浏览的页面列表 -->
  <UCard
    class="overflow-hidden transform-gpu"
    role="region"
    aria-label="Recently viewed pages"
    :ui="{
      root: 'divide-none',
    }"
  >
    <!-- 标题 -->
    <template
      #header
      v-if="recentThreePages.length > 0"
    >
      <div>
        <h3
          id="recent-pages-title"
          class="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {{ t("recentlyViewed.title") }}
        </h3>
        <p class="text-sm text-muted">
          {{ t("recentlyViewed.subtitle") }}
        </p>
      </div>
    </template>

    <!-- 最近浏览的页面内容 -->
    <template
      #default
      v-if="recentThreePages.length > 0"
    >
      <UPageMarquee
        class="divide-y divide-white/10 dark:divide-gray-700/30 w-full max-h-56"
        aria-labelledby="recent-pages-title"
        :ui="{
          content: 'items-stretch w-full',
        }"
        role="navigation"
        :pause-on-hover="true"
        orientation="vertical"
        :repeat="3"
      >
        <NuxtLink
          v-for="(page, index) in recentThreePages"
          :key="page.path"
          :to="page.path"
          class="block hover:bg-muted dark:hover:bg-muted/50 hover:scale-[1.02] transition-all duration-200 motion-reduce:transform-none transform-gpu focus:bg-white/10"
          :class="{ 'border-t-0': index === 0 }"
          :aria-label="`Visit ${getLocalizedTitle(page)} - ${getLocalizedDescription(page)}`"
          tabindex="0"
        >
          <div class="flex items-start space-x-3">
            <!-- 图标 -->
            <div class="flex-shrink-0">
              <UIcon
                :name="getPageIcon(page)"
                class="w-5 h-5"
                :class="getPageIconColor(page)"
                aria-hidden="true"
              />
            </div>

            <!-- 内容 -->
            <div class="flex-1 min-w-0 max-w-sm">
              <h4 class="text-sm font-medium truncate">
                {{ getLocalizedTitle(page) }}
              </h4>
              <p
                class="text-xs mt-1 line-clamp-2 text-muted"
              >
                {{ getLocalizedDescription(page) }}
              </p>
              <p
                class="text-xs mt-2"
                :class="getTimeColor(page.timestamp)"
                :aria-label="`Last visited ${formatTime(page.timestamp)}`"
              >
                {{ formatTime(page.timestamp) }}
              </p>
            </div>

            <!-- 箭头图标 -->
            <div class="flex-shrink-0">
              <UIcon
                name="i-heroicons-chevron-right"
                class="w-4 h-4 text-muted"
                aria-hidden="true"
              />
            </div>
          </div>
        </NuxtLink>
      </UPageMarquee>
    </template>

    <template #footer>
      <div class="py-2">
        <p class="text-xs text-muted">
          {{ t("recentlyViewed.footer.signInPrompt") }}
          <UButton
            to="https://sandbox-portal.onerway.com/user/login"
            target="_blank"
            variant="link"
            size="xs"
            class="text-xs p-0 h-auto font-semibold"
            aria-label="Sign in to Onerway sandbox portal"
          >
            {{ t("recentlyViewed.footer.signIn") }}
          </UButton>
          {{ t("recentlyViewed.footer.loadKeys") }}
        </p>
      </div>
    </template>
  </UCard>
</template>
