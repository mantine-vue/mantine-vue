<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import RichTextEditorControlComponent from './RichTextEditorControl.vue'
import type {
  RichTextEditorControlBaseRuntimeProps,
  RichTextEditorControlBaseSlots,
} from './RichTextEditorControl.types'

defineOptions({ name: 'RichTextEditorControlBase', inheritAttrs: false })

const props = defineProps<RichTextEditorControlBaseRuntimeProps>()
defineSlots<RichTextEditorControlBaseSlots>()

const attrs = useAttrs()
const ctx = useRichTextEditorContext()
const controlProps = computed(() => ({ ...props, ...attrs }))
const iconProps = computed(() => ctx.getStyles('controlIcon'))
</script>

<template>
  <RichTextEditorControlComponent v-bind="controlProps">
    <slot name="icon" v-bind="iconProps">
      <component :is="props.icon" v-bind="iconProps" />
    </slot>
  </RichTextEditorControlComponent>
</template>
