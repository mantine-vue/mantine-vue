import { computed, defineComponent, h, type PropType, type VNode } from 'vue'
import { rectToPolygon, type Point } from '../core/geometry'
import { createPointsBehavior, getDataPoints } from '../core/shapes'
import type { DiagramNode } from '../core/types'
import { pointsAttr } from '../components/shapes/shape-utils'
import { useDiagramContext } from '../vue/context'
import type { DiagramNodeType } from '../vue/types'
import type { DiagramController } from '../vue/use-diagram'
import classes from './restaurant.module.css'
import {
  BAR_TYPE,
  BOOTH_TYPE,
  getBarStoolPositions,
  getSeatPositions,
  getTableFootprint,
  TABLE_TYPE,
  ZONE_TYPE,
  type SeatPosition,
} from './seating'
import { DEFAULT_STATUS, DEFAULT_TABLE_STATUSES, type TableStatusDefinition } from './tables'

/** Shared state keys of the restaurant extension. */
export const STATUS_STATE_KEY = 'restaurant:statuses'
export const STATUS_DEFINITIONS_STATE_KEY = 'restaurant:statusDefinitions'

const rendererProps = {
  node: { type: Object as PropType<DiagramNode>, required: true as const },
  selected: { type: Boolean, default: false },
  controller: { type: Object as PropType<DiagramController>, required: true as const },
}

/** Live status of a table: the external status map first, then the stored status. */
export function resolveTableStatus(controller: DiagramController, node: DiagramNode): string {
  const live = controller.state[STATUS_STATE_KEY] as Record<string, string> | undefined

  return live?.[node.id] ?? node.data?.status ?? DEFAULT_STATUS
}

export function getStatusDefinitions(
  controller: DiagramController,
): Record<string, TableStatusDefinition> {
  return (
    (controller.state[STATUS_DEFINITIONS_STATE_KEY] as
      | Record<string, TableStatusDefinition>
      | undefined) ?? DEFAULT_TABLE_STATUSES
  )
}

function useStatus(props: { node: DiagramNode; controller: DiagramController }) {
  const { resolveColor } = useDiagramContext()

  return computed(() => {
    const status = resolveTableStatus(props.controller, props.node)
    const definition = getStatusDefinitions(props.controller)[status]
    const color = resolveColor(props.node.style?.stroke ?? definition?.color ?? 'gray') ?? 'gray'
    const fill = props.node.style?.fill
      ? resolveColor(props.node.style.fill)!
      : `color-mix(in srgb, ${color} 16%, var(--diagram-node-fill, white))`

    return { status, definition, color, fill }
  })
}

function chair(seat: SeatPosition, size: number, key: string | number): VNode {
  const half = size / 2

  return h('g', { key, transform: `translate(${seat.x} ${seat.y}) rotate(${seat.rotation})` }, [
    h('rect', {
      class: classes.chair,
      x: -half,
      y: -half,
      width: size,
      height: size,
      rx: size * 0.2,
    }),
    h('rect', {
      class: classes.chairBack,
      x: -half,
      y: -half,
      width: size,
      height: size * 0.22,
      rx: size * 0.1,
    }),
  ])
}

function tableText(node: DiagramNode, color: string, extra: string | null) {
  const number = node.data?.number ?? node.label
  const size = Math.max(10, Math.min(node.width, node.height) * 0.28)
  const children: VNode[] = []

  if (number !== undefined && number !== '') {
    children.push(
      h(
        'text',
        {
          class: classes.tableNumber,
          x: node.width / 2,
          y: node.height / 2 - (extra ? size * 0.25 : 0),
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          'font-size': size,
        },
        String(number),
      ),
    )
  }

  if (extra) {
    children.push(
      h(
        'text',
        {
          class: classes.tableSeats,
          x: node.width / 2,
          y: node.height / 2 + size * 0.75,
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          'font-size': size * 0.55,
        },
        extra,
      ),
    )
  }

  children.push(
    h('circle', {
      class: classes.statusDot,
      cx: node.width - Math.min(10, node.width * 0.12),
      cy: Math.min(10, node.height * 0.12),
      r: Math.min(5, node.width * 0.06),
      fill: color,
    }),
  )

  return children
}

