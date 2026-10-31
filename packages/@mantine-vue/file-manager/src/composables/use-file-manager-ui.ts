import { nextTick, onBeforeUnmount, ref, shallowRef, toValue, type MaybeRefOrGetter } from 'vue'
import { useFileDialog } from '@mantine-vue/hooks'
import type { FileManagerActionScope, FileManagerUiActions } from '../actions'
import { hasPermission } from '../core/capabilities'
import type { FileEntry, FileUploadRestrictions } from '../types'
import type {
  FileConfirmRequest,
  FileConflictRequest,
  FileManagerController,
  FileManagerNotice,
} from './use-file-manager'
import type { FileConflictDecision } from './use-upload-queue'

export type FileManagerDialog =
  | { type: 'newFolder' }
  | { type: 'rename'; entry: FileEntry }
  | { type: 'transfer'; mode: 'move' | 'copy'; entries: FileEntry[] }
  | { type: 'properties'; entry: FileEntry }

export interface FileManagerContextMenuState {
  x: number
  y: number
  entries: FileEntry[]
  scope: FileManagerActionScope
}

export interface FileManagerNoticeItem extends FileManagerNotice {
  id: number
}

/** Key of the root folder in places that need a string, such as drop targets. */
export const ROOT_FOLDER_KEY = '__root__'

const NOTICE_DURATION: Record<FileManagerNotice['status'], number | null> = {
  info: 3000,
  success: 3000,
  warning: 8000,
  // Errors stay until dismissed, so that nobody misses them.
  error: null,
}

const MAX_NOTICES = 4

/** Internal drags carry only this marker, the entries stay in memory. */
export const DRAG_MIME_TYPE = 'application/x-mantine-file-manager'

/** Finds the element of an entry. Ids are opaque, so they are compared and not put in a selector. */
export function findEntryElement(root: Element | null | undefined, id: string) {
  return (
    Array.from(root?.querySelectorAll<HTMLElement>('[data-entry-id]') ?? []).find(
      (element) => element.dataset.entryId === id,
    ) ?? null
  )
}

