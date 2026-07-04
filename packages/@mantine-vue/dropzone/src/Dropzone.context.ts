import { createSafeContext } from '@mantine-vue/core'

export interface DropzoneContextValue {
  idle: boolean
  accept: boolean
  reject: boolean
}

export const [provideDropzoneContext, useDropzoneContext] = createSafeContext<DropzoneContextValue>(
  'Dropzone component was not found in tree',
)
