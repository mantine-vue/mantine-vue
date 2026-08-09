import { withBoxProps } from '../../core'
import TitleComponent, { varsResolver } from './Title.vue'
import classes from './Title.module.css'

export const Title = withBoxProps(TitleComponent)
Object.assign(Title, { classes, varsResolver })
export type { TitleOwnProps, TitleProps } from './Title.types'
