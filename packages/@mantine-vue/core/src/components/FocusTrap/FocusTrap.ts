import { cloneVNode, defineComponent, h, type PropType, type VNode } from 'vue'
import { mergeRefs, useFocusTrap, type VueRefTarget } from '@mantine-vue/hooks'
import { VisuallyHidden } from '../VisuallyHidden'

export interface FocusTrapProps {
  active?: boolean
  refProp?: string
  innerRef?: VueRefTarget<any>
}

function isSingleVNode(children: VNode[]) {
  return children.length === 1 && typeof children[0].type !== 'symbol'
}

export const FocusTrapInitialFocus = defineComponent({
  name: 'FocusTrapInitialFocus',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h(VisuallyHidden, { ...attrs, tabindex: -1, 'data-autofocus': '' })
  },
})

const FocusTrapBase = defineComponent({
  name: 'FocusTrap',
  props: {
    active: { type: Boolean, default: true },
    refProp: { type: String, default: 'ref' },
    innerRef: { type: [Object, Function] as PropType<VueRefTarget<any>>, default: undefined },
  },
  setup(props, { slots }) {
    const focusTrapRef = useFocusTrap(() => props.active)

    return () => {
      const children = slots.default?.() ?? []

      if (!isSingleVNode(children)) {
        return children
      }

      const child = children[0]
      const existingRef = (child as any).ref as VueRefTarget<any>
      const ref = mergeRefs(focusTrapRef, props.innerRef, existingRef)

      return cloneVNode(child, { [props.refProp]: ref }, true)
    }
  },
})

export const FocusTrap = Object.assign(FocusTrapBase, {
  InitialFocus: FocusTrapInitialFocus,
})
