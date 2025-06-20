<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { locale, locales, setLocale, t } = useI18n();
const route = useRoute();

// 导航菜单项
const items = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: t("header.getStarted"),
      to: "/get-started",
      active: route.path.startsWith("/get-started"),
    },
    {
      label: t("header.payments"),
      to: "/payments",
      active: route.path.startsWith("/payments"),
    },
    {
      label: t("header.payout"),
      to: "/payout",
      active: route.path.startsWith("/payout"),
    },
  ],
  [
    {
      label: t("header.apisAndSdks"),
      to: "https://docs.onerway.com/",
      target: "_blank",
      children: [
        {
          label: t("header.payments"),
          to: "https://docs.onerway.com/apis/zh/",
          target: "_blank",
        },
        {
          label: t("header.payout"),
          to: "https://docs.onerway.com/apis/payout/",
          target: "_blank",
        },
      ],
    },
    {
      label: t("header.help"),
      to: "https://docs.onerway.com/",
      target: "_blank",
      children: [
        {
          label: t("header.support"),
          to: "https://docs.onerway.com/",
          target: "_blank",
        },
        {
          label: t("header.contactUs"),
          to: "https://docs.onerway.com/",
          target: "_blank",
        },
      ],
    },
  ],
]);

// 当前语言标签
const currentLocaleLabel = computed(() => {
  return locales.value.find(
    (localeItem) => localeItem.code === locale.value
  )?.name;
});

// 语言切换菜单项
const languageItems = computed(() => [
  locales.value.map((localeItem) => ({
    label: localeItem.name,
    onSelect: () => setLocale(localeItem.code),
  })),
]);
</script>

<template>
  <div
    class="sticky top-0 z-50 h-[var(--ui-header-height)]"
  >
    <UHeader
      :ui="{
        root: 'border-none bg-muted backdrop-blur',
        container: 'max-w-full mx-auto',
      }"
      :toggle="{
        color: 'primary',
        variant: 'subtle',
      }"
    >
      <template #left>
        <!-- Logo 和品牌名 -->
        <NuxtLink
          to="/"
          class="flex items-center gap-2 text-xl font-bold text-center"
        >
          <img
            src="/favicon.ico"
            alt="Onerway Docs"
            class="size-10"
          />
          <Logo class="text-highlighted" />
        </NuxtLink>
      </template>

      <!-- 搜索按钮 -->
      <UContentSearchButton
        :collapsed="false"
        shortcut="meta_k"
      />

      <template #right>
        <div class="flex items-center gap-2">
          <!-- 语言切换 -->
          <UDropdownMenu :items="languageItems">
            <UButton
              icon="i-heroicons-language"
              variant="ghost"
              color="primary"
              :label="currentLocaleLabel"
            />
          </UDropdownMenu>

          <!-- 主题切换 -->
          <UColorModeButton />
        </div>
      </template>

      <template #body>
        <UNavigationMenu
          :items="items"
          class="px-4 sm:px-6"
        />
      </template>

      <template #bottom>
        <UNavigationMenu
          :items="items"
          content-orientation="vertical"
          collapsed
          class="px-4 sm:px-6 bg-muted backdrop-blur max-sm:hidden border-b border-muted"
        />
      </template>
    </UHeader>
  </div>
</template>
