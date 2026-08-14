import { factory } from '../../core'
import SpaceComponent from './Space.vue'
import type { SpaceFactory } from './Space.types'
export const Space = factory<SpaceFactory>(SpaceComponent)
export type { SpaceOwnProps, SpaceProps, SpaceFactory } from './Space.types'
