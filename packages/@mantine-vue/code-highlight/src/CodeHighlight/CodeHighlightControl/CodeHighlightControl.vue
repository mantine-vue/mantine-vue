<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { ActionIcon, Tooltip, useProps } from '@mantine-vue/core'
import { useCodeHighlightContext } from '../CodeHighlight.context'
import type {
  CodeHighlightControlEmits,
  CodeHighlightControlProps,
  CodeHighlightControlSlots,
} from './CodeHighlightControl.types'

defineOptions({ name: 'CodeHighlightControl', inheritAttrs: false })
const rawProps = withDefaults(defineProps<CodeHighlightControlProps>(), { component: 'button' })
defineSlots<CodeHighlightControlSlots>()
const emit = defineEmits<CodeHighlightControlEmits>()
const props = useProps('CodeHighlightControl', null, rawProps)
const attrs = useAttrs()
const ctx = useCodeHighlightContext()
const tooltipStyles = computed(() => ctx.getStyles('controlTooltip'))
</script>

<template>
  <Tooltip
    v-if="props.tooltipLabel"
    :label="props.tooltipLabel"
    fz="sm"
    position="bottom"
    :class-names="{ tooltip: tooltipStyles.class }"
    :styles="{ tooltip: tooltipStyles.style }"
    :data-code-color-scheme="ctx.codeColorScheme"
    :transition-props="{ duration: 0 }"
  >
    <ActionIcon
      v-bind="{ ...ctx.getStyles('control'), ...attrs }"
      :component="props.component"
      :variant="'none' as any"
      :data-code-color-scheme="ctx.codeColorScheme"
      @click="(event: MouseEvent) => emit('click', event)"
    >
      <slot />
    </ActionIcon>
  </Tooltip>
  <ActionIcon
    v-else
    v-bind="{ ...ctx.getStyles('control'), ...attrs }"
    :component="props.component"
    :variant="'none' as any"
    :data-code-color-scheme="ctx.codeColorScheme"
    @click="(event: MouseEvent) => emit('click', event)"
  >
    <slot />
  </ActionIcon>
</template>
