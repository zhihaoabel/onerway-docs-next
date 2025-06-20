<script setup lang="ts">
// 组件可以接受配置参数
interface Props {
  testCardNumber?: string;
  testCardsUrl?: string;
  width?: string;
}

const props = withDefaults(defineProps<Props>(), {
  testCardNumber: "4242 4242 4242 4242",
  testCardsUrl:
    "https://docs.onerway.com/apis/zh/v0.6/test",
  width: "w-80",
});

const { t } = useI18n();
const copied = ref(false);

// 复制测试卡号到剪贴板
const copyCardNumber = async () => {
  try {
    await navigator.clipboard.writeText(
      props.testCardNumber.replace(/\s/g, "")
    );
    copied.value = true;
    // 可以添加成功提示
    useToast().add({
      title: t("testCard.copySuccess"),
      description: t("testCard.copyDescription"),
      color: "success",
      icon: "i-heroicons-check-circle",
      duration: 3000,
    });
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy card number:", error);
  }
};
</script>

<template>
  <div
    class="rounded-xl border border-white/20 dark:border-gray-700/30 overflow-hidden aspect-[86/54] bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 shadow-xl shadow-blue-500/25 motion-reduce:transform-none transform-gpu"
    :class="[width]"
    role="article"
    :aria-label="t('testCard.ariaLabel')"
  >
    <!-- Header section -->
    <div
      class="relative h-8 top-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-80"
      aria-hidden="true"
    ></div>

    <!-- Content section -->
    <div class="p-6 space-y-4 pt-10">
      <!-- Test cards section -->
      <div class="flex items-center justify-between">
        <UButton
          variant="link"
          size="sm"
          trailing-icon="i-heroicons-arrow-right"
          target="_blank"
          :to="testCardsUrl"
          class="text-white hover:text-blue-100"
          :aria-label="t('testCard.viewDocsLabel')"
        >
          <span class="font-medium text-xs">{{
            t("testCard.title")
          }}</span>
        </UButton>
        <CardChip
          class="rotate-6 scale-110 animate-pulse"
          aria-hidden="true"
        />
      </div>

      <!-- Test card number -->
      <UButton
        variant="link"
        size="md"
        class="w-full cursor-pointer flex items-center justify-between text-white hover:text-blue-100 focus:outline-none"
        :trailing-icon="
          copied
            ? 'i-heroicons-check-circle'
            : 'i-heroicons-clipboard-document-list'
        "
        :aria-label="
          copied
            ? t('testCard.copiedLabel')
            : t('testCard.copyCardLabel')
        "
        tabindex="0"
        @click="copyCardNumber"
        @keydown.enter="copyCardNumber"
        @keydown.space.prevent="copyCardNumber"
      >
        <span class="font-mono font-semibold text-sm">{{
          testCardNumber
        }}</span>
      </UButton>
    </div>
  </div>
</template>
