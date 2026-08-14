import { factory } from '@mantine-vue/core'
import DropzoneComponent, { varsResolver } from './Dropzone.vue'
import type { DropzoneFactory } from './Dropzone.types'
import { DropzoneAccept, DropzoneIdle, DropzoneReject } from '../DropzoneStatus'
import classes from '../../Dropzone.module.css'
export const Dropzone = factory<DropzoneFactory>(DropzoneComponent, {
  classes,
  varsResolver,
  Accept: DropzoneAccept,
  Idle: DropzoneIdle,
  Reject: DropzoneReject,
})
export type * from './Dropzone.types'
