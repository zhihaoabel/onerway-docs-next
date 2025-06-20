<script setup lang="ts">
interface CarouselItem {
  label: string;
  command: string;
  content: string;
  slotKey?: string;
  footer?: {
    primaryAction?: {
      label: string;
      icon?: string;
      to?: string;
      color?:
        | "primary"
        | "neutral"
        | "secondary"
        | "success"
        | "info"
        | "warning"
        | "error";
      action?: () => void;
    };
    secondaryActions?: Array<{
      label: string;
      icon?: string;
      to?: string;
      trailingIcon?: string;
      color?:
        | "primary"
        | "neutral"
        | "secondary"
        | "success"
        | "info"
        | "warning"
        | "error";
      action?: () => void;
    }>;
  };
}

interface Props {
  items?: CarouselItem[];
  autoplayDuration?: number;
  pauseOnManualStop?: number;
}

const props = withDefaults(defineProps<Props>(), {
  autoplayDuration: 3000,
  pauseOnManualStop: 5000,
});

const { t } = useI18n();

// 默认轮播项目数据
const defaultItems = computed<CarouselItem[]>(() => {
  return [
    {
      label: t("home.tryItOut.carousel.startPayment"),
      command: "onerway payment_intents create",
      content: `{
    "billingInformation": {
        "address": "60557 Monroe Street",
        "city": "Port Lafayette",
        "country": "US",
        "email": "Furman_Lemke@gmail.com",
        "firstName": "Oma",
        "identityNumber": 60863524016,
        "lastName": "Lind",
        "phone": 15954017127,
        "postalCode": 66246,
        "province": "CO"
    },
    "merchantCustId": "CustId-5JK7-02L2",
    "merchantNo": 800209,
    "merchantTxnId": "66286265-0489-4825-adc8-9e7f1c53c62e",
    "merchantTxnTime": "2025-06-19 20:46:47",
    "orderAmount": 4,
    "orderCurrency": "USD",
    "productType": "CARD",
    "shippingInformation": {
        "address": "91362 Mikel Valley",
        "city": "Fort Rigobertofort",
        "country": "US",
        "email": "Braden74@gmail.com",
        "firstName": "Lamont",
        "identityNumber": 31372062919,
        "lastName": "Ryan",
        "phone": 13144165794,
        "postalCode": 98925,
        "province": "CO"
    },
    "sign": null,
    "subProductType": "DIRECT",
    "txnOrderMsg": {
        "accept": "*/*",
        "appId": 1727880846378401800,
        "colorDepth": 16,
        "contentLength": 0,
        "javaEnabled": false,
        "language": "en-US",
        "products": {
            "0": {
                "currency": "USD",
                "name": "butternut pumpkin",
                "num": 34,
                "price": 601.35,
                "type": "id eu esse officia nisi"
            }
        },
        "returnUrl": "https://docs.onerway.com/",
        "notifyUrl": "https://docs.onerway.com/apis",
        "screenHeight": 1440,
        "screenWidth": 2560,
        "timeZoneOffset": 660,
        "transactionIp": "169.116.91.126",
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
    },
    "txnType": "SALE"
}`,
      slotKey: "payment",
      footer: {
        primaryAction: {
          label: t("home.tryItOut.carousel.tryItOut"),
          icon: "i-heroicons-play",
          to: "https://postman.onerway.com/",
          color: "primary",
        },
        secondaryActions: [
          {
            label: t(
              "home.tryItOut.carousel.learnMorePayment"
            ),
            trailingIcon: "lucide:chevron-right",
            color: "info",
            to: "/",
          },
        ],
      },
    },
    {
      label: t("home.tryItOut.carousel.storingPayment"),
      command: "stripe products create",
      content: `{
  "appId": "...",
  "cardInfo": {
      "holderName": "Test User",
      "cardNumber": "4242424242424242",
      "month": "05",
      "year": "26",
      "cvv": "123"
  },
  "country": "US",
  "email": "...",
  "merchantCustId": "...",
  "merchantNo": "...",
  "sign": "...",
  "transactionIp": "..."
}`,
      slotKey: "product",
      footer: {
        primaryAction: {
          label: t("home.tryItOut.carousel.tryItOut"),
          icon: "i-heroicons-play",
          color: "primary",
          to: "https://postman.onerway.com/",
        },
        secondaryActions: [
          {
            label: t(
              "home.tryItOut.carousel.learnMoreSaving"
            ),
            trailingIcon: "lucide:chevron-right",
            color: "info",
            to: "/",
          },
        ],
      },
    },
    {
      label: t("home.tryItOut.carousel.subscriptions"),
      command: "stripe coupons create",
      content: `{
      ...
    "subscription": {
        "requestType": "0",
        "selfExecute": "1",
        "productName": "Rustic Frozen Pants",
        "frequencyType": "D",
        "bindCard": true,
        "merchantCustId": "CustId-M1SW-04UL",
        "frequencyPoint": "1",
        "notificationEmail": "Darron_Lehner@hotmail.com",
        "metaData": "ea amet id aliqua",
        "expireDate": "2025-12-23"
    },
    ...
}`,
      slotKey: "coupon",
      footer: {
        primaryAction: {
          label: t("home.tryItOut.carousel.tryItOut"),
          icon: "i-heroicons-play",
          color: "primary",
          to: "https://postman.onerway.com/",
        },
        secondaryActions: [
          {
            label: t(
              "home.tryItOut.carousel.learnMoreSubscriptions"
            ),
            trailingIcon: "lucide:chevron-right",
            color: "info",
            to: "/",
          },
        ],
      },
    },
    {
      label: t("home.tryItOut.carousel.reconciliation"),
      command: "stripe balance retrieve",
      content: ``,
      slotKey: "balance",
      footer: {
        primaryAction: {
          label: t("home.tryItOut.carousel.tryItOut"),
          icon: "i-heroicons-play",
          color: "primary",
          to: "https://postman.onerway.com/",
        },
        secondaryActions: [
          {
            label: t(
              "home.tryItOut.carousel.learnMoreReconciliation"
            ),
            trailingIcon: "lucide:chevron-right",
            color: "info",
            to: "/",
          },
        ],
      },
    },
  ];
});

