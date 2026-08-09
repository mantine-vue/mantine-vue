import { withBoxProps } from '../../core'
import SkeletonComponent from './Skeleton.vue'

export const Skeleton = withBoxProps(SkeletonComponent)

export type { SkeletonOwnProps, SkeletonProps } from './Skeleton.types'
