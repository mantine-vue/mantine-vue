<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { ActionIcon, Tooltip, UnstyledButton } from '@mantine-vue/core'
import { useFullscreenElement } from '@mantine-vue/hooks'
import DiagramIcon from '../../icons/DiagramIcon.vue'
import { commandLabel } from '../../vue/command-ui'
import { useDiagramViewport } from '../../vue/composables'
import { useDiagramContext } from '../../vue/context'
import { useFullscreenPortal } from '../../vue/fullscreen'
import type { DiagramPanelPosition } from '../../vue/types'
import DiagramPanel from '../DiagramPanel/DiagramPanel.vue'

defineOptions({ name: 'DiagramControls' })

const props = withDefaults(
  defineProps<{
    /** Position over the canvas, `'static'` renders the controls in place. Defaults to `'bottom-left'` inside a Diagram */
    position?: DiagramPanelPosition | 'static'
    /** Layout direction */
    orientation?: 'horizontal' | 'vertical'
    /** Shows zoom in, zoom out and the zoom level, which resets to 100% on click */
    withZoom?: boolean
    /** Shows the zoom to fit button */
    withFit?: boolean
    /** Shows the fullscreen toggle */
    withFullscreen?: boolean
    /** Shows the snap to grid toggle */
    withSnap?: boolean
    /** Shows a toggle between the edit mode and the view mode */
    withModeToggle?: boolean
  }>(),
  {
    position: undefined,
    orientation: 'horizontal',
    withZoom: true,
    withFit: true,
    withFullscreen: true,
    withSnap: true,
    withModeToggle: false,
  },
)

const { controller, labels, getStyles, elements, inCanvas } = useDiagramContext()
const portalProps = useFullscreenPortal()
const { editor } = controller
const viewport = useDiagramViewport(controller)
const fullscreen = useFullscreenElement()

watchEffect(() => {
  fullscreen.ref.value = elements.root.value
})

// Known after mounting only, so server and client render the same markup.
const fullscreenSupported = ref(false)

onMounted(() => {
  fullscreenSupported.value = document.fullscreenEnabled !== false
})

const snapEnabled = computed(() => {
  void controller.optionsVersion.value
  return editor.options.snapToGrid
})
const position = computed(() => props.position ?? (inCanvas ? 'bottom-left' : 'static'))
const label = (id: string) => commandLabel(controller, labels.value, id)

function toggleMode() {
  editor.setMode(controller.mode.value === 'edit' ? 'view' : 'edit')
}
</script>

<template>
  <component
    :is="position === 'static' ? 'div' : DiagramPanel"
    v-bind="position === 'static' ? {} : { position }"
  >
    <div
      v-bind="getStyles('controls')"
      role="group"
      :aria-label="labels.controls"
      :data-orientation="props.orientation"
    >
      <template v-if="props.withZoom">
        <Tooltip :portal-props="portalProps" :label="label('zoomOut')" withinPortal>
          <ActionIcon
            variant="subtle"
            color="gray"
            :aria-label="label('zoomOut')"
            :disabled="!viewport.canZoomOut.value"
            data-command="zoomOut"
            @click="viewport.zoomOut()"
          >
            <DiagramIcon name="zoomOut" />
          </ActionIcon>
        </Tooltip>
        <Tooltip :portal-props="portalProps" :label="label('zoomReset')" withinPortal>
          <UnstyledButton
            v-bind="getStyles('zoomLabel')"
            :aria-label="`${label('zoomReset')}, ${labels.zoomLevel(viewport.zoomPercent.value)}`"
            data-command="zoomReset"
            @click="viewport.zoomTo(1, { animate: true })"
          >
            {{ labels.zoomLevel(viewport.zoomPercent.value) }}
          </UnstyledButton>
        </Tooltip>
        <Tooltip :portal-props="portalProps" :label="label('zoomIn')" withinPortal>
          <ActionIcon
            variant="subtle"
            color="gray"
            :aria-label="label('zoomIn')"
            :disabled="!viewport.canZoomIn.value"
            data-command="zoomIn"
            @click="viewport.zoomIn()"
          >
            <DiagramIcon name="zoomIn" />
          </ActionIcon>
        </Tooltip>
      </template>
      <Tooltip
        :portal-props="portalProps"
        v-if="props.withFit"
        :label="label('zoomToFit')"
        withinPortal
      >
        <ActionIcon
          variant="subtle"
          color="gray"
          :aria-label="label('zoomToFit')"
          data-command="zoomToFit"
          @click="viewport.fitView()"
        >
          <DiagramIcon name="fit" />
        </ActionIcon>
      </Tooltip>
      <Tooltip
        :portal-props="portalProps"
        v-if="props.withSnap"
        :label="labels.toggleSnap"
        withinPortal
      >
        <ActionIcon
          :variant="snapEnabled ? 'light' : 'subtle'"
          :color="snapEnabled ? undefined : 'gray'"
          :aria-label="labels.toggleSnap"
          :aria-pressed="snapEnabled"
          data-command="toggleSnap"
          @click="editor.execute('toggleSnap')"
        >
          <DiagramIcon name="magnet" />
        </ActionIcon>
      </Tooltip>
      <Tooltip
        :portal-props="portalProps"
        v-if="props.withModeToggle"
        :label="controller.mode.value === 'edit' ? labels.interactive : labels.locked"
        withinPortal
      >
        <ActionIcon
          variant="subtle"
          color="gray"
          :aria-label="labels.interactive"
          :aria-pressed="controller.mode.value === 'edit'"
          data-command="toggleMode"
          @click="toggleMode"
        >
          <DiagramIcon :name="controller.mode.value === 'edit' ? 'unlock' : 'lock'" />
        </ActionIcon>
      </Tooltip>
      <Tooltip
        :portal-props="portalProps"
        v-if="props.withFullscreen && fullscreenSupported && inCanvas"
        :label="fullscreen.fullscreen.value ? labels.exitFullscreen : labels.fullscreen"
        withinPortal
      >
        <ActionIcon
          variant="subtle"
          color="gray"
          :aria-label="fullscreen.fullscreen.value ? labels.exitFullscreen : labels.fullscreen"
          data-command="fullscreen"
          @click="fullscreen.toggle()"
        >
          <DiagramIcon :name="fullscreen.fullscreen.value ? 'fullscreenExit' : 'fullscreen'" />
        </ActionIcon>
      </Tooltip>
    </div>
  </component>
</template>