// 计算属性 - 使用传入的 items 或默认 items
const carouselItems = computed(
  () => props.items || defaultItems.value
);

// 响应式状态
const currentActiveIndex = ref(0);
const isAutoPlaying = ref(true);
const autoPlayInterval = ref<NodeJS.Timeout | null>(null);
const isHovering = ref(false);
const userManuallyStopped = ref(false);

// 计算属性
const currentItem = computed(
  () => carouselItems.value[currentActiveIndex.value]
);

// 复制内容到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(
      currentItem.value.content
    );
    // 可以添加 toast 提示
  } catch (err) {
    console.error("复制失败:", err);
  }
};

// 自动轮播逻辑
const startAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value);
  }

  autoPlayInterval.value = setInterval(() => {
    if (isAutoPlaying.value && !isHovering.value) {
      currentActiveIndex.value =
        (currentActiveIndex.value + 1) %
        carouselItems.value.length;
    }
  }, props.autoplayDuration);
};

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value);
    autoPlayInterval.value = null;
  }
};

const toggleAutoPlay = () => {
  if (isAutoPlaying.value) {
    isAutoPlaying.value = false;
    userManuallyStopped.value = true;
    stopAutoPlay();
  } else {
    isAutoPlaying.value = true;
    userManuallyStopped.value = false;
    startAutoPlay();
  }
};

const setActiveContent = (index: number) => {
  currentActiveIndex.value = index;

  // 用户手动点击后暂停自动轮播一段时间
  if (isAutoPlaying.value) {
    stopAutoPlay();
    setTimeout(() => {
      if (
        isAutoPlaying.value &&
        !userManuallyStopped.value
      ) {
        startAutoPlay();
      }
    }, props.pauseOnManualStop);
  }
};

