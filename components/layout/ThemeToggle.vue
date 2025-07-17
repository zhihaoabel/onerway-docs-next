<script setup>
const { t } = useI18n();
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  }
});

// 移动端简化样式：单按钮切换
const mobileButtonClasses = computed(() => [
  "relative rounded-lg transition-all duration-300 ease-out animate-pulse",
  "hover:scale-105 active:scale-95",
  isDark.value ? "text-primary" : "text-amber-600"
]);

// 桌面端完整样式
const desktopContainerClasses = computed(() => [
  "flex items-center gap-2 p-1 rounded-lg transition-colors duration-200",
  "hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
]);

const sunIconClasses = computed(() => [
  "h-4 w-4 sm:h-5 sm:w-5 transition-all duration-500 ease-out",
  isDark.value
    ? "text-gray-400 scale-75 rotate-90 opacity-60"
    : "text-amber-500 scale-100 rotate-0 opacity-100 drop-shadow-sm"
]);

const moonIconClasses = computed(() => [
  "h-4 w-4 sm:h-5 sm:w-5 transition-all duration-500 ease-out",
  isDark.value
    ? "text-blue-400 scale-100 rotate-0 opacity-100 drop-shadow-sm"
    : "text-gray-400 scale-75 -rotate-90 opacity-60"
]);

const switchClasses = computed(() => [
  "relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-all duration-300 ease-out",
  "hover:scale-105 active:scale-95 focus:outline-none focus:ring-1 focus:ring-offset-1 cursor-pointer",
  "shadow-inner border border-opacity-20",
  isDark.value
    ? "bg-gradient-to-r from-blue-600 to-blue-700 focus:ring-blue-400 border-blue-500"
    : "bg-gradient-to-r from-gray-200 to-gray-300 focus:ring-amber-400 border-gray-300"
]);

const switchButtonClasses = computed(() => [
  "inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full transition-all duration-300 ease-out",
  "shadow-md border border-opacity-30",
  isDark.value
    ? "translate-x-5 sm:translate-x-3 bg-gradient-to-br from-white to-blue-50 border-blue-200"
    : "translate-x-0.5 sm:-translate-x-1.5 bg-gradient-to-br from-white to-amber-50 border-amber-200"
]);

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

const ariaLabel = computed(() =>
  isDark.value
    ? t("theme.switchToLight", "Switch to light mode")
    : t("theme.switchToDark", "Switch to dark mode")
);
</script>

<template>
  <ClientOnly>
    <!-- 移动端：简化的单按钮切换 -->
    <UButton
      :class="mobileButtonClasses"
      :title="ariaLabel"
      :aria-label="ariaLabel"
      :aria-pressed="isDark"
      role="switch"
      variant="ghost"
      class="sm:hidden cursor-pointer"
      @click="toggleTheme">
      <UIcon
        :name="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
        class="h-5 w-5 transition-transform duration-300"
        :class="isDark ? 'rotate-0' : 'rotate-0'" />
    </UButton>

    <!-- 桌面端：完整的开关组件 -->
    <div
      :class="desktopContainerClasses"
      class="hidden sm:flex">
      <!-- 太阳图标 -->
      <div class="relative">
        <UIcon
          name="i-lucide-sun"
          :class="sunIconClasses" />
        <!-- 光晕效果 -->
        <div
          v-if="!isDark"
          class="absolute inset-0 -z-10 animate-pulse">
          <UIcon
            name="i-lucide-sun"
            class="h-5 w-5 text-amber-300 opacity-30 scale-150 blur-sm" />
        </div>
      </div>

      <!-- 开关按钮 -->
      <UButton
        :class="switchClasses"
        :title="ariaLabel"
        :aria-label="ariaLabel"
        :aria-pressed="isDark"
        role="switch"
        @click="toggleTheme">
        <!-- 开关内部按钮 -->
        <span :class="switchButtonClasses">
          <!-- 按钮内部图标 -->
          <UIcon
            :name="
              isDark ? 'i-lucide-moon' : 'i-lucide-sun'
            "
            class="h-2 w-2 sm:h-2.5 sm:w-2.5 text-gray-600 opacity-70 -translate-y-1" />
        </span>

        <!-- 开关轨道装饰 -->
        <div
          class="absolute inset-0.5 rounded-full opacity-20">
          <div
            class="h-full w-full rounded-full transition-all duration-300"
            :class="[
              isDark ? 'bg-blue-300' : 'bg-amber-300'
            ]" />
        </div>
      </UButton>

      <!-- 月亮图标 -->
      <div class="relative">
        <UIcon
          name="i-lucide-moon"
          :class="moonIconClasses" />
        <!-- 光晕效果 -->
        <div
          v-if="isDark"
          class="absolute inset-0 -z-10 animate-pulse">
          <UIcon
            name="i-lucide-moon"
            class="h-5 w-5 text-blue-300 opacity-30 scale-150 blur-sm" />
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
