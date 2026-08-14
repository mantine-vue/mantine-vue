<script lang="ts">
import { foldAccents } from './highlighter/highlighter'

const defaultProps = {
  color: 'yellow',
  wholeWord: false,
  caseInsensitive: true,
  accentInsensitive: true,
} as const

function normalizeKey(value: string, caseInsensitive?: boolean, accentInsensitive?: boolean) {
  let key = value
  if (caseInsensitive) key = key.toLowerCase()
  if (accentInsensitive) key = foldAccents(key)
  return key
}
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { useMantineTheme, useProps } from '../../core'
import { Mark } from '../Mark'
import { Text } from '../Text'
import { highlighter } from './highlighter/highlighter'
import type { HighlightOwnProps, HighlightSlots, HighlightTerm } from './Highlight.types'

defineOptions({ name: 'Highlight', inheritAttrs: false })

const rawProps = withDefaults(defineProps<HighlightOwnProps>(), {
  rootRef: undefined,
  color: undefined,
  highlightStyles: undefined,
  wholeWord: undefined,
  caseInsensitive: undefined,
  accentInsensitive: undefined,
  component: undefined,
  span: false,
  unstyled: false,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<HighlightSlots>()

const attrs = useAttrs()
const slots = useSlots()
const props = useProps('Highlight', defaultProps, rawProps)

function getChunks() {
  // Called by the template render function so slot dependencies remain tracked.
  const text =
    slots
      .default?.()
      .map((node) => String(node.children ?? ''))
      .join('') ?? ''
  const isTermArray = Array.isArray(props.highlight) && typeof props.highlight[0] === 'object'
  const colorMap = new Map<string, string>()
  let highlightStrings: string[]

  if (isTermArray) {
    highlightStrings = (props.highlight as HighlightTerm[]).map((term) => {
      if (term.color) {
        colorMap.set(
          normalizeKey(term.text, props.caseInsensitive, props.accentInsensitive),
          term.color,
        )
      }
      return term.text
    })
  } else if (Array.isArray(props.highlight)) {
    highlightStrings = props.highlight as string[]
  } else {
    highlightStrings = [props.highlight as string]
  }

  return highlighter(text, highlightStrings, {
    wholeWord: props.wholeWord,
    caseInsensitive: props.caseInsensitive,
    accentInsensitive: props.accentInsensitive,
  }).map((item) => ({
    ...item,
    color:
      colorMap.get(normalizeKey(item.chunk, props.caseInsensitive, props.accentInsensitive)) ||
      props.color,
  }))
}

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })

const theme = useMantineTheme()

/**
 * `highlightStyles` accepts a theme callback, which cannot be bound to `:style` directly -- Vue
 * would receive the function itself. Resolve it against the theme first.
 */
const highlightStyle = computed(() =>
  typeof props.highlightStyles === 'function'
    ? props.highlightStyles(theme.value)
    : props.highlightStyles,
)
</script>

<template>
  <Text
    v-bind="attrs"
    :rootRef="setRootRef"
    :component="props.component"
    :span="props.span"
    :unstyled="props.unstyled"
    :class-names="props.classNames as any"
    :styles="props.styles as any"
    :vars="props.vars as any"
    __static-selector="Highlight"
  >
    <template v-for="(item, index) in getChunks()" :key="index">
      <Mark
        v-if="item.highlighted"
        :unstyled="props.unstyled"
        :color="item.color"
        :style="highlightStyle"
        :data-highlight="item.chunk"
      >
        {{ item.chunk }}
      </Mark>
      <span v-else>{{ item.chunk }}</span>
    </template>
  </Text>
</template>
