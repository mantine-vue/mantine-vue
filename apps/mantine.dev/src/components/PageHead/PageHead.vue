<script setup lang="ts">
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import {
  DEFAULT_DESCRIPTION,
  SOCIAL_IMAGE_URL,
  getCanonicalUrl,
  getPageTitle,
  getStructuredData,
} from '@/seo'

const props = defineProps<{
  title: string | undefined
  description: string | undefined
}>()

const route = useRoute()

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = url
}

function setStructuredData(title: string, description: string, path: string) {
  let el = document.head.querySelector<HTMLScriptElement>('#seo-structured-data')
  if (!el) {
    el = document.createElement('script')
    el.id = 'seo-structured-data'
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }

  el.textContent = JSON.stringify(getStructuredData({ path, title, description }))
}

watchEffect(() => {
  const pageTitle = props.title || 'Mantine Vue'
  const title = getPageTitle(props.title)
  const description = props.description || DEFAULT_DESCRIPTION
  const canonicalUrl = getCanonicalUrl(route.path)

  document.title = title

  setMeta('name', 'description', description)
  setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1')
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:type', 'article')
  setMeta('property', 'og:url', canonicalUrl)
  setMeta('property', 'og:image', SOCIAL_IMAGE_URL)
  setMeta('property', 'og:image:width', '1200')
  setMeta('property', 'og:image:height', '630')
  setMeta('property', 'og:image:alt', 'Mantine Vue — Build interfaces that feel inevitable.')
  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', SOCIAL_IMAGE_URL)
  setCanonical(canonicalUrl)
  setStructuredData(pageTitle, description, route.path)
})
</script>

<template>
  <!-- Head-only component, nothing to render -->
  <span style="display: none" />
</template>
