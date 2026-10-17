import type { ModifierGroup, Product, ProductSelection, ProductVariant } from './types'

export type ModifierErrorCode = 'required' | 'min' | 'max' | 'unavailable' | 'unknown-option'

export interface ModifierGroupError {
  groupId: string
  code: ModifierErrorCode
  /** Expected bound for `min` / `max` errors. */
  limit?: number
}

export interface SelectionValidationResult {
  valid: boolean
  variantError?: 'required' | 'unavailable'
  groupErrors: ModifierGroupError[]
}

export function isGroupRequired(group: ModifierGroup) {
  return group.min > 0
}

export function getDefaultVariant(product: Product): ProductVariant | undefined {
  if (!product.variants?.length) {
    return undefined
  }

  return product.variants.find((variant) => variant.available !== false) ?? product.variants[0]
}

/** Builds the initial selection shown when a product sheet opens. */
export function createDefaultSelection(product: Product): ProductSelection {
  const modifiers: Record<string, string[]> = {}

  for (const group of product.modifierGroups ?? []) {
    const defaults = group.options
      .filter((option) => option.selectedByDefault && option.available !== false)
      .map((option) => option.id)
      .slice(0, group.max)

    modifiers[group.id] =
      group.selection === 'single' && defaults.length > 1 ? defaults.slice(0, 1) : defaults
  }

  return { variantId: getDefaultVariant(product)?.id, modifiers }
}

/** Returns a copy of the selection with the option toggled while honouring the group rules. */
export function toggleModifierOption(
  selection: ProductSelection,
  group: ModifierGroup,
  optionId: string,
): ProductSelection {
  const current = selection.modifiers[group.id] ?? []
  let next: string[]

  if (group.selection === 'single') {
    next = current.includes(optionId) && group.min === 0 ? [] : [optionId]
  } else if (current.includes(optionId)) {
    next = current.filter((id) => id !== optionId)
  } else if (current.length >= group.max) {
    next = current
  } else {
    next = [...current, optionId]
  }

  return { ...selection, modifiers: { ...selection.modifiers, [group.id]: next } }
}

/** `true` when no more options can be added to a multi-select group. */
export function isGroupAtMax(selection: ProductSelection, group: ModifierGroup) {
  return group.selection === 'multiple' && (selection.modifiers[group.id]?.length ?? 0) >= group.max
}

export function validateGroup(
  group: ModifierGroup,
  selectedIds: string[],
): ModifierGroupError | undefined {
  for (const id of selectedIds) {
    const option = group.options.find((item) => item.id === id)
    if (!option) {
      return { groupId: group.id, code: 'unknown-option' }
    }
    if (option.available === false) {
      return { groupId: group.id, code: 'unavailable' }
    }
  }

  if (selectedIds.length === 0 && group.min > 0) {
    return { groupId: group.id, code: 'required', limit: group.min }
  }

  if (selectedIds.length < group.min) {
    return { groupId: group.id, code: 'min', limit: group.min }
  }

  if (selectedIds.length > group.max) {
    return { groupId: group.id, code: 'max', limit: group.max }
  }

  return undefined
}

/** Validates a full product selection: variant + every modifier group. */
export function validateSelection(
  product: Product,
  selection: ProductSelection,
): SelectionValidationResult {
  let variantError: SelectionValidationResult['variantError']

  if (product.variants?.length) {
    const variant = product.variants.find((item) => item.id === selection.variantId)
    if (!variant) {
      variantError = 'required'
    } else if (variant.available === false) {
      variantError = 'unavailable'
    }
  }

  const groupErrors = (product.modifierGroups ?? [])
    .map((group) => validateGroup(group, selection.modifiers[group.id] ?? []))
    .filter((error): error is ModifierGroupError => Boolean(error))

  return { valid: !variantError && groupErrors.length === 0, variantError, groupErrors }
}

/** Products without variants or required groups can be added straight from the menu. */
export function canQuickAdd(product: Product) {
  return (
    product.available &&
    !product.variants?.length &&
    !(product.modifierGroups ?? []).some((group) => isGroupRequired(group))
  )
}

/** Normalises a selection so equal choices always produce the same cart line id. */
export function normalizeSelection(
  product: Product,
  selection: ProductSelection,
): ProductSelection {
  const modifiers: Record<string, string[]> = {}

  for (const group of product.modifierGroups ?? []) {
    const selected = selection.modifiers[group.id] ?? []
    if (selected.length > 0) {
      const order = group.options.map((option) => option.id)
      modifiers[group.id] = [...selected].sort((a, b) => order.indexOf(a) - order.indexOf(b))
    }
  }

  return product.variants?.length ? { variantId: selection.variantId, modifiers } : { modifiers }
}
