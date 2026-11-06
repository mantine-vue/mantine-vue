<script setup lang="ts">
import { computed } from 'vue'
import {
  ColorInput,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Slider,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
} from '@mantine-vue/core'
import { round } from '../../core/geometry'
import type { DiagramEdge, DiagramLengthUnit, DiagramNode } from '../../core/types'
import { unitToWorld, worldToUnit } from '../../core/units'
import { useDiagramContext } from '../../vue/context'
import { useFullscreenPortal } from '../../vue/fullscreen'
import { getPath, setPath } from '../../vue/paths'
import type { DiagramPropertyField } from '../../vue/types'

defineOptions({ name: 'DiagramPropertiesPanel' })

const props = withDefaults(
  defineProps<{
    /** Shows grid and scale settings of the document while nothing is selected */
    withDocument?: boolean
    /** Shows position, size and rotation of nodes */
    withGeometry?: boolean
    /** Shows fill, stroke, opacity and text style */
    withStyle?: boolean
    /** Swatches offered by color inputs */
    swatches?: string[]
  }>(),
  { withDocument: true, withGeometry: true, withStyle: true, swatches: undefined },
)

const { controller, labels, getStyles } = useDiagramContext()
const portalProps = useFullscreenPortal()
const { editor } = controller

const SWATCHES = [
  '#ffffff',
  '#f1f3f5',
  '#ffe3e3',
  '#fff3bf',
  '#d3f9d8',
  '#d0ebff',
  '#e5dbff',
  '#212529',
  '#868e96',
  '#fa5252',
  '#fab005',
  '#40c057',
  '#228be6',
  '#7950f2',
]

const nodes = computed(() =>
  controller.selection.value
    .map((id) => controller.nodeRef(id).value)
    .filter((node): node is DiagramNode => Boolean(node)),
)
const edges = computed(() =>
  controller.selection.value
    .map((id) => controller.edgeRef(id).value)
    .filter((edge): edge is DiagramEdge => Boolean(edge)),
)
const elements = computed<(DiagramNode | DiagramEdge)[]>(() => [...nodes.value, ...edges.value])
const editable = computed(
  () =>
    controller.mode.value === 'edit' &&
    nodes.value.every((node) => editor.isNodeEditable(node)) &&
    edges.value.every((edge) => editor.isEdgeEditable(edge)),
)
const single = computed(() =>
  nodes.value.length === 1 && edges.value.length === 0 ? nodes.value[0] : null,
)
const singleEdge = computed(() =>
  edges.value.length === 1 && nodes.value.length === 0 ? edges.value[0] : null,
)

const scale = computed(() => {
  void controller.settings.value
  return editor.scale
})
const unit = computed(() => (scale.value.unit === 'ft-in' ? 'ft' : scale.value.unit))
const usesUnits = computed(() => scale.value.unit !== 'px')

/** Value shared by all selected elements, `undefined` when they differ. */
function shared(path: string, defaultValue?: unknown) {
  const values = elements.value.map((element) => getPath(element, path) ?? defaultValue)

  return values.every((value) => value === values[0]) ? values[0] : undefined
}

function update(path: string, value: unknown) {
  const ids = elements.value.map((element) => element.id)
  editor.updateElements(ids, (element) => setPath(element as any, path, value), 'Edit property', {
    mergeKey: `property:${path}:${ids.join(',')}`,
  })
}

const toDisplay = (value: number) =>
  round(usesUnits.value ? worldToUnit(value, scale.value) : value, 2)
const fromDisplay = (value: number) => (usesUnits.value ? unitToWorld(value, scale.value) : value)

function setGeometry(key: 'x' | 'y' | 'width' | 'height' | 'rotation', value: unknown) {
  const node = single.value

  if (!node || typeof value !== 'number' || !Number.isFinite(value)) {
    return
  }

  const next = key === 'rotation' ? ((value % 360) + 360) % 360 : fromDisplay(value)

  editor.store.transact(
    'Edit geometry',
    () => {
      editor.setNodeBox(node.id, { [key]: next })
      editor.notifyTransform([node.id])
    },
    { mergeKey: `geometry:${key}:${node.id}` },
  )
}

