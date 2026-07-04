<script setup lang="ts">
import type { Component } from 'vue'
import DemoRoot from './DemoRoot.vue'
import DemoArea from './DemoArea.vue'
import DemoCode from './DemoCode.vue'
import type { DemoCode as DemoCodeSource } from './types'

defineProps<{
  component: Component
  code?: DemoCodeSource
  centered?: boolean
  withPadding?: boolean
  maxWidth?: number | string
  minHeight?: number | string
  defaultExpanded?: boolean
}>()
</script>

<template>
  <DemoRoot>
    <DemoArea
      :centered="centered"
      :with-padding="withPadding"
      :max-width="maxWidth"
      :min-height="minHeight"
    >
      <component :is="component" />
    </DemoArea>
    <DemoCode :code="code" :default-expanded="defaultExpanded" />
  </DemoRoot>
</template>
