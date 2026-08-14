import { factory } from '@mantine-vue/core'
import DropzoneFullScreenComponent from './DropzoneFullScreen.vue'
import type { DropzoneFullScreenFactory } from './DropzoneFullScreen.types'
import classes from '../../Dropzone.module.css'
export const DropzoneFullScreen = factory<DropzoneFullScreenFactory>(DropzoneFullScreenComponent, {
  classes,
})
export type * from './DropzoneFullScreen.types'
