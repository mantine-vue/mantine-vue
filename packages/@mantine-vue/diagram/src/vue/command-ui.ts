import type { DiagramLabels } from '../labels'
import type { DiagramIconName } from '../icons/icon-paths'
import type { DiagramController } from './use-diagram'

/** Icons of the built-in commands, used by toolbars and menus. */
export const COMMAND_ICONS: Record<string, DiagramIconName> = {
  undo: 'undo',
  redo: 'redo',
  copy: 'copy',
  cut: 'cut',
  paste: 'paste',
  duplicate: 'duplicate',
  delete: 'trash',
  group: 'group',
  ungroup: 'ungroup',
  lock: 'lock',
  unlock: 'unlock',
  bringToFront: 'bringToFront',
  bringForward: 'bringToFront',
  sendBackward: 'sendToBack',
  sendToBack: 'sendToBack',
  alignLeft: 'alignLeft',
  alignCenter: 'alignCenter',
  alignRight: 'alignRight',
  alignTop: 'alignTop',
  alignMiddle: 'alignMiddle',
  alignBottom: 'alignBottom',
  distributeHorizontal: 'distributeHorizontal',
  distributeVertical: 'distributeVertical',
  flipHorizontal: 'flipHorizontal',
  flipVertical: 'flipVertical',
  rotateClockwise: 'rotate',
  rotateCounterClockwise: 'rotate',
  zoomIn: 'zoomIn',
  zoomOut: 'zoomOut',
  zoomToFit: 'fit',
  zoomToSelection: 'fit',
  toggleSnap: 'magnet',
  editText: 'text',
}

export function commandLabel(controller: DiagramController, labels: DiagramLabels, id: string) {
  return labels.commands[id] ?? controller.editor.getCommand(id)?.label ?? id
}

export function toolLabel(controller: DiagramController, labels: DiagramLabels, id: string) {
  return labels.tools[id] ?? controller.editor.getTool(id)?.label ?? id
}

/** Formats a hotkey for display, e.g. `mod+shift+Z` as `Ctrl + Shift + Z`. */
export function formatShortcut(shortcut: string, mac = isMac()) {
  return shortcut
    .split('+')
    .map((part) => {
      const key = part.trim()

      switch (key.toLowerCase()) {
        case 'mod':
          return mac ? '⌘' : 'Ctrl'
        case 'alt':
          return mac ? '⌥' : 'Alt'
        case 'shift':
          return mac ? '⇧' : 'Shift'
        case 'ctrl':
          return 'Ctrl'
        default:
          return key
            .replace(/^Bracket(Left|Right)$/, (_, side) => (side === 'Left' ? '[' : ']'))
            .replace(/^Digit/, '')
            .replace(/^Equal$/, '=')
            .replace(/^\[plus\]$/, '+')
            .replace(/^Numpad(Add|Subtract|\d)$/, (_, key) =>
              key === 'Add' ? 'Num +' : key === 'Subtract' ? 'Num -' : `Num ${key}`,
            )
            .replace(/^Minus$/, '-')
            .replace(/^Quote$/, "'")
            .replace(/^Arrow/, '')
      }
    })
    .join(mac ? '' : ' + ')
}

function isMac() {
  return (
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
  )
}

/** Writes text to the system clipboard when the browser allows it. */
export function writeClipboard(text: string | null) {
  if (text && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {
      // The internal clipboard still works without permission.
    })
  }
}

/** Runs a command, syncing copy and cut with the system clipboard. */
export function runCommand(controller: DiagramController, id: string) {
  const { editor } = controller

  if (id === 'copy' || id === 'cut') {
    if (!editor.canExecute(id)) {
      return false
    }

    writeClipboard(id === 'copy' ? editor.copy() : editor.cut())
    return true
  }

  return editor.execute(id)
}
