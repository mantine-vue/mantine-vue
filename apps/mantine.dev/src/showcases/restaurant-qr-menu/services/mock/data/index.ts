import type { Menu, Promotion, Restaurant } from '../../../domain/types'
import { brewAndBloomMenu } from './menus/brew-and-bloom'
import { lunaTrattoriaMenu } from './menus/luna-trattoria'
import { saffronHouseMenu } from './menus/saffron-house'
import { MOCK_PROMOTIONS } from './promotions'
import { MOCK_RESTAURANTS } from './restaurants'

/** The complete mock dataset. Pass a custom one to `createMockServices` to test edge cases. */
export interface MockDataset {
  restaurants: Restaurant[]
  menus: Record<string, Menu>
  promotions: Record<string, Promotion[]>
}

export const DEFAULT_MOCK_DATASET: MockDataset = {
  restaurants: MOCK_RESTAURANTS,
  menus: {
    [saffronHouseMenu.restaurantId]: saffronHouseMenu,
    [brewAndBloomMenu.restaurantId]: brewAndBloomMenu,
    [lunaTrattoriaMenu.restaurantId]: lunaTrattoriaMenu,
  },
  promotions: MOCK_PROMOTIONS,
}
