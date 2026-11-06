<script lang="ts">
import { createVarsResolver, getRadius, getThemeColor } from '@mantine-vue/core'

const defaultProps = {
  mode: 'edit',
  grid: true,
  gridSize: 20,
  snapToGrid: true,
  smartGuides: true,
  minZoom: 0.1,
  maxZoom: 4,
  wheelMode: 'pan',
  culling: 300,
  historyLimit: 100,
} as const

const varsResolver = createVarsResolver<any>((theme, { color, radius, background }) => {
  const accent = color ? theme.variantColorResolver({ color, theme, variant: 'light' }) : undefined
  const vars = {
    '--diagram-accent': color ? getThemeColor(color, theme) : undefined,
    '--diagram-accent-light': accent?.background,
    '--diagram-radius': radius !== undefined ? getRadius(radius) : undefined,
    '--diagram-background': background ? getThemeColor(background, theme) : undefined,
  }

  // The provider carries the same tokens for parts rendered outside of a diagram.
  return { root: vars, provider: vars }
})

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, useAttrs, useId, watch } from 'vue'
import { Box, useProps, useStyles } from '@mantine-vue/core'
import { useReducedMotion } from '@mantine-vue/hooks'
import type { DiagramDocument } from '../../core/types'
import { mergeDiagramLabels } from '../../labels'
import { useDiagramKeyboard } from '../../vue/composables'
import {
  createElements,
  provideDiagramContext,
  textMeasurementReady,
  useColorResolver,
} from '../../vue/context'
import { useDiagram, type DiagramController } from '../../vue/use-diagram'
import DiagramCanvas from '../parts/DiagramCanvas.vue'
import DiagramContextMenu from '../parts/DiagramContextMenu.vue'
import type { DiagramEmits, DiagramMenuState, DiagramOwnProps, DiagramSlots } from './Diagram.types'
import classes from './Diagram.module.css'

defineOptions({ name: 'Diagram', inheritAttrs: false })

