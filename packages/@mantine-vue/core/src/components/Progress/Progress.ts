import { defineComponent, h, type PropType } from 'vue'
import { useProps } from '../../core'
import { ProgressLabel } from './ProgressLabel/ProgressLabel'
import { ProgressRoot } from './ProgressRoot/ProgressRoot'
import { ProgressSection } from './ProgressSection/ProgressSection'
import classes from './Progress.module.css'

export type ProgressStylesNames = 'root' | 'section' | 'label'

const ProgressBase = defineComponent({
  name: 'Progress',
  inheritAttrs: false,
  props: {
    value: { type: Number, required: true },
    color: { type: String, default: undefined },
    striped: { type: Boolean, default: false },
    animated: { type: Boolean, default: false },
    size: { type: [String, Number] as PropType<string | number>, default: undefined },
    radius: { type: [String, Number] as PropType<string | number>, default: undefined },
    autoContrast: { type: Boolean, default: undefined },
    transitionDuration: { type: Number, default: undefined },
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs }) {
    const props = useProps('Progress', null, rawProps)

    return () =>
      h(
        ProgressRoot,
        {
          ...attrs,
          classNames: props.classNames,
          styles: props.styles,
          vars: props.vars,
          unstyled: props.unstyled,
          size: props.size,
          radius: props.radius,
          autoContrast: props.autoContrast,
          transitionDuration: props.transitionDuration,
          orientation: props.orientation,
        },
        () =>
          h(ProgressSection, {
            value: props.value,
            color: props.color,
            striped: props.striped,
            animated: props.animated,
            'aria-label': attrs['aria-label'],
          }),
      )
  },
})

export const Progress = Object.assign(ProgressBase, {
  classes,
  Root: ProgressRoot,
  Section: ProgressSection,
  Label: ProgressLabel,
})
