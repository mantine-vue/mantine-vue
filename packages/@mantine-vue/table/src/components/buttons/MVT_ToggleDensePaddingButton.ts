import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_DensityState, MVT_RowData, MVT_TableInstance } from '../../types'

const next: Record<
  Exclude<MVT_DensityState, 'lg' | 'sm'>,
  Exclude<MVT_DensityState, 'lg' | 'sm'>
> = { md: 'xs', xl: 'md', xs: 'xl' }
export const MVT_ToggleDensePaddingButton = defineComponent({
  name: 'MVTToggleDensePaddingButton',
  inheritAttrs: false,
  props: { table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true } },
  setup(props, { attrs }) {
    return () => {
      const { table } = props
      const density = table.getState().density
      const { IconBaselineDensityLarge, IconBaselineDensityMedium, IconBaselineDensitySmall } =
        table.options.icons
      const title = (attrs.title as string | undefined) ?? table.options.localization.toggleDensity
      const icon =
        density === 'xs'
          ? IconBaselineDensitySmall
          : density === 'md'
            ? IconBaselineDensityMedium
            : IconBaselineDensityLarge
      return h(Tooltip, { label: title, withinPortal: true }, () =>
        h(
          ActionIcon,
          {
            'aria-label': title,
            color: 'gray',
            size: 'lg',
            variant: 'subtle',
            ...attrs,
            onClick: () => table.setDensity((current) => next[current as keyof typeof next]),
          },
          () => h(icon),
        ),
      )
    }
  },
})
