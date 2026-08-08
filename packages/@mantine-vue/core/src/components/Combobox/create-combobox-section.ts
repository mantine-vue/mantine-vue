import { defineComponent, h } from 'vue'
import { Box } from '../../core'
import { useComboboxContext } from './Combobox.context'

/**
 * Builds `Combobox.Empty`, `Combobox.Header` and `Combobox.Footer`.
 *
 * Deliberately a factory rather than three identical SFCs: each is a `Box` that reads
 * one Styles API selector and renders its children, differing only in the selector name.
 */
export function createComboboxSection(name: string, selector: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      const ctx = useComboboxContext()

      return () =>
        h(
          Box,
          { ...attrs, ...ctx.getStyles(selector, { className: attrs.class, style: attrs.style }) },
          slots,
        )
    },
  })
}
