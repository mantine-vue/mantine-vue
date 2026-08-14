import { factory } from '../../core'
import SkeletonComponent, { varsResolver } from './Skeleton.vue'
import type { SkeletonFactory } from './Skeleton.types'
import classes from './Skeleton.module.css'

export const Skeleton = factory<SkeletonFactory>(SkeletonComponent, {
  classes,
  varsResolver,
})

export type {
  SkeletonCssVariables,
  SkeletonFactory,
  SkeletonOwnProps,
  SkeletonProps,
  SkeletonStylesNames,
} from './Skeleton.types'
