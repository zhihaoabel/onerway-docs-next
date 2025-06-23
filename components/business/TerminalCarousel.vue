<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), {
  autoplayDuration: 4000,
  pauseOnManualStop: 6000,
  showPlayButton: true,
  showCopyButton: true,
  height: "auto",
  variant: "default",
});

const { t } = useI18n();

interface CarouselItem {
  label: string;
  command: string;
  content: string;
  contentFull?: string; // 完整内容，用于展开显示
  slotKey?: string;
  category?:
    | "payment"
    | "subscription"
    | "reconciliation"
    | "product"
    | "tokenization";
  icon?: string;
  description?: string;
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
  showPlayButton?: boolean;
  showCopyButton?: boolean;
  height?: string;
  variant?: "default" | "compact" | "detailed";
}

// Simple JSON syntax highlighting
const highlightJson = (jsonString: string): string => {
  if (!jsonString) return "";

  return (
    jsonString
      // Highlight strings
      .replace(
        /"([^"\\]*(\\.[^"\\]*)*)"/g,
        '<span class="json-string">"$1"</span>'
      )
      // Highlight property keys
      .replace(
        /(<span class="json-string">"[^"]*"<\/span>)(\s*):/g,
        '<span class="json-key">$1</span>$2:'
      )
      // Highlight numbers
      .replace(
        /:\s*(-?\d+\.?\d*)/g,
        ': <span class="json-number">$1</span>'
      )
      // Highlight booleans
      .replace(
        /:\s*(true|false)/g,
        ': <span class="json-boolean">$1</span>'
      )
      // Highlight null
      .replace(
        /:\s*(null)/g,
        ': <span class="json-null">$1</span>'
      )
      // Preserve original string highlighting for non-key strings
      .replace(
        /<span class="json-key">(<span class="json-string">"[^"]*"<\/span>)<\/span>/g,
        "$1"
      )
  );
};

// Toast notification for copy feedback
const toast = useToast?.() || {
  add: (notification: any) =>
    console.log("Toast:", notification),
};

// Category icons mapping
const categoryIcons = {
  payment: "i-heroicons-credit-card",
  subscription: "i-heroicons-arrow-path",
  reconciliation: "i-heroicons-scale",
  product: "i-heroicons-cube",
  tokenization: "i-heroicons-key",
  default: "i-heroicons-code-bracket",
};

// 默认轮播项目数据 - 完全国际化
const defaultItems = computed<CarouselItem[]>(() => [
  {
    label: t("home.tryItOut.carousel.startPayment"),
    command: "onerway payment_intents create",
    category: "payment",
    icon: "i-heroicons-credit-card",
    description: t("home.tryItOut.carousel.startPayment"),
    content: `{
    "merchantNo": 800209,
    "merchantTxnId": "66286265-0489-4825-adc8-9e7f1c53c62e",
    "orderAmount": 4,
    "orderCurrency": "USD",
    "productType": "CARD",
    "txnType": "SALE",
    "billingInformation": {
        "firstName": "Oma",
        "lastName": "Lind",
        "email": "Furman_Lemke@gmail.com"
        // ... 更多字段
    }
    // ... 更多数据
}`,
    contentFull: `{
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
        label: t("home.tryItOut.title"),
        icon: "i-heroicons-play",
        to: "https://postman.onerway.com/",
        color: "primary",
      },
      secondaryActions: [
        {
          label: t("home.tryItOut.learnMore"),
          trailingIcon:
            "i-heroicons-arrow-top-right-on-square",
          color: "neutral",
          to: "/payments",
        },
      ],
    },
  },
  {
    label: t("home.tryItOut.carousel.storingPayment"),
    command: "onerway tokenization create",
    category: "tokenization",
    icon: "i-heroicons-arrow-path",
    description: t("home.tryItOut.carousel.storingPayment"),
    content: `{
    "appId": "...",
    "cardInfo": {
        "holderName": "Test User",
        "cardNumber": "4242424242424242",
        "month": "05",
        "year": "26",
        "cvv": "123"
    }
}`,
    contentFull: `{
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
    slotKey: "tokenization",
    footer: {
      primaryAction: {
        label: t("home.tryItOut.title"),
        icon: "i-heroicons-play",
        color: "primary",
        to: "https://postman.onerway.com/",
      },
      secondaryActions: [
        {
          label: t("home.tryItOut.learnMore"),
          trailingIcon:
            "i-heroicons-arrow-top-right-on-square",
          color: "neutral",
          to: "/tokenization",
        },
      ],
    },
  },
  {
    label: t("home.tryItOut.carousel.subscriptions"),
    command: "onerway subscriptions create",
    category: "subscription",
    icon: "i-heroicons-arrow-path",
    description: t("home.tryItOut.carousel.subscriptions"),
    content: `{
    "subscription": {
        "productName": "Rustic Frozen Pants",
        "frequencyType": "D",
        "bindCard": true,
        "merchantCustId": "CustId-M1SW-04UL",
        "expireDate": "2025-12-23"
        // ... 更多配置
    }
    // ... 其他字段
}`,
    contentFull: `{
    "billingInformation": {
        "address": "60557 Monroe Street",
        "city": "Port Lafayette",
        "country": "US",
        "email": "Furman_Lemke@gmail.com",
        "firstName": "Oma",
        "lastName": "Lind"
    },
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
    "merchantNo": 800209,
    "orderAmount": 4,
    "orderCurrency": "USD"
}`,
    slotKey: "subscription",
    footer: {
      primaryAction: {
        label: t("home.tryItOut.title"),
        icon: "i-heroicons-play",
        color: "primary",
        to: "https://postman.onerway.com/",
      },
      secondaryActions: [
        {
          label: t("home.tryItOut.learnMore"),
          trailingIcon:
            "i-heroicons-arrow-top-right-on-square",
          color: "neutral",
          to: "/subscriptions",
        },
      ],
    },
  },
  {
    label: t("home.tryItOut.carousel.reconciliation"),
    command: "onerway transactions list",
    category: "reconciliation",
    icon: "i-heroicons-scale",
    description: t("home.tryItOut.carousel.reconciliation"),
    content: `{
    "page": 1,
    "limit": 10,
    "filters": {
        "status": "completed",
        "dateRange": "2025-01-01 to 2025-01-31"
    }
    // ... 查询参数
}`,
    contentFull: `{
    "page": 1,
    "limit": 10,
    "filters": {
        "status": "completed",
        "dateRange": "2025-01-01 to 2025-01-31",
        "merchantNo": 800209,
        "transactionType": ["SALE", "REFUND"],
        "amountRange": {
            "min": 1,
            "max": 10000
        }
    },
    "sort": {
        "field": "merchantTxnTime",
        "order": "desc"
    },
    "include": ["billingInfo", "shippingInfo", "products"]
}`,
    slotKey: "reconciliation",
    footer: {
      primaryAction: {
        label: t("home.tryItOut.title"),
        icon: "i-heroicons-play",
        color: "primary",
        to: "https://postman.onerway.com/",
      },
      secondaryActions: [
        {
          label: t("home.tryItOut.learnMore"),
          trailingIcon:
            "i-heroicons-arrow-top-right-on-square",
          color: "neutral",
          to: "/reconciliation",
        },
      ],
    },
  },
]);

// Reactive state
const currentActiveIndex = ref(0);
const isAutoPlaying = ref(true);
const autoPlayInterval = ref<NodeJS.Timeout | null>(null);
const isHovering = ref(false);
const userManuallyStopped = ref(false);
const copySuccess = ref(false);
const isContentExpanded = ref(false); // 控制内容展开状态

// Computed properties
const carouselItems = computed(
  () => props.items || defaultItems.value
);
const currentItem = computed(
  () => carouselItems.value[currentActiveIndex.value]
);

// 当前显示的内容（根据展开状态决定）
const currentDisplayContent = computed(() => {
  const item = currentItem.value;
  if (!item) return "";

  if (isContentExpanded.value && item.contentFull) {
    return item.contentFull;
  }
  return item.content;
});

// 是否有完整内容可以展开
const hasExpandableContent = computed(() => {
  return (
    currentItem.value?.contentFull &&
    currentItem.value.contentFull !==
      currentItem.value.content
  );
});

// Theme-aware classes
const themeClasses = computed(() => ({
  container: [
    "group relative overflow-hidden rounded-xl transition-all duration-300",
    "bg-gradient-to-br from-white via-white to-gray-50/50",
    "dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/50",
    "border border-gray-200/60 dark:border-gray-700/60",
    "shadow-lg dark:shadow-2xl",
    "hover:shadow-xl dark:hover:shadow-2xl",
    "hover:border-gray-300/80 dark:hover:border-gray-600/80",
  ],
  navigationPanel: [
    "relative overflow-hidden rounded-lg",
    "bg-gradient-to-b from-gray-50/80 to-gray-100/60",
    "dark:from-gray-800/60 dark:to-gray-900/80",
    "border border-gray-200/40 dark:border-gray-700/40",
    "backdrop-blur-sm",
  ],
  navigationItem: (isActive: boolean) => [
    "group/item relative w-full transition-all duration-200",
    "rounded-lg border border-transparent",
    isActive
      ? [
          "bg-gradient-to-r from-primary-500/10 to-primary-600/5",
          "dark:from-primary-400/15 dark:to-primary-500/10",
          "border-primary-200/60 dark:border-primary-700/60",
          "shadow-sm text-primary-700 dark:text-primary-300",
        ]
      : [
          "hover:bg-white/80 dark:hover:bg-gray-800/60",
          "hover:border-gray-200/60 dark:hover:border-gray-600/60",
          "hover:shadow-sm text-gray-600 dark:text-gray-400",
          "hover:text-gray-900 dark:hover:text-gray-200",
        ],
  ],
  codePanel: [
    "relative overflow-hidden rounded-lg",
    "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800",
    "border border-gray-700/60 dark:border-gray-600/60",
    "shadow-xl dark:shadow-2xl",
  ],
  codeHeader: [
    "flex items-center justify-between px-4 py-3",
    "bg-gradient-to-r from-gray-800/90 to-gray-700/90",
    "border-b border-gray-600/50",
    "backdrop-blur-sm",
  ],
}));

// Enhanced copy to clipboard with feedback
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(
      currentDisplayContent.value
    );
    copySuccess.value = true;

    toast.add({
      title: t(
        "home.tryItOut.carousel.feedback.copySuccess"
      ),
      description: t(
        "home.tryItOut.carousel.feedback.copySuccessDesc"
      ),
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error("Copy failed:", err);
    toast.add({
      title: t("home.tryItOut.carousel.feedback.copyError"),
      description: t(
        "home.tryItOut.carousel.feedback.copyErrorDesc"
      ),
      icon: "i-heroicons-exclamation-triangle",
      color: "error",
    });
  }
};

// 切换内容展开状态
const toggleContentExpansion = () => {
  isContentExpanded.value = !isContentExpanded.value;
};

// Auto-play logic with better control
const startAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value);
  }

  autoPlayInterval.value = setInterval(() => {
    if (
      isAutoPlaying.value &&
      !isHovering.value &&
      !userManuallyStopped.value
    ) {
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
  // 切换内容时重置展开状态
  isContentExpanded.value = false;

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

// Mouse interaction handlers
const handleMouseEnter = () => {
  isHovering.value = true;
};

const handleMouseLeave = () => {
  isHovering.value = false;
  if (isAutoPlaying.value && !userManuallyStopped.value) {
    startAutoPlay();
  }
};

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      setActiveContent(
        Math.max(0, currentActiveIndex.value - 1)
      );
      break;
    case "ArrowRight":
      event.preventDefault();
      setActiveContent(
        Math.min(
          carouselItems.value.length - 1,
          currentActiveIndex.value + 1
        )
      );
      break;
    case "Space":
      event.preventDefault();
      toggleAutoPlay();
      break;
  }
};

// Lifecycle
onMounted(() => {
  if (isAutoPlaying.value) {
    startAutoPlay();
  }
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  stopAutoPlay();
  document.removeEventListener("keydown", handleKeydown);
});

// Watch for color mode changes
watch(
  () => useColorMode().preference,
  () => {
    // Force re-render for theme updates
    nextTick();
  }
);
</script>

<template>
  <div
    class="flex flex-col lg:flex-row gap-6 p-6"
    :class="[
      themeClasses.container,
      props.height !== 'auto'
        ? `h-[${props.height}]`
        : 'h-[600px] lg:h-[500px]',
    ]"
    role="region"
    :aria-label="t('home.tryItOut.carousel.ariaLabel')"
    tabindex="0"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Enhanced Left Navigation Panel -->
    <div
      class="flex-none w-full lg:w-80 xl:w-96 p-4"
      :class="[themeClasses.navigationPanel]"
    >
      <!-- Panel Header -->
      <div
        class="mb-4 pb-3 border-b border-gray-200/60 dark:border-gray-700/60"
      >
        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white"
        >
          {{ t("home.tryItOut.carousel.navigation.title") }}
        </h3>
        <p
          class="text-sm text-gray-600 dark:text-gray-400 mt-1"
        >
          {{
            t("home.tryItOut.carousel.navigation.subtitle")
          }}
        </p>
      </div>

      <!-- Navigation Items -->
      <div class="space-y-2">
        <div
          v-for="(item, index) in carouselItems"
          :key="index"
          class="relative group/container"
        >
          <button
            :class="
              themeClasses.navigationItem(
                currentActiveIndex === index
              )
            "
            :aria-pressed="currentActiveIndex === index"
            :aria-label="`${t('home.tryItOut.carousel.navigation.selectItem')} ${item.label}`"
            @click="setActiveContent(index)"
          >
            <div class="flex items-start gap-3 p-3">
              <!-- Category Icon -->
              <div class="flex-shrink-0 mt-0.5">
                <UIcon
                  :name="
                    item.icon ||
                    categoryIcons[
                      item.category || 'default'
                    ]
                  "
                  class="w-5 h-5 transition-all duration-200"
                  :class="[
                    currentActiveIndex === index
                      ? 'text-primary-600 dark:text-primary-400 group-hover/item:scale-110'
                      : 'text-gray-500 dark:text-gray-400 group-hover/item:text-primary-500 group-hover/item:scale-105',
                  ]"
                />
              </div>

              <!-- Content -->
              <div class="flex-1 text-left">
                <div class="font-medium text-sm leading-5">
                  {{ item.label }}
                </div>
                <div
                  v-if="
                    item.description &&
                    variant === 'detailed'
                  "
                  class="text-xs mt-1 opacity-75 line-clamp-2"
                >
                  {{ item.description }}
                </div>
              </div>

              <!-- Active Indicator -->
              <div
                v-if="currentActiveIndex === index"
                class="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 animate-pulse"
              />
            </div>
          </button>

          <!-- Play/Pause Button - Enhanced positioning -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 scale-90 translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-90 translate-y-1"
          >
            <UButton
              v-if="
                props.showPlayButton &&
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
              class="absolute right-2 top-1/2 -translate-y-1/2 shadow-lg"
              :title="
                isAutoPlaying
                  ? t(
                      'home.tryItOut.carousel.controls.pause'
                    )
                  : t(
                      'home.tryItOut.carousel.controls.play'
                    )
              "
              @click.stop="toggleAutoPlay"
            />
          </Transition>
        </div>
      </div>

      <!-- Auto-play Status -->
      <div
        class="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60"
      >
        <div
          class="flex items-center justify-between text-xs"
        >
          <span class="text-gray-600 dark:text-gray-400">
            {{
              t("home.tryItOut.carousel.status.autoPlay")
            }}
          </span>
          <div class="flex items-center gap-2">
            <div
              class="w-2 h-2 rounded-full transition-colors duration-200"
              :class="[
                isAutoPlaying
                  ? 'bg-green-500 animate-pulse'
                  : 'bg-gray-400',
              ]"
            />
            <span
              :class="
                isAutoPlaying
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500'
              "
            >
              {{
                isAutoPlaying
                  ? t(
                      "home.tryItOut.carousel.status.active"
                    )
                  : t(
                      "home.tryItOut.carousel.status.paused"
                    )
              }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Right Code Panel -->
    <div class="flex-1 min-w-0 flex flex-col h-full">
      <div
        class="h-full flex flex-col"
        :class="[themeClasses.codePanel]"
      >
        <!-- Code Header - Enhanced -->
        <div :class="themeClasses.codeHeader">
          <div
            class="flex items-center gap-3 min-w-0 flex-1"
          >
            <!-- Terminal Indicator -->
            <div class="flex items-center gap-1.5">
              <div
                class="w-3 h-3 rounded-full bg-red-500"
              ></div>
              <div
                class="w-3 h-3 rounded-full bg-yellow-500"
              ></div>
              <div
                class="w-3 h-3 rounded-full bg-green-500"
              ></div>
            </div>

            <!-- Command -->
            <div
              class="flex items-center gap-2 min-w-0 flex-1"
            >
              <span
                class="text-green-400 font-mono text-sm flex-shrink-0"
                >$</span
              >
              <span
                class="text-white font-mono text-sm truncate"
                >{{ currentItem.command }}</span
              >
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-2">
            <!-- Expand/Collapse Button -->
            <UButton
              v-if="hasExpandableContent"
              :icon="
                isContentExpanded
                  ? 'i-heroicons-chevron-up'
                  : 'i-heroicons-chevron-down'
              "
              size="xs"
              color="neutral"
              variant="ghost"
              class="text-gray-400 hover:text-highlighted transition-all duration-200"
              :title="
                isContentExpanded
                  ? t(
                      'home.tryItOut.carousel.actions.collapse'
                    )
                  : t(
                      'home.tryItOut.carousel.actions.expand'
                    )
              "
              @click="toggleContentExpansion"
            />

            <!-- Copy Button -->
            <UButton
              v-if="props.showCopyButton"
              :icon="
                copySuccess
                  ? 'i-heroicons-check'
                  : 'i-heroicons-clipboard-document'
              "
              size="xs"
              :color="copySuccess ? 'success' : 'neutral'"
              variant="ghost"
              class="transition-all duration-200"
              :class="[
                copySuccess
                  ? 'text-green-400'
                  : 'text-gray-400 hover:text-highlighted',
              ]"
              :title="
                t('home.tryItOut.carousel.actions.copy')
              "
              @click="copyToClipboard"
            />
          </div>
        </div>

        <!-- Code Content with syntax highlighting simulation -->
        <div class="flex-1 min-h-0 relative">
          <div
            class="h-full p-4 font-mono text-sm overflow-auto"
            style="
              scrollbar-width: thin;
              scrollbar-color: #4b5563 #1f2937;
            "
          >
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-300 ease-in"
              enter-from-class="opacity-0 transform scale-95"
              enter-to-class="opacity-100 transform scale-100"
              leave-from-class="opacity-100 transform scale-100"
              leave-to-class="opacity-0 transform scale-95"
              mode="out-in"
            >
              <pre
                v-if="currentDisplayContent"
                :key="`${currentActiveIndex}-${isContentExpanded}`"
                class="text-gray-200 whitespace-pre-wrap break-words leading-relaxed"
                v-html="
                  highlightJson(currentDisplayContent)
                "
              />
              <div
                v-else
                class="h-full flex items-center justify-center text-gray-500"
              >
                <div class="text-center">
                  <UIcon
                    name="i-heroicons-code-bracket"
                    class="w-8 h-8 mx-auto mb-2 opacity-50"
                  />
                  <p>{{
                    t(
                      "home.tryItOut.carousel.content.noContent"
                    )
                  }}</p>
                </div>
              </div>
            </Transition>
          </div>

          <!-- 展开状态指示器 -->
          <div
            v-if="hasExpandableContent"
            class="absolute bottom-4 right-4"
          >
            <UBadge
              :color="
                isContentExpanded ? 'primary' : 'neutral'
              "
              variant="soft"
              class="text-xs"
            >
              {{
                isContentExpanded
                  ? t(
                      "home.tryItOut.carousel.content.fullView"
                    )
                  : t(
                      "home.tryItOut.carousel.content.compactView"
                    )
              }}
            </UBadge>
          </div>

          <!-- Loading overlay for transitions -->
          <Transition
            enter-active-class="transition-opacity duration-200"
            leave-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
          >
            <div
              v-if="false"
              class="absolute inset-0 bg-gray-900/50 flex items-center justify-center"
            >
              <div class="text-white text-sm">{{
                t("home.tryItOut.carousel.content.loading")
              }}</div>
            </div>
          </Transition>
        </div>

        <!-- Enhanced Footer -->
        <div
          class="border-t border-gray-700 bg-gray-800/40 backdrop-blur-sm"
        >
          <!-- Slot Support -->
          <template
            v-if="
              currentItem.slotKey &&
              $slots[`footer-${currentItem.slotKey}`]
            "
          >
            <div class="p-4">
              <slot
                :name="`footer-${currentItem.slotKey}`"
                :item="currentItem"
                :index="currentActiveIndex"
              />
            </div>
          </template>

          <template v-else-if="$slots.footer">
            <div class="p-4">
              <slot
                name="footer"
                :item="currentItem"
                :index="currentActiveIndex"
              />
            </div>
          </template>

          <!-- Default Footer -->
          <template v-else-if="currentItem.footer">
            <div class="p-4">
              <div
                class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <UButton
                  v-if="currentItem.footer.primaryAction"
                  :color="
                    currentItem.footer.primaryAction
                      .color || 'primary'
                  "
                  variant="solid"
                  size="sm"
                  :icon="
                    currentItem.footer.primaryAction.icon
                  "
                  :to="currentItem.footer.primaryAction.to"
                  target="_blank"
                  class="shadow-lg hover:shadow-xl transition-shadow"
                  @click="
                    currentItem.footer.primaryAction.action?.()
                  "
                >
                  {{
                    currentItem.footer.primaryAction.label
                  }}
                </UButton>

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
                    :to="action.to"
                    class="text-gray-300 hover:text-white"
                    @click="action.action?.()"
                  >
                    {{ action.label }}
                  </UButton>
                </div>
              </div>
            </div>
          </template>

          <!-- Fallback Footer -->
          <template v-else>
            <div class="p-4">
              <div
                class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <UBadge
                  color="primary"
                  variant="soft"
                  class="text-xs flex items-center gap-1.5"
                >
                  <UIcon
                    name="i-heroicons-information-circle"
                    class="w-3 h-3"
                  />
                  {{
                    t(
                      "home.tryItOut.carousel.footer.signInPrompt"
                    )
                  }}
                </UBadge>

                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  trailing-icon="i-heroicons-arrow-top-right-on-square"
                  class="text-xs text-gray-400 hover:text-gray-200"
                >
                  {{
                    t(
                      "home.tryItOut.carousel.footer.learnMore"
                    )
                  }}
                </UButton>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Enhanced Progress Indicators -->
      <div class="mt-4 flex-shrink-0">
        <!-- Desktop Indicators -->
        <div
          class="hidden lg:flex items-center justify-center gap-3"
        >
          <div class="flex gap-2">
            <button
              v-for="(_, index) in carouselItems"
              :key="index"
              class="group relative"
              :aria-label="`${t('home.tryItOut.carousel.indicators.goToSlide')} ${index + 1}`"
              @click="setActiveContent(index)"
            >
              <div
                class="w-3 h-3 rounded-full transition-all duration-300 cursor-pointer"
                :class="[
                  currentActiveIndex === index
                    ? 'bg-primary-500 shadow-lg shadow-primary-500/30'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary-400 hover:scale-110',
                ]"
              />
              <!-- Progress ring for active indicator -->
              <div
                v-if="
                  currentActiveIndex === index &&
                  isAutoPlaying
                "
                class="absolute inset-0 rounded-full border-2 border-primary-300 animate-spin"
                style="
                  animation-duration: var(
                    --carousel-duration,
                    4s
                  );
                "
              />
            </button>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-2 ml-4">
            <UButton
              :icon="
                isAutoPlaying
                  ? 'i-heroicons-pause'
                  : 'i-heroicons-play'
              "
              size="xs"
              color="primary"
              variant="soft"
              :title="
                isAutoPlaying
                  ? t(
                      'home.tryItOut.carousel.controls.pause'
                    )
                  : t(
                      'home.tryItOut.carousel.controls.play'
                    )
              "
              @click="toggleAutoPlay"
            />
            <span
              class="text-xs text-gray-500 dark:text-gray-400 ml-2"
            >
              {{ currentActiveIndex + 1 }} /
              {{ carouselItems.length }}
            </span>
          </div>
        </div>

        <!-- Mobile Indicators -->
        <div
          class="flex lg:hidden items-center justify-center gap-3"
        >
          <div class="flex gap-2">
            <button
              v-for="(_, index) in carouselItems"
              :key="index"
              class="w-2.5 h-2.5 rounded-full transition-all duration-300"
              :class="[
                currentActiveIndex === index
                  ? 'bg-primary-500 scale-125'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary-400',
              ]"
              :aria-label="`${t('home.tryItOut.carousel.indicators.goToSlide')} ${index + 1}`"
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
            :title="
              isAutoPlaying
                ? t('home.tryItOut.carousel.controls.pause')
                : t('home.tryItOut.carousel.controls.play')
            "
            @click="toggleAutoPlay"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for code area */
