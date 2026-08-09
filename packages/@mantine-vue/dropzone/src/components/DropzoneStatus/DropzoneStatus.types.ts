import type { VNodeChild } from 'vue'
export interface DropzoneStatusProps {
  /** Content displayed when the corresponding dropzone status is active. */
  children?: VNodeChild
}
export type DropzoneAcceptProps = DropzoneStatusProps
export type DropzoneRejectProps = DropzoneStatusProps
export type DropzoneIdleProps = DropzoneStatusProps
