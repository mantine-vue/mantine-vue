import { h, type VNodeChild } from 'vue'
import type { Primitive } from '../../core'
import { CheckIcon } from '../Checkbox'
import { ComboboxGroup, ComboboxOption, isOptionsGroup } from '../Combobox'
import type { ComboboxLikeRenderOptionInput, ComboboxParsedItem } from '../Combobox'
import comboboxClasses from '../Combobox/Combobox.module.css'

/** Single mode compares by value, multiple mode by membership. */
export function isValueChecked(
  value: Primitive | Primitive[] | undefined | null,
  optionValue: Primitive,
): boolean {
  return Array.isArray(value) ? value.includes(optionValue) : value === optionValue
}

export interface RenderOptionOptions {
  /** Selected value, or values in multiple mode. */
  value: Primitive | Primitive[] | null | undefined

  /** If set, a check icon is rendered next to the selected options. */
  withCheckIcon: boolean | undefined

  /** If set, unselected options reserve the check icon's space so all labels line up. */
  withAlignedLabels: boolean | undefined

  /** Side of the option the check icon is rendered on. */
  checkIconPosition: 'left' | 'right' | undefined

  /** If set, all Mantine classes are removed. */
  unstyled: boolean | undefined

  /** Custom markup for the option. */
  renderOption?: (input: ComboboxLikeRenderOptionInput<any>) => VNodeChild
}

/**
 * Renders one parsed item of the searchable dropdown, recursing into groups.
 *
 * Kept as a plain function rather than a component: it walks an arbitrarily nested
 * structure and has to be able to return either a group or an option. This mirrors
 * `OptionsDropdown`'s `renderItem`, but is driven by an explicit options object rather
 * than by props, because the searchable dropdown builds its options itself.
 */
export function renderPopoverOption(
  data: ComboboxParsedItem<Primitive>,
  opts: RenderOptionOptions,
  index: number,
): VNodeChild {
  if (isOptionsGroup(data)) {
    return h(ComboboxGroup, { label: data.group, key: `group-${data.group ?? index}` }, () =>
      data.items.map((item, i) => renderPopoverOption(item, opts, i)),
    )
  }

  const checked = isValueChecked(opts.value, data.value)

  // `withAlignedLabels` keeps the icon's space so the labels of unchecked options do not
  // shift relative to the checked ones.
  const check =
    opts.withCheckIcon &&
    (checked
      ? h(CheckIcon, { class: comboboxClasses.optionsDropdownCheckIcon })
      : opts.withAlignedLabels
        ? h('div', { class: comboboxClasses.optionsDropdownCheckPlaceholder })
        : null)

  const content =
    typeof opts.renderOption === 'function'
      ? opts.renderOption({ option: data, checked })
      : [
          opts.checkIconPosition === 'left' && check,
          h('span', data.label),
          opts.checkIconPosition === 'right' && check,
        ]

  return h(
    ComboboxOption,
    {
      value: data.value,
      disabled: data.disabled,
      active: checked,
      key: String(data.value),
      class: !opts.unstyled ? comboboxClasses.optionsDropdownOption : undefined,
      'data-reverse': opts.checkIconPosition === 'right' || undefined,
      'data-checked': checked || undefined,
      'aria-selected': checked,
    },
    () => content,
  )
}
