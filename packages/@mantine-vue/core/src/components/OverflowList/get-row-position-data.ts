interface NodePosition {
  elements: Set<HTMLElement>
  bottom: number
  top: number
}

function groupNodesByTopPosition(nodes: HTMLElement[]): Record<number, NodePosition> {
  return nodes.reduce<Record<number, NodePosition>>((result, node) => {
    const rect = node.getBoundingClientRect()
    const top = Math.round(rect.top)
    const bottom = Math.round(rect.bottom)
    const row = result[top] ?? { elements: new Set<HTMLElement>(), bottom, top }
    row.bottom = Math.max(row.bottom, bottom)
    row.elements.add(node)
    result[top] = row
    return result
  }, {})
}

export function getRowPositionsData(container: HTMLElement | null, overflow: HTMLElement | null) {
  if (!container) {
    return null
  }

  const children = Array.from(container.children).filter(
    (child) => child !== overflow,
  ) as HTMLElement[]
  if (children.length === 0) {
    return null
  }

  const itemsSizesMap = groupNodesByTopPosition(children)
  return { itemsSizesMap, rowPositions: Object.keys(itemsSizesMap).map(Number), children }
}
