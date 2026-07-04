import { defineComponent, provide, type InjectionKey } from 'vue'
export interface HoverCardGroupContextValue {
  withinGroup: boolean
  openDelay: number
  closeDelay: number
}
export const HoverCardGroupKey: InjectionKey<HoverCardGroupContextValue> = Symbol('HoverCardGroup')
export const HoverCardGroup = defineComponent({
  name: 'HoverCardGroup',
  props: { openDelay: { type: Number, default: 0 }, closeDelay: { type: Number, default: 0 } },
  setup(props, { slots }) {
    provide(HoverCardGroupKey, {
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
export interface HoverCardGroupProps {
  openDelay?: number
  closeDelay?: number
}
