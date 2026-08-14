import { factory } from '../../core'
import ContainerComponent, { varsResolver } from './Container.vue'
import type { ContainerFactory } from './Container.types'
import classes from './Container.module.css'

export const Container = factory<ContainerFactory>(ContainerComponent, {
  classes,
  varsResolver,
})

export type { ContainerOwnProps, ContainerProps, ContainerFactory } from './Container.types'
