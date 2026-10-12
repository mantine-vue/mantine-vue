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
/**
 * Kept as a render function deliberately.
 *
 * `HoverCard.Target` injects its hover listeners and a merged ref into whatever single
 * element the consumer passes as children, using `cloneVNode`. A template cannot clone
 * and re-prop an arbitrary child VNode, so this is one of the components the migration
 * leaves as-is – the same reason `FocusTrap` and `Portal` keep theirs.
 */
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
      const childProps = child.props as any
      const events = {
        onMouseenter: ctx.events.hover ? ctx.openDropdown : undefined,
        onMouseleave: ctx.events.hover ? ctx.closeDropdown : undefined,
        onFocus: ctx.events.focus
          ? (event: FocusEvent) => {
              if ((event.currentTarget as HTMLElement).matches(':focus-visible')) {
                ctx.openDropdown()
              }
            }
          : undefined,
        onBlur: ctx.events.focus ? ctx.closeImmediately : undefined,
        onTouchstart:
          ctx.events.hover && ctx.events.touch
            ? () => (ctx.opened ? ctx.closeImmediately() : ctx.openDropdown())
            : undefined,
        onKeydown: (event: KeyboardEvent) => {
          if (event.key === 'Escape' && ctx.opened) {
            ctx.dismiss()
          }
        },
      }
      const targetRef = mergeRefs(assignTargetRef, (child as any).ref)
      const accessibleProps = !ctx.withRoles
        ? undefined
        : ctx.role === 'tooltip'
          ? {
              'aria-describedby':
                [childProps?.['aria-describedby'], ctx.opened ? ctx.dropdownId : undefined]
                  .filter(Boolean)
                  .join(' ') || undefined,
            }
          : {
              'aria-haspopup': 'dialog',
              'aria-expanded': ctx.opened,
              'aria-controls': ctx.dropdownId,
            }
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
          : { ref: targetRef, ...events, ...accessibleProps },
        true,
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
