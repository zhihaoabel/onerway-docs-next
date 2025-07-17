<script setup lang="ts">
import { Html } from "#components";
import * as locales from "@nuxt/ui-pro/locale";

const { data: files } = useLazyAsyncData(
  "search",
  () => queryCollectionSearchSections("get_started_en"),
  {
    server: false,
  }
);

const searchTerm = ref("");

const links = [
  {
    label: "Docs",
    icon: "i-lucide-book",
    to: "/get-started",
  },
  {
    label: "Payments",
    icon: "i-lucide-box",
    to: "/payment",
  },
  {
    label: "Payout",
    icon: "i-lucide-chart-no-axes-gantt",
    to: "/payouts",
  },
];

const { locale } = useI18n();
const { initialize } = useRecentPages();

// 计算当前语言环境的 UI 配置
const currentUILocale = computed(() => {
  // 根据 Nuxt UI Pro 文档，locale code 映射如下:
  // zh-CN -> zh-CN (简体中文)
  // zh-TW -> zh-TW (繁体中文)
  // en -> en (英文)
  const localeMap = {
    "zh-CN": "zh-CN",
    "zh-TW": "zh-TW",
    en: "en",
  } as const;

  const mappedLocale =
    localeMap[locale.value as keyof typeof localeMap] ||
    "en";
  return (
    locales[mappedLocale as keyof typeof locales] ||
    locales.en
  );
});

onMounted(() => {
  nextTick(() => {
    initialize();
  });
});
</script>

<template>
  <Html :lang="locale">
    <Body>
      <UApp :locale="currentUILocale">
        <ClientOnly>
          <LazyUContentSearch
            v-model:search-term="searchTerm"
            :files="files"
            shortcut="meta_k"
            :links="links"
            :fuse="{ resultLimit: 42 }" />
        </ClientOnly>
        <NuxtLayout>
          <NuxtRouteAnnouncer />
          <NuxtPage />
        </NuxtLayout>
      </UApp>
    </Body>
  </Html>
</template>
