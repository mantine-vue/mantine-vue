import { withBoxProps } from '../../core'
import LoaderComponent, { defaultLoaders, varsResolver } from './Loader.vue'
import classes from './Loader.module.css'
export { defaultLoaders }
export const Loader = withBoxProps(LoaderComponent)
Object.assign(Loader, { classes, varsResolver, defaultLoaders })
export type {
  LoaderCssVariables,
  LoaderOwnProps,
  LoaderProps,
  LoaderSlots,
  LoaderStylesNames,
} from './Loader.types'
