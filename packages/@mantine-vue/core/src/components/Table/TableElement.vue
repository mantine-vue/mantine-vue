<script lang="ts">
import type { TableContextValue } from './Table.context'
import type { TableElementOptions } from './TableElement.types'

/**
 * Turns the parent `Table`'s options into `data-` attributes, but only the ones this
 * element opts into: a `td` cares about column borders, a `tr` about striping.
 */
function getDataAttributes(ctx: TableContextValue, options?: TableElementOptions) {
  if (!options) {
    return undefined
  }

  const data: Record<string, boolean | string | undefined> = {}

  if (options.columnBorder && ctx.withColumnBorders) data['data-with-column-border'] = true
  if (options.rowBorder && ctx.withRowBorders) data['data-with-row-border'] = true
  if (options.striped && ctx.striped) data['data-striped'] = ctx.striped
  if (options.highlightOnHover && ctx.highlightOnHover) data['data-hover'] = true
  if (options.captionSide && ctx.captionSide) data['data-side'] = ctx.captionSide
  if (options.stickyHeader && ctx.stickyHeader) data['data-sticky'] = true

  return data
}

export { getDataAttributes }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useProps } from '../../core'
import { useTableContext } from './Table.context'
import type {
  TableElementName,
  TableElementOwnProps,
  TableElementSlots,
} from './TableElement.types'

defineOptions({
  name: 'TableElement',
  inheritAttrs: false,
})

const props = defineProps<
  TableElementOwnProps & {
    /** Element this instance renders; fixed by the named wrapper. */
    __element: TableElementName
    /** Table options this element reacts to; fixed by the named wrapper. */
    __options?: TableElementOptions
    /** Theme lookup name, so `theme.components.TableTd` still applies. */
    __name: string
  }
>()

defineSlots<TableElementSlots>()

const attrs = useAttrs()
const ctx = useTableContext()

const resolved = useProps(props.__name, {}, props)

const dataAttributes = computed(() => getDataAttributes(ctx, props.__options))

const elementStyles = computed(() =>
  ctx.getStyles(props.__element, {
    className: [resolved.className, attrs.class],
    style: [resolved.style, attrs.style],
    props: resolved,
  }),
)
</script>

<template>
  <Box v-bind="{ ...attrs, ...dataAttributes, ...elementStyles }" :component="props.__element">
    <slot />
  </Box>
</template>
