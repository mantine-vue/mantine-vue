import { defineComponent, h, type PropType } from 'vue'
import { ActionIcon, Tooltip, useProps } from '@mantine-vue/core'
import { useCodeHighlightContext } from '../CodeHighlight.context'

export interface CodeHighlightControlProps {
  tooltipLabel?: string
  classNames?: any
  styles?: any
  vars?: any
  [key: string]: any
}

export const CodeHighlightControl = defineComponent({
  name: 'CodeHighlightControl',
  inheritAttrs: false,
  props: {
    tooltipLabel: { type: String, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    component: { type: String, default: 'button' },
    onClick: { type: Function as PropType<(event: MouseEvent) => void>, default: undefined },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps<CodeHighlightControlProps>('CodeHighlightControl', null, rawProps as any)
    const ctx = useCodeHighlightContext()

    return () => {
      const tooltipStyles = ctx.getStyles('controlTooltip')
      const control = h(
        ActionIcon,
        {
          ...ctx.getStyles('control'),
          ...attrs,
          component: props.component,
          variant: 'none' as any,
          'data-code-color-scheme': ctx.codeColorScheme,
          onClick: props.onClick,
        },
        slots,
      )

      return props.tooltipLabel
        ? h(
            Tooltip,
            {
              label: props.tooltipLabel,
              fz: 'sm',
              position: 'bottom',
              classNames: { tooltip: tooltipStyles.class },
              styles: { tooltip: tooltipStyles.style },
              'data-code-color-scheme': ctx.codeColorScheme,
              transitionProps: { duration: 0 },
            },
            () => control,
          )
        : control
    }
  },
})
