<script setup lang="ts">
import type { LinkProps } from "@nuxt/ui";
import type { EnhancedProduct } from "~/components/business/ProductCard.vue";
import { ClientOnly } from "#components";
import { useI18n } from "vue-i18n";
import TerminalCarousel from "~/components/business/TerminalCarousel.vue";

const { t } = useI18n();

// SEO 头部信息
useSeoMeta({
  title: t("home.seo.title"),
});

const links = computed<LinkProps[]>(() => [
  {
    label: t("home.hero.getStarted"),
    to: "/get-started",
    color: "primary",
    size: "xl",
    icon: "i-lucide-square-play",
  },
  {
    label: t("home.hero.exploreProducts"),
    to: "#products",
    color: "neutral",
    variant: "link",
    size: "lg",
    trailingIcon: "lucide:chevron-right",
  },
]);

// 增强的产品数据 - 结合你现有的 paymentCards 结构
const additionalProducts = computed<EnhancedProduct[]>(
  () => {
    // 使用 paymentCards 中的 title 和 description，tags 支持国际化
    return [
      {
        id: "1",
        title: t("home.products.payments.items.0.title"),
        description: t(
          "home.products.payments.items.0.description"
        ),
        icon: "i-heroicons-globe-alt",
        to: "/web-platform",
        docsCount: 24,
        lastUpdated: "2024-06-15",
        tags: [
          t("tags.frontend"),
          t("tags.api"),
          t("tags.guides"),
        ],
        status: "updated",
      },
      {
        id: "2",
        title: t("home.products.payments.items.1.title"),
        description: t(
          "home.products.payments.items.1.description"
        ),
        icon: "i-heroicons-device-phone-mobile",
        to: "/mobile-sdk",
        docsCount: 18,
        lastUpdated: "2024-06-10",
        tags: [
          t("tags.mobile"),
          t("tags.sdk"),
          t("tags.ios"),
          t("tags.android"),
        ],
      },
      {
        id: "3",
        title: t("home.products.payments.items.2.title"),
        description: t(
          "home.products.payments.items.2.description"
        ),
        icon: "i-heroicons-cloud",
        to: "/cloud-services",
        docsCount: 32,
        lastUpdated: "2024-06-12",
        tags: [
          t("tags.cloud"),
          t("tags.infrastructure"),
          t("tags.deployment"),
        ],
        status: "new",
      },
      {
        id: "4",
        title: t("home.products.payments.items.3.title"),
        description: t(
          "home.products.payments.items.3.description"
        ),
        icon: "i-heroicons-chart-bar",
        to: "/data-analytics",
        docsCount: 15,
        lastUpdated: "2024-06-08",
        tags: [
          t("tags.analytics"),
          t("tags.reporting"),
          t("tags.insights"),
        ],
      },
      {
        id: "5",
        title: t("home.products.payments.items.4.title"),
        description: t(
          "home.products.payments.items.4.description"
        ),
        icon: "i-heroicons-shield-check",
        to: "/security-tools",
        docsCount: 21,
        lastUpdated: "2024-06-14",
        tags: [
          t("tags.security"),
          t("tags.authentication"),
          t("tags.encryption"),
        ],
        status: "beta",
      },
    ];
  }
);

// 直接定义features数据，使用i18n获取文本
const features = computed(() => {
  return [
    {
      title: t("home.features.items.0.title"),
      description: t("home.features.items.0.description"),
      icon: "i-heroicons-building-storefront",
      links: [
        {
          label: t("home.features.items.0.links.0.label"),
          to: "/payments",
          class:
            "text-primary font-medium hover:text-muted transition-colors duration-200 flex items-center gap-1",
          trailingIcon: "i-heroicons-arrow-right",
        },
        {
          label: t("home.features.items.0.links.1.label"),
          to: "https://sandbox-portal.onerway.com/",
          class:
            "text-primary font-medium hover:text-muted transition-colors duration-200 flex items-center gap-1",
          trailingIcon: "i-heroicons-arrow-right",
        },
        {
          label: t("home.features.items.0.links.2.label"),
          to: "https://docs.onerway.com/apis/zh/v0.6/settlement-file",
          class:
            "text-primary font-medium hover:text-muted transition-colors duration-200 flex items-center gap-1",
          trailingIcon: "i-heroicons-arrow-right",
        },
      ],
    },
    {
      title: t("home.features.items.1.title"),
      description: t("home.features.items.1.description"),
      icon: "i-heroicons-credit-card",
      links: [
        {
          label: t("home.features.items.1.links.0.label"),
          to: "https://postman.onerway.com/",
          class:
            "text-primary font-medium hover:text-muted transition-colors duration-200 flex items-center gap-1",
          trailingIcon: "i-heroicons-arrow-right",
        },
        {
          label: t("home.features.items.1.links.1.label"),
          to: "/payments",
          class:
            "text-primary font-medium hover:text-muted transition-colors duration-200 flex items-center gap-1",
          trailingIcon: "i-heroicons-arrow-right",
        },
      ],
    },
    {
      title: t("home.features.items.2.title"),
      description: t("home.features.items.2.description"),
      icon: "i-heroicons-code-bracket",
      links: [
        {
          label: t("home.features.items.2.links.0.label"),
          to: "/payments",
          class:
            "text-primary font-medium hover:text-muted transition-colors duration-200 flex items-center gap-1",
          trailingIcon: "i-heroicons-arrow-right",
        },
        {
          label: t("home.features.items.2.links.1.label"),
          to: "/payments",
          class:
            "text-primary font-medium hover:text-muted transition-colors duration-200 flex items-center gap-1",
          trailingIcon: "i-heroicons-arrow-right",
        },
        {
          label: t("home.features.items.2.links.2.label"),
          to: "/payments",
          class:
            "text-primary font-medium hover:text-muted transition-colors duration-200 flex items-center gap-1",
          trailingIcon: "i-heroicons-arrow-right",
        },
      ],
    },
  ];
});

