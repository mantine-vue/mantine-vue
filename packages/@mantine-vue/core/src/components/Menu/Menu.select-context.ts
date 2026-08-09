import type { InjectionKey } from 'vue'

/** Shared shape of the checkbox and radio group contexts. */
export interface MenuSelectContext {
  /** Current value: an array for the checkbox group, a single value for the radio group. */
  value: any

  /** Replaces the value. */
  setValue: (value: any) => void
}

export const MenuCheckboxGroupKey: InjectionKey<MenuSelectContext> = Symbol('MenuCheckboxGroup')

export const MenuRadioGroupKey: InjectionKey<MenuSelectContext> = Symbol('MenuRadioGroup')
