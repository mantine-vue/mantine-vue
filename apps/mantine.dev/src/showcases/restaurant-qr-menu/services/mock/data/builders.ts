import type { ModifierGroup, ModifierOption, Product, ProductVariant } from '../../../domain/types'
import { tx } from './restaurants'

export { tx }

export function option(
  id: string,
  en: string,
  ar: string,
  priceDelta = 0,
  extra: Partial<ModifierOption> = {},
): ModifierOption {
  return { id, name: tx(en, ar), priceDelta, ...extra }
}

export function variant(
  id: string,
  en: string,
  ar: string,
  price: number,
  extra: Partial<ProductVariant> = {},
): ProductVariant {
  return { id, name: tx(en, ar), price, ...extra }
}

export function group(
  id: string,
  name: [string, string],
  config: Pick<ModifierGroup, 'selection' | 'min' | 'max' | 'options'> & {
    description?: [string, string]
  },
): ModifierGroup {
  return {
    id,
    name: tx(...name),
    description: config.description ? tx(...config.description) : undefined,
    selection: config.selection,
    min: config.min,
    max: config.max,
    options: config.options,
  }
}

type ProductInput = Omit<
  Product,
  'badges' | 'dietary' | 'allergens' | 'available' | 'popularity' | 'addedAt'
> &
  Partial<
    Pick<Product, 'badges' | 'dietary' | 'allergens' | 'available' | 'popularity' | 'addedAt'>
  >

/** Fills sensible defaults so menu files only declare what is specific to a dish. */
export function product(input: ProductInput): Product {
  return {
    badges: [],
    dietary: [],
    allergens: [],
    available: true,
    popularity: 50,
    addedAt: '2024-01-01',
    ...input,
  }
}