:deep(.overflow-auto) {
  scrollbar-width: thin;
  scrollbar-color: #4b5563 #1f2937;
}

:deep(.overflow-auto::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(.overflow-auto::-webkit-scrollbar-track) {
  background: #1f2937;
  border-radius: 4px;
}

:deep(.overflow-auto::-webkit-scrollbar-thumb) {
  background: #4b5563;
  border-radius: 4px;
}

:deep(.overflow-auto::-webkit-scrollbar-thumb:hover) {
  background: #6b7280;
}

/* Animation for carousel duration */
:root {
  --carousel-duration: v-bind(
    `${props.autoplayDuration}ms`
  );
}

/* Enhanced focus styles for accessibility */
button:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px rgb(var(--color-primary-500)),
    0 0 0 4px white;
}

.dark button:focus-visible {
  box-shadow:
    0 0 0 2px rgb(var(--color-primary-500)),
    0 0 0 4px rgb(17 24 39);
}

/* JSON syntax highlighting simulation */
.json-key {
  color: #60a5fa; /* blue-400 */
}

.json-string {
  color: #34d399; /* emerald-400 */
}

.json-number {
  color: #f59e0b; /* amber-500 */
}

.json-boolean {
  color: #ec4899; /* pink-500 */
}

.json-null {
  color: #9ca3af; /* gray-400 */
}

/* Smooth transitions for theme changes */
* {
  transition-property:
    background-color, border-color, color, fill, stroke,
    opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Progressive enhancement for reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .border-gray-200\/60 {
    border-color: #000;
  }

  .dark .border-gray-700\/60 {
    border-color: #fff;
  }
}
</style>
