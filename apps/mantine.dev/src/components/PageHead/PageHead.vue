<script setup lang="ts">
import { watchEffect } from 'vue'

const props = defineProps<{
  title: string | undefined
  description: string | undefined
}>()

const metaDescription =
  'Vue components and composables library with native dark theme support and focus on usability, accessibility and developer experience'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

watchEffect(() => {
  const title = props.title ? `${props.title} | Mantine Vue` : 'Mantine Vue'
  const description = props.description || metaDescription

  document.title = title

  setMeta('name', 'description', description)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'twitter:title', title)
  setMeta('property', 'twitter:description', description)
})
</script>

<template>
  <!-- Head-only component, nothing to render -->
  <span style="display: none" />
</template>
