import { computed, defineComponent, h, type PropType } from 'vue'
import { getArrowhead, endAngle } from '../../core/routing'
import { BUILT_IN_NODE_BEHAVIORS, getDataPoints, SHAPE_OUTLINES } from '../../core/shapes'
import type { DiagramNode } from '../../core/types'
import { useDiagramContext } from '../../vue/context'
import type { DiagramNodeType } from '../../vue/types'
import { getShapeAttrs, isSafeImageUrl, pointsAttr, sanitizePathData } from './shape-utils'

const nodeProps = {
  node: { type: Object as PropType<DiagramNode>, required: true as const },
  selected: { type: Boolean, default: false },
  controller: { type: Object, required: true as const },
}

/** Defines an SVG renderer from a function of the node and its presentation attributes. */
function defineShape(
  name: string,
  render: (node: DiagramNode, attrs: ReturnType<typeof getShapeAttrs>) => any,
) {
  return defineComponent({
    name,
    props: nodeProps,
    setup(props) {
      const { resolveColor } = useDiagramContext()
      const attrs = computed(() => getShapeAttrs(props.node.style, resolveColor))

      return () => render(props.node, attrs.value)
    },
  })
}

const RectShape = defineShape('DiagramRectShape', (node, attrs) =>
  h('rect', {
    width: node.width,
    height: node.height,
    rx: node.style?.cornerRadius ?? 0,
    ...attrs,
  }),
)

const StadiumShape = defineShape('DiagramStadiumShape', (node, attrs) =>
  h('rect', {
    width: node.width,
    height: node.height,
    rx: Math.min(node.width, node.height) / 2,
    ...attrs,
  }),
)

const EllipseShape = defineShape('DiagramEllipseShape', (node, attrs) =>
  h('ellipse', {
    cx: node.width / 2,
    cy: node.height / 2,
    rx: node.width / 2,
    ry: node.height / 2,
    ...attrs,
  }),
)

const outlineShape = (
  name: string,
  factory: (w: number, h: number) => { x: number; y: number }[],
) =>
  defineShape(name, (node, attrs) =>
    h('polygon', { points: pointsAttr(factory(node.width, node.height)), ...attrs }),
  )

const CylinderShape = defineShape('DiagramCylinderShape', (node, attrs) => {
  const { width: w, height: hgt } = node
  const ry = Math.min(hgt * 0.15, w * 0.25)

  return h('g', [
    h('path', {
      d: `M0 ${ry} A${w / 2} ${ry} 0 0 1 ${w} ${ry} L${w} ${hgt - ry} A${w / 2} ${ry} 0 0 1 0 ${hgt - ry} Z`,
      ...attrs,
    }),
    h('path', { d: `M0 ${ry} A${w / 2} ${ry} 0 0 0 ${w} ${ry}`, ...attrs, fill: 'none' }),
  ])
})

const DocumentShape = defineShape('DiagramDocumentShape', (node, attrs) => {
  const { width: w, height: hgt } = node
  const wave = hgt * 0.12

  return h('path', {
    d: `M0 0 H${w} V${hgt - wave} C${w * 0.75} ${hgt - wave * 2.5} ${w * 0.25} ${hgt + wave * 0.5} 0 ${hgt - wave} Z`,
    ...attrs,
  })
})

const NoteShape = defineShape('DiagramNoteShape', (node, attrs) => {
  const { width: w, height: hgt } = node
  const fold = Math.min(18, w / 4, hgt / 4)

  return h('g', [
    h('path', {
      d: `M0 0 H${w - fold} L${w} ${fold} V${hgt} H0 Z`,
      ...attrs,
      fill: attrs.fill === 'var(--diagram-node-fill)' ? 'var(--diagram-note-fill)' : attrs.fill,
    }),
    h('path', { d: `M${w - fold} 0 V${fold} H${w}`, ...attrs, fill: 'none' }),
  ])
})

const PolygonShape = defineShape('DiagramPolygonShape', (node, attrs) =>
  h('polygon', { points: pointsAttr(getDataPoints(node)), ...attrs }),
)

const LineShape = defineComponent({
  name: 'DiagramLineShape',
  props: nodeProps,
  setup(props) {
    const { resolveColor } = useDiagramContext()

    return () => {
      const { node } = props
      const points = getDataPoints(node)
      const attrs = getShapeAttrs(node.style, resolveColor, { strokeWidth: 2 })
      const size = 8 + attrs['stroke-width'] * 2
      const arrows = (['source', 'target'] as const).map((end) => {
        const type = end === 'source' ? node.data?.startArrow : node.data?.endArrow
        const tip = end === 'source' ? points[0] : points[points.length - 1]

        return tip ? getArrowhead(type, tip, endAngle(points, end), size) : null
      })

      return h('g', [
        // Wide transparent stroke, thin lines are hard to hit otherwise.
        h('polyline', {
          points: pointsAttr(points),
          fill: 'none',
          stroke: 'transparent',
          'stroke-width': 12,
        }),
        h('polyline', {
          points: pointsAttr(points),
          ...attrs,
          fill: 'none',
          'stroke-linecap': 'round',
        }),
        ...arrows.map((arrow) =>
          arrow
            ? h('path', {
                d: arrow.path,
                fill: arrow.filled ? attrs.stroke : 'var(--diagram-background)',
                stroke: attrs.stroke,
                'stroke-width': attrs['stroke-width'],
                'stroke-linejoin': 'round',
              })
            : null,
        ),
      ])
    }
  },
})

