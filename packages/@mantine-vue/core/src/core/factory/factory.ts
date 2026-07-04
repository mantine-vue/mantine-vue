import { defineComponent, h, ref, type PropType } from 'vue'

export interface VueFactoryPayload<Props extends Record<string, any> = Record<string, any>> {
  name: string
  props?: Record<string, any>
  setup: (
    props: Props,
    ctx: { attrs: Record<string, unknown>; slots: any; emit: any; ref: any },
  ) => any
}

export function factory<Props extends Record<string, any>>(payload: VueFactoryPayload<Props>) {
  return defineComponent({
    name: payload.name,
    props: payload.props ?? {},
    setup(props, ctx) {
      const elementRef = ref<HTMLElement | null>(null)
      return () => payload.setup(props as Props, { ...ctx, ref: elementRef })
    },
  })
}

export interface FactoryBoxProps {
  component?: string
  class?: any
  style?: any
}

export const polymorphicProps = {
  component: { type: String as PropType<string>, default: undefined },
}

export function renderPolymorphic(
  component: string | undefined,
  props: Record<string, any>,
  children?: any,
) {
  return h(component || 'div', props, children)
}
