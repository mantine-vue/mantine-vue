import type { DiagramCommand, DiagramEditor } from './editor'
import { getNodeBounds } from './shapes'

const hasSelection = (editor: DiagramEditor) => editor.selection.size > 0
const hasNodes = (count: number) => (editor: DiagramEditor) =>
  editor.getSelectedNodes().filter((node) => editor.isNodeEditable(node)).length >= count
const hasEditable = (editor: DiagramEditor) =>
  editor.getSelectedNodes().some((node) => editor.isNodeEditable(node)) ||
  editor.getSelectedEdges().some((edge) => editor.isEdgeEditable(edge))

function nudge(editor: DiagramEditor, dx: number, dy: number) {
  editor.moveBy(editor.selection, dx, dy, { mergeKey: 'nudge' })
}

/** Top level selectable nodes in reading order: rows top to bottom, left to right. */
export function getFocusOrder(editor: DiagramEditor) {
  return editor.store
    .getNodes()
    .filter((node) => !node.parentId && editor.isNodeSelectable(node))
    .sort((a, b) => {
      const ra = getNodeBounds(a)
      const rb = getNodeBounds(b)
      // Rows of roughly the same height read left to right.
      return Math.abs(ra.y - rb.y) > Math.min(ra.height, rb.height) / 2 ? ra.y - rb.y : ra.x - rb.x
    })
}

/**
 * Whether Tab (or Shift+Tab) moves the selection to another node. At either end of the order
 * the key is left to the browser, so keyboard users can always leave the canvas.
 */
export function canFocusNext(editor: DiagramEditor, direction: 1 | -1) {
  const nodes = getFocusOrder(editor)
  const current = editor.getSelectedIds()[0]
  const index = nodes.findIndex((node) => node.id === current)

  if (nodes.length === 0) {
    return false
  }

  if (index === -1) {
    return direction === 1
  }

  return direction === 1 ? index < nodes.length - 1 : index > 0
}

/** Moves the selection to the next or previous node in reading order and keeps it visible. */
export function focusNextNode(editor: DiagramEditor, direction: 1 | -1) {
  const nodes = getFocusOrder(editor)

  if (nodes.length === 0) {
    return
  }

  const current = editor.getSelectedIds()[0]
  const index = nodes.findIndex((node) => node.id === current)
  const next =
    index === -1 ? nodes[0] : nodes[Math.min(nodes.length - 1, Math.max(0, index + direction))]
  editor.setSelection([next.id])

  const visible = editor.getVisibleRect()
  const bounds = getNodeBounds(next)

  if (
    visible.width > 0 &&
    (bounds.x < visible.x ||
      bounds.y < visible.y ||
      bounds.x + bounds.width > visible.x + visible.width ||
      bounds.y + bounds.height > visible.y + visible.height)
  ) {
    editor.centerOn(
      { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 },
      { animate: true },
    )
  }
}

/**
 * Commands registered on every editor. Labels are English defaults, the Vue layer translates
 * them. Shortcuts match either the produced character or the physical key (`KeyboardEvent.code`).
 */
