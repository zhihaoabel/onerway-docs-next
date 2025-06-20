<script setup lang="ts">
// 页脚组件不需要额外的逻辑
</script>

<template>
  <UFooter>
    <template #left>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-heroicons-credit-card"
          class="h-5 w-5"
        />
        <span class="font-semibold">Onerway</span>
      </div>
    </template>

    <template #center>
      <UFooterColumns
        :links="[
          {
            label: $t('footer.product'),
            children: [
              {
                label: $t('footer.payment'),
                to: '/payment',
              },
              {
                label: $t('footer.acquiring'),
                to: '/acquiring',
              },
              {
                label: $t('footer.api'),
                to: '/api',
              },
            ],
          },
          {
            label: $t('footer.resources'),
            children: [
              {
                label: $t('footer.docs'),
                to: '/docs',
              },
              {
                label: $t('footer.guides'),
                to: '/guides',
              },
              {
                label: $t('footer.changelog'),
                to: '/changelog',
              },
            ],
          },
          {
            label: $t('footer.support'),
            children: [
              {
                label: $t('footer.contact'),
                to: '/contact',
              },
              {
                label: $t('footer.help'),
                to: '/help',
              },
              {
                label: $t('footer.status'),
                to: 'https://status.onerway.com',
                target: '_blank',
              },
            ],
          },
        ]"
      />
    </template>

    <template #right>
      <div class="flex items-center gap-4">
        <!-- 社交媒体链接 -->
        <div class="flex items-center gap-2">
          <UButton
            to="https://github.com/onerway"
            target="_blank"
            icon="i-simple-icons-github"
            variant="ghost"
            color="primary"
            size="sm"
            aria-label="GitHub"
          />
          <UButton
            to="https://twitter.com/onerway"
            target="_blank"
            icon="i-simple-icons-twitter"
            variant="ghost"
            color="primary"
            size="sm"
            aria-label="Twitter"
          />
        </div>
      </div>
    </template>

    <template #bottom>
      <div
        class="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
      >
        <div>
          © {{ new Date().getFullYear() }} Onerway.
          {{ $t("footer.rights") }}
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/privacy"
            class="hover:text-gray-700 dark:hover:text-gray-200"
          >
            {{ $t("footer.privacy") }}
          </NuxtLink>
          <NuxtLink
            to="/terms"
            class="hover:text-gray-700 dark:hover:text-gray-200"
          >
            {{ $t("footer.terms") }}
          </NuxtLink>
        </div>
      </div>
    </template>
  </UFooter>
</template>
