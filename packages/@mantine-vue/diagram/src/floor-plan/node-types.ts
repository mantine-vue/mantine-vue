import { computed, defineComponent, h, type PropType, type VNode } from 'vue'
import { polygonArea, polygonCentroid, worldToLocal, type Point } from '../core/geometry'
import { createPointsBehavior, flipLocal, getDataPoints } from '../core/shapes'
import type { DiagramNode } from '../core/types'
import { formatArea, formatLength } from '../core/units'
import { pointsAttr } from '../components/shapes/shape-utils'
import { useDiagramContext } from '../vue/context'
import type { DiagramNodeType } from '../vue/types'
import type { DiagramController } from '../vue/use-diagram'
import classes from './floor-plan.module.css'
import { FURNITURE_KINDS } from './furniture'
import {
  COLUMN_TYPE,
  DIMENSION_TYPE,
  DOOR_TYPE,
  FURNITURE_TYPE,
  ROOM_TYPE,
  STAIRS_TYPE,
  WALL_TYPE,
  WINDOW_TYPE,
} from './geometry'
import { getFloorPlanRuntime } from './runtime'

const rendererProps = {
  node: { type: Object as PropType<DiagramNode>, required: true as const },
  selected: { type: Boolean, default: false },
  controller: { type: Object as PropType<DiagramController>, required: true as const },
}

const rectOutline = (node: DiagramNode): Point[] => [
  { x: 0, y: 0 },
  { x: node.width, y: 0 },
  { x: node.width, y: node.height },
  { x: 0, y: node.height },
]

/** Style overrides as inline styles, so CSS module defaults apply when a style is not set. */
function useOverrides() {
  const { resolveColor } = useDiagramContext()

  return (node: DiagramNode) => {
    const style: Record<string, string | number> = {}
    const fill = resolveColor(node.style?.fill)
    const stroke = resolveColor(node.style?.stroke)

    if (fill) {
      style.fill = fill
    }

    if (stroke) {
      style.stroke = stroke
    }

    if (node.style?.strokeWidth !== undefined) {
      style.strokeWidth = `${node.style.strokeWidth}px`
    }

    return style
  }
}

const WallShape = defineComponent({
  name: 'FloorPlanWallShape',
  props: rendererProps,
  setup(props) {
    const overrides = useOverrides()
    const runtime = getFloorPlanRuntime(props.controller)
    const outline = runtime?.wallOutline(props.node.id)

    const local = computed(() => {
      const world = outline?.value
      const node = props.node

      if (!world) {
        return rectOutline(node)
      }

      return world.map((p) => flipLocal(worldToLocal(p, node), node))
    })

    return () =>
      h('polygon', {
        class: classes.wall,
        points: pointsAttr(local.value),
        style: overrides(props.node),
      })
  },
})

const DoorShape = defineComponent({
  name: 'FloorPlanDoorShape',
  props: rendererProps,
  setup(props) {
    const overrides = useOverrides()

    return () => {
      const { width: w, height: t } = props.node
      const kind = props.node.data?.kind ?? 'single'
      const children: VNode[] = [
        h('rect', { class: classes.openingGap, x: 0, y: -0.5, width: w, height: t + 1 }),
      ]
      const style = overrides(props.node)

      if (kind === 'single') {
        children.push(
          h('line', { class: classes.doorLeaf, x1: 0, y1: 0, x2: 0, y2: -w, style }),
          h('path', { class: classes.doorSwing, d: `M${w} 0 A${w} ${w} 0 0 0 0 ${-w}` }),
        )
      } else if (kind === 'double') {
        const half = w / 2
        children.push(
          h('line', { class: classes.doorLeaf, x1: 0, y1: 0, x2: 0, y2: -half, style }),
          h('line', { class: classes.doorLeaf, x1: w, y1: 0, x2: w, y2: -half, style }),
          h('path', {
            class: classes.doorSwing,
            d: `M${half} 0 A${half} ${half} 0 0 0 0 ${-half} M${half} 0 A${half} ${half} 0 0 1 ${w} ${-half}`,
          }),
        )
      } else if (kind === 'sliding') {
        children.push(
          h('rect', {
            class: classes.doorLeaf,
            x: 0,
            y: t * 0.2,
            width: w * 0.55,
            height: t * 0.25,
            style,
          }),
          h('rect', {
            class: classes.doorLeaf,
            x: w * 0.45,
            y: t * 0.55,
            width: w * 0.55,
            height: t * 0.25,
            style,
          }),
        )
      } else {
        children.push(
          h('line', { class: classes.doorLeaf, x1: 0, y1: 0, x2: 0, y2: t, style }),
          h('line', { class: classes.doorLeaf, x1: w, y1: 0, x2: w, y2: t, style }),
        )
      }

      return h('g', children)
    }
  },
})