const onProductClick = (product: EnhancedProduct) => {
  // 使用 Nuxt 的路由跳转
  navigateTo(product.to);
};
</script>

<template>
  <div>
    <UContainer>
      <img
        class="absolute top-0 left-0 w-full dark:hidden max-h-7/12"
        src="https://b.stripecdn.com/docs-statics-srv/assets/52d6e32f24e1d2872960ba1d0cb8aac5.webp"
        alt=""
      />

      <div
        class="absolute left-0 light:w-full light:h-7/12 max-sm:hidden dot-background"
      >
      </div>
      <!-- Hero Section -->
      <UContainer>
        <UPageHero
          :description="
            $t('home.documentation.description')
          "
          orientation="horizontal"
          :links="links"
          :ui="{
            container: 'py-8 sm:py-12 lg:py-16 ',
            title: 'text-3xl sm:text-4xl font-bold',
          }"
        >
          <template #title>
            {{ $t("home.documentation.title") }}
          </template>

          <!-- 最近浏览的页面和测试卡 -->
          <ClientOnly>
            <div class="relative sm:max-w-xs max-sm:hidden">
              <!-- 最近浏览组件 -->
              <div class="relative z-10">
                <RecentlyViewed
                  class="backdrop-blur-xs bg-white/10 dark:bg-gray-900/50 border border-white/20 dark:border-gray-700/30 shadow-2xl shadow-black/10 rounded-xl"
                />
              </div>

              <!-- 测试卡预览 - 桌面端重叠效果，移动端隐藏 -->
              <div
                class="hidden lg:block absolute z-0 pointer-events-none"
              >
                <TestCardPreview
                  class="transform -rotate-12 translate-x-1/2 -translate-y-2/5 hover:-rotate-6 hover:scale-105 transition-transform duration-500 ease-out pointer-events-auto"
                />
              </div>
            </div>
          </ClientOnly>
        </UPageHero>
      </UContainer>

      <!-- Features Section -->
      <UPageSection
        :ui="{
          container: 'py-8 sm:py-0 lg:py-0 my-8',
        }"
      >
        <template #features>
          <UPageFeature
            v-for="feature in features"
            :key="feature.title"
            :title="feature.title"
            :description="feature.description"
            :ui="{
              root: 'group relative overflow-hidden rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-102',
              title: 'text-xl font-bold mb-3',
              description: 'mb-6',
            }"
          >
            <template #leading>
              <div
                class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20"
              >
                <UIcon
                  :name="feature.icon"
                  class="h-6 w-6 text-primary"
                />
              </div>
            </template>
            <template #title>
              <h3 class="text-xl font-bold mb-3">
                {{ feature.title }}
              </h3>
            </template>
            <template #description>
              <div class="space-y-2">
                <UPageLinks
                  :links="feature.links"
                  class="text-primary"
                  :ui="{
                    item: 'group/link',
                    link: 'relative',
                  }"
                >
                  <template #link-trailing="{ link }">
                    <UIcon
                      :name="link.trailingIcon"
                      class="size-4 text-muted opacity-0 group-hover/link:opacity-100 transition-opacity duration-200"
                    />
                  </template>
                </UPageLinks>
              </div>
            </template>
          </UPageFeature>
        </template>
      </UPageSection>

      <!-- Try It Out Section -->
      <UContainer>
        <ProseH2 id="try-it-out">
          {{ $t("home.tryItOut.title") }}
        </ProseH2>
        <TerminalCarousel class="max-lg:hidden" />
      </UContainer>

      <!-- Products section -->
      <UContainer>
        <div class="mb-16">
          <ProseH2 id="products">
            {{ $t("home.products.browse.title") }}
          </ProseH2>

          <ProseH3
            id="payments"
            class="text-muted"
          >
            {{ $t("home.products.payments.title") }}
          </ProseH3>

          <UPageGrid class="mb-12">
            <ProductCard
              v-for="(product, index) in additionalProducts"
              :key="index"
              :product="product"
              :clickable="true"
              class="group hover:scale-[1.02] hover:bg-default transition-transform duration-300"
              @click="onProductClick"
            />
          </UPageGrid>
        </div>

        <ProseH3
          id="payout"
          class="text-muted"
        >
          {{ $t("home.products.payout.title") }}
          <UBadge
            class="font-bold rounded-lg ml-2 -translate-y-1"
            trailing-icon="i-heroicons-clock"
            >{{ $t("home.products.payout.comingSoon") }}
          </UBadge>
        </ProseH3>
      </UContainer>

      <!-- CTA Section -->
      <UPageSection>
        <UPageCTA
          :title="$t('home.cta.title')"
          :description="$t('home.cta.description')"
          :links="[
            {
              label: $t('home.cta.start'),
              to: '/get_started',
              size: 'lg',
            },
          ]"
        />
      </UPageSection>
    </UContainer>
  </div>
</template>

<style scoped>
.dot-background {
  background-image: radial-gradient(
    rgba(0, 0, 0, 0) 1.5px,
    #fff 1px
  );
  background-size: 14px 14px;
}

.dark .dot-background {
  animation: pulse 2.5s infinite;
  background-image: radial-gradient(
    circle,
    rgba(238, 9, 223, 0.1) 20%,
    rgba(238, 9, 223, 0.06) 60%
  );
  background-size: contain;
}
</style>
