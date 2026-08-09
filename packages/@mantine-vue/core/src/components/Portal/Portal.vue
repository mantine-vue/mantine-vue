<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
import type { PortalOwnProps, PortalSlots } from './Portal.types'

defineOptions({ name: 'Portal', inheritAttrs: false })

const props = withDefaults(defineProps<PortalOwnProps>(), {
  target: undefined,
  reuseTargetNode: true,
})
defineSlots<PortalSlots>()

const attrs = useAttrs()
const mounted = ref(false)
const node = ref<HTMLElement | null>(null)
let ownsNode = false

function createPortalNode() {
  const element = document.createElement('div')
  element.setAttribute('data-portal', 'true')

  if (typeof attrs.class === 'string') {
    element.classList.add(...attrs.class.split(' ').filter(Boolean))
  }

  if (typeof attrs.style === 'object') {
    Object.assign(element.style, attrs.style)
  }

  if (typeof attrs.id === 'string') {
    element.setAttribute('id', attrs.id)
  }

  return element
}

function removeOwnedNode() {
  if (ownsNode && node.value?.parentNode) {
    node.value.parentNode.removeChild(node.value)
  }

  ownsNode = false
}

function resolveTarget() {
  removeOwnedNode()

  if (props.target) {
    node.value =
      typeof props.target === 'string'
        ? document.querySelector<HTMLElement>(props.target) || createPortalNode()
        : props.target
    return
  }

  if (props.reuseTargetNode) {
    const existingNode = document.querySelector<HTMLElement>('[data-mantine-shared-portal-node]')

    if (existingNode) {
      node.value = existingNode
      return
    }

    const sharedNode = createPortalNode()
    sharedNode.setAttribute('data-mantine-shared-portal-node', 'true')
    document.body.appendChild(sharedNode)
    node.value = sharedNode
    return
  }

  const ownNode = createPortalNode()
  document.body.appendChild(ownNode)
  node.value = ownNode
  ownsNode = true
}

let stopWatching: (() => void) | undefined

onMounted(() => {
  mounted.value = true
  stopWatching = watch([() => props.target, () => props.reuseTargetNode], resolveTarget, {
    immediate: true,
  })
})

onBeforeUnmount(() => {
  stopWatching?.()
  removeOwnedNode()
})
</script>

<template>
  <Teleport v-if="mounted && node" :to="node">
    <slot />
  </Teleport>
</template>
