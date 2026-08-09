<script lang="ts">
import { createVarsResolver, getRadius, getThemeColor, rem } from '@mantine-vue/core'

const varsResolver = createVarsResolver<any>(
  (theme, { maxCollapsedHeight, background, radius }) => ({
    codeHighlight: {
      '--ch-max-height': rem(maxCollapsedHeight),
      '--ch-background': background ? getThemeColor(background, theme) : undefined,
      '--ch-radius': typeof radius !== 'undefined' ? getRadius(radius) : undefined,
    },
  }),
)

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import {
  Box,
  ScrollArea,
  UnstyledButton,
  useMantineContext,
  useProps,
  useStyles,
} from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import { useHighlight } from '../CodeHighlightProvider/CodeHighlightProvider'
import { provideCodeHighlightContext } from './CodeHighlight.context'
import CopyCodeButton from './CopyCodeButton/CopyCodeButton.vue'
import ExpandCodeButton from './ExpandCodeButton/ExpandCodeButton.vue'
import type {
  CodeHighlightEmits,
  CodeHighlightFactory,
  CodeHighlightProps,
  CodeHighlightSlots,
} from './CodeHighlight.types'
import classes from '../CodeHighlight.module.css'

defineOptions({ name: 'CodeHighlight', inheritAttrs: false })
const rawProps = withDefaults(defineProps<CodeHighlightProps>(), {
  // Keep optional Boolean props uncontrolled when they are not provided.
  defaultExpanded: undefined,
  expanded: undefined,
  withCopyButton: true,
  withExpandButton: false,
  expandCodeLabel: 'Expand code',
  collapseCodeLabel: 'Collapse code',
  withBorder: false,
  withLineNumbers: false,
  __withOffset: false,
  __inline: false,
})
defineSlots<CodeHighlightSlots>()
const emit = defineEmits<CodeHighlightEmits>()
const props = useProps('CodeHighlight', null, rawProps)
const attrs = useAttrs()
const slots = useSlots()
const mantine = useMantineContext()
const getStyles = useStyles<CodeHighlightFactory>({
  name: props.__staticSelector || 'CodeHighlight',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames,
  styles: props.styles,
  vars: props.vars,
  unstyled: props.unstyled,
  varsResolver,
  rootSelector: 'codeHighlight',
} as any)
const [expanded, setExpanded] = useUncontrolled<boolean>({
  value: () => props.expanded,
  defaultValue: props.defaultExpanded,
  finalValue: true,
  onChange: (value) => {
    emit('update:expanded', value)
    emit('expanded-change', value)
  },
})
const highlight = useHighlight()

function resolveColorScheme(value: 'light' | 'dark' | 'auto'): 'light' | 'dark' {
  if (value !== 'auto') return value
  return typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const highlighted = computed(() =>
  highlight({
    code: props.code.trim(),
    language: props.language,
    colorScheme: props.codeColorScheme ?? resolveColorScheme(mantine.colorScheme.value),
  }),
)
const renderedControls = computed(() => {
  const value =
    props.controls !== undefined
      ? typeof props.controls === 'function'
        ? props.controls()
        : props.controls
      : slots.controls?.()
  return Array.isArray(value) ? value : value ? [value] : []
})
const shouldDisplayControls = computed(
  () => renderedControls.value.length > 0 || props.withExpandButton || props.withCopyButton,
)
const lineNumbers = computed(() =>
  props.code
    .trim()
    .split('\n')
    .map((_, index) => index + 1),
)
const renderControls = () => renderedControls.value

provideCodeHighlightContext({
  getStyles,
  get codeColorScheme() {
    return props.codeColorScheme
  },
})
</script>

<template>
  <code
    v-if="props.__inline && highlighted.isHighlighted"
    v-bind="{
      ...attrs,
      ...highlighted.codeElementProps,
      ...getStyles('codeHighlight', {
        className: [highlighted.codeElementProps?.class, attrs.class],
        style: [highlighted.codeElementProps?.style, attrs.style],
      }),
    }"
    :data-with-border="props.withBorder || undefined"
    v-html="highlighted.highlightedCode"
  />
  <code
    v-else-if="props.__inline"
    v-bind="{
      ...attrs,
      ...highlighted.codeElementProps,
      ...getStyles('codeHighlight', {
        className: [highlighted.codeElementProps?.class, attrs.class],
        style: [highlighted.codeElementProps?.style, attrs.style],
      }),
    }"
    :data-with-border="props.withBorder || undefined"
    >{{ props.code.trim() }}</code
  >
  <Box
    v-else
    v-bind="{ ...attrs, ...getStyles('codeHighlight') }"
    dir="ltr"
    :data-code-color-scheme="props.codeColorScheme"
    :data-with-border="props.withBorder || undefined"
  >
    <div
      v-if="shouldDisplayControls"
      v-bind="getStyles('controls')"
      :data-with-offset="props.__withOffset || undefined"
    >
      <component :is="renderControls" />
      <ExpandCodeButton
        v-if="props.withExpandButton"
        :expanded="expanded"
        :expand-code-label="props.expandCodeLabel"
        :collapse-code-label="props.collapseCodeLabel"
        @expand="setExpanded"
      />
      <CopyCodeButton
        v-if="props.withCopyButton"
        :code="props.code"
        :copied-label="props.copiedLabel"
        :copy-label="props.copyLabel"
      />
    </div>
    <ScrollArea
      type="hover"
      :scrollbar-size="4"
      dir="ltr"
      :offset-scrollbars="false"
      :data-collapsed="!expanded || undefined"
      :styles="{ viewport: { overscrollBehaviorInline: 'none' } }"
      v-bind="getStyles('scrollarea')"
    >
      <div v-bind="getStyles('codeWrapper')">
        <div
          v-if="props.withLineNumbers"
          v-bind="getStyles('lineNumbers')"
          :data-with-offset="props.__withOffset || undefined"
        >
          <div v-for="line in lineNumbers" :key="line">{{ line }}</div>
        </div>
        <pre v-bind="getStyles('pre')" :data-with-offset="props.__withOffset || undefined"><code
          v-if="highlighted.isHighlighted"
          v-bind="{
            ...highlighted.codeElementProps,
            ...getStyles('code', {
              className: highlighted.codeElementProps?.class,
              style: highlighted.codeElementProps?.style,
            }),
          }"
          v-html="highlighted.highlightedCode"
        /><code
          v-else
          v-bind="{
            ...highlighted.codeElementProps,
            ...getStyles('code', {
              className: highlighted.codeElementProps?.class,
              style: highlighted.codeElementProps?.style,
            }),
          }"
        >{{ props.code.trim() }}</code></pre>
      </div>
    </ScrollArea>
    <UnstyledButton
      v-bind="getStyles('showCodeButton')"
      :mod="{ hidden: expanded }"
      :data-code-color-scheme="props.codeColorScheme"
      @click="setExpanded(true)"
    >
      {{ props.expandCodeLabel }}
    </UnstyledButton>
  </Box>
</template>
