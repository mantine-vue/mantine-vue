<script setup lang="ts">
import { useAttrs } from 'vue'
import type { RichTextEditorIconProps } from './RichTextEditorIcon.types'

defineOptions({ name: 'RichTextEditorIcon', inheritAttrs: false })

defineProps<RichTextEditorIconProps>()
const attrs = useAttrs()
</script>

<template>
  <svg
    v-bind="attrs"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path v-for="path in paths" :key="path" :d="path" />
  </svg>
</template>
