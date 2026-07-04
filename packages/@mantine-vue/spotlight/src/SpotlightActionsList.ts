import { defineComponent, h, onBeforeUnmount, onMounted, type PropType } from 'vue'
import { ScrollAreaAutosize, useProps } from '@mantine-vue/core'
import { useId } from '@mantine-vue/hooks'
import { useSpotlightContext } from './Spotlight.context'
import { spotlightActions } from './spotlight.store'
import classes from './Spotlight.module.css'

export type SpotlightActionsListStylesNames = 'actionsList' | 'actionsListInner'

export interface SpotlightActionsListProps {
  id?: string
  classNames?: Record<string, any>
  styles?: Record<string, any>
  [key: string]: any
}

export const SpotlightActionsList = defineComponent({
  name: 'SpotlightActionsList',
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function] as PropType<any>, default: undefined },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps<SpotlightActionsListProps>('SpotlightActionsList', null, rawProps as any)
    const ctx = useSpotlightContext()
    const generatedId = useId()
    const listId = props.id || `mantine-${generatedId.value.replace(/:/g, '')}`

    onMounted(() => spotlightActions.setListId(listId, ctx.store))
    onBeforeUnmount(() => spotlightActions.setListId('', ctx.store))

    return () =>
      h(
        ScrollAreaAutosize,
        {
          ...attrs,
          ...ctx.getStyles('actionsList', {
            className: attrs.class,
            style: attrs.style,
            classNames: props.classNames,
            styles: props.styles,
          }),
          type: 'scroll',
          scrollbarSize: 'var(--spotlight-actions-list-padding)',
          offsetScrollbars: 'y',
          id: listId,
        },
        () => slots.default?.(),
      )
  },
})

Object.assign(SpotlightActionsList, { classes })
