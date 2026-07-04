import { defineComponent, provide, type InjectionKey } from 'vue'

export interface TooltipGroupContextValue {
  withinGroup: boolean
  openDelay: number
  closeDelay: number
}
export const TooltipGroupKey: InjectionKey<TooltipGroupContextValue> = Symbol('TooltipGroup')
export const TooltipGroup = defineComponent({
  name: 'TooltipGroup',
  props: { openDelay: { type: Number, default: 0 }, closeDelay: { type: Number, default: 0 } },
  setup(props, { slots }) {
    provide(TooltipGroupKey, {
      withinGroup: true,
      get openDelay() {
        return props.openDelay
      },
      get closeDelay() {
        return props.closeDelay
      },
    })
    return () => slots.default?.()
  },
})
export interface TooltipGroupProps {
  openDelay?: number
  closeDelay?: number
}
