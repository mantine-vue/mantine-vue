<script setup lang="ts">
import { computed } from 'vue'
import { Text, Title } from '@mantine-vue/core'
import {
  PhCalendarBlank,
  PhCertificate,
  PhGithubLogo,
  PhPencilSimple,
  PhToggleLeft,
} from '@phosphor-icons/vue'
import type { Frontmatter } from '@/types'
import { DOCS_BASE, REPO_BASE, SOURCE_BASE } from '@/links'
import { NpmIcon } from '@/mdx-components/icons/NpmIcon'
import LinkItem from './LinkItem/LinkItem.vue'

const props = defineProps<{ meta: Frontmatter }>()

const withTabs = computed(() => Array.isArray(props.meta.props))
const hasLinks = computed(() => !!props.meta.source)
const withTitle = computed(() => !!props.meta.title)

const isVisible = computed(
  () =>
    !props.meta.hideHeader &&
    (hasLinks.value || withTabs.value || !!props.meta.release || withTitle.value),
)
</script>

<template>
  <div v-if="isVisible" class="wrapper" :data-with-tabs="withTabs || undefined">
    <div class="header" :data-with-tabs="withTabs || undefined">
      <Title class="title">{{ meta.title }}</Title>
      <Text v-if="meta.description" class="description">{{ meta.description }}</Text>

      <LinkItem v-if="meta.polymorphic" label="Polymorphic" link="/guides/polymorphic">
        <template #icon><PhToggleLeft :size="14" /></template>
        Polymorphic component
      </LinkItem>

      <LinkItem v-if="meta.source" label="Source" :link="`${SOURCE_BASE}/${meta.source}`">
        <template #icon><PhGithubLogo :size="14" /></template>
        View source code
      </LinkItem>

      <LinkItem v-if="meta.date && meta.release" label="Release date" :link="meta.release">
        <template #icon><PhCalendarBlank :size="14" /></template>
        {{ meta.date }}
      </LinkItem>

      <LinkItem v-if="meta.release" label="Source code" :link="meta.release">
        <template #icon><PhGithubLogo :size="14" /></template>
        Release on GitHub
      </LinkItem>

      <LinkItem v-if="meta.docs" label="Docs" :link="`${DOCS_BASE}/${meta.docs}`">
        <template #icon><PhPencilSimple :size="14" /></template>
        Edit this page
      </LinkItem>

      <LinkItem
        v-if="meta.package"
        label="Package"
        :link="`https://www.npmjs.com/package/${meta.package}`"
      >
        <template #icon><NpmIcon :size="14" /></template>
        {{ meta.package }}
      </LinkItem>

      <LinkItem v-if="meta.license" label="License" :link="`${REPO_BASE}/LICENSE`">
        <template #icon><PhCertificate :size="14" /></template>
        MIT
      </LinkItem>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  z-index: 4;
  padding-inline: var(--docs-inline-spacing);
  background-color: var(--mantine-color-body);
}

.wrapper:not([data-with-tabs]) {
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
</style>
