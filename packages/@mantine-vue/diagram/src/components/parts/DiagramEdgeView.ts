import { computed, defineComponent, h } from 'vue'
import { pointAlongPolyline } from '../../core/geometry'
import { endAngle, getArrowhead } from '../../core/routing'
import { estimateText, measureText } from '../../core/text'
import type { DiagramEdgeLabel } from '../../core/types'
import { textMeasurementReady, useDiagramContext } from '../../vue/context'

const LABEL_FONT_SIZE = 12

/** Renders one connector with its arrowheads and labels. */
export const DiagramEdgeView = defineComponent({
  name: 'DiagramEdgeView',
  props: {
    id: { type: String, required: true },
  },
  setup(props) {
    const { controller, resolveColor, labels, getStyles, domId } = useDiagramContext()
    const record = controller.edgeRef(props.id)
    const selected = computed(() => controller.selectionSet.value.has(props.id))
    const editing = computed(
      () => controller.editing.value?.kind === 'edge' && controller.editing.value.id === props.id,
    )
    const layerOpacity = computed(() => {
      const edge = record.value
      const layers = controller.layers.value
      const layer = layers.find((item) => item.id === edge?.layerId) ?? layers[0]

      return layer?.opacity ?? 1
    })

    const route = computed(() => {
      const edge = record.value

      if (!edge) {
        return null
      }

      // Depend on the connected nodes, and on commits for routes that avoid other nodes.
      if (edge.source.nodeId) {
        void controller.nodeRef(edge.source.nodeId).value
      }

      if (edge.target.nodeId) {
        void controller.nodeRef(edge.target.nodeId).value
      }

      void controller.routeVersion.value

      return controller.editor.getEdgeRoute(edge)
    })

    const name = (nodeId: string | undefined) => {
      const node = nodeId ? controller.nodeRef(nodeId).value : undefined

      return node?.label || node?.type || labels.value.untitled
    }

    return () => {
      const edge = record.value
      const path = route.value

      if (!edge || !path) {
        return null
      }

      const style = edge.style ?? {}
      const stroke = resolveColor(style.stroke) ?? 'var(--diagram-edge-stroke)'
      const strokeWidth = style.strokeWidth ?? 1.5
      const arrowSize = 8 + strokeWidth * 2
      const arrows = (['source', 'target'] as const).map((end) => {
        const type = end === 'source' ? edge.sourceArrow : (edge.targetArrow ?? 'arrow')
        const tip = end === 'source' ? path.points[0] : path.points[path.points.length - 1]

        return tip ? getArrowhead(type, tip, endAngle(path.points, end), arrowSize) : null
      })
      const textColor = resolveColor(style.textColor) ?? 'var(--diagram-text)'
      const allLabels: DiagramEdgeLabel[] = [
        ...(edge.label && !editing.value ? [{ text: edge.label, position: 0.5 }] : []),
        ...(edge.labels ?? []),
      ]

      return h(
        'g',
        {
          ...getStyles('edge'),
          id: domId(edge.id),
          role: 'img',
          'aria-label': labels.value.edgeDescription(
            name(edge.source.nodeId),
            name(edge.target.nodeId),
          ),
          'data-diagram-hit': 'edge',
          'data-id': edge.id,
          'data-selected': selected.value || undefined,
          opacity:
            (style.opacity ?? 1) * layerOpacity.value < 1
              ? (style.opacity ?? 1) * layerOpacity.value
              : undefined,
        },
        [
          h('path', {
            d: path.path,
            fill: 'none',
            stroke: 'transparent',
            'stroke-width': 14,
            'stroke-linejoin': 'round',
            class: 'mantine-diagram-edge-hit',
          }),
          h('path', {
            ...getStyles('edgePath'),
            d: path.path,
            fill: 'none',
            stroke,
            'stroke-width': strokeWidth,
            'stroke-dasharray': style.strokeDasharray,
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round',
          }),
          ...arrows.map((arrow) =>
            arrow
              ? h('path', {
                  d: arrow.path,
                  fill: arrow.filled ? stroke : 'var(--diagram-background)',
                  stroke,
                  'stroke-width': strokeWidth,
                  'stroke-linejoin': 'round',
                })
              : null,
          ),
          ...allLabels.map((label, index) => {
            const { point, angle } = pointAlongPolyline(path.points, label.position ?? 0.5)
            const offset = label.offset ?? 0
            const rad = ((angle + 90) * Math.PI) / 180
            const x = point.x + Math.cos(rad) * offset
            const y = point.y + Math.sin(rad) * offset
            const fontSize = style.fontSize ?? LABEL_FONT_SIZE
            const measure = textMeasurementReady.value ? measureText : estimateText
            const width = measure(label.text, { size: fontSize }) + 8

            return h(
              'g',
              { key: index, transform: `translate(${x} ${y})`, ...getStyles('edgeLabel') },
              [
                h('rect', {
                  x: -width / 2,
                  y: -fontSize * 0.75,
                  width,
                  height: fontSize * 1.5,
                  rx: 3,
                  fill: 'var(--diagram-background)',
                }),
                h(
                  'text',
                  {
                    'text-anchor': 'middle',
                    'dominant-baseline': 'central',
                    'font-size': fontSize,
                    fill: textColor,
                  },
                  label.text,
                ),
              ],
            )
          }),
        ],
      )
    }
  },
})