/** State of the built-in interface: dialogs, menus, panels, feedback and drag and drop. */
export function useFileManagerUi(
  controller: FileManagerController,
  options: { restrictions: MaybeRefOrGetter<FileUploadRestrictions | undefined> },
) {
  const dialog = shallowRef<FileManagerDialog | null>(null)
  const confirmRequest = shallowRef<
    (FileConfirmRequest & { resolve: (ok: boolean) => void }) | null
  >(null)
  const conflictRequest = shallowRef<
    (FileConflictRequest & { resolve: (decision: FileConflictDecision) => void }) | null
  >(null)
  const contextMenu = shallowRef<FileManagerContextMenuState | null>(null)
  const notices = ref<FileManagerNoticeItem[]>([])
  const sidebarOpened = ref(false)
  const sidebarVisible = ref(true)
  const detailsOpened = ref(false)
  const uploadsOpened = ref(true)
  const filtersOpened = ref(false)
  const contentElement = shallowRef<HTMLElement | null>(null)

  /** Touch selection mode, entered with a long press. */
  const selectionMode = ref(false)

  const draggedEntries = shallowRef<FileEntry[]>([])
  const dropTarget = ref<string | null>(null)

  const noticeTimers = new Map<number, ReturnType<typeof setTimeout>>()
  let nextNoticeId = 1

  function dismissNotice(id: number) {
    clearTimeout(noticeTimers.get(id))
    noticeTimers.delete(id)
    notices.value = notices.value.filter((notice) => notice.id !== id)
  }

  function pushNotice(notice: FileManagerNotice) {
    const id = nextNoticeId++
    const duration = NOTICE_DURATION[notice.status]

    notices.value = [...notices.value, { ...notice, id }]

    if (duration !== null) {
      noticeTimers.set(
        id,
        setTimeout(() => dismissNotice(id), duration),
      )
    }

    if (notices.value.length > MAX_NOTICES) {
      dismissNotice(notices.value[0].id)
    }
  }

  const toInputs = (files: FileList | null, withFolders: boolean) =>
    Array.from(files ?? []).map((file) => ({
      file,
      relativePath: withFolders ? file.webkitRelativePath || undefined : undefined,
    }))

  const accept = () => toValue(options.restrictions)?.accept?.join(',') || '*'

  const filePicker = useFileDialog({
    multiple: true,
    accept: accept(),
    resetOnOpen: true,
    onChange: (files) => {
      if (files?.length) {
        controller.upload(toInputs(files, false))
      }
    },
  })

  const folderPicker = useFileDialog({
    multiple: true,
    directory: true,
    resetOnOpen: true,
    onChange: (files) => {
      if (files?.length) {
        controller.upload(toInputs(files, true))
      }
    },
  })

  const actions: FileManagerUiActions = {
    openNewFolder: () => {
      dialog.value = { type: 'newFolder' }
    },
    openRename: (entry) => {
      dialog.value = { type: 'rename', entry }
    },
    openTransfer: (mode, entries) => {
      dialog.value = { type: 'transfer', mode, entries }
    },
    openProperties: (entry) => {
      dialog.value = { type: 'properties', entry }
    },
    openFilePicker: () => filePicker.open(),
    openFolderPicker: () => folderPicker.open(),
  }

  const closeDialog = () => {
    dialog.value = null
  }

  /** Moves focus to the active entry, or to the list when there is none. */
  function focusContent() {
    void nextTick(() => {
      const root = contentElement.value
      const id = controller.activeId.value
      const item = id ? findEntryElement(root, id) : null

      ;(item ?? root?.querySelector<HTMLElement>('[tabindex="0"]') ?? root)?.focus({
        preventScroll: true,
      })
    })
  }

  function openContextMenu(state: FileManagerContextMenuState) {
    contextMenu.value = state
  }

  function closeContextMenu() {
    contextMenu.value = null
    focusContent()
  }

  /* Drag and drop */

  const toKey = (folderId: string | null) => folderId ?? ROOT_FOLDER_KEY

  function startDrag(event: DragEvent, entries: FileEntry[]) {
    draggedEntries.value = entries

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copyMove'
      event.dataTransfer.setData(DRAG_MIME_TYPE, '1')
    }
  }

  function endDrag() {
    draggedEntries.value = []
    dropTarget.value = null
  }

  const isFileDrag = (event: DragEvent) =>
    Array.from(event.dataTransfer?.types ?? []).includes('Files')

  /** Whether the dragged entries, or external files, may land on a folder. */
  function canDrop(event: DragEvent, folderId: string | null, target?: FileEntry | null) {
    if (target && !hasPermission(target, 'write')) {
      return false
    }

    if (draggedEntries.value.length > 0) {
      return !draggedEntries.value.some((entry) => entry.id === folderId)
    }

    return isFileDrag(event) && controller.capabilities.value.upload
  }

  function onFolderDragOver(event: DragEvent, folderId: string | null, target?: FileEntry | null) {
    if (!canDrop(event, folderId, target)) {
      return
    }

    event.preventDefault()
    dropTarget.value = toKey(folderId)

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect =
        draggedEntries.value.length === 0 || event.ctrlKey || event.altKey ? 'copy' : 'move'
    }
  }

  function onFolderDragLeave(folderId: string | null) {
    if (dropTarget.value === toKey(folderId)) {
      dropTarget.value = null
    }
  }

  /** Completes an internal drag. External files bubble up to the dropzone. */
  function onFolderDrop(event: DragEvent, folderId: string | null) {
    const entries = draggedEntries.value

    if (entries.length === 0) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const shouldCopy = event.ctrlKey || event.altKey
    const accepted = dropTarget.value === toKey(folderId)

    endDrag()

    // Only a target that accepted the drag while hovering may receive it.
    if (!accepted) {
      return
    }

    void (shouldCopy ? controller.copy(entries, folderId) : controller.move(entries, folderId))
  }

  /** Listeners that turn an element into a drop target for a folder. */
  const getDropTargetProps = (folderId: () => string | null, target?: () => FileEntry | null) => ({
    onDragover: (event: DragEvent) => onFolderDragOver(event, folderId(), target?.()),
    onDragleave: () => onFolderDragLeave(folderId()),
    onDrop: (event: DragEvent) => onFolderDrop(event, folderId()),
  })

  /* Prompts of the controller */

  controller.setHandlers({
    confirm: (request) =>
      new Promise<boolean>((resolve) => {
        confirmRequest.value = { ...request, resolve }
      }),
    resolveConflict: (request) =>
      new Promise<FileConflictDecision>((resolve) => {
        conflictRequest.value = { ...request, resolve }
      }),
  })

  function answerConfirm(confirmed: boolean) {
    confirmRequest.value?.resolve(confirmed)
    confirmRequest.value = null
  }

  function answerConflict(decision: FileConflictDecision) {
    conflictRequest.value?.resolve(decision)
    conflictRequest.value = null
  }

  onBeforeUnmount(() => {
    noticeTimers.forEach((timer) => clearTimeout(timer))
    noticeTimers.clear()
    answerConfirm(false)
    answerConflict({ strategy: null })
  })

  return {
    actions,
    dialog,
    closeDialog,
    confirmRequest,
    answerConfirm,
    conflictRequest,
    answerConflict,
    contextMenu,
    openContextMenu,
    closeContextMenu,
    notices,
    pushNotice,
    dismissNotice,
    sidebarOpened,
    sidebarVisible,
    detailsOpened,
    uploadsOpened,
    filtersOpened,
    selectionMode,
    contentElement,
    focusContent,
    draggedEntries,
    dropTarget,
    startDrag,
    endDrag,
    isFileDrag,
    onFolderDragOver,
    onFolderDragLeave,
    onFolderDrop,
    getDropTargetProps,
  }
}

export type FileManagerUi = ReturnType<typeof useFileManagerUi>
