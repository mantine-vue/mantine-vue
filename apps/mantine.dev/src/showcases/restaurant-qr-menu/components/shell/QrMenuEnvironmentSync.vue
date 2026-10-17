<script setup lang="ts">
import { computed, watch } from 'vue'
import { useDirection, useMantineColorScheme } from '@mantine-vue/core'
import { ensureStylesheet, useDocumentAttributes } from '../../../shared/use-document-attributes'
import { useQrMenu } from '../../app/use-qr-menu'
import { getGoogleFontsUrl } from '../../theme/build-theme'

/** Renderless component that mirrors preferences into the document and Mantine. */
const { i18n, preferences, appearance } = useQrMenu()
const { setDirection } = useDirection()
const { setColorScheme } = useMantineColorScheme()

watch(i18n.dir, (dir) => setDirection(dir), { immediate: true })

useDocumentAttributes(() => ({ dir: i18n.dir.value, lang: i18n.locale.value }))

const colorScheme = computed(() => {
  const preference = preferences.state.colorScheme
  return preference === 'auto' ? (appearance.value.preset.preferredScheme ?? 'auto') : preference
})
watch(colorScheme, (scheme) => setColorScheme(scheme), { immediate: true })

watch(
  () => getGoogleFontsUrl(appearance.value.font),
  (href) => href && ensureStylesheet(href),
  { immediate: true },
)
</script>

<template>
  <span hidden />
</template>
