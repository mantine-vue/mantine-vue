import { defineComponent, h, type PropType } from 'vue'
import { useContextMenuSettings } from './context'
import './ContextMenuOverlay.css'

export const ContextMenuOverlay = defineComponent({
  name: 'ContextMenuOverlay',
  props: {
    zIndex: { type: Number, default: undefined },
    onHide: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const settings = useContextMenuSettings()

    const handleClick = (event: MouseEvent) => {
      event.preventDefault()
      props.onHide()
    }

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault()

      if (!settings.value.repositionOnRepeat) {
        props.onHide()
        return
      }

      try {
        document.elementsFromPoint(event.clientX, event.clientY)[1]?.dispatchEvent(
          new MouseEvent('contextmenu', {
            bubbles: true,
            clientX: event.clientX,
            clientY: event.clientY,
          }),
        )
      } catch {
        // Ignore dispatch errors from elements that disappear during the event.
      }
    }

    return () =>
      h(
        'div',
        {
          class: 'mantine-contextmenu-overlay',
          style: { zIndex: props.zIndex },
          onClick: handleClick,
          onContextmenu: handleContextMenu,
        },
        slots.default?.(),
      )
  },
})
