import { defineComponent, h } from 'vue'
import { Group, rem, Text, UnstyledButton } from '@mantine-vue/core'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import classes from './SearchControl.module.css'

export const SearchControl = defineComponent({
  name: 'SearchControl',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(UnstyledButton, { ...attrs, class: [classes.root, attrs.class] }, () =>
        h(Group, { gap: 'xs' }, () => [
          h(PhMagnifyingGlass, { style: { width: rem(15), height: rem(15) } }),
          h(Text, { fz: 'sm', c: 'dimmed', pr: 80 }, () => 'Search'),
          h(Text, { fw: 700, class: classes.shortcut }, () => 'Ctrl + K'),
        ]),
      )
  },
})
