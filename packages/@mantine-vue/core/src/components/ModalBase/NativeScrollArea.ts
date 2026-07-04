import { defineComponent } from 'vue'
export const NativeScrollArea = defineComponent({
  name: 'NativeScrollArea',
  setup(_, { slots }) {
    return () => slots.default?.()
  },
})
