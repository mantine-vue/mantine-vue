import { factory } from '../../core'
import TitleComponent, { varsResolver } from './Title.vue'
import type { TitleFactory } from './Title.types'
import classes from './Title.module.css'

export const Title = factory<TitleFactory>(TitleComponent, { classes, varsResolver })
export type { TitleOwnProps, TitleProps, TitleFactory } from './Title.types'