export function createBuiltInCommands(): DiagramCommand[] {
  return [
    {
      id: 'undo',
      label: 'Undo',
      shortcuts: ['mod+Z'],
      isEnabled: (editor) => editor.canUndo,
      run: (editor) => editor.undo(),
    },
    {
      id: 'redo',
      label: 'Redo',
      shortcuts: ['mod+shift+Z', 'mod+Y'],
      isEnabled: (editor) => editor.canRedo,
      run: (editor) => editor.redo(),
    },
    {
      id: 'copy',
      label: 'Copy',
      shortcuts: ['mod+C'],
      readOnly: true,
      isEnabled: (editor) => hasSelection(editor) && editor.mode !== 'view',
      run: (editor) => editor.copy(),
    },
    {
      id: 'cut',
      label: 'Cut',
      shortcuts: ['mod+X'],
      isEnabled: hasEditable,
      run: (editor) => editor.cut(),
    },
    {
      id: 'paste',
      label: 'Paste',
      shortcuts: ['mod+V'],
      isEnabled: (editor) => editor.hasClipboard,
      run: (editor) => editor.paste(),
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      shortcuts: ['mod+D'],
      isEnabled: hasSelection,
      run: (editor) => editor.duplicate(),
    },
    {
      id: 'delete',
      label: 'Delete',
      shortcuts: ['Delete', 'Backspace'],
      isEnabled: hasEditable,
      run: (editor) => editor.deleteSelection(),
    },
    {
      id: 'selectAll',
      label: 'Select all',
      shortcuts: ['mod+A'],
      readOnly: true,
      isEnabled: (editor) => editor.mode !== 'view',
      run: (editor) => editor.selectAll(),
    },
    {
      id: 'clearSelection',
      label: 'Clear selection',
      readOnly: true,
      isEnabled: hasSelection,
      run: (editor) => editor.clearSelection(),
    },
    {
      id: 'group',
      label: 'Group',
      shortcuts: ['mod+G'],
      isEnabled: hasNodes(2),
      run: (editor) => editor.group(),
    },
    {
      id: 'ungroup',
      label: 'Ungroup',
      shortcuts: ['mod+shift+G'],
      isEnabled: (editor) =>
        editor.getSelectedNodes().some((node) => editor.getBehavior(node.type).container),
      run: (editor) => editor.ungroup(),
    },
    {
      id: 'lock',
      label: 'Lock',
      shortcuts: ['mod+L'],
      isEnabled: (editor) =>
        editor.canEdit &&
        (editor
          .getSelectedNodes()
          .some((node) => !node.locked && editor.getLayerOf(node)?.locked !== true) ||
          editor
            .getSelectedEdges()
            .some((edge) => !edge.locked && editor.getLayerOf(edge)?.locked !== true)),
      run: (editor) => editor.setLocked(editor.selection, true),
    },
    {
      id: 'unlock',
      label: 'Unlock',
      shortcuts: ['mod+shift+L'],
      isEnabled: (editor) =>
        editor.canEdit &&
        (editor
          .getSelectedNodes()
          .some((node) => node.locked && editor.getLayerOf(node)?.locked !== true) ||
          editor
            .getSelectedEdges()
            .some((edge) => edge.locked && editor.getLayerOf(edge)?.locked !== true)),
      run: (editor) => editor.setLocked(editor.selection, false),
    },
    {
      id: 'bringToFront',
      label: 'Bring to front',
      shortcuts: ['mod+shift+BracketRight'],
      isEnabled: hasNodes(1),
      run: (editor) => editor.reorder(editor.selection, 'front'),
    },
    {
      id: 'bringForward',
      label: 'Bring forward',
      shortcuts: ['mod+BracketRight'],
      isEnabled: hasNodes(1),
      run: (editor) => editor.reorder(editor.selection, 'forward'),
    },
    {
      id: 'sendBackward',
      label: 'Send backward',
      shortcuts: ['mod+BracketLeft'],
      isEnabled: hasNodes(1),
      run: (editor) => editor.reorder(editor.selection, 'backward'),
    },
    {
      id: 'sendToBack',
      label: 'Send to back',
      shortcuts: ['mod+shift+BracketLeft'],
      isEnabled: hasNodes(1),
      run: (editor) => editor.reorder(editor.selection, 'back'),
    },
    ...(['left', 'center', 'right', 'top', 'middle', 'bottom'] as const).map(
      (alignment): DiagramCommand => ({
        id: `align${alignment[0].toUpperCase()}${alignment.slice(1)}`,
        label: `Align ${alignment}`,
        shortcuts: {
          left: ['alt+A'],
          center: ['alt+H'],
          right: ['alt+D'],
          top: ['alt+W'],
          middle: ['alt+V'],
          bottom: ['alt+S'],
        }[alignment],
        isEnabled: hasNodes(2),
        run: (editor) => editor.align(alignment),
      }),
    ),
    {
      id: 'distributeHorizontal',
      label: 'Distribute horizontally',
      shortcuts: ['alt+shift+H'],
      isEnabled: hasNodes(3),
      run: (editor) => editor.distribute('horizontal'),
    },
    {
      id: 'distributeVertical',
      label: 'Distribute vertically',
      shortcuts: ['alt+shift+V'],
      isEnabled: hasNodes(3),
      run: (editor) => editor.distribute('vertical'),
    },
    {
      id: 'matchWidth',
      label: 'Match width',
      isEnabled: hasNodes(2),
      run: (editor) => editor.matchSize('width'),
    },
    {
      id: 'matchHeight',
      label: 'Match height',
      isEnabled: hasNodes(2),
      run: (editor) => editor.matchSize('height'),
    },
    {
      id: 'flipHorizontal',
      label: 'Flip horizontal',
      shortcuts: ['shift+H'],
      isEnabled: hasNodes(1),
      run: (editor) => editor.flip(editor.selection, 'horizontal'),
    },
    {
      id: 'flipVertical',
      label: 'Flip vertical',
      shortcuts: ['shift+V'],
      isEnabled: hasNodes(1),
      run: (editor) => editor.flip(editor.selection, 'vertical'),
    },
    {
      id: 'rotateClockwise',
      label: 'Rotate 90° clockwise',
      shortcuts: ['mod+shift+R'],
      isEnabled: hasNodes(1),
      run: (editor) => editor.rotateBy(editor.selection, 90),
    },
    {
      id: 'rotateCounterClockwise',
      label: 'Rotate 90° counterclockwise',
      shortcuts: ['mod+alt+R'],
      isEnabled: hasNodes(1),
      run: (editor) => editor.rotateBy(editor.selection, -90),
    },
    {
      id: 'editText',
      label: 'Edit text',
      shortcuts: ['Enter', 'F2'],
      isEnabled: (editor) => editor.selection.size === 1,
      run: (editor) => {
        const [id] = editor.getSelectedIds()
        editor.startTextEdit({ kind: editor.store.hasNode(id) ? 'node' : 'edge', id })
      },
    },
    ...(
      [
        ['nudgeLeft', 'ArrowLeft', -1, 0],
        ['nudgeRight', 'ArrowRight', 1, 0],
        ['nudgeUp', 'ArrowUp', 0, -1],
        ['nudgeDown', 'ArrowDown', 0, 1],
      ] as const
    ).flatMap(([id, key, x, y]): DiagramCommand[] => [
      {
        id,
        label: `Move ${key.replace('Arrow', '').toLowerCase()}`,
        shortcuts: [key],
        isEnabled: hasEditable,
        run: (editor) =>
          nudge(editor, x * editor.options.nudge.small, y * editor.options.nudge.small),
      },
      {
        id: `${id}Large`,
        label: `Move ${key.replace('Arrow', '').toLowerCase()} further`,
        shortcuts: [`shift+${key}`],
        isEnabled: hasEditable,
        run: (editor) => {
          const step = editor.options.snapToGrid ? editor.gridSize : editor.options.nudge.large
          nudge(editor, x * step, y * step)
        },
      },
    ]),
    {
      id: 'focusNext',
      label: 'Select next element',
      shortcuts: ['Tab'],
      readOnly: true,
      isEnabled: (editor) => editor.mode !== 'view' && canFocusNext(editor, 1),
      run: (editor) => focusNextNode(editor, 1),
    },
    {
      id: 'focusPrevious',
      label: 'Select previous element',
      shortcuts: ['shift+Tab'],
      readOnly: true,
      isEnabled: (editor) => editor.mode !== 'view' && canFocusNext(editor, -1),
      run: (editor) => focusNextNode(editor, -1),
    },
    {
      id: 'zoomIn',
      label: 'Zoom in',
      // Ctrl + + is Ctrl + Shift + = on many layouts, its own key on others and on numpads.
      shortcuts: [
        'mod+Equal',
        'mod+shift+Equal',
        'mod+[plus]',
        'mod+shift+[plus]',
        'mod+NumpadAdd',
        'Equal',
        'shift+Equal',
        '[plus]',
        'shift+[plus]',
      ],
      readOnly: true,
      captureShortcuts: true,
      isEnabled: (editor) => editor.viewport.zoom < editor.options.maxZoom,
      run: (editor) => editor.zoomIn(),
    },
    {
      id: 'zoomOut',
      label: 'Zoom out',
      shortcuts: ['mod+Minus', 'mod+shift+Minus', 'mod+NumpadSubtract', 'Minus'],
      readOnly: true,
      captureShortcuts: true,
      isEnabled: (editor) => editor.viewport.zoom > editor.options.minZoom,
      run: (editor) => editor.zoomOut(),
    },
    {
      id: 'zoomReset',
      label: 'Zoom to 100%',
      shortcuts: ['mod+Digit0', 'mod+Numpad0', 'shift+Digit0'],
      readOnly: true,
      captureShortcuts: true,
      run: (editor) => editor.zoomTo(1, undefined, { animate: true }),
    },
    {
      id: 'zoomToFit',
      label: 'Zoom to fit',
      shortcuts: ['shift+Digit1'],
      readOnly: true,
      run: (editor) => editor.fitView({ animate: true }),
    },
    {
      id: 'zoomToSelection',
      label: 'Zoom to selection',
      shortcuts: ['shift+Digit2'],
      readOnly: true,
      isEnabled: hasSelection,
      run: (editor) => editor.zoomToSelection({ animate: true }),
    },
    {
      id: 'toggleSnap',
      label: 'Snap to grid',
      shortcuts: ['mod+shift+Quote'],
      readOnly: true,
      run: (editor) => editor.setOptions({ snapToGrid: !editor.options.snapToGrid }),
    },
    {
      id: 'toggleGuides',
      label: 'Smart guides',
      readOnly: true,
      run: (editor) => editor.setOptions({ smartGuides: !editor.options.smartGuides }),
    },
  ]
}
