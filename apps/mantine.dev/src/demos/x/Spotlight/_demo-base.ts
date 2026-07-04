import { defineComponent, h, type PropType } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { createSpotlight, Spotlight, type SpotlightActions } from '@mantine-vue/spotlight'

// Each demo on the docs page needs its own isolated spotlight instance – if they
// all shared the default `spotlight` store, opening one demo's spotlight would
// open every other demo's spotlight at the same time.
export const SpotlightDemoBase = defineComponent({
  name: 'SpotlightDemoBase',
  inheritAttrs: false,
  props: {
    actions: { type: Array as PropType<SpotlightActions[]>, default: () => [] },
  },
  setup(props, { attrs }) {
    const [store, actions] = createSpotlight()

    return () => [
      h(Group, { justify: 'center' }, () =>
        h(Button, { onClick: actions.open }, () => 'Open spotlight'),
      ),
      h(Spotlight, { actions: props.actions, store, ...attrs }),
    ]
  },
})
