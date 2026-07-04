import { cloneVNode, defineComponent, h, isVNode, type VNodeChild } from 'vue'
import { useDropzoneContext, type DropzoneContextValue } from './Dropzone.context'

function upperFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function createDropzoneStatus(status: keyof DropzoneContextValue) {
  return defineComponent({
    name: `Dropzone${upperFirst(status)}`,
    setup(_, { slots, attrs }) {
      const ctx = useDropzoneContext()

      return () => {
        if (!ctx[status]) return null

        const children = slots.default?.()
        const child: VNodeChild = children && children.length === 1 ? children[0] : children

        if (isVNode(child) && !Array.isArray(child)) {
          return cloneVNode(child, attrs)
        }

        return h('span', attrs, children as any)
      }
    },
  })
}

export const DropzoneAccept = createDropzoneStatus('accept')
export const DropzoneReject = createDropzoneStatus('reject')
export const DropzoneIdle = createDropzoneStatus('idle')

export interface DropzoneStatusProps {
  children?: VNodeChild
}

export type DropzoneAcceptProps = DropzoneStatusProps
export type DropzoneRejectProps = DropzoneStatusProps
export type DropzoneIdleProps = DropzoneStatusProps
