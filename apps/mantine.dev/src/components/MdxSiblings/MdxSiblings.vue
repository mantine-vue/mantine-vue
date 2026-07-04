<script setup lang="ts">
import { computed } from 'vue'
import { Text } from '@mantine-vue/core'
import { PhArrowLeft, PhArrowRight } from '@phosphor-icons/vue'
import type { Frontmatter } from '@/types'
import { getMdxSiblings } from './get-mdx-siblings'

const props = defineProps<{ meta: Frontmatter }>()

const siblings = computed(() => getMdxSiblings(props.meta.slug))
</script>

<template>
  <div v-if="!meta.hideSiblings" class="root">
    <RouterLink v-if="siblings.prev" :to="siblings.prev.link" class="link mantine-focus-auto">
      <PhArrowLeft class="icon" />
      <Text class="title">{{ siblings.prev.label }}</Text>
    </RouterLink>

    <RouterLink v-if="siblings.next" :to="siblings.next.link" class="link mantine-focus-auto">
      <Text class="title">{{ siblings.next.label }}</Text>
      <PhArrowRight class="icon" />
    </RouterLink>
  </div>
</template>

<style scoped>
.root {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 50px;
  border-top: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4));
  padding-top: var(--mantine-spacing-lg);

  @mixin smaller-than 700px {
    flex-direction: column;
    align-items: stretch;
    gap: var(--mantine-spacing-md);
  }
}

.link {
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  padding: 7px 12px;
  border-radius: var(--mantine-radius-md);
  color: var(--mantine-color-bright);
  gap: var(--mantine-spacing-xs);

  @mixin hover {
    background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-5));
  }
}

.title {
  font-size: var(--mantine-font-size-sm);
  font-weight: 600;
}

.icon {
  width: 18px;
  height: 18px;

  @mixin rtl {
    transform: rotate(180deg);
  }
}
</style>
