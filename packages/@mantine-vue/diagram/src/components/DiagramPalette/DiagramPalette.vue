<script setup lang="ts">
import { computed, ref } from 'vue'
import { Accordion, TextInput, Text } from '@mantine-vue/core'
import { getDataPoints } from '../../core/shapes'
import type { DiagramNode } from '../../core/types'
import { useDiagramContext } from '../../vue/context'
import { insertTemplate, TEMPLATE_MIME } from '../../vue/templates'
import type { DiagramTemplate } from '../../vue/types'
import { pointsAttr } from '../shapes/shape-utils'

defineOptions({ name: 'DiagramPalette' })

const props = withDefaults(
  defineProps<{
    /** Templates to show, the templates of the controller by default */
    templates?: DiagramTemplate[]
    /** Shows a search field */
    searchable?: boolean
    /** Opens every category initially */
    expanded?: boolean
  }>(),
  { templates: undefined, searchable: true, expanded: true },
)

const { controller, labels, getStyles } = useDiagramContext()
const { editor } = controller
const query = ref('')

const source = computed(() => props.templates ?? controller.templates.value)

const groups = computed(() => {
  const search = query.value.trim().toLowerCase()
  const map = new Map<
    string,
    { template: DiagramTemplate; preview: ReturnType<typeof preview> }[]
  >()

  for (const template of source.value) {
    const haystack = [template.label, template.category ?? '', ...(template.keywords ?? [])]
      .join(' ')
      .toLowerCase()

    if (search && !haystack.includes(search)) {
      continue
    }

    const category = template.category ?? labels.value.palette
    map.set(category, [...(map.get(category) ?? []), { template, preview: preview(template) }])
  }

  return [...map.entries()].map(([category, items]) => ({ category, items }))
})

const opened = ref<string[] | null>(null)
const openedValue = computed(
  () => opened.value ?? (props.expanded ? groups.value.map((group) => group.category) : []),
)

/** Small outline of the first node of a template, drawn in a 32 × 32 box. */
function preview(template: DiagramTemplate) {
  const partial = template.node ?? template.nodes?.[0]

  if (!partial) {
    return null
  }

  const node = editor.createNode({ ...partial, id: 'preview' }) as DiagramNode
  const behavior = editor.getBehavior(node.type)
  const ratio = Math.min(28 / Math.max(node.width, 1), 28 / Math.max(node.height, 1))
  const width = node.width * ratio
  const height = node.height * ratio
  const outline = (behavior.outline?.(node) ?? getDataPoints(node)).map((p) => ({
    x: p.x * ratio,
    y: p.y * ratio,
  }))

  return {
    transform: `translate(${(32 - width) / 2} ${(32 - height) / 2})`,
    points: outline.length >= 2 ? pointsAttr(outline) : null,
    closed: !behavior.points || behavior.points.closed,
    width,
    height,
  }
}

function onDragStart(event: DragEvent, template: DiagramTemplate) {
  event.dataTransfer?.setData(TEMPLATE_MIME, template.id)

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
  }
}

/** Keyboard and click insertion: at the center of the view. */
function add(template: DiagramTemplate) {
  const visible = editor.getVisibleRect()
  const center =
    visible.width > 0
      ? { x: visible.x + visible.width / 2, y: visible.y + visible.height / 2 }
      : { x: 0, y: 0 }
  insertTemplate(controller, template, center)
}
</script>

<template>
  <div v-bind="getStyles('sidePanel')" role="region" :aria-label="labels.palette">
    <span v-bind="getStyles('sidePanelTitle')">{{ labels.palette }}</span>
    <TextInput
      v-if="props.searchable"
      v-model="query"
      size="xs"
      type="search"
      :placeholder="labels.searchTemplates"
      :aria-label="labels.searchTemplates"
    />
    <Text v-if="groups.length === 0" size="sm" c="dimmed">{{ labels.noTemplates }}</Text>
    <Accordion
      v-else
      multiple
      variant="contained"
      :value="openedValue"
      @update:value="(value: any) => (opened = value)"
    >
      <Accordion.Item v-for="group in groups" :key="group.category" :value="group.category">
        <Accordion.Control>{{ group.category }}</Accordion.Control>
        <Accordion.Panel>
          <div v-bind="getStyles('paletteGrid')">
            <button
              v-for="{ template, preview: shape } in group.items"
              :key="template.id"
              v-bind="getStyles('paletteItem')"
              type="button"
              draggable="true"
              :disabled="controller.mode.value !== 'edit'"
              :aria-label="labels.addTemplate(template.label)"
              :data-template="template.id"
              @dragstart="onDragStart($event, template)"
              @click="add(template)"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                <g
                  v-if="shape"
                  :transform="shape.transform"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <component
                    :is="shape.closed ? 'polygon' : 'polyline'"
                    v-if="shape.points"
                    :points="shape.points"
                  />
                  <rect v-else :width="shape.width" :height="shape.height" rx="2" />
                </g>
              </svg>
              <span>{{ template.label }}</span>
            </button>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  </div>
</template>
