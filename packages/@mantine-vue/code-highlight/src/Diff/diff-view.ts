import { h, type VNode, type VNodeChild } from 'vue'
import type {
  ExpandMarker,
  ProcessedRow,
  RevealedLineRow,
} from './apply-context-collapsing/apply-context-collapsing'
import type { DiffResult } from './diff-algorithm'
import type { LineRow } from './group-change-blocks/group-change-blocks'
import type { LineEntry } from './split-into-lines/split-into-lines'

type GetStyles = (selector: string, options?: Record<string, any>) => Record<string, any>

const LINE_STYLES_NAMES = {
  add: 'addedLine',
  remove: 'removedLine',
  equal: 'unchangedLine',
} as const

const CHANGE_MARKERS = {
  add: '+ ',
  remove: '- ',
}

function getLineCellStyles(
  getStyles: GetStyles,
  selector: 'lineNumber' | 'content',
  type: DiffResult['type'] | undefined,
) {
  if (!type) {
    return getStyles(selector)
  }

  const { class: className, style, ...attributes } = getStyles(LINE_STYLES_NAMES[type])
  return { ...getStyles(selector, { className, style }), ...attributes }
}

function renderInlineContent(
  inlineDiff: DiffResult[],
  side: 'add' | 'remove',
  getStyles: GetStyles,
) {
  return inlineDiff.map((part, index) => {
    if (part.type === 'equal') {
      return h('span', { key: index }, part.value)
    }

    if (part.type === side) {
      return h(
        'mark',
        { key: index, ...getStyles(side === 'add' ? 'addedHighlight' : 'removedHighlight') },
        part.value,
      )
    }

    return null
  })
}

interface LineCellsInput {
  entry: LineEntry | undefined
  gutters: 'both' | 'old' | 'new'
  inlineDiff?: DiffResult[]
  withLineNumbers: boolean
  getStyles: GetStyles
}

function renderLineCells({
  entry,
  gutters,
  inlineDiff,
  withLineNumbers,
  getStyles,
}: LineCellsInput): VNode[] {
  const lineType = entry?.type
  const changeType = entry && entry.type !== 'equal' ? entry.type : undefined
  const numbers =
    gutters === 'both'
      ? [entry?.oldLineNumber, entry?.newLineNumber]
      : [gutters === 'old' ? entry?.oldLineNumber : entry?.newLineNumber]

  const cells: VNode[] = withLineNumbers
    ? numbers.map((lineNumber, index) =>
        h(
          'td',
          { key: index, ...getLineCellStyles(getStyles, 'lineNumber', lineType) },
          lineNumber,
        ),
      )
    : []

  const content: VNodeChild[] = []
  if (changeType) {
    content.push(h('span', getStyles('changeMarker'), CHANGE_MARKERS[changeType]))
  }

  if (changeType && inlineDiff) {
    content.push(...renderInlineContent(inlineDiff, changeType, getStyles))
  } else if (entry) {
    content.push(entry.value || '\n')
  }

  cells.push(
    h('td', { key: 'content', ...getLineCellStyles(getStyles, 'content', lineType) }, content),
  )
  return cells
}

export interface DiffViewInput {
  mode: 'unified' | 'split'
  processedRows: ProcessedRow[]
  withLineNumbers: boolean
  getStyles: GetStyles
  onExpand: (sectionIndex: number) => void
  expandLabel: (hiddenCount: number) => string
  revealedRowRef: (node: Element | null) => void
}

function renderExpandRow(row: ExpandMarker, colSpan: number, input: DiffViewInput) {
  return h('tr', { key: `expand-${row.sectionIndex}`, ...input.getStyles('row') }, [
    h('td', { colspan: colSpan }, [
      h(
        'button',
        {
          type: 'button',
          ...input.getStyles('expandControl', { focusable: true }),
          onClick: () => input.onExpand(row.sectionIndex),
        },
        input.expandLabel(row.hiddenCount),
      ),
    ]),
  ])
}

function getLineRowProps(row: LineRow | RevealedLineRow, input: DiffViewInput) {
  if ('revealedSectionIndex' in row) {
    return {
      ...input.getStyles('row', { focusable: true }),
      tabindex: -1,
      'data-section': row.revealedSectionIndex,
      ref: input.revealedRowRef as any,
    }
  }

  return input.getStyles('row')
}

/** Renders diff rows as a table, unified or split (side-by-side) */
export function renderDiffView(input: DiffViewInput) {
  const { processedRows, withLineNumbers, getStyles, mode } = input
  const split = mode === 'split'
  const colSpan = split ? (withLineNumbers ? 5 : 3) : withLineNumbers ? 3 : 1

  const rows = processedRows.flatMap((row, index): VNode[] => {
    if (row.kind === 'expand') {
      return [renderExpandRow(row, colSpan, input)]
    }

    if (row.kind === 'block') {
      if (split) {
        return Array.from(
          { length: Math.max(row.removed.length, row.added.length) },
          (_, lineIndex) =>
            h('tr', { key: `${index}-${lineIndex}`, ...getStyles('row') }, [
              ...renderLineCells({
                entry: row.removed[lineIndex],
                gutters: 'old',
                inlineDiff: row.inlineDiffs[lineIndex],
                withLineNumbers,
                getStyles,
              }),
              h('td', { key: 'divider', ...getStyles('splitDivider') }),
              ...renderLineCells({
                entry: row.added[lineIndex],
                gutters: 'new',
                inlineDiff: row.inlineDiffs[lineIndex],
                withLineNumbers,
                getStyles,
              }),
            ]),
        )
      }

      return [
        ...row.removed.map((entry, lineIndex) =>
          h(
            'tr',
            { key: `${index}-remove-${lineIndex}`, ...getStyles('row') },
            renderLineCells({
              entry,
              gutters: 'both',
              inlineDiff: row.inlineDiffs[lineIndex],
              withLineNumbers,
              getStyles,
            }),
          ),
        ),
        ...row.added.map((entry, lineIndex) =>
          h(
            'tr',
            { key: `${index}-add-${lineIndex}`, ...getStyles('row') },
            renderLineCells({
              entry,
              gutters: 'both',
              inlineDiff: row.inlineDiffs[lineIndex],
              withLineNumbers,
              getStyles,
            }),
          ),
        ),
      ]
    }

    const cells = split
      ? [
          ...renderLineCells({ entry: row, gutters: 'old', withLineNumbers, getStyles }),
          h('td', { key: 'divider', ...getStyles('splitDivider') }),
          ...renderLineCells({ entry: row, gutters: 'new', withLineNumbers, getStyles }),
        ]
      : renderLineCells({ entry: row, gutters: 'both', withLineNumbers, getStyles })

    return [h('tr', { key: index, ...getLineRowProps(row, input) }, cells)]
  })

  return h('table', getStyles('table'), [h('tbody', rows)])
}
