import { cloneVNode, defineComponent, h, type PropType } from 'vue'
import { mergeRefs } from '@mantine-vue/hooks'
import { PopoverTarget } from '../Popover'
import { useComboboxContext } from './Combobox.context'
import { useComboboxTargetProps } from './use-combobox-target-props/use-combobox-target-props'
import { childrenOne } from './combobox-utils'

/**
 * Builds `Combobox.Target` and `Combobox.EventsTarget`.
 *
 * Deliberately a factory rather than two near-identical SFCs: the pair differs only in
 * whether the cloned child is additionally wrapped in a `Popover.Target`, which is what
 * separates "the element the dropdown is anchored to" from "an element that only
 * receives the combobox events". The same reasoning applies to
 * `create-app-shell-component` and the modal and drawer compound factories.
 */
export function createComboboxTarget(name: string, withPopover: boolean) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      refProp: { type: String, default: 'ref' },
      withKeyboardNavigation: { type: Boolean, default: true },
      withAriaAttributes: { type: Boolean, default: true },
      withExpandedAttribute: Boolean,
      targetType: { type: String as PropType<'button' | 'input'>, default: 'input' },
      autoComplete: { type: String, default: 'off' },
    },
    setup(props, { attrs, slots }) {
      const ctx = useComboboxContext()
      const child = () => childrenOne(slots, name)
      const targetProps = useComboboxTargetProps({
        targetType: props.targetType,
        withAriaAttributes: props.withAriaAttributes,
        withKeyboardNavigation: props.withKeyboardNavigation,
        withExpandedAttribute: props.withExpandedAttribute,
        autoComplete: props.autoComplete,
      })

      return () => {
        const vnode = child()
        const cloned = cloneVNode(
          vnode,
          {
            ...attrs,
            ...targetProps,
            [props.refProp]: mergeRefs(
              (node: any) => {
                // The child may be a wrapper such as `InputBase`, so the focusable
                // element inside it is what the store has to steer.
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

        return withPopover ? h(PopoverTarget, { refProp: props.refProp }, () => cloned) : cloned
      }
    },
  })
}