const typeFields = computed<DiagramPropertyField[]>(() => {
  if (nodes.value.length === 0 || edges.value.length > 0) {
    return []
  }

  const types = new Set(nodes.value.map((node) => node.type))

  // Fields of the type, when every selected node has the same one.
  return types.size === 1 ? (controller.nodeTypes.get([...types][0])?.properties ?? []) : []
})

const layerOptions = computed(() =>
  controller.layers.value.map((layer) => ({ value: layer.id, label: layer.name })),
)
const routerOptions = computed(() =>
  editor
    .getRouterNames()
    .map((name) => ({ value: name, label: labels.value.routers[name] ?? name })),
)
const arrowOptions = computed(() =>
  Object.entries(labels.value.arrowheads).map(([value, label]) => ({ value, label })),
)

const typeName = computed(() => {
  const node = single.value
  return node ? (controller.nodeTypes.get(node.type)?.name ?? node.type) : ''
})

const UNIT_OPTIONS: { value: DiagramLengthUnit; label: string }[] = [
  { value: 'px', label: 'Pixels' },
  { value: 'mm', label: 'Millimeters' },
  { value: 'cm', label: 'Centimeters' },
  { value: 'm', label: 'Meters' },
  { value: 'in', label: 'Inches' },
  { value: 'ft', label: 'Feet' },
  { value: 'ft-in', label: 'Feet and inches' },
]

function setScale(patch: Partial<typeof scale.value>) {
  editor.updateSettings({ scale: { ...scale.value, ...patch } }, 'Change scale')
}

const fieldValue = (field: DiagramPropertyField) => shared(field.path, field.defaultValue)

const GEOMETRY_PATHS = new Set(['x', 'y', 'width', 'height', 'rotation'])

/** Geometry goes through the node type, which may adjust its data or keep a centerline. */
function updateNumber(field: DiagramPropertyField, value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return
  }

  if (single.value && GEOMETRY_PATHS.has(field.path)) {
    // setGeometry takes display units, plain number fields hold world units.
    const display = field.path === 'rotation' || field.type === 'length' ? value : toDisplay(value)
    setGeometry(field.path as 'width', display)
    return
  }

  update(field.path, field.type === 'length' ? fromDisplay(value) : value)
}

const swatches = computed(() => props.swatches ?? SWATCHES)
</script>

