import { defineComponent, h, ref, type PropType } from 'vue'
import { Input, useProps } from '@mantine-vue/core'
import { useSpotlightContext } from './Spotlight.context'
import { spotlightActions } from './spotlight.store'
import { mergeClassNames, mergeStyles } from './style-api'
import classes from './Spotlight.module.css'

export type SpotlightSearchStylesNames = 'input' | 'wrapper' | 'section' | 'bottomSection'

export interface SpotlightSearchProps {
  size?: string | number
  value?: string
  onChange?: (event: Event) => void
  onKeydown?: (event: KeyboardEvent) => void
  classNames?: Record<string, any>
  styles?: Record<string, any>
  vars?: Record<string, any>
  [key: string]: any
}

const defaultProps = {
  size: 'lg',
} satisfies Partial<SpotlightSearchProps>

export const SpotlightSearch = defineComponent({
  name: 'SpotlightSearch',
  inheritAttrs: false,
  props: {
    size: { type: [String, Number] as PropType<string | number>, default: undefined },
    value: { type: String, default: undefined },
    onChange: { type: Function as PropType<(event: Event) => void>, default: undefined },
    onKeydown: { type: Function as PropType<(event: KeyboardEvent) => void>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
  },
  setup(rawProps, { attrs }) {
    const props = useProps<SpotlightSearchProps>('SpotlightSearch', defaultProps, rawProps as any)
    const ctx = useSpotlightContext()
    const isComposing = ref(false)

    const handleKeydown = (event: KeyboardEvent) => {
      props.onKeydown?.(event)

      if (isComposing.value) {
        return
      }

      if (event.code === 'ArrowDown') {
        event.preventDefault()
        spotlightActions.selectNextAction(ctx.store)
      }

      if (event.code === 'ArrowUp') {
        event.preventDefault()
        spotlightActions.selectPreviousAction(ctx.store)
      }

      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault()
        spotlightActions.triggerSelectedAction(ctx.store)
      }
    }

    return () => {
      const inputStyles = ctx.getStyles('search')

      return h(Input, {
        ...attrs,
        size: props.size,
        value: props.value ?? ctx.query,
        classNames: mergeClassNames({ input: inputStyles.class }, props.classNames),
        styles: mergeStyles({ input: inputStyles.style }, props.styles),
        vars: props.vars,
        onInput: (event: Event) => {
          ctx.setQuery((event.currentTarget as HTMLInputElement).value)
          props.onChange?.(event)
        },
        onKeydown: handleKeydown,
        onCompositionstart: () => {
          isComposing.value = true
        },
        onCompositionend: () => {
          isComposing.value = false
        },
      })
    }
  },
})

Object.assign(SpotlightSearch, { classes })