const WindowShape = defineComponent({
  name: 'FloorPlanWindowShape',
  props: rendererProps,
  setup(props) {
    const overrides = useOverrides()

    return () => {
      const { width: w, height: t } = props.node

      return h('g', [
        h('rect', { class: classes.openingGap, x: 0, y: -0.5, width: w, height: t + 1 }),
        h('rect', {
          class: classes.windowFrame,
          x: 0,
          y: 0,
          width: w,
          height: t,
          style: overrides(props.node),
        }),
        h('line', { class: classes.windowGlass, x1: 0, y1: t * 0.4, x2: w, y2: t * 0.4 }),
        h('line', { class: classes.windowGlass, x1: 0, y1: t * 0.6, x2: w, y2: t * 0.6 }),
      ])
    }
  },
})

const RoomShape = defineComponent({
  name: 'FloorPlanRoomShape',
  props: rendererProps,
  setup(props) {
    const overrides = useOverrides()
    const { controller } = props
    const points = computed(() => getDataPoints(props.node))
    const area = computed(() => polygonArea(points.value))

    return () => {
      const node = props.node
      const center = polygonCentroid(points.value)
      const editing = controller.editing.value?.id === node.id
      // Room names are read from afar: they scale with the room unless a size is set.
      const fontSize =
        node.style?.fontSize ?? Math.min(40, Math.max(14, Math.min(node.width, node.height) * 0.06))
      void controller.settings.value
      const showArea = node.data?.showArea !== false

      return h('g', [
        h('polygon', {
          class: classes.room,
          points: pointsAttr(points.value),
          style: overrides(node),
        }),
        !editing && (node.label || showArea)
          ? h(
              'text',
              {
                x: center.x,
                y: center.y,
                'text-anchor': 'middle',
                'font-size': fontSize,
                'pointer-events': 'none',
              },
              [
                node.label
                  ? h(
                      'tspan',
                      {
                        class: classes.roomName,
                        x: center.x,
                        dy: showArea ? -fontSize * 0.2 : fontSize * 0.35,
                      },
                      node.label,
                    )
                  : null,
                showArea
                  ? h(
                      'tspan',
                      {
                        class: classes.roomArea,
                        x: center.x,
                        dy: node.label ? fontSize * 1.2 : fontSize * 0.35,
                        'font-size': fontSize * 0.85,
                      },
                      formatArea(area.value, controller.editor.scale),
                    )
                  : null,
              ],
            )
          : null,
      ])
    }
  },
})

const ColumnShape = defineComponent({
  name: 'FloorPlanColumnShape',
  props: rendererProps,
  setup(props) {
    const overrides = useOverrides()

    return () => {
      const { width: w, height: t, data } = props.node

      return data?.shape === 'round'
        ? h('ellipse', {
            class: classes.column,
            cx: w / 2,
            cy: t / 2,
            rx: w / 2,
            ry: t / 2,
            style: overrides(props.node),
          })
        : h('rect', { class: classes.column, width: w, height: t, style: overrides(props.node) })
    }
  },
})

