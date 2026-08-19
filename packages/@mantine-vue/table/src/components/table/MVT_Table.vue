<script setup lang="ts">
import { computed, unref, useAttrs } from 'vue'

import { darken, lighten, Table, useMantineColorScheme } from '@mantine-vue/core'

import clsx from 'clsx'

import { useMVT_ColumnVirtualizer } from '../../hooks/useMVT_ColumnVirtualizer'
import { type MVT_RowData, type MVT_TableInstance } from '../../types'
import { parseCSSVarId } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import MVT_TableBody from '../body/MVT_TableBody.vue'
import MVT_TableFooter from '../footer/MVT_TableFooter.vue'
import MVT_TableHead from '../head/MVT_TableHead.vue'
import classes from './MVT_Table.module.css'

defineOptions({ name: 'MVTTable', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

const attrs = useAttrs()
const columnVirtualizerRef = useMVT_ColumnVirtualizer(props.table)
const { colorScheme } = useMantineColorScheme()

// Compiled child-component bindings only update when a prop changes identity.
// TanStack instead mutates one virtualizer and calls triggerRef, so expose a new
// facade for each trigger while keeping all operations bound to the real instance.
const columnVirtualizer = computed(() => {
  const virtualizer = columnVirtualizerRef?.value
  if (!virtualizer) return undefined

  return new Proxy(virtualizer, {
    get(target, property) {
      const value = Reflect.get(target, property, target)
      return typeof value === 'function' ? value.bind(target) : value
    },
    set(target, property, value) {
      return Reflect.set(target, property, value, target)
    },
  })
})

const tableProps = computed(() => {
  const { table } = props
  const density = table.getState().density
  return {
    highlightOnHover: true,
    horizontalSpacing: density,
    verticalSpacing: density,
    ...parseFromValuesOrFunc(table.options.mantineTableProps, { table }),
    ...attrs,
  } as Record<string, any>
})

const columnSizeVars = computed(() => {
  const sizes: Record<string, number> = {}
  for (const header of props.table.getFlatHeaders()) {
    const size = header.getSize()
    sizes[`--header-${parseCSSVarId(header.id)}-size`] = size
    sizes[`--col-${parseCSSVarId(header.column.id)}-size`] = size
  }
  return sizes
})

// Rebuilt per render rather than cached: a memoized props object is value-equal
// across renders, and Vue would then skip updating this wrapper along with the
// slot content inside it.
const tableBindings = () => {
  const stripedColor = tableProps.value.stripedColor

  return {
    ...tableProps.value,
    class: clsx(
      'mvt-table',
      classes.root,
      props.table.options.layoutMode?.startsWith('grid') && classes['root-grid'],
      tableProps.value.class,
    ),
    style: {
      ...columnSizeVars.value,
      '--mvt-striped-row-background-color': stripedColor,
      '--mvt-striped-row-hover-background-color': stripedColor
        ? unref(colorScheme) === 'dark'
          ? lighten(stripedColor, 0.08)
          : darken(stripedColor, 0.12)
        : undefined,
      ...tableProps.value.style,
    },
  }
}
</script>

<template>
  <Table v-bind="tableBindings()">
    <MVT_TableHead
      v-if="table.options.enableTableHead"
      :columnVirtualizer="columnVirtualizer"
      :table="table"
    />
    <MVT_TableBody :columnVirtualizer="columnVirtualizer" :table="table" :tableProps="tableProps" />
    <MVT_TableFooter
      v-if="table.options.enableTableFooter"
      :columnVirtualizer="columnVirtualizer"
      :table="table"
    />
  </Table>
</template>