const TableShape = defineComponent({
  name: 'RestaurantTableShape',
  props: rendererProps,
  setup(props) {
    const status = useStatus(props)

    return () => {
      const { node } = props
      const { width: w, height: hgt } = node
      const shape = node.data?.shape ?? 'round'
      const chairSize = node.data?.chairSize ?? 45
      const { color, fill } = status.value
      const seats = getSeatPositions(node)
      const body =
        shape === 'round' || shape === 'oval'
          ? h('ellipse', {
              class: classes.tableBody,
              cx: w / 2,
              cy: hgt / 2,
              rx: w / 2,
              ry: hgt / 2,
              fill,
              stroke: color,
            })
          : h('rect', {
              class: classes.tableBody,
              width: w,
              height: hgt,
              rx: Math.min(w, hgt) * 0.08,
              fill,
              stroke: color,
            })

      return h('g', { 'data-status': status.value.status }, [
        ...seats.map((seat, index) => chair(seat, chairSize, index)),
        body,
        ...tableText(node, color, node.data?.seats ? `${node.data.seats}` : null),
      ])
    }
  },
})

const BoothShape = defineComponent({
  name: 'RestaurantBoothShape',
  props: rendererProps,
  setup(props) {
    const status = useStatus(props)

    return () => {
      const { node } = props
      const { width: w, height: hgt } = node
      const bench = Math.min(hgt * 0.28, 50)
      const layout = node.data?.layout ?? 'double'
      const { color, fill } = status.value
      const tableTop = bench + 6
      const tableBottom = layout === 'double' ? hgt - bench - 6 : hgt - 6

      return h('g', { 'data-status': status.value.status }, [
        h('rect', { class: classes.bench, width: w, height: bench, rx: 6 }),
        layout === 'double'
          ? h('rect', { class: classes.bench, y: hgt - bench, width: w, height: bench, rx: 6 })
          : null,
        layout === 'u'
          ? h('rect', { class: classes.bench, x: 0, y: 0, width: bench, height: hgt, rx: 6 })
          : null,
        h('rect', {
          class: classes.tableBody,
          x: layout === 'u' ? bench + 6 : 8,
          y: tableTop,
          width: w - (layout === 'u' ? bench + 14 : 16),
          height: Math.max(tableBottom - tableTop, 10),
          rx: 4,
          fill,
          stroke: color,
        }),
        ...tableText(
          { ...node, height: hgt },
          color,
          node.data?.seats ? `${node.data.seats}` : null,
        ),
      ])
    }
  },
})

const BarShape = defineComponent({
  name: 'RestaurantBarShape',
  props: rendererProps,
  setup(props) {
    const status = useStatus(props)

    return () => {
      const { node } = props
      const stool = node.data?.chairSize ?? 36

      return h('g', { 'data-status': status.value.status }, [
        h('rect', { class: classes.counter, width: node.width, height: node.height, rx: 6 }),
        ...getBarStoolPositions(node).map((seat, index) =>
          h('circle', { key: index, class: classes.chair, cx: seat.x, cy: seat.y, r: stool / 2 }),
        ),
        ...tableText(node, status.value.color, null),
      ])
    }
  },
})

const ZONE_COLORS: Record<string, string> = {
  dining: 'blue',
  indoor: 'indigo',
  outdoor: 'green',
  bar: 'orange',
  kitchen: 'grape',
  entrance: 'cyan',
  walkway: 'gray',
  restricted: 'red',
}

const ZoneShape = defineComponent({
  name: 'RestaurantZoneShape',
  props: rendererProps,
  setup(props) {
    const { resolveColor } = useDiagramContext()

    return () => {
      const { node, controller } = props
      const kind = node.data?.kind ?? 'dining'
      const color = resolveColor(node.style?.stroke ?? ZONE_COLORS[kind] ?? 'blue')!
      const fill = node.style?.fill
        ? resolveColor(node.style.fill)!
        : `color-mix(in srgb, ${color} ${kind === 'restricted' ? 12 : 7}%, transparent)`
      const points = getDataPoints(node)
      const editing = controller.editing.value?.id === node.id
      const fontSize = node.style?.fontSize ?? 14

      return h('g', [
        points.length >= 3
          ? h('polygon', { class: classes.zone, points: pointsAttr(points), fill, stroke: color })
          : h('rect', {
              class: classes.zone,
              width: node.width,
              height: node.height,
              rx: 8,
              fill,
              stroke: color,
            }),
        node.label && !editing
          ? h(
              'text',
              {
                class: classes.zoneLabel,
                x: 12,
                y: 12 + fontSize,
                'font-size': fontSize,
                fill: color,
              },
              node.label,
            )
          : null,
      ])
    }
  },
})

const tableOutline = (node: DiagramNode): Point[] => getTableFootprint(node)

/** Copies get a new number from the extension, two tables with one number confuse guests. */
function dropNumber(node: DiagramNode): DiagramNode {
  if (node.data?.number === undefined) {
    return node
  }

  const { number: _number, ...data } = node.data

  return { ...node, data }
}

