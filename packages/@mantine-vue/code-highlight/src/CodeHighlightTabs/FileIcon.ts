import { defineComponent, h, type PropType, type VNodeChild } from 'vue'

export const FileIcon = defineComponent({
  name: 'FileIcon',
  inheritAttrs: false,
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
  setup(props, { attrs }) {
    return () => {
      if (props.fileIcon) {
        return h('span', attrs, props.fileIcon as any)
      }

      if (props.getFileIcon && props.fileName) {
        return h('span', attrs, props.getFileIcon(props.fileName) as any)
      }

      return null
    }
  },
})
