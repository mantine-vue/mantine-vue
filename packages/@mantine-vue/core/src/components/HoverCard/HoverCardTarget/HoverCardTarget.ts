import { cloneVNode, defineComponent, h, type VNode } from 'vue'
import { mergeRefs } from '@mantine-vue/hooks'
import { PopoverTarget } from '../../Popover'
import { useHoverCardContext } from '../HoverCard.context'

function one(slots: any): VNode {
  const children = slots.default?.().filter((child: VNode) => typeof child.type !== 'symbol') ?? []
  if (children.length !== 1)
    throw new Error(
      'HoverCard.Target component children should be a single element or component that accepts ref',
    )
  return children[0]
}
export const HoverCardTarget = defineComponent({
  name: 'HoverCardTarget',
  inheritAttrs: false,
  props: { refProp: { type: String, default: 'ref' }, eventPropsWrapperName: String },
  setup(props, { attrs, slots }) {
    const ctx = useHoverCardContext()
    const assignTargetRef = (el: any) => {
      ctx.assignTarget((el?.$el ?? el ?? null) as HTMLElement | null)
    }
    return () => {
      const child = one(slots)
      const events = { onMouseenter: ctx.openDropdown, onMouseleave: ctx.closeDropdown }
      const targetRef = mergeRefs(assignTargetRef, (child as any).ref)
      const cloned = cloneVNode(
        child,
        props.eventPropsWrapperName
          ? {
              ref: targetRef,
              [props.eventPropsWrapperName]: {
                ...(child.props as any)?.[props.eventPropsWrapperName],
                ...events,
              },
            }
          : { ref: targetRef, ...events },
        false,
      )
      return h(PopoverTarget, { ...attrs, refProp: props.refProp }, () => cloned)
    }
  },
})
export interface HoverCardTargetProps {
  refProp?: string
  eventPropsWrapperName?: string
  [key: string]: any
}
