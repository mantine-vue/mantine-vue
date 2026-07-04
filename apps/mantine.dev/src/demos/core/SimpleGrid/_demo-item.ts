import { defineComponent, h } from 'vue'

const itemStyle = {
  padding: '8px',
  background: 'var(--mantine-color-blue-light)',
  borderRadius: 'var(--mantine-radius-sm)',
  textAlign: 'center' as const,
  fontWeight: 500,
}

export const GridItem = defineComponent({
  name: 'GridItem',
  setup(_props, { slots }) {
    return () => h('div', { style: itemStyle }, slots.default?.())
  },
})

export function makeItems(count: number) {
  return Array.from({ length: count }, (_, i) =>
    h(GridItem, { key: i }, { default: () => String(i + 1) }),
  )
}
