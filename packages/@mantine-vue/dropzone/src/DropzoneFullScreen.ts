import { defineComponent, h, onUnmounted, ref, watch, type PropType } from 'vue'
import {
  getDefaultZIndex,
  OptionalPortal,
  useProps,
  useStyles,
  withBoxProps,
} from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import { Dropzone, type DropzoneProps, type DropzoneStylesNames } from './Dropzone'
import classes from './Dropzone.module.css'

export type DropzoneFullScreenStylesNames = DropzoneStylesNames | 'fullScreen'

export interface DropzoneFullScreenProps extends Omit<
  DropzoneProps,
  'variant' | 'classNames' | 'styles' | 'vars'
> {
  /** Determines whether user can drop files to browser window @default true */
  active?: boolean
  /** Z-index value @default 9999 (theme "max" z-index) */
  zIndex?: string | number
  /** Determines whether component should be rendered within `Portal` @default true */
  withinPortal?: boolean
  /** Props to pass down to the portal when withinPortal is `true` */
  portalProps?: Record<string, any>
  classNames?: any
  styles?: any
}

const defaultProps: Record<string, any> = {
  maxSize: Infinity,
  activateOnDrag: true,
  dragEventsBubbling: true,
  activateOnKeyboard: true,
  active: true,
  zIndex: getDefaultZIndex('max'),
  withinPortal: true,
}

const DropzoneFullScreenBaseComponent = defineComponent({
  name: 'DropzoneFullScreen',
  inheritAttrs: false,
  props: {
    active: { type: Boolean, default: undefined },
    onDrop: { type: Function as PropType<(files: any[]) => void>, required: true },
    onReject: { type: Function as PropType<(fileRejections: any[]) => void>, default: undefined },
    zIndex: { type: [String, Number], default: undefined },
    withinPortal: { type: Boolean, default: undefined },
    portalProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('DropzoneFullScreen', defaultProps, rawProps as any)

    const getStyles = useStyles({
      name: 'DropzoneFullScreen',
      classes,
      props,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      rootSelector: 'fullScreen',
    })

    const counter = ref(0)
    const [visible, { open, close }] = useDisclosure(false)

    const handleDragEnter = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes('Files')) {
        counter.value += 1
        open()
      }
    }
    const handleDragLeave = () => {
      counter.value -= 1
    }

    watch(counter, (value) => {
      if (value === 0) close()
    })

    let attached = false
    const attach = () => {
      if (attached) return
      document.addEventListener('dragenter', handleDragEnter, false)
      document.addEventListener('dragleave', handleDragLeave, false)
      attached = true
    }
    const detach = () => {
      if (!attached) return
      document.removeEventListener('dragenter', handleDragEnter, false)
      document.removeEventListener('dragleave', handleDragLeave, false)
      attached = false
    }

    watch(
      () => props.active,
      (active) => {
        detach()
        if (active) attach()
      },
      { immediate: true },
    )

    onUnmounted(detach)

    return () =>
      h(OptionalPortal, { ...props.portalProps, withinPortal: props.withinPortal }, () =>
        h(
          'div',
          {
            ...getStyles('fullScreen', {
              style: {
                opacity: visible.value ? 1 : 0,
                pointerEvents: visible.value ? 'all' : 'none',
                zIndex: props.zIndex,
              },
            }),
          },
          [
            h(
              Dropzone,
              {
                activateOnClick: false,
                ...attrs,
                classNames: props.classNames,
                styles: props.styles,
                unstyled: props.unstyled,
                class: classes.dropzone,
                onDrop: (files: any) => {
                  props.onDrop(files)
                  close()
                  counter.value = 0
                },
                onReject: (fileRejections: any) => {
                  props.onReject?.(fileRejections)
                  close()
                  counter.value = 0
                },
              },
              slots,
            ),
          ],
        ),
      )
  },
})

export const DropzoneFullScreen = withBoxProps(DropzoneFullScreenBaseComponent)
