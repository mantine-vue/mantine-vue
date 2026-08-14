<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { Box, useProps, useStyles } from '@mantine-vue/core'
import { DEFAULT_LABELS } from './labels'
import type { RichTextEditorLabels } from './labels'
import { provideRichTextEditorContext } from './RichTextEditor.context'
import type {
  RichTextEditorFactory,
  RichTextEditorSlots,
  RichTextEditorVariant,
} from './RichTextEditor.types'
import classes from './RichTextEditor.module.css'

defineOptions({ name: 'RichTextEditor', inheritAttrs: false })

interface RichTextEditorRuntimeProps {
  editor: Editor | null | undefined
  withCodeHighlightStyles?: boolean
  withTypographyStyles?: boolean
  onSourceCodeTextSwitch?: (isSourceCodeModeActive: boolean) => void
  labels?: Partial<RichTextEditorLabels>
  variant?: RichTextEditorVariant
  classNames?: unknown
  styles?: unknown
  vars?: unknown
  unstyled?: boolean
}

const rawProps = withDefaults(defineProps<RichTextEditorRuntimeProps>(), {
  editor: null,
  withCodeHighlightStyles: true,
  withTypographyStyles: true,
  onSourceCodeTextSwitch: undefined,
  labels: undefined,
  variant: 'default',
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: undefined,
})

defineSlots<RichTextEditorSlots>()

const attrs = useAttrs()
const props = useProps('RichTextEditor', null, rawProps)
const getStyles = useStyles<RichTextEditorFactory>({
  name: 'RichTextEditor',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as never,
  styles: props.styles as never,
  vars: props.vars as never,
  unstyled: props.unstyled,
})
const mergedLabels = computed(() => ({ ...DEFAULT_LABELS, ...props.labels }))
const rootProps = computed(() => {
  const forwarded = { ...attrs }
  delete forwarded.class
  delete forwarded.style
  return { ...getStyles('root'), ...forwarded }
})

provideRichTextEditorContext({
  get editor() {
    return props.editor
  },
  getStyles,
  get labels() {
    return mergedLabels.value
  },
  get withCodeHighlightStyles() {
    return props.withCodeHighlightStyles
  },
  get withTypographyStyles() {
    return props.withTypographyStyles
  },
  get onSourceCodeTextSwitch() {
    return props.onSourceCodeTextSwitch
  },
  get unstyled() {
    return props.unstyled
  },
  get variant() {
    return props.variant
  },
})
</script>

<template>
  <Box v-bind="rootProps">
    <slot />
  </Box>
</template>
