<script setup lang="ts">
import { useContextMenuSettings } from '../../context'
import type { ContextMenuOverlayEmits } from '../../types'
import '../../ContextMenuOverlay.css'

defineOptions({ name: 'ContextMenuOverlay' })
const props = defineProps<{ zIndex?: number }>()
const emit = defineEmits<ContextMenuOverlayEmits>()
const settings = useContextMenuSettings()

function click(event: MouseEvent) {
  event.preventDefault()
  emit('hide')
}

function contextmenu(event: MouseEvent) {
  event.preventDefault()
  if (!settings.value.repositionOnRepeat) {
    emit('hide')
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
    // The target may disappear while the event is dispatched.
  }
}
</script>

<template>
  <div
    class="mantine-contextmenu-overlay"
    :style="{ zIndex: props.zIndex }"
    @click="click"
    @contextmenu="contextmenu"
  >
    <slot />
  </div>
</template>
