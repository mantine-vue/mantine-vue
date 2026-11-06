import { computed, defineComponent, h } from 'vue'
import { DiagramNodeLabel } from '../shapes/DiagramNodeLabel'
import { getShadowFilter } from '../shapes/shape-utils'
import { useDiagramContext } from '../../vue/context'

/** Renders one node. Reads only its own record, so other nodes changing does not re-render it. */
export const DiagramNodeView = defineComponent({
  name: 'DiagramNodeView',
  props: {
    id: { type: String, required: true },
  },
  setup(props) {
    const { controller, resolveColor, labels, getStyles, domId } = useDiagramContext()
    const record = controller.nodeRef(props.id)
    const selected = computed(() => controller.selectionSet.value.has(props.id))
    const editing = computed(
      () => controller.editing.value?.kind === 'node' && controller.editing.value.id === props.id,
    )
    const colliding = computed(() => {
      const collisions = controller.state.collisions as ReadonlySet<string> | undefined
      return collisions?.has(props.id) ?? false
    })
    const layerOpacity = computed(() => {
      const node = record.value
      const layers = controller.layers.value
      const layer = layers.find((item) => item.id === node?.layerId) ?? layers[0]

      return layer?.opacity ?? 1
    })

    return () => {
      const node = record.value

      if (!node) {
        return null
      }

      const type = controller.nodeTypes.get(node.type)
      const component = type?.component ?? controller.nodeTypes.get('rect')!.component
      const { width, height } = node
      const rotation = node.rotation ?? 0
      const transform = `translate(${node.x} ${node.y})${rotation ? ` rotate(${rotation} ${width / 2} ${height / 2})` : ''}`
      const flips: string[] = []

      if (node.flipX) {
        flips.push(`translate(${width} 0) scale(-1 1)`)
      }

      if (node.flipY) {
        flips.push(`translate(0 ${height}) scale(1 -1)`)
      }

      const rendererProps = { node, selected: selected.value, controller }
      const content = type?.html
        ? h(
            'foreignObject',
            { width, height, ...getStyles('htmlNode') },
            h(
              'div',
              { xmlns: 'http://www.w3.org/1999/xhtml', style: { width: '100%', height: '100%' } },
              [h(component as any, rendererProps)],
            ),
          )
        : h(component as any, rendererProps)
      const opacity = (node.style?.opacity ?? 1) * layerOpacity.value
      const name = node.label || type?.name || node.type

      const nodeStyles = getStyles('node')

      return h(
        'g',
        {
          ...nodeStyles,
          id: domId(props.id),
          transform,
          opacity: opacity < 1 ? opacity : undefined,
          role: 'img',
          'aria-label': labels.value.nodeDescription(name, type?.name ?? node.type),
          'data-diagram-hit': 'node',
          'data-id': node.id,
          'data-type': node.type,
          'data-selected': selected.value || undefined,
          'data-locked': node.locked || undefined,
          'data-colliding': colliding.value || undefined,
          style: { ...nodeStyles.style, filter: getShadowFilter(node.style, resolveColor) },
        },
        [
          flips.length > 0 ? h('g', { transform: flips.join(' ') }, [content]) : content,
          type?.renderLabel !== false && !editing.value && (node.label || node.richText)
            ? h(DiagramNodeLabel, { node, box: type?.labelBox?.(node) })
            : null,
        ],
      )
    }
  },
})