const rawProps = withDefaults(defineProps<DiagramOwnProps>(), {
  controller: undefined,
  modelValue: undefined,
  defaultValue: undefined,
  selection: undefined,
  viewport: undefined,
  mode: undefined,
  nodeTypes: undefined,
  extensions: undefined,
  tools: undefined,
  commands: undefined,
  plugins: undefined,
  routers: undefined,
  templates: undefined,
  grid: undefined,
  gridSize: undefined,
  snapToGrid: undefined,
  smartGuides: undefined,
  rulers: undefined,
  minZoom: undefined,
  maxZoom: undefined,
  translateExtent: undefined,
  fitView: undefined,
  wheelMode: undefined,
  culling: undefined,
  historyLimit: undefined,
  connectionRules: undefined,
  defaultEdge: undefined,
  validateTransform: undefined,
  shortcuts: undefined,
  contextMenu: undefined,
  color: undefined,
  radius: undefined,
  background: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<DiagramEmits>()
defineSlots<DiagramSlots>()

const attrs = useAttrs()
const props = useProps('Diagram', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'Diagram',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

let controllerRef: DiagramController | null = null

const controller: DiagramController =
  props.controller ??
  useDiagram({
    document: props.modelValue ?? props.defaultValue,
    viewport: props.viewport,
    mode: props.mode,
    nodeTypes: props.nodeTypes,
    extensions: props.extensions,
    tools: props.tools,
    commands: props.commands,
    plugins: props.plugins,
    routers: props.routers,
    templates: props.templates,
    gridSize: props.gridSize,
    snapToGrid: props.snapToGrid,
    smartGuides: props.smartGuides,
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
    translateExtent: props.translateExtent,
    historyLimit: props.historyLimit,
    connection: props.connectionRules,
    defaultEdge: props.defaultEdge,
    validateTransform: props.validateTransform
      ? (_editor, nodes) => props.validateTransform!(controllerRef!, nodes)
      : undefined,
  })

controllerRef = controller
const { editor } = controller

if (props.controller) {
  // A controller from outside may still need the documents and registrations passed here.
  if (props.modelValue ?? props.defaultValue) {
    editor.load((props.modelValue ?? props.defaultValue)!)
  }

  props.nodeTypes?.forEach((type) => controller.registerNodeType(type))
  props.extensions?.forEach((extension) => controller.addExtension(extension))

  if (props.templates) {
    controller.addTemplates(props.templates)
  }
}

// Stable between server and client rendering.
const instance = useId()
const labels = computed(() => mergeDiagramLabels(props.labels))
const resolveColor = useColorResolver()
const elements = createElements()
const menu = shallowRef<DiagramMenuState | null>(null)

provideDiagramContext({
  controller,
  labels,
  getStyles: getStyles as any,
  resolveColor,
  elements,
  domId: (id) => `mantine-diagram-${instance}-${id}`,
  inCanvas: true,
  openContextMenu(position, scope) {
    if (props.contextMenu === false) {
      return
    }

    const canvas = elements.canvas.value?.getBoundingClientRect()
    const offset = props.rulers ? 22 : 0
    const point = editor.screenToWorld({
      x: position.x - (canvas?.left ?? 0) - offset,
      y: position.y - (canvas?.top ?? 0) - offset,
    })
    menu.value = { ...position, scope, point }
  },
})

/* Options */

const reducedMotion = useReducedMotion()

watch(
  reducedMotion,
  (value) => {
    editor.reducedMotion = value
  },
  { immediate: true },
)

watch(
  () => ({
    gridSize: props.gridSize,
    snapToGrid: props.snapToGrid,
    smartGuides: props.smartGuides,
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
    translateExtent: props.translateExtent,
    connection: props.connectionRules,
    defaultEdge: props.defaultEdge,
  }),
  (options) => {
    editor.setOptions(
      Object.fromEntries(Object.entries(options).filter(([, value]) => value !== undefined)) as any,
    )
  },
  { deep: true },
)

watch(
  () => props.mode,
  (mode) => mode && editor.setMode(mode),
  { immediate: !!props.controller },
)

watch(
  () => [props.nodeTypes, props.extensions, props.templates] as const,
  ([nodeTypes, extensions, templates]) => {
    nodeTypes?.forEach((type) => {
      if (controller.nodeTypes.get(type.type) !== type) {
        controller.registerNodeType(type)
      }
    })
    extensions?.forEach((extension) => controller.addExtension(extension))

    if (templates) {
      controller.addTemplates(templates)
    }
  },
)

/* Controlled state */

let lastEmitted: DiagramDocument | undefined = props.modelValue

const emitDocument = () => {
  const document = editor.toDocument()
  lastEmitted = document
  emit('update:modelValue', document)
  emit('change', document)
}

const listeners = [
  editor.events.on('commit', emitDocument),
  editor.events.on('change', (change) => {
    if (change.source === 'history' || change.source === 'remote') {
      emitDocument()
    }
  }),
  editor.events.on('selection', (ids) => emit('update:selection', ids)),
  editor.events.on('viewport', (viewport) => emit('update:viewport', viewport)),
  editor.events.on('mode', (mode) => emit('update:mode', mode)),
  editor.events.on('nodeClick', ({ node, event }) => emit('nodeClick', node, event)),
  editor.events.on('nodeDoubleClick', ({ node }) => emit('nodeDoubleClick', node)),
  editor.events.on('edgeClick', ({ edge, event }) => emit('edgeClick', edge, event)),
  editor.events.on('canvasClick', ({ point }) => emit('canvasClick', point)),
  editor.events.on('canvasDoubleClick', ({ point }) => emit('canvasDoubleClick', point)),
  editor.events.on('connect', (edge) => emit('connect', edge)),
  editor.events.on('connectEnd', (payload) => emit('connectEnd', payload)),
]

// A controller passed in outlives the component, its listeners must not.
onBeforeUnmount(() => listeners.forEach((off) => off()))

watch(
  () => props.modelValue,
  (value) => {
    if (value && value !== lastEmitted) {
      lastEmitted = value
      editor.load(value)
    }
  },
)

watch(
  () => props.selection,
  (ids) => ids && editor.setSelection(ids),
  { immediate: true },
)

watch(
  () => props.viewport,
  (viewport) => {
    if (viewport) {
      editor.setViewport(viewport)
    }
  },
)

/* Keyboard and clipboard */

const keyboard = useDiagramKeyboard(controller, {
  shortcuts: () => props.shortcuts,
  // Native clipboard events handle these when the canvas has focus.
  skip: ['copy', 'cut', 'paste'],
})

const isInteractive = (target: EventTarget | null) =>
  target instanceof Element &&
  target !== elements.root.value &&
  Boolean(
    target.closest(
      'button, a[href], input, textarea, select, [role="menuitem"], [role="option"], [contenteditable="true"]',
    ),
  )

function onKeyDown(event: KeyboardEvent) {
  if (!isInteractive(event.target)) {
    keyboard.onKeyDown(event)
  }
}

const fromCanvas = (event: Event) => !isInteractive(event.target) && !editor.editing

function onCopy(event: ClipboardEvent) {
  if (fromCanvas(event) && editor.selection.size > 0 && editor.mode !== 'view') {
    const text = editor.copy()

    if (text && event.clipboardData) {
      event.clipboardData.setData('text/plain', text)
      event.preventDefault()
    }
  }
}

function onCut(event: ClipboardEvent) {
  if (fromCanvas(event) && editor.canExecute('cut')) {
    const text = editor.cut()

    if (text && event.clipboardData) {
      event.clipboardData.setData('text/plain', text)
      event.preventDefault()
    }
  }
}

function onPaste(event: ClipboardEvent) {
  if (!fromCanvas(event) || !editor.canEdit) {
    return
  }

  const text = event.clipboardData?.getData('text/plain')
  const pasted = text ? editor.paste({ text }) : []

  if (pasted.length === 0) {
    editor.paste()
  }

  event.preventDefault()
}

/* Accessibility */

const activeDescendant = computed(() => {
  const [first] = controller.selection.value
  return first ? `mantine-diagram-${instance}-${first}` : undefined
})

const announcement = computed(() => {
  const names = controller.selection.value.map((id) => {
    const node = controller.nodeRef(id).value

    if (node) {
      return node.label || controller.nodeTypes.get(node.type)?.name || node.type
    }

    return controller.edgeRef(id).value?.label || labels.value.untitled
  })

  return labels.value.selectionAnnouncement(names)
})

const instructionsId = `mantine-diagram-${instance}-instructions`

/* Root */

const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const setRoot = (node: unknown) => {
  elements.root.value = ((node as any)?.$el ?? node) as HTMLElement | null
}

watch(
  () => [elements.root.value, elements.content.value] as const,
  ([root, content]) => {
    controller.elements.value = { root, content }
  },
)

onMounted(() => {
  textMeasurementReady.value = true
  emit('ready', controller)
})
onBeforeUnmount(() => {
  controller.elements.value = { root: null, content: null }
})

defineExpose({ controller })
</script>

<template>
  <Box
    v-bind="{ ...rootAttrs, ...getStyles('root') }"
    :ref="setRoot"
    tabindex="0"
    role="application"
    :aria-roledescription="labels.canvasRole"
    :aria-label="(rootAttrs['aria-label'] as string | undefined) ?? labels.canvas"
    :aria-describedby="instructionsId"
    :aria-activedescendant="activeDescendant"
    :data-mode="controller.mode.value"
    @keydown="onKeyDown"
    @keyup="keyboard.onKeyUp"
    @blur="keyboard.onBlur"
    @copy="onCopy"
    @cut="onCut"
    @paste="onPaste"
  >
    <DiagramCanvas
      :grid="props.grid!"
      :rulers="!!props.rulers"
      :wheel-mode="props.wheelMode!"
      :culling="props.culling!"
      :space-pressed="keyboard.spacePressed.value"
      :fit-view="!!props.fitView"
    />
    <slot />
    <DiagramContextMenu
      v-if="props.contextMenu !== false"
      :state="menu"
      :items="props.contextMenu || undefined"
      @close="menu = null"
    />
    <div v-bind="getStyles('liveRegion')" :id="instructionsId">{{ labels.instructions }}</div>
    <div v-bind="getStyles('liveRegion')" aria-live="polite" aria-atomic="true">
      {{ announcement }}
    </div>
  </Box>
</template>
