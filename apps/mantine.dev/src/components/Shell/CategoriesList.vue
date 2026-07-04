<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Title } from '@mantine-vue/core'
import type { MdxNavGroup } from '@/mdx'

defineProps<{ groups: MdxNavGroup[] }>()
const emit = defineEmits<{ navigate: [] }>()

const route = useRoute()
</script>

<template>
  <div class="categories">
    <template v-for="group in groups" :key="group.title ?? 'default'">
      <div class="category">
        <Title v-if="group.title" :order="5" class="categoryTitle"> {{ group.title }}</Title>
        <div class="links">
          <RouterLink
            v-for="page in group.pages"
            :key="page.link"
            :to="page.link"
            class="link"
            :data-active="page.link === route.path || undefined"
            @click="emit('navigate')"
          >
            {{ page.label }}
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.categories {
  padding-inline-end: var(--mantine-spacing-md);
}

.categories:first-of-type {
  padding-top: var(--mantine-spacing-xl);
}

.categories:last-of-type {
  padding-bottom: 80px;
}

.category + .category {
  margin-top: var(--mantine-spacing-xl);
}

.link {
  display: block;
  font-size: var(--mantine-font-size-sm);
  color: light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-0));
  text-decoration: none;
  border-radius: var(--mantine-radius-md);
  padding: 6px 12px;

  @mixin hover {
    background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6));
    color: var(--mantine-color-bright);
  }

  @mixin smaller-than $docsMdxBreakpoint {
    font-size: var(--mantine-font-size-md);
    padding: 8px 15px;
  }
}

.link[data-active] {
  color: light-dark(var(--mantine-color-blue-8), var(--mantine-color-blue-2));
  background-color: light-dark(
    var(--mantine-color-blue-0),
    alpha(var(--mantine-color-blue-6), 0.17)
  );
}

.link.pending {
  color: var(--mantine-color-dimmed);
  text-decoration: line-through;
}

.categoryTitle {
  padding-inline-start: 12px;
  font-size: var(--mantine-font-size-sm);
  color: var(--mantine-color-bright);
  font-weight: 600;
  margin-bottom: 5px;
  font-family: var(--docs-font-primary);

  @mixin smaller-than $docsMdxBreakpoint {
    padding-inline-start: 15px;
    font-size: var(--mantine-font-size-lg);
  }
}
</style>
