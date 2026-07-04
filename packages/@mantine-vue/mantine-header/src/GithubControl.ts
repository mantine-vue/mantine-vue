import { defineComponent, h } from 'vue'
import { HeaderControl } from './HeaderControl'
import { GithubIcon } from './icons/GithubIcon'

export const GithubControl = defineComponent({
  name: 'GithubControl',
  props: {
    link: { type: String, required: true },
  },
  setup(props) {
    return () =>
      h(HeaderControl, { tooltip: 'Source code', component: 'a', href: props.link }, () =>
        h(GithubIcon, { size: 22 }),
      )
  },
})
