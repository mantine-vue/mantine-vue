import { withBoxProps } from '../../core'
import BreadcrumbsComponent, { varsResolver } from './Breadcrumbs.vue'
import classes from './Breadcrumbs.module.css'

export const Breadcrumbs = withBoxProps(BreadcrumbsComponent)
Object.assign(Breadcrumbs, { classes, varsResolver })

export type {
  BreadcrumbsCssVariables,
  BreadcrumbsOwnProps,
  BreadcrumbsProps,
  BreadcrumbsSlots,
  BreadcrumbsStylesNames,
} from './Breadcrumbs.types'
