import { defineComponent, h } from 'vue'
import { rem } from '@mantine-vue/core'
import { PhHeart } from '@phosphor-icons/vue'
import { HeaderControl } from './HeaderControl'
import classes from './SupportControl.module.css'

export const SupportControl = defineComponent({
  name: 'SupportControl',
  setup() {
    return () =>
      h(
        HeaderControl,
        {
          component: 'a',
          href: 'https://opencollective.com/mantinedev',
          tooltip: 'Sponsor',
          'aria-label': 'Sponsor',
          class: classes.support,
        },
        () => h(PhHeart, { weight: 'fill', style: { width: rem(22), height: rem(22) } }),
      )
  },
})