const seatsField = { path: 'data.seats', label: 'Seats', type: 'number' as const, min: 0, max: 40 }
const numberField = { path: 'data.number', label: 'Table number', type: 'text' as const }

function statusField(statuses: Record<string, TableStatusDefinition>) {
  return {
    path: 'data.status',
    label: 'Status',
    type: 'select' as const,
    defaultValue: DEFAULT_STATUS,
    options: Object.entries(statuses).map(([value, definition]) => ({
      value,
      label: definition.label,
    })),
  }
}

/** Node types of the restaurant extension. */
export function createRestaurantNodeTypes(
  statuses: Record<string, TableStatusDefinition> = DEFAULT_TABLE_STATUSES,
): DiagramNodeType[] {
  return [
    {
      type: TABLE_TYPE,
      name: 'Table',
      component: TableShape,
      defaults: {
        width: 90,
        height: 90,
        data: { shape: 'round', seats: 4, status: DEFAULT_STATUS },
      },
      outline: tableOutline,
      outlineExceedsBox: true,
      connectable: false,
      renderLabel: false,
      editableText: false,
      remapReferences: dropNumber,
      resizable: true,
      minWidth: 30,
      minHeight: 30,
      properties: [
        numberField,
        seatsField,
        {
          path: 'data.shape',
          label: 'Shape',
          type: 'select',
          defaultValue: 'round',
          options: [
            { value: 'round', label: 'Round' },
            { value: 'oval', label: 'Oval' },
            { value: 'square', label: 'Square' },
            { value: 'rectangle', label: 'Rectangle' },
          ],
        },
        {
          path: 'data.seatLayout',
          label: 'Chairs',
          type: 'select',
          defaultValue: 'around',
          options: [
            { value: 'around', label: 'All sides' },
            { value: 'long-sides', label: 'Long sides' },
            { value: 'one-side', label: 'One side' },
            { value: 'ends', label: 'Ends' },
          ],
        },
        statusField(statuses),
        { path: 'data.minSeats', label: 'Minimum party size', type: 'number', min: 0, max: 40 },
      ],
    },
    {
      type: BOOTH_TYPE,
      name: 'Booth',
      component: BoothShape,
      defaults: {
        width: 160,
        height: 160,
        data: { seats: 4, layout: 'double', status: DEFAULT_STATUS },
      },
      outline: (node) => rectToPolygon({ x: 0, y: 0, width: node.width, height: node.height }),
      remapReferences: dropNumber,
      connectable: false,
      renderLabel: false,
      editableText: false,
      properties: [
        numberField,
        seatsField,
        {
          path: 'data.layout',
          label: 'Benches',
          type: 'select',
          defaultValue: 'double',
          options: [
            { value: 'double', label: 'Two benches' },
            { value: 'single', label: 'One bench' },
            { value: 'u', label: 'U shape' },
          ],
        },
        statusField(statuses),
      ],
    },
    {
      type: BAR_TYPE,
      name: 'Bar counter',
      component: BarShape,
      defaults: { width: 360, height: 60, data: { seats: 6, status: DEFAULT_STATUS } },
      outline: (node) => {
        const reach = node.data?.seats ? (node.data?.chairSize ?? 36) + 8 : 0
        return rectToPolygon({ x: 0, y: 0, width: node.width, height: node.height + reach })
      },
      outlineExceedsBox: true,
      remapReferences: dropNumber,
      connectable: false,
      renderLabel: false,
      editableText: false,
      properties: [numberField, { ...seatsField, label: 'Stools' }, statusField(statuses)],
    },
    {
      type: ZONE_TYPE,
      name: 'Zone',
      component: ZoneShape,
      defaults: {
        width: 600,
        height: 400,
        label: 'Dining area',
        data: {
          kind: 'dining',
          points: [
            { x: 0, y: 0 },
            { x: 600, y: 0 },
            { x: 600, y: 400 },
            { x: 0, y: 400 },
          ],
        },
      },
      outline: (node) => {
        const points = getDataPoints(node)
        return points.length >= 3
          ? points
          : rectToPolygon({ x: 0, y: 0, width: node.width, height: node.height })
      },
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
        {
          path: 'data.kind',
          label: 'Zone type',
          type: 'select',
          defaultValue: 'dining',
          options: Object.keys(ZONE_COLORS).map((value) => ({
            value,
            label: value[0].toUpperCase() + value.slice(1),
          })),
        },
      ],
    },
  ]
}