const StairsShape = defineComponent({
  name: 'FloorPlanStairsShape',
  props: rendererProps,
  setup(props) {
    const overrides = useOverrides()

    return () => {
      const { width: w, height: length } = props.node
      const steps = Math.max(2, Math.round(props.node.data?.steps ?? length / 28))
      const lines: VNode[] = []

      for (let index = 1; index < steps; index += 1) {
        const y = (length * index) / steps
        lines.push(h('line', { class: classes.stairs, x1: 0, y1: y, x2: w, y2: y }))
      }

      // The arrow points up the stairs.
      return h('g', [
        h('rect', {
          class: classes.stairs,
          width: w,
          height: length,
          style: overrides(props.node),
        }),
        ...lines,
        h('path', {
          class: classes.dimension,
          d: `M${w / 2} ${length * 0.9} V${length * 0.1} M${w / 2 - 8} ${length * 0.1 + 10} L${w / 2} ${length * 0.1} L${w / 2 + 8} ${length * 0.1 + 10}`,
        }),
      ])
    }
  },
})

const DimensionShape = defineComponent({
  name: 'FloorPlanDimensionShape',
  props: rendererProps,
  setup(props) {
    return () => {
      const { node, controller } = props
      const { width: w, height: t } = node
      const y = t / 2
      const tick = Math.min(8, t / 2)
      void controller.settings.value
      const text = node.label || formatLength(w, controller.editor.scale)
      const fontSize = node.style?.fontSize ?? 12
      const rotation = (((node.rotation ?? 0) % 360) + 360) % 360
      // Keep the text readable from below.
      const upsideDown = rotation > 90 && rotation <= 270
      const textWidth = text.length * fontSize * 0.6 + 8

      return h('g', [
        h('rect', { x: 0, y: 0, width: w, height: t, fill: 'transparent' }),
        h('path', {
          class: classes.dimension,
          d: `M0 ${y} H${w} M0 ${y - tick} V${y + tick} M${w} ${y - tick} V${y + tick} M${-tick / 2} ${y + tick / 2} L${tick / 2} ${y - tick / 2} M${w - tick / 2} ${y + tick / 2} L${w + tick / 2} ${y - tick / 2}`,
        }),
        h('g', { transform: upsideDown ? `rotate(180 ${w / 2} ${y})` : undefined }, [
          h('rect', {
            class: classes.dimensionTextBackground,
            x: w / 2 - textWidth / 2,
            y: y - fontSize * 0.7,
            width: textWidth,
            height: fontSize * 1.4,
            rx: 2,
          }),
          h(
            'text',
            {
              class: classes.dimensionText,
              x: w / 2,
              y,
              'text-anchor': 'middle',
              'dominant-baseline': 'central',
              'font-size': fontSize,
            },
            text,
          ),
        ]),
      ])
    }
  },
})

