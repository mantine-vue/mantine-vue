<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import {
  ActionIcon,
  Group,
  ScrollArea,
  TextInput,
  Tooltip,
  UnstyledButton,
} from '@mantine-vue/core'
import DiagramIcon from '../../icons/DiagramIcon.vue'
import { useDiagramContext } from '../../vue/context'
import { useFullscreenPortal } from '../../vue/fullscreen'

defineOptions({ name: 'DiagramLayers' })

const props = withDefaults(
  defineProps<{
    /** Lists the objects of the active layer under the layers */
    withObjects?: boolean
    /** Maximum height of the objects list in pixels */
    objectsHeight?: number
    /** Allows changing visibility, locking, names, order and membership while in edit mode */
    editable?: boolean
  }>(),
  { withObjects: true, objectsHeight: 240, editable: true },
)

const { controller, labels, getStyles } = useDiagramContext()
const portalProps = useFullscreenPortal()
const { editor } = controller
const renaming = ref<string | null>(null)
const draftName = ref('')

/** Top layer first, like the stacking order. */
const layers = computed(() => [...controller.layers.value].reverse())
const canEdit = computed(() => props.editable && controller.mode.value === 'edit')

const objects = computed(() => {
  void controller.structureVersion.value
  void controller.version.value
  const active = controller.activeLayerId.value

  return [...controller.nodeIds.value]
    .reverse()
    .map((id) => editor.store.getNode(id)!)
    .filter((node) => node && !node.parentId && editor.store.resolveLayerId(node) === active)
    .map((node) => ({
      id: node.id,
      label: node.label || controller.nodeTypes.get(node.type)?.name || node.type,
      locked: !!node.locked,
      hidden: !!node.hidden,
    }))
})

async function startRename(id: string, name: string) {
  if (!canEdit.value) {
    return
  }

  renaming.value = id
  draftName.value = name
  await nextTick()
  document.querySelector<HTMLInputElement>(`[data-layer-rename="${id}"]`)?.select()
}

function finishRename() {
  const id = renaming.value

  if (id && draftName.value.trim()) {
    editor.updateLayer(id, { name: draftName.value.trim() })
  }

  renaming.value = null
}

function onRenameKey(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    finishRename()
  } else if (event.key === 'Escape') {
    renaming.value = null
  }
}

function remove(id: string) {
  const others = controller.layers.value.filter((layer) => layer.id !== id)
  editor.removeLayer(id, others[others.length - 1]?.id ?? null)
}
</script>

<template>
  <div v-bind="getStyles('sidePanel')" role="region" :aria-label="labels.layers">
    <Group justify="space-between" gap="xs" wrap="nowrap">
      <span v-bind="getStyles('sidePanelTitle')">{{ labels.layers }}</span>
      <Tooltip :portal-props="portalProps" v-if="canEdit" :label="labels.addLayer" withinPortal>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          :aria-label="labels.addLayer"
          data-action="add-layer"
          @click="editor.addLayer()"
        >
          <DiagramIcon name="plus" :size="16" />
        </ActionIcon>
      </Tooltip>
    </Group>
    <div role="list">
      <div
        v-for="(layer, index) in layers"
        :key="layer.id"
        v-bind="getStyles('layerRow')"
        role="listitem"
        :data-active="layer.id === controller.activeLayerId.value || undefined"
        :data-layer="layer.id"
      >
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          :aria-label="layer.visible === false ? labels.showLayer : labels.hideLayer"
          :aria-pressed="layer.visible !== false"
          :disabled="!canEdit"
          data-action="toggle-visible"
          @click="canEdit && editor.updateLayer(layer.id, { visible: layer.visible === false })"
        >
          <DiagramIcon :name="layer.visible === false ? 'eyeOff' : 'eye'" :size="16" />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          :aria-label="layer.locked ? labels.unlockLayer : labels.lockLayer"
          :aria-pressed="!!layer.locked"
          :disabled="!canEdit"
          data-action="toggle-lock"
          @click="canEdit && editor.updateLayer(layer.id, { locked: !layer.locked })"
        >
          <DiagramIcon :name="layer.locked ? 'lock' : 'unlock'" :size="16" />
        </ActionIcon>
        <TextInput
          v-if="renaming === layer.id"
          v-model="draftName"
          size="xs"
          style="flex: 1"
          :aria-label="labels.renameLayer"
          :data-layer-rename="layer.id"
          @blur="finishRename"
          @keydown="onRenameKey"
        />
        <UnstyledButton
          v-else
          v-bind="getStyles('layerName')"
          :aria-label="`${labels.activeLayer}: ${layer.name}`"
          :aria-current="layer.id === controller.activeLayerId.value ? 'true' : undefined"
          @click="editor.setActiveLayer(layer.id)"
          @dblclick="startRename(layer.id, layer.name)"
        >
          {{ layer.name }}
        </UnstyledButton>
        <template v-if="canEdit">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            :aria-label="labels.moveLayerUp"
            :disabled="index === 0"
            @click="editor.moveLayer(layer.id, 'up')"
          >
            <DiagramIcon name="chevronUp" :size="14" />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            :aria-label="labels.moveLayerDown"
            :disabled="index === layers.length - 1"
            @click="editor.moveLayer(layer.id, 'down')"
          >
            <DiagramIcon name="chevronDown" :size="14" />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            size="sm"
            :aria-label="labels.removeLayer"
            :disabled="layers.length <= 1"
            data-action="remove-layer"
            @click="remove(layer.id)"
          >
            <DiagramIcon name="trash" :size="14" />
          </ActionIcon>
        </template>
      </div>
    </div>
    <template v-if="props.withObjects">
      <span v-bind="getStyles('sidePanelTitle')">{{ labels.objects }}</span>
      <ScrollArea.Autosize :mah="props.objectsHeight" type="auto">
        <div role="listbox" :aria-label="labels.objects" aria-multiselectable="true">
          <UnstyledButton
            v-for="item in objects"
            :key="item.id"
            v-bind="getStyles('objectRow')"
            role="option"
            :aria-selected="controller.selectionSet.value.has(item.id)"
            :data-active="controller.selectionSet.value.has(item.id) || undefined"
            :data-object="item.id"
            :disabled="controller.mode.value === 'view'"
            @click="
              editor.select(item.id, {
                toggle: $event.shiftKey || $event.ctrlKey || $event.metaKey,
              })
            "
          >
            <span v-bind="getStyles('layerName')">{{ item.label }}</span>
            <DiagramIcon v-if="item.locked" name="lock" :size="12" />
            <DiagramIcon v-if="item.hidden" name="eyeOff" :size="12" />
          </UnstyledButton>
        </div>
      </ScrollArea.Autosize>
    </template>
  </div>
</template>