<template>
  <div v-bind="getStyles('sidePanel')" role="region" :aria-label="labels.properties">
    <span v-bind="getStyles('sidePanelTitle')">{{ labels.properties }}</span>

    <template v-if="elements.length === 0">
      <Text size="sm" c="dimmed">{{ labels.noSelection }}</Text>
      <Stack v-if="props.withDocument" gap="xs" data-section="document">
        <NumberInput
          size="xs"
          label="Grid size"
          :min="1"
          :model-value="controller.settings.value.gridSize ?? editor.options.gridSize"
          :disabled="controller.mode.value !== 'edit'"
          @update:model-value="
            (value: any) =>
              typeof value === 'number' && value > 0 && editor.updateSettings({ gridSize: value })
          "
        />
        <Select
          :combobox-props="{ portalProps }"
          size="xs"
          label="Units"
          :data="UNIT_OPTIONS"
          :model-value="scale.unit"
          :allow-deselect="false"
          :disabled="controller.mode.value !== 'edit'"
          @update:model-value="(value: any) => value && setScale({ unit: value })"
        />
        <NumberInput
          v-if="usesUnits"
          size="xs"
          label="World units per meter"
          :min="0.001"
          :model-value="scale.pixelsPerMeter"
          :disabled="controller.mode.value !== 'edit'"
          @update:model-value="
            (value: any) =>
              typeof value === 'number' && value > 0 && setScale({ pixelsPerMeter: value })
          "
        />
      </Stack>
    </template>

    <Stack v-else gap="xs">
      <Text v-if="elements.length > 1" size="sm">{{
        labels.multipleSelection(elements.length)
      }}</Text>
      <Text v-else-if="single" size="xs" c="dimmed">{{ typeName }}</Text>

      <Textarea
        v-if="elements.length === 1"
        size="xs"
        autosize
        :min-rows="1"
        :max-rows="4"
        :label="labels.fields.label"
        :model-value="(shared('label') as string) ?? ''"
        :disabled="!editable"
        data-field="label"
        @update:model-value="(value: any) => update('label', value || undefined)"
      />

      <template v-if="single && props.withGeometry">
        <SimpleGrid :cols="2" spacing="xs" data-section="geometry">
          <NumberInput
            v-for="key in ['x', 'y', 'width', 'height'] as const"
            :key="key"
            size="xs"
            :label="labels.fields[key]"
            :suffix="usesUnits ? ` ${unit}` : undefined"
            :decimal-scale="2"
            :min="key === 'width' || key === 'height' ? 0.01 : undefined"
            :model-value="toDisplay(single[key])"
            :disabled="!editable"
            :data-field="key"
            @update:model-value="(value: any) => setGeometry(key, value)"
          />
        </SimpleGrid>
        <NumberInput
          v-if="editor.getBehavior(single.type).rotatable !== false"
          size="xs"
          :label="labels.fields.rotation"
          suffix="°"
          :decimal-scale="1"
          :model-value="round(single.rotation ?? 0, 1)"
          :disabled="!editable"
          data-field="rotation"
          @update:model-value="(value: any) => setGeometry('rotation', value)"
        />
      </template>

      <template v-for="field in typeFields" :key="field.path">
        <TextInput
          v-if="field.type === 'text'"
          size="xs"
          :label="field.label"
          :model-value="(fieldValue(field) as string) ?? ''"
          :disabled="!editable"
          :data-field="field.path"
          @update:model-value="(value: any) => update(field.path, value)"
        />
        <Textarea
          v-else-if="field.type === 'textarea'"
          size="xs"
          autosize
          :label="field.label"
          :model-value="(fieldValue(field) as string) ?? ''"
          :disabled="!editable"
          :data-field="field.path"
          @update:model-value="(value: any) => update(field.path, value)"
        />
        <NumberInput
          v-else-if="field.type === 'number' || field.type === 'length'"
          size="xs"
          :label="field.label"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          :suffix="field.type === 'length' && usesUnits ? ` ${unit}` : undefined"
          :model-value="
            field.type === 'length' && typeof fieldValue(field) === 'number'
              ? toDisplay(fieldValue(field) as number)
              : (fieldValue(field) as number | undefined)
          "
          :disabled="!editable"
          :data-field="field.path"
          @update:model-value="(value: any) => updateNumber(field, value)"
        />
        <ColorInput
          :popover-props="{ portalProps }"
          v-else-if="field.type === 'color'"
          size="xs"
          :label="field.label"
          :swatches="swatches"
          :model-value="(fieldValue(field) as string) ?? ''"
          :disabled="!editable"
          :data-field="field.path"
          @update:model-value="(value: any) => update(field.path, value || undefined)"
        />
        <Select
          :combobox-props="{ portalProps }"
          v-else-if="field.type === 'select'"
          size="xs"
          :label="field.label"
          :data="field.options ?? []"
          :model-value="(fieldValue(field) as string) ?? null"
          :disabled="!editable"
          :allow-deselect="false"
          :data-field="field.path"
          @update:model-value="(value: any) => update(field.path, value)"
        />
        <Switch
          v-else-if="field.type === 'switch'"
          size="xs"
          :label="field.label"
          :model-value="Boolean(fieldValue(field))"
          :disabled="!editable"
          :data-field="field.path"
          @update:model-value="(value: any) => update(field.path, value)"
        />
      </template>

      <template v-if="singleEdge">
        <Select
          :combobox-props="{ portalProps }"
          size="xs"
          :label="labels.fields.router"
          :data="routerOptions"
          :model-value="singleEdge.type ?? 'straight'"
          :allow-deselect="false"
          :disabled="!editable"
          data-field="type"
          @update:model-value="(value: any) => update('type', value)"
        />
        <SimpleGrid :cols="2" spacing="xs">
          <Select
            :combobox-props="{ portalProps }"
            size="xs"
            :label="labels.fields.sourceArrow"
            :data="arrowOptions"
            :model-value="singleEdge.sourceArrow ?? 'none'"
            :allow-deselect="false"
            :disabled="!editable"
            data-field="sourceArrow"
            @update:model-value="(value: any) => update('sourceArrow', value)"
          />
          <Select
            :combobox-props="{ portalProps }"
            size="xs"
            :label="labels.fields.targetArrow"
            :data="arrowOptions"
            :model-value="singleEdge.targetArrow ?? 'arrow'"
            :allow-deselect="false"
            :disabled="!editable"
            data-field="targetArrow"
            @update:model-value="(value: any) => update('targetArrow', value)"
          />
        </SimpleGrid>
      </template>

      <template v-if="props.withStyle">
        <ColorInput
          :popover-props="{ portalProps }"
          v-if="nodes.length > 0"
          size="xs"
          :label="labels.fields.fill"
          :swatches="swatches"
          :model-value="(shared('style.fill') as string) ?? ''"
          :disabled="!editable"
          data-field="style.fill"
          @update:model-value="(value: any) => update('style.fill', value || undefined)"
        />
        <ColorInput
          :popover-props="{ portalProps }"
          size="xs"
          :label="labels.fields.stroke"
          :swatches="swatches"
          :model-value="(shared('style.stroke') as string) ?? ''"
          :disabled="!editable"
          data-field="style.stroke"
          @update:model-value="(value: any) => update('style.stroke', value || undefined)"
        />
        <SimpleGrid :cols="2" spacing="xs">
          <NumberInput
            size="xs"
            :label="labels.fields.strokeWidth"
            :min="0"
            :step="0.5"
            :model-value="(shared('style.strokeWidth') as number | undefined) ?? ''"
            :disabled="!editable"
            data-field="style.strokeWidth"
            @update:model-value="
              (value: any) =>
                update('style.strokeWidth', typeof value === 'number' ? value : undefined)
            "
          />
          <NumberInput
            size="xs"
            :label="labels.fields.fontSize"
            :min="4"
            :model-value="(shared('style.fontSize') as number | undefined) ?? ''"
            :disabled="!editable"
            data-field="style.fontSize"
            @update:model-value="
              (value: any) =>
                update('style.fontSize', typeof value === 'number' ? value : undefined)
            "
          />
        </SimpleGrid>
        <NumberInput
          v-if="nodes.length > 0 && edges.length === 0"
          size="xs"
          :label="labels.fields.cornerRadius"
          :min="0"
          :model-value="(shared('style.cornerRadius') as number | undefined) ?? ''"
          :disabled="!editable"
          data-field="style.cornerRadius"
          @update:model-value="
            (value: any) =>
              update('style.cornerRadius', typeof value === 'number' ? value : undefined)
          "
        />
        <ColorInput
          :popover-props="{ portalProps }"
          size="xs"
          :label="labels.fields.textColor"
          :swatches="swatches"
          :model-value="(shared('style.textColor') as string) ?? ''"
          :disabled="!editable"
          data-field="style.textColor"
          @update:model-value="(value: any) => update('style.textColor', value || undefined)"
        />
        <div>
          <Text size="xs" fw="500" mb="4">{{ labels.fields.opacity }}</Text>
          <Slider
            size="sm"
            :min="0.1"
            :max="1"
            :step="0.05"
            :label="(value: number) => `${Math.round(value * 100)}%`"
            :model-value="(shared('style.opacity', 1) as number | undefined) ?? 1"
            :disabled="!editable"
            :thumb-label="labels.fields.opacity"
            data-field="style.opacity"
            @update:model-value="
              (value: any) => update('style.opacity', value >= 1 ? undefined : value)
            "
          />
        </div>
        <Switch
          v-if="edges.length > 0"
          size="xs"
          :label="labels.fields.dashed"
          :model-value="Boolean(shared('style.strokeDasharray'))"
          :disabled="!editable"
          data-field="style.strokeDasharray"
          @update:model-value="
            (value: any) => update('style.strokeDasharray', value ? '6 4' : undefined)
          "
        />
      </template>

      <Select
        :combobox-props="{ portalProps }"
        v-if="layerOptions.length > 1 && elements.length > 0"
        size="xs"
        :label="labels.fields.layer"
        :data="layerOptions"
        :model-value="(shared('layerId') as string | undefined) ?? layerOptions[0].value"
        :allow-deselect="false"
        :disabled="!editable"
        data-field="layerId"
        @update:model-value="
          (value: any) => value && editor.moveToLayer(controller.selection.value, value)
        "
      />

      <Group gap="md">
        <Switch
          size="xs"
          :label="labels.fields.locked"
          :model-value="elements.every((element) => element.locked)"
          :disabled="controller.mode.value !== 'edit'"
          data-field="locked"
          @update:model-value="(value: any) => editor.setLocked(controller.selection.value, value)"
        />
      </Group>
    </Stack>
  </div>
</template>
