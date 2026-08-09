import { defineComponent, provide, ref, type InjectionKey, type PropType } from 'vue'
import type { MenuSelectContext } from './Menu.select-context'

/**
 * Builds `Menu.CheckboxGroup` and `Menu.RadioGroup`.
 *
 * Deliberately a factory rather than two near-identical SFCs: the pair differs only in
 * the injection key and in whether the uncontrolled default is an empty array or
 * `undefined`. The same reasoning applies to the other compound-part factories in this
 * package.
 */
export function createMenuSelectGroup(key: InjectionKey<MenuSelectContext>, multiple: boolean) {
  return defineComponent({
    inheritAttrs: false,
    props: {
      modelValue: { type: null as unknown as PropType<any>, default: undefined },
      defaultValue: {
        type: null as unknown as PropType<any>,
        default: multiple ? () => [] : undefined,
      },
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { slots, emit }) {
      const local = ref(props.defaultValue)
      const current = () => props.modelValue ?? local.value

      const setValue = (value: any) => {
        if (props.modelValue === undefined) {
          local.value = value
        }

        emit('update:modelValue', value)
        emit('change', value)
      }

      provide(key, {
        get value() {
          return current()
        },
        setValue,
      })

      // The group is state only: it renders its children untouched.
      return () => slots.default?.()
    },
  })
}
