import { computed, defineComponent, h, type PropType } from 'vue'
import type { Rect } from '../../core/geometry'
import { estimateText, measureText, plainTextToRichText, wrapRichText } from '../../core/text'
import type { DiagramNode, DiagramRichText } from '../../core/types'
import {
  textMeasurementReady,
  useContrastColorResolver,
  useDiagramContext,
} from '../../vue/context'

const DEFAULT_FONT_SIZE = 14
const LINE_HEIGHT = 1.25

/**
 * Renders the label (or rich text) of a node, wrapped to fit a box in local coordinates. Custom
 * node renderers can use it to place text anywhere in the node.
 */
export const DiagramNodeLabel = defineComponent({
  name: 'DiagramNodeLabel',
  props: {
    /** Node whose style and text are rendered */
    node: { type: Object as PropType<DiagramNode>, required: true },
    /** Box in local coordinates, the whole node by default */
    box: { type: Object as PropType<Rect>, default: undefined },
    /** Text to render instead of the node label */
    text: { type: [String, Array] as PropType<string | DiagramRichText>, default: undefined },
    /** Inner padding in world units */
    padding: { type: Number, default: 6 },
  },
  setup(props) {
    const { resolveColor } = useDiagramContext()
    const resolveContrastColor = useContrastColorResolver()

    const layout = computed(() => {
      const { node } = props
      const style = node.style ?? {}
      const box = props.box ?? { x: 0, y: 0, width: node.width, height: node.height }
      const source = props.text ?? node.richText ?? node.label

      if (!source || (typeof source === 'string' && source.length === 0)) {
        return null
      }

      const fontSize = style.fontSize ?? DEFAULT_FONT_SIZE
      const font = {
        size: fontSize,
        weight: style.fontWeight,
        style: style.fontStyle,
        family: style.fontFamily,
      }
      const rich = typeof source === 'string' ? plainTextToRichText(source) : source
      const maxWidth = Math.max(1, box.width - props.padding * 2)
      const lines = wrapRichText(
        rich,
        maxWidth,
        font,
        textMeasurementReady.value ? measureText : estimateText,
      )
      const heights = lines.map((line) => line.size * LINE_HEIGHT)
      const total = heights.reduce((sum, value) => sum + value, 0)
      const align = style.textAlign ?? 'middle'
      const vertical = style.verticalAlign ?? 'middle'
      const x =
        align === 'start'
          ? box.x + props.padding
          : align === 'end'
            ? box.x + box.width - props.padding
            : box.x + box.width / 2
      const top =
        vertical === 'top'
          ? box.y + props.padding
          : vertical === 'bottom'
            ? box.y + box.height - props.padding - total
            : box.y + (box.height - total) / 2

      return { lines, heights, x, top, align, fontSize, style }
    })

    return () => {
      const value = layout.value

      if (!value) {
        return null
      }

      const { lines, heights, x, top, align, fontSize, style } = value
      let y = top

      return h(
        'text',
        {
          class: 'mantine-diagram-label',
          x,
          'text-anchor': align,
          'font-size': fontSize,
          'font-weight': style.fontWeight,
          'font-style': style.fontStyle,
          'font-family': style.fontFamily,
          fill:
            resolveColor(style.textColor) ??
            resolveContrastColor(style.fill) ??
            'var(--diagram-text)',
          'pointer-events': 'none',
        },
        lines.flatMap((line, index) => {
          y += heights[index]
          const baseline = y - (heights[index] - line.size) / 2 - line.size * 0.2

          return line.runs.map((run, runIndex) =>
            h(
              'tspan',
              {
                key: `${index}-${runIndex}`,
                x: runIndex === 0 ? x : undefined,
                y: runIndex === 0 ? baseline : undefined,
                'font-weight': run.bold ? 'bold' : undefined,
                'font-style': run.italic ? 'italic' : undefined,
                'text-decoration': run.underline ? 'underline' : undefined,
                'font-size': run.fontSize,
                fill: resolveColor(run.color),
              },
              run.text,
            ),
          )
        }),
      )
    }
  },
})
