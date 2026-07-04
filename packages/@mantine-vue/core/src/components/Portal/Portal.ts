import { defineComponent, h, onBeforeUnmount, onMounted, ref, Teleport, type PropType } from 'vue'

function createPortalNode(props: Record<string, any>) {
  const node = document.createElement('div')
  node.setAttribute('data-portal', 'true')

  if (typeof props.class === 'string') {
    node.classList.add(...props.class.split(' ').filter(Boolean))
  }

  if (typeof props.style === 'object') {
    Object.assign(node.style, props.style)
  }

  if (typeof props.id === 'string') {
    node.setAttribute('id', props.id)
  }

  return node
}

function getTargetNode({
  target,
  reuseTargetNode,
  props,
}: {
  target?: HTMLElement | string
  reuseTargetNode: boolean
  props: Record<string, any>
}) {
  if (target) {
    if (typeof target === 'string') {
      return document.querySelector<HTMLElement>(target) || createPortalNode(props)
    }

    return target
  }

  if (reuseTargetNode) {
    const existingNode = document.querySelector<HTMLElement>('[data-mantine-shared-portal-node]')

    if (existingNode) {
      return existingNode
    }

    const node = createPortalNode(props)
    node.setAttribute('data-mantine-shared-portal-node', 'true')
    document.body.appendChild(node)
    return node
  }

  return createPortalNode(props)
}

export const Portal = defineComponent({
  name: 'Portal',
  inheritAttrs: false,
  props: {
    target: { type: [String, Object] as PropType<HTMLElement | string>, default: undefined },
    reuseTargetNode: { type: Boolean, default: true },
  },
  setup(props, { attrs, slots }) {
    const mounted = ref(false)
    const node = ref<HTMLElement | null>(null)

    onMounted(() => {
      mounted.value = true
      node.value = getTargetNode({
        target: props.target,
        reuseTargetNode: props.reuseTargetNode,
        props: attrs,
      })

      if (!props.target && !props.reuseTargetNode && node.value) {
        document.body.appendChild(node.value)
      }
    })

    onBeforeUnmount(() => {
      if (!props.target && !props.reuseTargetNode && node.value?.parentNode) {
        node.value.parentNode.removeChild(node.value)
      }
    })

    return () => {
      if (!mounted.value || !node.value) {
        return null
      }

      return h(Teleport as any, { to: node.value }, slots.default?.())
    }
  },
})
