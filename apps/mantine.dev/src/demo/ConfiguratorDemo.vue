<script setup lang="ts">
import { reactive, computed, type Component } from 'vue'
import DemoRoot from './DemoRoot.vue'
import DemoColumns from './DemoColumns.vue'
import DemoCode from './DemoCode.vue'
import ConfiguratorControl from './controls/ConfiguratorControl.vue'
import { getCode } from './get-code-array'
import type { ConfiguratorControlOptions } from './types'

const props = defineProps<{
  component: Component
  code: string
  controls: ConfiguratorControlOptions[]
  centered?: boolean
}>()

// Live state initialised from each control's initialValue.
const state = reactive<Record<string, unknown>>(
  props.controls.reduce<Record<string, unknown>>((acc, c) => {
    acc[c.prop] = c.initialValue
    return acc
  }, {}),
)

// A computed snapshot of the live state. Binding this (a ref) in the template
// makes the preview's render track every control value.
const previewProps = computed(() => ({ ...state }))

const generatedCode = computed(() => getCode(props.code, props.controls, { ...state }))
</script>

<template>
  <DemoRoot>
    <DemoColumns :centered="centered">
      <template #preview>
        <component :is="component" v-bind="previewProps" />
      </template>
      <template #controls>
        <ConfiguratorControl
          v-for="control in controls"
          :key="control.prop"
          :control="control"
          :value="state[control.prop]"
          :on-change="(v: unknown) => (state[control.prop] = v)"
        />
      </template>
    </DemoColumns>
    <DemoCode :code="generatedCode" />
  </DemoRoot>
</template>
