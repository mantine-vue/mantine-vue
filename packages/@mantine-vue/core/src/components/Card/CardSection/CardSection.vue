<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps } from '../../../core'
import { useCardContext } from '../Card.context'
import type { CardSectionOwnProps, CardSectionSlots } from './CardSection.types'

defineOptions({ name: 'CardSection', inheritAttrs: false })
const rawProps = withDefaults(defineProps<CardSectionOwnProps>(), {
  component: 'div',
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<CardSectionSlots>()
const attrs = useAttrs()
const props = useProps('CardSection', null, rawProps)
const ctx = useCardContext()
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('section', { className: attrs.class, style: attrs.style as any }),
    }"
    :component="props.component"
    :mod="[{ withBorder: props.withBorder, inheritPadding: props.inheritPadding }, props.mod]"
    ><slot
  /></Box>
</template>
