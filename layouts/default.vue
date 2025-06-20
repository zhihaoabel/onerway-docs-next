<script setup lang="ts"></script>

<template>
  <div class="min-h-screen">
    <!-- 全局顶部导航 -->
    <AppHeader />

    <!-- 主内容区域 -->
    <UMain class="sm:mt-[var(--ui-header-height-bottom)]">
      <slot />
    </UMain>

    <!-- 全局页脚 -->
    <AppFooter />
  </div>
</template>

<style scoped></style>
