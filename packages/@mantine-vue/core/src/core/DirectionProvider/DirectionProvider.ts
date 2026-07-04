import {
  defineComponent,
  inject,
  provide,
  ref,
  type InjectionKey,
  type PropType,
  type Ref,
} from 'vue'

export type Direction = 'ltr' | 'rtl'

export interface DirectionContextValue {
  dir: Ref<Direction>
  setDirection: (dir: Direction) => void
  toggleDirection: () => void
}

export const DirectionContextKey = Symbol('DirectionContext') as InjectionKey<DirectionContextValue>

export function useDirection() {
  return inject(DirectionContextKey, {
    dir: ref<Direction>('ltr'),
    setDirection: () => {},
    toggleDirection: () => {},
  })
}

export const DirectionProvider = defineComponent({
  name: 'DirectionProvider',
  props: {
    initialDirection: { type: String as PropType<Direction>, default: 'ltr' },
  },
  setup(props, { slots }) {
    const dir = ref(props.initialDirection)
    const setDirection = (value: Direction) => {
      dir.value = value
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('dir', value)
      }
    }

    provide(DirectionContextKey, {
      dir,
      setDirection,
      toggleDirection: () => setDirection(dir.value === 'ltr' ? 'rtl' : 'ltr'),
    })

    return () => slots.default?.()
  },
})
