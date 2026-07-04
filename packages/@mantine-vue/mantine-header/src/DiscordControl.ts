import { defineComponent, h } from 'vue'
import { HeaderControl } from './HeaderControl'
import { DiscordIcon } from './icons/DiscordIcon'
import classes from './DiscordControl.module.css'

export const DiscordControl = defineComponent({
  name: 'DiscordControl',
  props: {
    link: { type: String, required: true },
  },
  setup(props) {
    return () =>
      h(
        HeaderControl,
        { tooltip: 'Discord', component: 'a', href: props.link, class: classes.discord },
        () => h(DiscordIcon, { size: 20 }),
      )
  },
})
