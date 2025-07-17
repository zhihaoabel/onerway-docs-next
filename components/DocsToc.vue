<script setup lang="ts">
import { UPage } from "#components";

interface TocLink {
  id: string;
  text: string;
  depth: number;
  children?: TocLink[];
}

interface Props {
  links: TocLink[];
}

defineProps<Props>();
</script>

<template>
  <UPage>
    <UContentToc
      :links="links"
      :title="$t('toc.title')" />
  </UPage>
</template>
