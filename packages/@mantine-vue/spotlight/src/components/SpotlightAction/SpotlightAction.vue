<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Box, Highlight, UnstyledButton, hasNode, resolveNode, useProps } from '@mantine-vue/core'
import { useSpotlightContext } from '../../Spotlight.context'
import { spotlightActions } from '../../spotlight.store'
import type { SpotlightActionProps, SpotlightActionSlots } from './SpotlightAction.types'

defineOptions({ name: 'SpotlightAction', inheritAttrs: false })
const rawProps = withDefaults(defineProps<SpotlightActionProps>(), {
  dimmedSections: true,
  highlightQuery: false,
  closeSpotlightOnTrigger: undefined,
})
defineSlots<SpotlightActionSlots>()
const attrs = useAttrs()
const slots = useSlots()
const props = useProps('SpotlightAction', null, rawProps)
const ctx = useSpotlightContext()
const stylesApi = computed(() => ({ classNames: props.classNames, styles: props.styles }))
const leftSection = computed(() => resolveNode(props.leftSection, slots.leftSection))
const rightSection = computed(() => resolveNode(props.rightSection, slots.rightSection))
const renderLeftSection = () => leftSection.value
const renderRightSection = () => rightSection.value
const forwardedAttrs = computed(() => {
  const value = { ...attrs }
  delete value.onClick
  delete value.onMousedown
  return value
})

function mousedown(event: MouseEvent) {
  event.preventDefault()
  ;(attrs.onMousedown as ((event: MouseEvent) => void) | undefined)?.(event)
}

function click(event: MouseEvent) {
  ;(attrs.onClick as ((event: MouseEvent) => void) | undefined)?.(event)
  if (props.closeSpotlightOnTrigger ?? ctx.closeOnActionTrigger) {
    spotlightActions.close(ctx.store)
  }
}
</script>

<template>
  <UnstyledButton
    v-bind="{
      ...forwardedAttrs,
      ...ctx.getStyles('action', { className: attrs.class, style: attrs.style, ...stylesApi }),
    }"
    data-action
    :tabindex="-1"
    @mousedown="mousedown"
    @click="click"
  >
    <slot v-if="$slots.default" />
    <template v-else>
      <Box
        v-if="hasNode(leftSection)"
        component="span"
        :mod="{ position: 'left', dimmed: props.dimmedSections }"
        v-bind="ctx.getStyles('actionSection', stylesApi)"
      >
        <component :is="renderLeftSection" />
      </Box>
      <span v-bind="ctx.getStyles('actionBody', stylesApi)">
        <Highlight
          v-if="props.highlightQuery && typeof props.label === 'string'"
          component="span"
          :highlight="ctx.query"
          :color="props.highlightColor"
          v-bind="ctx.getStyles('actionLabel', stylesApi)"
        >
          {{ props.label }}
        </Highlight>
        <span v-else v-bind="ctx.getStyles('actionLabel', stylesApi)">{{ props.label }}</span>
        <span v-bind="ctx.getStyles('actionDescription', stylesApi)">{{ props.description }}</span>
      </span>
      <Box
        v-if="hasNode(rightSection)"
        component="span"
        :mod="{ position: 'right', dimmed: props.dimmedSections }"
        v-bind="ctx.getStyles('actionSection', stylesApi)"
      >
        <component :is="renderRightSection" />
      </Box>
    </template>
  </UnstyledButton>
</template>
