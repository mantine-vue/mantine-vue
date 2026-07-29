import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'

export interface FileIconSlots {
  fileIcon?: () => VNodeChild
  getFileIcon?: (input: { fileName: string }) => VNodeChild
}

export const FileIcon = defineComponent({
  name: 'FileIcon',
  inheritAttrs: false,
  slots: Object as SlotsType<FileIconSlots>,
  props: {
    fileName: { type: String, default: undefined },
    getFileIcon: {
      type: Function as PropType<(fileName: string) => VNodeChild>,
      default: undefined,
    },
    fileIcon: {
      type: [String, Number, Object, Function, Array] as PropType<VNodeChild>,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    return () => {
      if (props.fileIcon) {
        return h('span', attrs, props.fileIcon as any)
      }

      if (props.getFileIcon && props.fileName) {
        return h('span', attrs, props.getFileIcon(props.fileName) as any)
      }

      if (slots.fileIcon) {
        return h('span', attrs, slots.fileIcon() as any)
      }

      if (slots.getFileIcon && props.fileName) {
        return h('span', attrs, slots.getFileIcon({ fileName: props.fileName }) as any)
      }

      return null
    }
  },
})
