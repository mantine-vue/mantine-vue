import { defineComponent, h, type PropType } from 'vue'
import { Tooltip, UnstyledButton } from '@mantine-vue/core'
import classes from './HeaderControl.module.css'

// Renders as a <button> by default, or as any element via the `component`
// prop, e.g. `a` for link-style controls. UnstyledButton is already
// polymorphic through its own `component` prop, so we forward it the same way.
export interface HeaderControlProps {
  tooltip: string
  component?: string
  'aria-label'?: string
}

export const HeaderControl = defineComponent({
  name: 'HeaderControl',
  inheritAttrs: false,
  props: {
    tooltip: { type: String, required: true },
    component: { type: String, default: 'button' },
    'aria-label': { type: String, default: undefined },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(Tooltip, { label: props.tooltip }, () =>
        h(
          UnstyledButton,
          {
            ...attrs,
            component: props.component,
            class: [classes.control, attrs.class],
            'aria-label': props['aria-label'] || props.tooltip,
          },
          () => slots.default?.(),
        ),
      )
  },
})
