<script lang="ts">
import {
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getFontSize,
  getRadius,
  getSize,
  getThemeColor,
} from '../../../core'

const defaultProps = {
  siblings: 1,
  boundaries: 1,
  size: 'md',
  color: 'var(--mantine-primary-color-filled)',
  layout: 'default',
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((theme, { size, radius, color, autoContrast }) => ({
  root: {
    '--pagination-control-radius': radius === undefined ? undefined : getRadius(radius),
    '--pagination-control-size': getSize(size, 'pagination-control-size'),
    '--pagination-control-fz': getFontSize(size),
    '--pagination-active-bg': color ? getThemeColor(color, theme) : undefined,
    '--pagination-active-color': getAutoContrastValue(autoContrast, theme)
      ? getContrastColor({ color, theme, autoContrast })
      : undefined,
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { usePagination } from '@mantine-vue/hooks'
import { Box, useProps, useStyles } from '../../../core'
import { providePaginationContext } from '../Pagination.context'
import type { PaginationRootOwnProps, PaginationRootSlots } from './PaginationRoot.types'
import classes from '../Pagination.module.css'

defineOptions({
  name: 'PaginationRoot',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<PaginationRootOwnProps>(), {
  disabled: false,
  autoContrast: undefined,
  unstyled: false,
})

defineSlots<PaginationRootSlots>()

const emit = defineEmits<{
  'update:modelValue': [page: number]
  change: [page: number]
}>()

const attrs = useAttrs()
const props = useProps('PaginationRoot', defaultProps, rawProps)

const pagination = usePagination({
  total: props.total,
  page: () => props.modelValue,
  initialPage: props.defaultValue,
  siblings: props.siblings,
  boundaries: props.boundaries,
  onChange: (page) => {
    emit('update:modelValue', page)
    emit('change', page)
  },
})

const getStyles = useStyles({
  name: 'Pagination',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

/** Getters keep the provided object reactive without changing the shape consumers read. */
providePaginationContext({
  total: props.total,
  disabled: props.disabled,
  getItemProps: props.getItemProps,
  getStyles,
  get range() {
    return pagination.range.value
  },
  get active() {
    return pagination.active.value
  },
  onChange: pagination.setPage,
  onNext: pagination.next,
  onPrevious: pagination.previous,
  onFirst: pagination.first,
  onLast: pagination.last,
} as any)

const rootStyles = computed(() =>
  getStyles('root', { className: attrs.class, style: attrs.style as any }),
)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...rootStyles }"
    :mod="[{ disabled: props.disabled }, props.mod]"
    :data-layout="props.layout"
  >
    <slot />
  </Box>
</template>
