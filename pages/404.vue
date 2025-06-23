<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// 获取查询参数中的原始路径
const route = useRoute();
const originalPath =
  (route.query.path as string) || route.path;

// 推荐的页面链接
const suggestedPages = computed(() => [
  {
    title: t("404.suggestions.getStarted.title"),
    description: t(
      "404.suggestions.getStarted.description"
    ),
    to: "/get-started",
    icon: "i-heroicons-rocket-launch",
  },
  {
    title: t("404.suggestions.payments.title"),
    description: t("404.suggestions.payments.description"),
    to: "/payments",
    icon: "i-heroicons-credit-card",
  },
  {
    title: t("404.suggestions.api.title"),
    description: t("404.suggestions.api.description"),
    to: "/api",
    icon: "i-heroicons-code-bracket",
  },
]);

// SEO Meta
useSeoMeta({
  title: t("404.seo.title"),
  description: t("404.seo.description"),
  robots: "noindex, nofollow",
});

// 设置404状态码
setResponseStatus(404);

// 搜索功能
const searchQuery = ref("");

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return;
  await navigateTo(
    `/?search=${encodeURIComponent(searchQuery.value)}`
  );
};
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 text-center">
      <!-- 错误图标和状态码 -->
      <div class="space-y-4">
        <div class="flex justify-center">
          <div class="relative">
            <!-- 大号状态码 -->
            <div
              class="text-8xl font-bold text-primary/20 dark:text-primary/30"
            >
              404
            </div>
            <!-- 搜索图标装饰 -->
            <div
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="w-12 h-12 text-primary"
              />
            </div>
          </div>
        </div>

        <!-- 错误标题 -->
        <h1
          class="text-3xl font-bold text-gray-900 dark:text-white"
        >
          {{ t("404.title") }}
        </h1>

        <!-- 错误描述 -->
        <p class="text-lg text-gray-600 dark:text-gray-400">
          {{ t("404.description") }}
        </p>

        <!-- 尝试访问的路径 -->
        <div
          class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm"
        >
          <span class="text-gray-500 dark:text-gray-400"
            >{{ t("404.attemptedPath") }}:</span
          >
          <code class="ml-2 text-primary font-mono">{{
            originalPath
          }}</code>
        </div>
      </div>

      <!-- 搜索框 -->
      <div class="space-y-4">
        <div class="flex gap-2">
          <UInput
            v-model="searchQuery"
            :placeholder="t('404.searchPlaceholder')"
            icon="i-heroicons-magnifying-glass"
            size="lg"
            class="flex-1"
            @keyup.enter="handleSearch"
          />
          <UButton
            size="lg"
            :disabled="!searchQuery.trim()"
            @click="handleSearch"
          >
            {{ t("404.search") }}
          </UButton>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div
        class="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <UButton
          size="lg"
          icon="i-heroicons-home"
          to="/"
        >
          {{ t("404.backHome") }}
        </UButton>

        <UButton
          size="lg"
          variant="outline"
          icon="i-heroicons-arrow-left"
          @click="$router.go(-1)"
        >
          {{ t("404.goBack") }}
        </UButton>
      </div>

      <!-- 推荐页面 -->
      <div class="space-y-4">
        <h2
          class="text-xl font-semibold text-gray-900 dark:text-white"
        >
          {{ t("404.suggestionsTitle") }}
        </h2>

        <div class="grid gap-3">
          <UCard
            v-for="page in suggestedPages"
            :key="page.to"
            class="cursor-pointer hover:shadow-md transition-shadow"
            @click="navigateTo(page.to)"
          >
            <div class="flex items-center space-x-3">
              <UIcon
                :name="page.icon"
                class="w-6 h-6 text-primary"
              />
              <div class="text-left">
                <h3
                  class="font-medium text-gray-900 dark:text-white"
                >
                  {{ page.title }}
                </h3>
                <p
                  class="text-sm text-gray-600 dark:text-gray-400"
                >
                  {{ page.description }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
