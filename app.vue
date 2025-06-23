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
    to: "/getting-started",
  },
  {
    label: "Payments",
    icon: "i-lucide-box",
    to: "/payment",
  },
  {
    label: "Payout",
    icon: "i-lucide-chart-no-axes-gantt",
    to: "/payout",
  },
];

const { locale } = useI18n();
</script>

<template>
  <Html :lang="locale">
    <Body>
      <UApp
        :locale="locales[locale as keyof typeof locales]"
      >
        <ClientOnly>
          <LazyUContentSearch
            v-model:search-term="searchTerm"
            :files="files"
            shortcut="meta_k"
            :links="links"
            :fuse="{ resultLimit: 42 }"
          />
        </ClientOnly>
        <NuxtLayout>
          <NuxtRouteAnnouncer />
          <NuxtPage />
        </NuxtLayout>
      </UApp>
    </Body>
  </Html>
</template>
