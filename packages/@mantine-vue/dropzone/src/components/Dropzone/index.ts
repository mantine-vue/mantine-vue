import { withBoxProps } from '@mantine-vue/core'
import DropzoneComponent, { varsResolver } from './Dropzone.vue'
import { DropzoneAccept, DropzoneIdle, DropzoneReject } from '../DropzoneStatus'
import classes from '../../Dropzone.module.css'
export const Dropzone = Object.assign(withBoxProps(DropzoneComponent), {
  classes,
  varsResolver,
  Accept: DropzoneAccept,
  Idle: DropzoneIdle,
  Reject: DropzoneReject,
})
export type * from './Dropzone.types'