// 鼠标悬停处理
const handleMouseEnter = () => {
  isHovering.value = true;
};

const handleMouseLeave = () => {
  isHovering.value = false;
  // 只有在用户没有手动暂停时才恢复轮播
  if (isAutoPlaying.value && !userManuallyStopped.value) {
    startAutoPlay();
  }
};

// 生命周期
onMounted(() => {
  if (isAutoPlaying.value) {
    startAutoPlay();
  }
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<template>
  <div
    class="flex flex-col lg:flex-row gap-9 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg transition-colors duration-200 h-[500px] lg:h-[400px]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 左侧导航菜单 -->
    <div
      class="flex-1/3 lg:w-64 flex-shrink-0 rounded-2xl bg-muted sm:px-4"
    >
      <div
        class="flex flex-col justify-around h-full gap-2"
      >
        <div
          v-for="(item, index) in carouselItems"
          :key="index"
          class="relative group"
        >
          <UButton
            :variant="
              currentActiveIndex === index
                ? 'soft'
                : 'ghost'
            "
            :color="
              currentActiveIndex === index
                ? 'primary'
                : 'neutral'
            "
            class="w-full justify-start text-left transition-all duration-200 cursor-pointer"
            :class="{
              'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm':
                currentActiveIndex === index,
              'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50':
                currentActiveIndex !== index,
            }"
            @click="setActiveContent(index)"
          >
            {{ item.label }}
          </UButton>

          <!-- 播放/暂停按钮 - 只在当前激活项且悬停时显示 -->
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0 scale-90"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-90"
          >
            <UButton
              v-if="
                currentActiveIndex === index &&
                (isHovering || !isAutoPlaying)
              "
              :icon="
                isAutoPlaying
                  ? 'i-heroicons-pause'
                  : 'i-heroicons-play'
              "
              size="xs"
              color="primary"
              variant="soft"
              class="absolute right-2 top-1/2 -translate-y-1/2"
              :title="
                isAutoPlaying
                  ? t('home.tryItOut.pause', 'Pause')
                  : t('home.tryItOut.play', 'Play')
              "
              @click.stop="toggleAutoPlay"
            />
          </Transition>
        </div>
      </div>
    </div>

    <!-- 右侧代码展示区域 -->
    <div class="flex-2/3 min-w-0 flex flex-col h-full">
      <div
        class="bg-gray-900 border border-gray-700 dark:border-gray-600 shadow-xl rounded-lg h-full flex flex-col overflow-hidden"
      >
        <!-- 代码块头部 -->
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800/50 flex-shrink-0"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="text-green-400 font-mono text-sm flex-shrink-0"
              >$</span
            >
            <span
              class="text-white font-mono text-sm truncate"
              >{{ currentItem.command }}</span
            >
          </div>
          <UButton
            icon="i-heroicons-clipboard-document"
            size="xs"
            color="neutral"
            variant="ghost"
            class="text-gray-400 hover:text-gray-600 flex-shrink-0"
            :title="
              t(
                'home.tryItOut.copyToClipboard',
                'Copy to clipboard'
              )
            "
            @click="copyToClipboard"
          />
        </div>

        <!-- 代码内容 -->
        <div
          class="flex-1 min-h-0 overflow-hidden bg-gray-900"
        >
          <div
            class="h-full p-4 font-mono text-sm text-gray-200 overflow-y-auto overflow-x-auto scrollbar-custom"
          >
            <pre
              v-if="currentItem.content"
              class="whitespace-pre-wrap break-words min-h-0"
              >{{ currentItem.content }}</pre
            >
            <template v-else>
              <UPageSection
                :description="t('home.tryItOut.noContent')"
                class="h-full"
              />
            </template>
          </div>
        </div>

        <!-- 底部提示 - 支持插槽自定义和字段配置 -->
        <div
          class="px-4 py-3 border-t border-gray-700 bg-gray-800/30 flex-shrink-0"
        >
          <!-- 检查是否有特定项目的自定义插槽 -->
          <template
            v-if="
              currentItem.slotKey &&
              $slots[`footer-${currentItem.slotKey}`]
            "
          >
            <slot
              :name="`footer-${currentItem.slotKey}`"
              :item="currentItem"
              :index="currentActiveIndex"
            />
          </template>

          <!-- 检查是否有通用底部插槽 -->
          <template v-else-if="$slots.footer">
            <slot
              name="footer"
              :item="currentItem"
              :index="currentActiveIndex"
            />
          </template>

          <!-- 使用字段配置的内容 -->
          <template v-else-if="currentItem.footer">
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <!-- 主要操作按钮 -->
              <UButton
                v-if="currentItem.footer.primaryAction"
                :color="
                  currentItem.footer.primaryAction.color
                "
                variant="solid"
                size="sm"
                :icon="
                  currentItem.footer.primaryAction.icon
                "
                class="text-sm"
                :to="currentItem.footer.primaryAction.to"
                @click="
                  currentItem.footer.primaryAction.action?.()
                "
              >
                {{ currentItem.footer.primaryAction.label }}
              </UButton>

              <!-- 次要操作按钮 -->
              <div
                v-if="
                  currentItem.footer.secondaryActions
                    ?.length
                "
                class="flex flex-wrap gap-2"
              >
                <UButton
                  v-for="(action, index) in currentItem
                    .footer.secondaryActions"
                  :key="index"
                  :color="action.color || 'neutral'"
                  variant="ghost"
                  size="sm"
                  :trailing-icon="action.trailingIcon"
                  class="text-sm"
                  :to="action.to"
                  @click="action.action?.()"
                >
                  {{ action.label }}
                </UButton>
              </div>
            </div>
          </template>

          <!-- 回退到硬编码默认内容 -->
          <template v-else>
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <UBadge
                color="primary"
                variant="soft"
                class="text-xs flex items-center gap-1"
              >
                <UIcon
                  name="i-heroicons-information-circle"
                  class="w-3 h-3"
                />
                {{
                  t(
                    "home.tryItOut.signInToEdit",
                    "Sign in to edit real requests"
                  )
                }}
              </UBadge>

              <UButton
                color="primary"
                variant="ghost"
                size="xs"
                trailing-icon="i-heroicons-arrow-top-right-on-square"
                class="text-xs"
              >
                {{
                  t("home.tryItOut.learnMore", "Learn more")
                }}
              </UButton>
            </div>
          </template>
        </div>
      </div>

      <!-- 轮播指示器 - 仅在桌面端显示 -->
      <div class="mt-2 sm:mt-4 flex-shrink-0 self-center">
        <div class="hidden lg:flex items-center gap-2">
          <div class="flex gap-2">
            <div
              v-for="(_, index) in carouselItems"
              :key="index"
              class="size-2.5 rounded-full transition-all duration-300 cursor-pointer hover:bg-primary/75"
              :class="
                currentActiveIndex === index
                  ? 'bg-primary-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              "
              @click="setActiveContent(index)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端轮播指示器 -->
    <div
      class="flex lg:hidden items-center justify-center gap-2 mt-4"
    >
      <div class="flex gap-2">
        <div
          v-for="(_, index) in carouselItems"
          :key="index"
          class="size-2 rounded-full transition-all duration-300 cursor-pointer"
          :class="
            currentActiveIndex === index
              ? 'bg-primary-500'
              : 'bg-gray-300 dark:bg-gray-600'
          "
          @click="setActiveContent(index)"
        />
      </div>
      <UButton
        :icon="
          isAutoPlaying
            ? 'i-heroicons-pause'
            : 'i-heroicons-play'
        "
        size="xs"
        color="primary"
        variant="soft"
        class="ml-3"
        :title="
          isAutoPlaying
            ? t('home.tryItOut.pause', 'Pause')
            : t('home.tryItOut.play', 'Play')
        "
        @click="toggleAutoPlay"
      />
    </div>
  </div>
</template>

<style scoped></style>