/** Top view symbols of the furniture library, drawn in a `w` × `h` box. */
function furnitureSymbol(
  kind: string,
  w: number,
  d: number,
  style: Record<string, string | number>,
): VNode[] {
  const base = (attrs: Record<string, any>) =>
    h('rect', { class: classes.furniture, style, ...attrs })
  const detail = (tag: string, attrs: Record<string, any>) =>
    h(tag, { class: classes.furnitureDetail, ...attrs })
  const r = Math.min(w, d)

  switch (kind) {
    case 'sofa':
      return [
        base({ width: w, height: d, rx: r * 0.15 }),
        detail('rect', { x: w * 0.08, y: d * 0.3, width: w * 0.84, height: d * 0.6, rx: r * 0.08 }),
        detail('line', { x1: w / 2, y1: d * 0.3, x2: w / 2, y2: d * 0.9 }),
      ]
    case 'armchair':
    case 'office-chair':
    case 'chair':
      return [
        base({ width: w, height: d, rx: r * (kind === 'chair' ? 0.12 : 0.25) }),
        detail('rect', {
          x: w * 0.12,
          y: d * 0.25,
          width: w * 0.76,
          height: d * 0.65,
          rx: r * 0.1,
        }),
        detail('line', { x1: w * 0.1, y1: d * 0.12, x2: w * 0.9, y2: d * 0.12 }),
      ]
    case 'bed-double':
    case 'bed-single': {
      const pillows = kind === 'bed-double' ? 2 : 1
      const pillowWidth = (w * 0.84) / pillows - w * 0.04 * (pillows - 1)

      return [
        base({ width: w, height: d, rx: r * 0.04 }),
        detail('line', { x1: 0, y1: d * 0.3, x2: w, y2: d * 0.3 }),
        ...Array.from({ length: pillows }, (_, index) =>
          detail('rect', {
            x: w * 0.08 + index * (pillowWidth + w * 0.04),
            y: d * 0.05,
            width: pillowWidth,
            height: d * 0.18,
            rx: r * 0.05,
          }),
        ),
      ]
    }
    case 'round-table':
    case 'plant':
      return [
        h('ellipse', {
          class: classes.furniture,
          style,
          cx: w / 2,
          cy: d / 2,
          rx: w / 2,
          ry: d / 2,
        }),
        kind === 'plant'
          ? detail('path', {
              d: `M${w / 2} ${d * 0.2} L${w / 2} ${d * 0.8} M${w * 0.2} ${d / 2} L${w * 0.8} ${d / 2} M${w * 0.3} ${d * 0.3} L${w * 0.7} ${d * 0.7} M${w * 0.7} ${d * 0.3} L${w * 0.3} ${d * 0.7}`,
            })
          : detail('ellipse', { cx: w / 2, cy: d / 2, rx: w * 0.35, ry: d * 0.35 }),
      ]
    case 'stove':
      return [
        base({ width: w, height: d, rx: r * 0.05 }),
        ...[0.3, 0.7].flatMap((x) =>
          [0.3, 0.7].map((y) => detail('circle', { cx: w * x, cy: d * y, r: r * 0.14 })),
        ),
      ]
    case 'fridge':
      return [
        base({ width: w, height: d, rx: r * 0.05 }),
        detail('line', { x1: 0, y1: d * 0.15, x2: w, y2: d * 0.15 }),
        detail('path', {
          d: `M${w * 0.2} ${d * 0.5} L${w * 0.8} ${d * 0.9} M${w * 0.8} ${d * 0.5} L${w * 0.2} ${d * 0.9}`,
        }),
      ]
    case 'sink':
    case 'washbasin':
      return [
        base({ width: w, height: d, rx: r * 0.1 }),
        detail('ellipse', { cx: w / 2, cy: d * 0.55, rx: w * 0.35, ry: d * 0.32 }),
        detail('circle', { cx: w / 2, cy: d * 0.15, r: r * 0.05 }),
      ]
    case 'toilet':
      return [
        base({ width: w, height: d * 0.28, rx: r * 0.05 }),
        h('ellipse', {
          class: classes.furniture,
          style,
          cx: w / 2,
          cy: d * 0.62,
          rx: w * 0.45,
          ry: d * 0.36,
        }),
        detail('ellipse', { cx: w / 2, cy: d * 0.64, rx: w * 0.28, ry: d * 0.24 }),
      ]
    case 'bathtub':
      return [
        base({ width: w, height: d, rx: r * 0.12 }),
        detail('rect', { x: w * 0.06, y: d * 0.1, width: w * 0.88, height: d * 0.8, rx: r * 0.35 }),
        detail('circle', { cx: w * 0.12, cy: d / 2, r: r * 0.05 }),
      ]
    case 'shower':
      return [
        base({ width: w, height: d, rx: r * 0.03 }),
        detail('path', { d: `M0 0 L${w} ${d} M${w} 0 L0 ${d}` }),
        detail('circle', { cx: w / 2, cy: d / 2, r: r * 0.06 }),
      ]
    case 'desk':
    case 'meeting-table':
    case 'dining-table':
    case 'coffee-table':
      return [
        base({ width: w, height: d, rx: r * 0.06 }),
        detail('rect', {
          x: w * 0.04,
          y: d * 0.08,
          width: w * 0.92,
          height: d * 0.84,
          rx: r * 0.04,
        }),
      ]
    case 'wardrobe':
    case 'cabinet':
      return [
        base({ width: w, height: d, rx: r * 0.03 }),
        detail('line', { x1: w / 2, y1: 0, x2: w / 2, y2: d }),
        detail('line', { x1: 0, y1: d * 0.85, x2: w, y2: d * 0.85 }),
      ]
    case 'bookshelf':
      return [
        base({ width: w, height: d }),
        ...[0.25, 0.5, 0.75].map((x) => detail('line', { x1: w * x, y1: 0, x2: w * x, y2: d })),
      ]
    case 'tv-stand':
      return [
        base({ width: w, height: d, rx: r * 0.05 }),
        detail('rect', { x: w * 0.15, y: d * 0.35, width: w * 0.7, height: d * 0.2 }),
      ]
    case 'piano':
      return [
        base({ width: w, height: d, rx: r * 0.05 }),
        ...Array.from({ length: 13 }, (_, index) =>
          detail('line', {
            x1: (w * (index + 1)) / 14,
            y1: d * 0.65,
            x2: (w * (index + 1)) / 14,
            y2: d,
          }),
        ),
      ]
    case 'kitchen-counter':
    case 'nightstand':
    default:
      return [
        base({ width: w, height: d, rx: r * 0.04 }),
        detail('line', { x1: 0, y1: d * 0.12, x2: w, y2: d * 0.12 }),
      ]
  }
}