const PathShape = defineShape('DiagramPathShape', (node, attrs) => {
  const viewBox = node.data?.viewBox as [number, number] | undefined
  const [vbWidth, vbHeight] =
    viewBox && viewBox[0] > 0 && viewBox[1] > 0 ? viewBox : [node.width, node.height]

  return h('path', {
    d: sanitizePathData(node.data?.d),
    transform: `scale(${node.width / vbWidth} ${node.height / vbHeight})`,
    'vector-effect': 'non-scaling-stroke',
    ...attrs,
  })
})

/** Text has no background unless the style sets one, the label renderer draws the text. */
const TextShape = defineComponent({
  name: 'DiagramTextShape',
  props: nodeProps,
  setup(props) {
    const { resolveColor } = useDiagramContext()

    return () =>
      h('rect', {
        width: props.node.width,
        height: props.node.height,
        rx: props.node.style?.cornerRadius ?? 0,
        fill: resolveColor(props.node.style?.fill) ?? 'transparent',
        stroke: resolveColor(props.node.style?.stroke) ?? 'none',
        'stroke-width': props.node.style?.strokeWidth ?? 1,
      })
  },
})

const ImageShape = defineComponent({
  name: 'DiagramImageShape',
  props: nodeProps,
  setup(props) {
    const { resolveColor } = useDiagramContext()

    return () => {
      const { node } = props
      const src = node.data?.src
      const fit = node.data?.fit ?? 'contain'
      const preserve =
        fit === 'fill' ? 'none' : fit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet'

      return h('g', [
        h('rect', {
          width: node.width,
          height: node.height,
          fill: resolveColor(node.style?.fill) ?? 'transparent',
          stroke: resolveColor(node.style?.stroke) ?? 'none',
          'stroke-width': node.style?.strokeWidth ?? 1,
        }),
        isSafeImageUrl(src)
          ? h('image', {
              href: src,
              width: node.width,
              height: node.height,
              preserveAspectRatio: preserve,
              opacity: node.data?.opacity,
            })
          : null,
      ])
    }
  },
})

/** Groups have no own visuals, the selection frame shows their bounds. */
const GroupShape = defineComponent({
  name: 'DiagramGroupShape',
  props: nodeProps,
  setup: () => () => null,
})

const RENDERERS: Record<string, any> = {
  rect: RectShape,
  ellipse: EllipseShape,
  circle: EllipseShape,
  stadium: StadiumShape,
  cylinder: CylinderShape,
  document: DocumentShape,
  note: NoteShape,
  polygon: PolygonShape,
  line: LineShape,
  path: PathShape,
  text: TextShape,
  image: ImageShape,
  group: GroupShape,
  ...Object.fromEntries(
    Object.entries(SHAPE_OUTLINES).map(([type, factory]) => [
      type,
      outlineShape(`Diagram${type}Shape`, factory),
    ]),
  ),
}

const NAMES: Record<string, string> = {
  rect: 'Rectangle',
  ellipse: 'Ellipse',
  circle: 'Circle',
  diamond: 'Decision',
  triangle: 'Triangle',
  hexagon: 'Hexagon',
  parallelogram: 'Data',
  trapezoid: 'Manual operation',
  star: 'Star',
  octagon: 'Octagon',
  stadium: 'Terminator',
  cylinder: 'Database',
  document: 'Document',
  note: 'Note',
  polygon: 'Polygon',
  line: 'Line',
  path: 'Path',
  text: 'Text',
  image: 'Image',
  group: 'Group',
}

/** Built-in node types: behaviors from the core paired with SVG renderers. */
export const BUILT_IN_NODE_TYPES: DiagramNodeType[] = BUILT_IN_NODE_BEHAVIORS.map((behavior) => ({
  ...behavior,
  name: NAMES[behavior.type] ?? behavior.type,
  component: RENDERERS[behavior.type],
  renderLabel: behavior.type !== 'group' && behavior.type !== 'line' && behavior.type !== 'image',
  properties:
    behavior.type === 'image'
      ? [
          { path: 'data.src', label: 'Image URL', type: 'text' },
          {
            path: 'data.fit',
            label: 'Fit',
            type: 'select',
            defaultValue: 'contain',
            options: [
              { value: 'contain', label: 'Contain' },
              { value: 'cover', label: 'Cover' },
              { value: 'fill', label: 'Stretch' },
            ],
          },
        ]
      : behavior.type === 'line'
        ? (['startArrow', 'endArrow'] as const).map((key) => ({
            path: `data.${key}`,
            label: key === 'startArrow' ? 'Start arrow' : 'End arrow',
            type: 'select' as const,
            defaultValue: 'none',
            options: ['none', 'arrow', 'triangle', 'circle', 'bar'].map((value) => ({
              value,
              label: value,
            })),
          }))
        : undefined,
}))
