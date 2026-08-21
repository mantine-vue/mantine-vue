<script lang="ts">
import type { MVT_DensityState } from '../../types'

const next: Record<
  Exclude<MVT_DensityState, 'lg' | 'sm'>,
  Exclude<MVT_DensityState, 'lg' | 'sm'>
> = { md: 'xs', xl: 'md', xs: 'xl' }
</script>

<script setup lang="ts">
import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { computed, useAttrs } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'

defineOptions({ name: 'MVTToggleDensePaddingButton', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

const attrs = useAttrs()

const title = computed(
  () => (attrs.title as string | undefined) ?? props.table.options.localization.toggleDensity,
)

const icon = computed(() => {
  const { IconBaselineDensityLarge, IconBaselineDensityMedium, IconBaselineDensitySmall } =
    props.table.options.icons
  const density = props.table.getState().density
  return density === 'xs'
    ? IconBaselineDensitySmall
    : density === 'md'
      ? IconBaselineDensityMedium
      : IconBaselineDensityLarge
})

const actionIconProps = computed<any>(() => ({
  'aria-label': title.value,
  color: 'gray',
  size: 'lg',
  variant: 'subtle',
  ...attrs,
  onClick: () => props.table.setDensity((current) => next[current as keyof typeof next]),
}))
</script>

<template>
  <Tooltip :label="title" :withinPortal="true">
    <ActionIcon v-bind="actionIconProps">
      <component :is="icon" />
    </ActionIcon>
  </Tooltip>
</template>
