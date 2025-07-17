<script setup lang="ts">
// 页面元数据
useSeoMeta({
  title: "图标测试页面",
  description: "测试生产环境中的图标加载情况",
});

// 状态管理
const copied = ref(false);
const isPlaying = ref(false);
const isExpanded = ref(false);

// 复制功能
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(
      "test-clipboard-content-12345"
    );
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error("复制失败:", error);
  }
};

// 播放切换
const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
};

// 展开切换
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <div class="container mx-auto p-8 space-y-8">
    <h1 class="text-3xl font-bold text-center mb-8"
      >图标测试页面</h1
    >

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 测试关键图标 -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold"
            >关键图标测试</h2
          >
        </template>

        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-clipboard-document-list"
              class="w-5 h-5" />
            <span>clipboard-document-list</span>
          </div>

          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-check-circle"
              class="w-5 h-5 text-green-500" />
            <span>check-circle</span>
          </div>

          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-x-circle"
              class="w-5 h-5 text-red-500" />
            <span>x-circle</span>
          </div>

          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-5 h-5 text-yellow-500" />
            <span>exclamation-triangle</span>
          </div>
        </div>
      </UCard>

      <!-- 测试按钮中的图标 -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold"
            >按钮图标测试</h2
          >
        </template>

        <div class="space-y-4">
          <UButton
            icon="i-heroicons-rocket-launch"
            color="primary"
            variant="solid">
            火箭图标
          </UButton>

          <UButton
            trailing-icon="i-heroicons-arrow-right"
            color="gray"
            variant="outline">
            箭头图标
          </UButton>

          <UButton
            icon="i-heroicons-credit-card"
            color="green"
            variant="soft">
            卡片图标
          </UButton>
        </div>
      </UCard>

      <!-- 测试复制功能图标 -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold"
            >复制功能测试</h2
          >
        </template>

        <div class="space-y-4">
          <UButton
            :trailing-icon="
              copied
                ? 'i-heroicons-check-circle'
                : 'i-heroicons-clipboard-document-list'
            "
            :color="copied ? 'green' : 'gray'"
            variant="outline"
            @click="handleCopy">
            {{ copied ? "已复制!" : "点击复制" }}
          </UButton>

          <div
            class="p-3 bg-gray-100 dark:bg-gray-800 rounded-md font-mono text-sm">
            test-clipboard-content-12345
          </div>
        </div>
      </UCard>

      <!-- 测试动态图标 -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold"
            >动态图标测试</h2
          >
        </template>

        <div class="space-y-4">
          <UButton
            :icon="
              isPlaying
                ? 'i-heroicons-pause'
                : 'i-heroicons-play'
            "
            :color="isPlaying ? 'red' : 'green'"
            variant="solid"
            @click="togglePlay">
            {{ isPlaying ? "暂停" : "播放" }}
          </UButton>

          <UButton
            :icon="
              isExpanded
                ? 'i-heroicons-chevron-up'
                : 'i-heroicons-chevron-down'
            "
            color="gray"
            variant="ghost"
            @click="toggleExpand">
            {{ isExpanded ? "收起" : "展开" }}
          </UButton>
        </div>
      </UCard>

      <!-- 测试导航图标 -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold"
            >导航图标测试</h2
          >
        </template>

        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-home"
              class="w-5 h-5" />
            <span>首页</span>
          </div>

          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-document-text"
              class="w-5 h-5" />
            <span>文档</span>
          </div>

          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-user-group"
              class="w-5 h-5" />
            <span>用户组</span>
          </div>

          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-envelope"
              class="w-5 h-5" />
            <span>邮件</span>
          </div>
        </div>
      </UCard>

      <!-- 测试状态指示器 -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">状态指示器</h2>
        </template>

        <div class="space-y-4">
          <div
            class="flex items-center gap-3 text-green-600">
            <UIcon
              name="i-heroicons-check-circle"
              class="w-5 h-5" />
            <span>成功状态</span>
          </div>

          <div
            class="flex items-center gap-3 text-yellow-600">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-5 h-5" />
            <span>警告状态</span>
          </div>

          <div class="flex items-center gap-3 text-red-600">
            <UIcon
              name="i-heroicons-x-circle"
              class="w-5 h-5" />
            <span>错误状态</span>
          </div>

          <div
            class="flex items-center gap-3 text-blue-600">
            <UIcon
              name="i-heroicons-information-circle"
              class="w-5 h-5" />
            <span>信息状态</span>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 返回首页按钮 -->
    <div class="text-center pt-8">
      <UButton
        to="/"
        icon="i-heroicons-arrow-left"
        variant="outline">
        返回首页
      </UButton>
    </div>
  </div>
</template>
