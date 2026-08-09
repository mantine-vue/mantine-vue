import { withBoxProps } from '../../core'
import ContainerComponent from './Container.vue'

export const Container = withBoxProps(ContainerComponent)

export type { ContainerOwnProps, ContainerProps } from './Container.types'
