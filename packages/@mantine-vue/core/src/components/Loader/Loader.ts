import { factory } from '../../core'
import type { LoaderFactory } from './Loader.types'
import LoaderComponent, { defaultLoaders, varsResolver } from './Loader.vue'
import classes from './Loader.module.css'
export { defaultLoaders }
export const Loader = factory<LoaderFactory>(LoaderComponent, {
  classes,
  varsResolver,
  defaultLoaders,
})
export type {
  LoaderCssVariables,
  LoaderFactory,
  LoaderOwnProps,
  LoaderProps,
  LoaderSlots,
  LoaderStylesNames,
} from './Loader.types'
