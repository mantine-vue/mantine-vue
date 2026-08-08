import { withBoxProps } from '../../core'
import BackgroundImageComponent from './BackgroundImage.vue'

export const BackgroundImage = withBoxProps(BackgroundImageComponent)

export type { BackgroundImageOwnProps, BackgroundImageProps } from './BackgroundImage.types'
