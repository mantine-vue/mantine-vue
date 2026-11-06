import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { getHotkeyHandler } from '@mantine-vue/hooks'
import type { DiagramEdge, DiagramId, DiagramNode, DiagramViewport } from '../core/types'
import { useOptionalDiagramContext } from './context'
import type { DiagramController } from './use-diagram'

function resolveController(controller?: DiagramController): DiagramController {
  const resolved = controller ?? useOptionalDiagramContext()?.controller

  if (!resolved) {
    throw new Error(
      '[@mantine-vue/diagram] Pass a controller or use the composable inside a Diagram or DiagramProvider',
    )
  }

  return resolved
}

/** Reactive selection with helpers. Uses the controller of the surrounding diagram by default. */
export function useDiagramSelection(controller?: DiagramController) {
  const ctrl = resolveController(controller)
  const { editor } = ctrl

  const nodes = computed(() =>
    ctrl.selection.value
      .map((id) => ctrl.nodeRef(id).value)
      .filter((node): node is DiagramNode => Boolean(node)),
  )
  const edges = computed(() =>
    ctrl.selection.value
      .map((id) => ctrl.edgeRef(id).value)
      .filter((edge): edge is DiagramEdge => Boolean(edge)),
  )

  return {
    ids: ctrl.selection,
    nodes,
    edges,
    isEmpty: computed(() => ctrl.selection.value.length === 0),
    isSelected: (id: DiagramId) => ctrl.selectionSet.value.has(id),
    select: (ids: DiagramId | DiagramId[], options?: { additive?: boolean; toggle?: boolean }) =>
      editor.select(ids, options),
    set: (ids: DiagramId[]) => editor.setSelection(ids),
    clear: () => editor.clearSelection(),
    selectAll: () => editor.selectAll(),
  }
}

/** Undo and redo state with labels of the next steps. */
export function useDiagramHistory(controller?: DiagramController) {
  const ctrl = resolveController(controller)
  const { editor } = ctrl

  return {
    canUndo: ctrl.canUndo,
    canRedo: ctrl.canRedo,
    undoLabel: computed(() => {
      void ctrl.commitVersion.value
      return ctrl.canUndo.value ? editor.store.undoLabel : undefined
    }),
    redoLabel: computed(() => {
      void ctrl.commitVersion.value
      return ctrl.canRedo.value ? editor.store.redoLabel : undefined
    }),
    undo: () => editor.undo(),
    redo: () => editor.redo(),
    clear: () => editor.store.clearHistory(),
    /** Groups several changes into one undo step */
    transact: <T>(label: string, fn: () => T) => editor.store.transact(label, fn),
  }
}

/** Viewport state with zoom and navigation helpers. */
export function useDiagramViewport(controller?: DiagramController) {
  const ctrl = resolveController(controller)
  const { editor } = ctrl

  return {
    viewport: ctrl.viewport,
    size: ctrl.viewportSize,
    zoom: computed(() => ctrl.viewport.value.zoom),
    /** Zoom in percent, rounded */
    zoomPercent: computed(() => Math.round(ctrl.viewport.value.zoom * 100)),
    canZoomIn: computed(() => {
      void ctrl.optionsVersion.value
      return ctrl.viewport.value.zoom < editor.options.maxZoom - 1e-9
    }),
    canZoomOut: computed(() => {
      void ctrl.optionsVersion.value
      return ctrl.viewport.value.zoom > editor.options.minZoom + 1e-9
    }),
    setViewport: (viewport: DiagramViewport, options?: { animate?: boolean | number }) =>
      editor.setViewport(viewport, options),
    zoomIn: () => editor.zoomIn(),
    zoomOut: () => editor.zoomOut(),
    zoomTo: (zoom: number, options?: { animate?: boolean | number }) =>
      editor.zoomTo(zoom, undefined, options),
    fitView: (options?: Parameters<typeof editor.fitView>[0]) =>
      editor.fitView({ animate: true, ...options }),
    zoomToSelection: () => editor.zoomToSelection({ animate: true }),
    centerOn: (point: { x: number; y: number }) => editor.centerOn(point, { animate: true }),
    screenToWorld: (point: { x: number; y: number }) => editor.screenToWorld(point),
    worldToScreen: (point: { x: number; y: number }) => editor.worldToScreen(point),
  }
}

export interface UseDiagramKeyboardOptions {
  /** Shortcut overrides by command id. `null` removes the shortcuts of a command */
  shortcuts?: MaybeRefOrGetter<Record<string, string | string[] | null> | false | undefined>
  /** Commands that are handled by native clipboard events and skipped here */
  skip?: string[]
}

/** Shortcuts of every command after applying overrides. */
export function resolveShortcuts(
  controller: DiagramController,
  overrides: Record<string, string | string[] | null> | undefined,
): Map<string, string[]> {
  const result = new Map<string, string[]>()

  for (const command of controller.editor.getCommands()) {
    const override = overrides?.[command.id]
    const value =
      override === null
        ? []
        : override === undefined
          ? (command.shortcuts ?? [])
          : Array.isArray(override)
            ? override
            : [override]

    if (value.length > 0) {
      result.set(command.id, value)
    }
  }

  return result
}

const isTextInput = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

/**
 * Keyboard handling of a diagram: the active tool first, then command shortcuts, plus Space to
 * pan. Shortcuts match the produced character or the physical key.
 */
export function useDiagramKeyboard(
  controller?: DiagramController,
  options: UseDiagramKeyboardOptions = {},
) {
  const ctrl = resolveController(controller)
  const { editor } = ctrl
  const spacePressed = ref(false)
  const skip = new Set(options.skip ?? [])

  // Each event runs at most one command, even when several shortcuts match it.
  const handled = new WeakSet<Event>()

  const handler = computed(() => {
    void ctrl.optionsVersion.value
    const overrides = toValue(options.shortcuts)

    if (overrides === false) {
      return () => {}
    }

    const run = (id: string) => (event: KeyboardEvent) => {
      if (handled.has(event)) {
        return
      }

      if (editor.canExecute(id)) {
        handled.add(event)
        event.preventDefault()
        editor.execute(id)
      } else if (editor.getCommand(id)?.captureShortcuts) {
        // A disabled zoom shortcut must not fall through to the browser zoom.
        handled.add(event)
        event.preventDefault()
      }
    }

    return getHotkeyHandler(
      [...resolveShortcuts(ctrl, overrides ?? undefined)]
        .filter(([id]) => !skip.has(id))
        .flatMap(([id, keys]) =>
          keys.flatMap((key) =>
            [false, true].map(
              (usePhysicalKeys) =>
                [key, run(id), { preventDefault: false, usePhysicalKeys }] as [
                  string,
                  (event: KeyboardEvent) => void,
                  { preventDefault: boolean; usePhysicalKeys: boolean },
                ],
            ),
          ),
        ),
    )
  })

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || isTextInput(event.target) || editor.editing) {
      return
    }

    if (event.key === ' ' && !event.repeat) {
      spacePressed.value = true
      event.preventDefault()
      return
    }

    if (editor.keyDown(event)) {
      event.preventDefault()
      return
    }

    handler.value(event)
  }

  const onKeyUp = (event: KeyboardEvent) => {
    if (event.key === ' ') {
      spacePressed.value = false
    }
  }

  const onBlur = () => {
    spacePressed.value = false
  }

  return { onKeyDown, onKeyUp, onBlur, spacePressed }
}
