<script setup lang="ts">
import { Code, Title } from '@mantine-vue/core'
import StylesApiTable from './StylesApiTable.vue'

defineProps<{ components: string[]; componentPrefix?: string }>()

// Mantine Vue does not have its own Styles API guide yet , the concept is identical to React Mantine
const STYLES_API_DOCS = 'https://mantine.dev/styles/styles-api'
</script>

<template>
  <div class="groupsHeader">
    <Title :order="2" class="mainTitle">Styles API</Title>

    <p class="intro">
      <Code>{{ components[0] }}</Code> component supports
      <a :href="STYLES_API_DOCS" class="link" target="_blank" rel="noreferrer">Styles API</a>. With
      Styles API, you can customize styles of any inner element. Follow
      <a :href="STYLES_API_DOCS" class="link" target="_blank" rel="noreferrer">the documentation</a>
      to learn how to use CSS modules, CSS variables and inline styles to get full control over
      component styles.
    </p>
  </div>

  <div v-for="component in components" :key="component" class="group">
    <StylesApiTable :component="component" :component-prefix="componentPrefix" />
  </div>
</template>

<style scoped>
.group {
  --group-spacing: 40px;
}

.group + .group {
  margin-top: var(--group-spacing);
  padding-top: var(--group-spacing);
  border-top: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3));
}

.mainTitle {
  font-family: var(--docs-font-primary);
  font-weight: 600;
  margin-bottom: var(--mantine-spacing-sm);
  color: var(--mantine-color-bright);
}

.intro {
  margin-top: 0;
  line-height: var(--mantine-line-height);
  color: var(--mantine-color-text);
}

.link {
  color: var(--mantine-color-anchor);
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
