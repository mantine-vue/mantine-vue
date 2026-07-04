<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import { Text, UnstyledButton } from '@mantine-vue/core'
import DemoArea from './DemoArea.vue'
import DemoCode from './DemoCode.vue'
import DemoRoot from './DemoRoot.vue'

const props = defineProps<{
  data: { selectors: Record<string, string> }
  code: string
  component: Component
  centered?: boolean
  withPadding?: boolean
  maxWidth?: number | string
  minHeight?: number | string
  defaultExpanded?: boolean
}>()

const hovered = ref<string | null>(null)

const selectorKeys = computed(() => Object.keys(props.data.selectors))

const classNames = computed(() =>
  selectorKeys.value.reduce<Record<string, string>>((acc, key) => {
    acc[key] = key
    return acc
  }, {}),
)

function getCss(value: string | null) {
  return value
    ? `.${value} {\n  outline: 2px solid #fe0d45;\n  outline-offset: -2px;\n}\n`
    : '/*\n * Hover over selectors to apply outline styles\n *\n */'
}

const css = computed(() => getCss(hovered.value))

const codeFiles = computed(() => {
  const classNamesProp = hovered.value
    ? `\n    :class-names="{ ${hovered.value}: classes.${hovered.value} }"`
    : ''
  return [
    { fileName: 'Demo.module.css', language: 'scss', code: css.value },
    {
      fileName: 'Demo.vue',
      language: 'vue',
      code: props.code.replace('{{props}}', classNamesProp),
    },
  ]
})
</script>

<template>
  <component :is="'style'">{{ css }}</component>
  <DemoRoot>
    <div class="columns">
      <DemoArea
        :centered="centered"
        :with-padding="withPadding"
        :max-width="maxWidth"
        :min-height="minHeight"
      >
        <component :is="component" :class-names="classNames" />
      </DemoArea>

      <div class="controls">
        <div class="header">
          <Text :fw="500" fz="sm" :mb="5">Component Styles API</Text>
          <Text c="dimmed" :fz="11" :style="{ lineHeight: 1.45 }">
            Hover over selectors to highlight corresponding elements
          </Text>
        </div>

        <UnstyledButton
          v-for="key in selectorKeys"
          :key="key"
          class="selector"
          @mouseenter="hovered = key"
          @mouseleave="hovered = null"
        >
          <Text :mb="2">{{ key }}</Text>
          <Text :fz="11" c="dimmed">{{ data.selectors[key] }}</Text>
        </UnstyledButton>
      </div>
    </div>

    <DemoCode :code="codeFiles" :default-expanded="defaultExpanded" />
  </DemoRoot>
</template>

<style scoped>
.columns {
  display: flex;
  align-items: stretch;
}
.controls {
  width: 280px;
  flex-shrink: 0;
  border-left: 1px solid var(--mantine-color-default-border);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--mantine-color-default-hover);
}
.header {
  margin-bottom: 8px;
}
.selector {
  width: 100%;
  padding: 8px;
  border-radius: var(--mantine-radius-sm);
}
.selector:hover {
  background: var(--mantine-color-default-border);
}
@media (max-width: 720px) {
  .columns {
    flex-direction: column;
  }
  .controls {
    width: auto;
    border-left: 0;
    border-top: 1px solid var(--mantine-color-default-border);
  }
}
</style>
