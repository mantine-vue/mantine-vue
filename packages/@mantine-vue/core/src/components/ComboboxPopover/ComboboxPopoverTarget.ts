import { cloneVNode, defineComponent, h, type SlotsType, type VNode, type VNodeChild } from 'vue'
import { mergeRefs } from '@mantine-vue/hooks'
import { useComboboxContext } from '../Combobox/Combobox.context'
import { useComboboxTargetProps } from '../Combobox/use-combobox-target-props/use-combobox-target-props'
import { PopoverTarget } from '../Popover'

export interface ComboboxPopoverTargetProps {
  /** Key of the prop that is used to access element ref @default 'ref' */
  refProp?: string
  [key: string]: any
}

export interface ComboboxPopoverTargetSlots {
  default?: () => VNodeChild
}

function childrenOne(slots: any): VNode {
  const children = slots.default?.().filter((child: VNode) => typeof child.type !== 'symbol') ?? []
  if (children.length !== 1) {
    throw new Error(
      'ComboboxPopover.Target component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported',
    )
  }
  return children[0]
}

export const ComboboxPopoverTarget = defineComponent({
  name: 'ComboboxPopoverTarget',
  inheritAttrs: false,
  slots: Object as SlotsType<ComboboxPopoverTargetSlots>,
  props: {
    refProp: { type: String, default: 'ref' },
  },
  setup(props, { attrs, slots }) {
    const ctx = useComboboxContext()
    const targetProps = useComboboxTargetProps({
      targetType: 'button',
      withAriaAttributes: true,
      withKeyboardNavigation: true,
      withExpandedAttribute: true,
      autoComplete: 'off',
      onClick: (event: MouseEvent) => {
        ctx.store.toggleDropdown()
        ;(attrs as any).onClick?.(event)
      },
      onKeydown: (attrs as any).onKeydown,
    })

    return () => {
      const vnode = childrenOne(slots)
      const cloned = cloneVNode(
        vnode,
        {
          ...attrs,
          ...targetProps,
          [props.refProp]: mergeRefs(
            (node: any) => {
              const root = node?.$el ?? node
              ctx.store.targetRef.value = root?.matches?.('input,button,[tabindex]')
                ? root
                : (root?.querySelector?.('input,button,[tabindex]') ?? root)
            },
            (vnode as any).ref,
          ),
        },
        true,
      )
      return h(PopoverTarget, { refProp: props.refProp }, () => cloned)
    }
  },
})