const FurnitureShape = defineComponent({
  name: 'FloorPlanFurnitureShape',
  props: rendererProps,
  setup(props) {
    const overrides = useOverrides()

    return () =>
      h(
        'g',
        furnitureSymbol(
          props.node.data?.kind ?? 'cabinet',
          props.node.width,
          props.node.height,
          overrides(props.node),
        ),
      )
  },
})

const SEGMENT_HANDLES = ['w', 'e'] as const

/** Keeps the centerline of segment shaped nodes in place when their thickness changes. */
function keepCenterline(next: DiagramNode, previous: DiagramNode): DiagramNode {
  if (
    next.width === previous.width &&
    next.height !== previous.height &&
    next.x === previous.x &&
    next.y === previous.y
  ) {
    return { ...next, y: previous.y + (previous.height - next.height) / 2 }
  }

  return next
}

function remapWall(node: DiagramNode, ids: ReadonlyMap<string, string>): DiagramNode {
  const wallId = node.data?.wallId

  if (!wallId) {
    return node
  }

  const data = { ...node.data }

  if (ids.has(wallId)) {
    data.wallId = ids.get(wallId)
  } else {
    delete data.wallId
    delete data.offset
  }

  return { ...node, data }
}

const lengthField = (path: 'width' | 'height', label: string) => ({
  path,
  label,
  type: 'length' as const,
  min: 1,
})

