import { defineComponent, h } from 'vue'
import { useMantineEnv } from '../../core'
import { Portal } from './Portal'

export const OptionalPortal = defineComponent({
  name: 'OptionalPortal',
  inheritAttrs: false,
  props: {
    withinPortal: { type: Boolean, default: true },
    target: { type: [String, Object], default: undefined },
    reuseTargetNode: { type: Boolean, default: true },
  },
  setup(props, { attrs, slots }) {
    const env = useMantineEnv()

    return () => {
      if (env === 'test' || !props.withinPortal) {
        return slots.default?.()
      }

      return h(
        Portal,
        {
          ...attrs,
          target: props.target as any,
          reuseTargetNode: props.reuseTargetNode,
        },
        slots.default,
      )
    }
  },
})
