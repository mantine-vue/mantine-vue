import { factory } from '../../core'
import type { BreadcrumbsFactory } from './Breadcrumbs.types'
import BreadcrumbsComponent, { varsResolver } from './Breadcrumbs.vue'
import classes from './Breadcrumbs.module.css'

export const Breadcrumbs = factory<BreadcrumbsFactory>(BreadcrumbsComponent, {
  classes,
  varsResolver,
})

export type {
  BreadcrumbsCssVariables,
  BreadcrumbsFactory,
  BreadcrumbsOwnProps,
  BreadcrumbsProps,
  BreadcrumbsSlots,
  BreadcrumbsStylesNames,
} from './Breadcrumbs.types'