/** Node types of the floor plan extension. */
export function createFloorPlanNodeTypes(
  options: { wallThickness?: number } = {},
): DiagramNodeType[] {
  const thickness = options.wallThickness ?? 15

  return [
    {
      type: WALL_TYPE,
      name: 'Wall',
      component: WallShape,
      defaults: { width: 300, height: thickness },
      outline: rectOutline,
      resizeHandles: [...SEGMENT_HANDLES],
      connectable: false,
      editableText: false,
      renderLabel: false,
      minWidth: 2,
      resize: keepCenterline,
      properties: [lengthField('width', 'Length'), lengthField('height', 'Thickness')],
    },
    {
      type: DOOR_TYPE,
      name: 'Door',
      component: DoorShape,
      defaults: { width: 90, height: thickness, data: { kind: 'single' } },
      outline: rectOutline,
      resizeHandles: [...SEGMENT_HANDLES],
      connectable: false,
      editableText: false,
      renderLabel: false,
      minWidth: 20,
      resize: keepCenterline,
      remapReferences: remapWall,
      properties: [
        {
          path: 'data.kind',
          label: 'Door type',
          type: 'select',
          defaultValue: 'single',
          options: [
            { value: 'single', label: 'Single' },
            { value: 'double', label: 'Double' },
            { value: 'sliding', label: 'Sliding' },
            { value: 'opening', label: 'Opening' },
          ],
        },
        lengthField('width', 'Width'),
      ],
    },
    {
      type: WINDOW_TYPE,
      name: 'Window',
      component: WindowShape,
      defaults: { width: 120, height: thickness },
      outline: rectOutline,
      resizeHandles: [...SEGMENT_HANDLES],
      connectable: false,
      editableText: false,
      renderLabel: false,
      minWidth: 20,
      resize: keepCenterline,
      remapReferences: remapWall,
      properties: [lengthField('width', 'Width')],
    },
    {
      type: ROOM_TYPE,
      name: 'Room',
      component: RoomShape,
      defaults: {
        width: 400,
        height: 300,
        label: 'Room',
        data: {
          points: [
            { x: 0, y: 0 },
            { x: 400, y: 0 },
            { x: 400, y: 300 },
            { x: 0, y: 300 },
          ],
          showArea: true,
        },
      },
      outline: getDataPoints,
      resize: (node, previous) => {
        const sx = previous.width > 0 ? node.width / previous.width : 1
        const sy = previous.height > 0 ? node.height / previous.height : 1

        return {
          ...node,
          data: {
            ...node.data,
            points: getDataPoints(previous).map((p) => ({ x: p.x * sx, y: p.y * sy })),
          },
        }
      },
      points: createPointsBehavior(true),
      connectable: false,
      rotatable: false,
      renderLabel: false,
      properties: [
        { path: 'data.showArea', label: 'Show area', type: 'switch', defaultValue: true },
      ],
    },
    {
      type: COLUMN_TYPE,
      name: 'Column',
      component: ColumnShape,
      defaults: { width: 40, height: 40, data: { shape: 'square' } },
      outline: rectOutline,
      connectable: false,
      renderLabel: false,
      editableText: false,
      properties: [
        {
          path: 'data.shape',
          label: 'Shape',
          type: 'select',
          defaultValue: 'square',
          options: [
            { value: 'square', label: 'Square' },
            { value: 'round', label: 'Round' },
          ],
        },
      ],
    },
    {
      type: STAIRS_TYPE,
      name: 'Stairs',
      component: StairsShape,
      defaults: { width: 100, height: 300 },
      outline: rectOutline,
      connectable: false,
      renderLabel: false,
      editableText: false,
      properties: [{ path: 'data.steps', label: 'Steps', type: 'number', min: 2, max: 60 }],
    },
    {
      type: DIMENSION_TYPE,
      name: 'Dimension',
      component: DimensionShape,
      defaults: { width: 300, height: 30 },
      outline: rectOutline,
      resizeHandles: [...SEGMENT_HANDLES],
      connectable: false,
      renderLabel: false,
      resize: keepCenterline,
      properties: [lengthField('width', 'Length')],
    },
    {
      type: FURNITURE_TYPE,
      name: 'Furniture',
      component: FurnitureShape,
      defaults: { width: 80, height: 80, data: { kind: 'cabinet' } },
      outline: (node) =>
        ['round-table', 'plant'].includes(node.data?.kind)
          ? Array.from({ length: 24 }, (_, index) => {
              const angle = (index / 24) * Math.PI * 2
              return {
                x: node.width / 2 + (Math.cos(angle) * node.width) / 2,
                y: node.height / 2 + (Math.sin(angle) * node.height) / 2,
              }
            })
          : rectOutline(node),
      connectable: false,
      properties: [
        {
          path: 'data.kind',
          label: 'Kind',
          type: 'select',
          options: FURNITURE_KINDS.map((item) => ({ value: item.kind, label: item.label })),
        },
        lengthField('width', 'Width'),
        lengthField('height', 'Depth'),
      ],
    },
  ]
}
