import { defineComponent, h, type PropType } from 'vue'
import { rem } from '@mantine-vue/core'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import { HeaderControl } from './HeaderControl'

export const SearchMobileControl = defineComponent({
  name: 'SearchMobileControl',
  props: {
    onSearch: { type: Function as PropType<() => void>, required: true },
  },
  setup(props) {
    return () =>
      h(HeaderControl, { onClick: () => props.onSearch(), tooltip: 'Search' }, () =>
        h(PhMagnifyingGlass, { style: { width: rem(22), height: rem(22) } }),
      )
  },
})
