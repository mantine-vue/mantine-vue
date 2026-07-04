<script setup lang="ts">
import { computed } from 'vue'
import type { Frontmatter } from '@/types'
import { SOURCE_BASE } from '@/links'

const props = defineProps<{ meta: Frontmatter }>()
const sourceLink = computed(() =>
  props.meta.source ? `${SOURCE_BASE}/${props.meta.source}` : null,
)
</script>

<template>
  <div v-if="!meta.hideHeader" class="wrapper">
    <div class="header">
      <h1 class="title">{{ meta.title }}</h1>
      <p v-if="meta.description" class="description">{{ meta.description }}</p>
      <div class="links">
        <a v-if="meta.package" class="badge">{{ meta.package }}</a>
        <RouterLink v-if="meta.polymorphic" to="/core/button" class="link">
          Polymorphic component
        </RouterLink>
        <a v-if="sourceLink" :href="sourceLink" target="_blank" rel="noreferrer" class="link">
          Source
        </a>
        <a
          v-if="meta.docs"
          class="link"
          :href="`https://github.com/mantinedev/mantine-vue/blob/master/apps/mantine.dev/src/pages/${meta.docs}`"
          target="_blank"
          rel="noreferrer"
          >Docs</a
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  z-index: 4;
  padding-inline: var(--docs-inline-spacing);
  background-color: var(--mantine-color-body);
  border-bottom: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4));
}

.header {
  padding-top: var(--mantine-spacing-xl);
  padding-bottom: calc(var(--mantine-spacing-xl) * 1.5);

  @mixin smaller-than $docsMdxBreakpoint {
    max-width: 100%;
    padding-bottom: var(--mantine-spacing-xl);
  }
}

.title {
  font-size: 44px;
  margin: 0 0 5px;
  font-weight: 600;
  font-family: var(--docs-font-primary);
  color: var(--mantine-color-bright);

  @mixin smaller-than $docsMdxBreakpoint {
    font-size: 32px;
  }
}

.description {
  max-width: 450px;
  margin: 0 0 var(--mantine-spacing-xl);
  font-size: var(--mantine-font-size-lg);
  color: light-dark(var(--mantine-color-gray-6), var(--mantine-color-dark-1));

  @mixin smaller-than $docsMdxBreakpoint {
    font-size: var(--mantine-font-size-md);
  }
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.badge {
  font-family: var(--mantine-font-family-monospace);
  font-size: 12px;
  padding: 4px 8px;
  border-radius: var(--mantine-radius-default);
  background: var(--mantine-color-default-hover);
  color: var(--mantine-color-text);
}
.link {
  font-size: 13px;
  color: var(--mantine-color-blue-text);
  text-decoration: none;
  padding: 4px 8px;
  border: 1px solid var(--mantine-color-default-border);
  border-radius: var(--mantine-radius-default);
}
.link:hover {
  background: var(--mantine-color-default-hover);
}
</style>
