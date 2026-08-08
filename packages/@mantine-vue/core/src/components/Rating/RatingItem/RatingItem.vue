<script lang="ts">
import type { VNodeChild } from 'vue'

/**
 * The icon may be renderable content or a function of the item value, so it is
 * rendered as a child rather than interpolated. Module scope keeps the identity stable.
 */
const RatingIcon = (props: { icon: any; value: number }): VNodeChild =>
  typeof props.icon === 'function' ? props.icon(props.value) : props.icon

RatingIcon.props = ['icon', 'value']

export { RatingIcon }
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Box, useDirection } from '../../../core'
import { useRatingContext } from '../Rating.context'
import { StarSymbol } from '../StarSymbol/StarSymbol'
import type { RatingItemOwnProps } from './RatingItem.types'

defineOptions({
  name: 'RatingItem',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<RatingItemOwnProps>(), {
  getSymbolLabel: undefined,
  emptyIcon: undefined,
  fullIcon: undefined,
  readOnly: false,
  onItemBlur: undefined,
})

const ctx = useRatingContext()
const { dir } = useDirection()

const icon = computed(() => (props.full ? props.fullIcon : props.emptyIcon))
const hasCustomIcon = computed(() => {
  const value = icon.value
  return (typeof value === 'function' ? value(props.value) : value) != null
})

/**
 * Fractional items are stacked on top of each other and clipped, so only the selected
 * portion of the symbol shows. A whole symbol needs no clip at all.
 */
const clipPath = computed(() => {
  if (props.fractionValue === 1) {
    return undefined
  }

  const remainder = props.active ? 100 - props.fractionValue * 100 : 100

  return dir.value === 'ltr' ? `inset(0 ${remainder}% 0 0)` : `inset(0 0 0 ${remainder}% )`
})

const labelStyles = computed(() =>
  ctx.getStyles('label', {
    style: {
      '--rating-item-z-index': props.fractionValue === 1 ? undefined : props.active ? '2' : '0',
    },
  }),
)

const symbolStyles = computed(() =>
  ctx.getStyles('symbolBody', { style: { '--rating-symbol-clip-path': clipPath.value } }),
)

function onKeydown(event: KeyboardEvent) {
  if (event.key === ' ' || event.key === 'Enter') {
    props.onChangeValue(props.value)
  }
}

function onLabelClick() {
  if (!props.readOnly) {
    props.onChangeValue(props.value)
  }
}
</script>

<template>
  <input
    v-if="!props.readOnly"
    v-bind="ctx.getStyles('input')"
    :id="props.id"
    type="radio"
    :name="props.name"
    :value="props.value"
    :checked="props.checked"
    :data-active="props.active ? true : undefined"
    :aria-label="props.getSymbolLabel?.(props.value)"
    @blur="props.onItemBlur"
    @change="props.onInputChange(props.value)"
    @keydown="onKeydown"
  />

  <Box
    :component="props.readOnly ? 'div' : 'label'"
    v-bind="labelStyles"
    :data-read-only="props.readOnly ? true : undefined"
    :for="props.id"
    @click="onLabelClick"
  >
    <Box v-bind="symbolStyles">
      <RatingIcon v-if="hasCustomIcon" :icon="icon" :value="props.value" />
      <StarSymbol v-else :type="props.full ? 'full' : 'empty'" />
    </Box>
  </Box>
</template>
