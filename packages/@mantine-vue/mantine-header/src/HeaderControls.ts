import { defineComponent, h, type PropType } from 'vue'
import { Group, Tooltip } from '@mantine-vue/core'
import { ColorSchemeControl } from './ColorSchemeControl'
import { DirectionControl } from './DirectionControl'
import { DiscordControl } from './DiscordControl'
import { GithubControl } from './GithubControl'
import { SearchControl } from './SearchControl'
import { SupportControl } from './SupportControl'

export const HeaderControls = defineComponent({
  name: 'HeaderControls',
  inheritAttrs: false,
  props: {
    onSearch: { type: Function as PropType<() => void>, default: undefined },
    githubLink: { type: String, default: undefined },
    withDirectionToggle: { type: Boolean, default: true },
    withSearch: { type: Boolean, default: true },
    withGithub: { type: Boolean, default: true },
    withDiscord: { type: Boolean, default: true },
    discordLink: { type: String, required: true },
    withColorScheme: { type: Boolean, default: true },
    withSupport: { type: Boolean, default: true },
  },
  setup(props, { attrs }) {
    return () =>
      h(Tooltip.Group, { openDelay: 600, closeDelay: 100 }, () =>
        h(Group, { gap: 'xs', ...attrs }, () => [
          props.withSearch ? h(SearchControl, { onClick: props.onSearch }) : null,
          props.withDiscord ? h(DiscordControl, { link: props.discordLink }) : null,
          props.withSupport ? h(SupportControl) : null,
          props.withGithub ? h(GithubControl, { link: props.githubLink! }) : null,
          props.withDirectionToggle ? h(DirectionControl) : null,
          props.withColorScheme ? h(ColorSchemeControl) : null,
        ]),
      )
  },
})
