import { defineComponent, h } from 'vue'
import { Group, Text } from '@mantine-vue/core'
import { Dropzone, IMAGE_MIME_TYPE, type DropzoneProps } from '@mantine-vue/dropzone'
import { PhImage, PhUploadSimple, PhX } from '@phosphor-icons/vue'

export const DropzoneDemoChildren = defineComponent({
  name: 'DropzoneDemoChildren',
  setup() {
    return () =>
      h(Group, { justify: 'center', gap: 'xl', mih: 220, style: { pointerEvents: 'none' } }, () => [
        h(Dropzone.Accept, null, () =>
          h(PhUploadSimple, { size: 52, color: 'var(--mantine-color-blue-6)' }),
        ),
        h(Dropzone.Reject, null, () => h(PhX, { size: 52, color: 'var(--mantine-color-red-6)' })),
        h(Dropzone.Idle, null, () =>
          h(PhImage, { size: 52, color: 'var(--mantine-color-dimmed)' }),
        ),
        h('div', null, [
          h(Text, { size: 'xl', inline: true }, () => 'Drag images here or click to select files'),
          h(
            Text,
            { size: 'sm', c: 'dimmed', inline: true, mt: 7 },
            () => 'Attach as many files as you like, each file should not exceed 5mb',
          ),
        ]),
      ])
  },
})

export const BaseDemo = defineComponent({
  name: 'DropzoneBaseDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        Dropzone,
        {
          onDrop: (files: any) => console.log('accepted files', files),
          onReject: (files: any) => console.log('rejected files', files),
          maxSize: 5 * 1024 ** 2,
          accept: IMAGE_MIME_TYPE,
          ...(attrs as Partial<DropzoneProps>),
        },
        () => h(DropzoneDemoChildren),
      )
  },
})
