/* oxlint-disable no-console */
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { getFilesFromEvent as defaultGetFilesFromEvent } from './get-files-from-event'
import type { Accept, DropEvent, FileError, FileRejection, FileWithPath } from './types'
import {
  acceptPropAsAcceptAttr,
  allFilesAccepted,
  canUseFileSystemAccessAPI,
  fileAccepted,
  fileMatchSize,
  isAbort,
  isEvtWithFiles,
  isSecurityError,
  pickerOptionsFromAccept,
  TOO_MANY_FILES_REJECTION,
} from './utils'

export interface UseDropzoneOptions {
  accept?: () => Accept | undefined
  disabled?: () => boolean | undefined
  multiple?: () => boolean | undefined
  maxSize?: () => number | undefined
  minSize?: () => number | undefined
  maxFiles?: () => number | undefined
  autoFocus?: () => boolean | undefined
  noClick?: () => boolean | undefined
  noDrag?: () => boolean | undefined
  noDragEventsBubbling?: () => boolean | undefined
  noKeyboard?: () => boolean | undefined
  preventDropOnDocument?: () => boolean | undefined
  useFsAccessApi?: () => boolean | undefined
  validator?: () => ((file: FileWithPath) => FileError | FileError[] | null) | undefined
  getFilesFromEvent?: () => ((event: DropEvent) => Promise<FileWithPath[]>) | undefined
  onDrop?: (files: FileWithPath[], fileRejections: FileRejection[], event: DropEvent | null) => void
  onDropAccepted?: (files: FileWithPath[], event: DropEvent | null) => void
  onDropRejected?: (fileRejections: FileRejection[], event: DropEvent | null) => void
  onDragEnter?: (event: DragEvent) => void
  onDragLeave?: (event: DragEvent) => void
  onDragOver?: (event: DragEvent) => void
  onFileDialogCancel?: () => void
  onFileDialogOpen?: () => void
  onError?: (error: unknown) => void
}

export interface DropzoneRootProps {
  onKeydown: ((event: KeyboardEvent) => void) | null
  onFocus: (() => void) | null
  onBlur: (() => void) | null
  onClick: (() => void) | null
  onDragenter: ((event: DragEvent) => void) | null
  onDragover: ((event: DragEvent) => void) | null
  onDragleave: ((event: DragEvent) => void) | null
  onDrop: ((event: DragEvent) => void) | null
  role: string
  ref: (el: any) => void
  tabindex?: number
  [key: string]: any
}

export interface DropzoneInputProps {
  type: 'file'
  accept?: string
  multiple: boolean
  style: Record<string, string | number>
  tabindex: number
  ref: (el: any) => void
  onChange: ((event: Event) => void) | null
  onClick: ((event: Event) => void) | null
  [key: string]: any
}

function noop() {}

export function useDropzone(options: UseDropzoneOptions) {
  const rootRef = ref<HTMLElement | null>(null)
  const inputRef = ref<HTMLInputElement | null>(null)

  const state = reactive({
    isFocused: false,
    isFileDialogActive: false,
    isDragActive: false,
    isDragAccept: false,
    isDragReject: false,
  })

  let dragTargets: EventTarget[] = []

  const fsAccessApiWorks =
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    !!options.useFsAccessApi?.() &&
    canUseFileSystemAccessAPI()

  const acceptAttr = computed(() => acceptPropAsAcceptAttr(options.accept?.()))
  const pickerTypes = computed(() => pickerOptionsFromAccept(options.accept?.()))

  const getFilesFromEvent = (event: DropEvent) =>
    (options.getFilesFromEvent?.() ?? defaultGetFilesFromEvent)(event)

  const onErr = (error: unknown) => {
    if (options.onError) options.onError(error)
    else console.error(error)
  }

  const stopPropagation = (event: Event) => {
    if (options.noDragEventsBubbling?.()) event.stopPropagation()
  }

  // Detect the file dialog being dismissed with no selection: the OS dialog blocks focus, so we
  // treat the window regaining focus with an empty input as a cancellation.
  const onWindowFocus = () => {
    if (!fsAccessApiWorks && state.isFileDialogActive) {
      setTimeout(() => {
        if (inputRef.value && !inputRef.value.files?.length) {
          state.isFileDialogActive = false
          options.onFileDialogCancel?.()
        }
      }, 300)
    }
  }

  const onDocumentDragOver = (event: DragEvent) => event.preventDefault()
  const onDocumentDrop = (event: DragEvent) => {
    if (rootRef.value && event.target && rootRef.value.contains(event.target as Node)) {
      return
    }
    event.preventDefault()
    dragTargets = []
  }

  onMounted(() => {
    window.addEventListener('focus', onWindowFocus, false)
    if (options.preventDropOnDocument?.() ?? true) {
      document.addEventListener('dragover', onDocumentDragOver, false)
      document.addEventListener('drop', onDocumentDrop, false)
    }
    if ((options.autoFocus?.() ?? false) && !options.disabled?.()) {
      rootRef.value?.focus()
    }
  })

  onUnmounted(() => {
    window.removeEventListener('focus', onWindowFocus, false)
    document.removeEventListener('dragover', onDocumentDragOver)
    document.removeEventListener('drop', onDocumentDrop)
  })

  const setFiles = (files: FileWithPath[], event: DropEvent | null) => {
    const acceptedFiles: FileWithPath[] = []
    const fileRejections: FileRejection[] = []
    const minSize = options.minSize?.()
    const maxSize = options.maxSize?.()
    const multiple = options.multiple?.() ?? true
    const maxFiles = options.maxFiles?.()
    const validator = options.validator?.()

    files.forEach((file) => {
      const [accepted, acceptError] = fileAccepted(file, acceptAttr.value)
      const [sizeMatch, sizeError] = fileMatchSize(file, minSize, maxSize)
      const customErrors = validator ? validator(file) : null

      if (accepted && sizeMatch && !customErrors) {
        acceptedFiles.push(file)
      } else {
        const errors = [acceptError, sizeError].filter((e): e is FileError => !!e)
        if (customErrors)
          errors.push(...(Array.isArray(customErrors) ? customErrors : [customErrors]))
        fileRejections.push({ file, errors })
      }
    })

    if (
      (!multiple && acceptedFiles.length > 1) ||
      (multiple && (maxFiles ?? 0) >= 1 && acceptedFiles.length > maxFiles!)
    ) {
      acceptedFiles.forEach((file) =>
        fileRejections.push({ file, errors: [TOO_MANY_FILES_REJECTION] }),
      )
      acceptedFiles.length = 0
    }

    options.onDrop?.(acceptedFiles, fileRejections, event)
    if (fileRejections.length > 0) options.onDropRejected?.(fileRejections, event)
    if (acceptedFiles.length > 0) options.onDropAccepted?.(acceptedFiles, event)
  }

  const onDragEnterCb = (event: DragEvent) => {
    event.preventDefault()
    stopPropagation(event)
    dragTargets = [...dragTargets, event.target as EventTarget]

    if (isEvtWithFiles(event)) {
      Promise.resolve(getFilesFromEvent(event))
        .then((files) => {
          const isDragAccept =
            files.length > 0 &&
            allFilesAccepted({
              files,
              accept: acceptAttr.value,
              minSize: options.minSize?.(),
              maxSize: options.maxSize?.(),
              multiple: options.multiple?.() ?? true,
              maxFiles: options.maxFiles?.(),
              validator: options.validator?.(),
            })
          const isDragReject = files.length > 0 && !isDragAccept

          state.isDragActive = true
          state.isDragAccept = isDragAccept
          state.isDragReject = isDragReject

          options.onDragEnter?.(event)
        })
        .catch(onErr)
    }
  }

  const onDragOverCb = (event: DragEvent) => {
    event.preventDefault()
    stopPropagation(event)

    const hasFiles = isEvtWithFiles(event)
    if (hasFiles && event.dataTransfer) {
      try {
        event.dataTransfer.dropEffect = 'copy'
      } catch {
        // dropEffect is not settable in every browser – safe to ignore.
      }
    }
    if (hasFiles) options.onDragOver?.(event)
  }

  const onDragLeaveCb = (event: DragEvent) => {
    event.preventDefault()
    stopPropagation(event)

    const targets = dragTargets.filter(
      (target) => rootRef.value && rootRef.value.contains(target as Node),
    )
    const targetIdx = targets.indexOf(event.target as EventTarget)
    if (targetIdx !== -1) targets.splice(targetIdx, 1)
    dragTargets = targets

    if (targets.length > 0) return

    state.isDragActive = false
    state.isDragAccept = false
    state.isDragReject = false

    if (isEvtWithFiles(event)) options.onDragLeave?.(event)
  }

  const onDropCb = (event: DragEvent | Event) => {
    event.preventDefault()
    stopPropagation(event)
    dragTargets = []

    if (isEvtWithFiles(event as DragEvent)) {
      Promise.resolve(getFilesFromEvent(event as DragEvent))
        .then((files) => setFiles(files, event as DropEvent))
        .catch(onErr)
    }

    state.isDragActive = false
    state.isDragAccept = false
    state.isDragReject = false
  }

  const openFileDialog = () => {
    if (options.disabled?.()) return

    if (fsAccessApiWorks) {
      state.isFileDialogActive = true
      options.onFileDialogOpen?.()
      const opts = { multiple: options.multiple?.() ?? true, types: pickerTypes.value }
      ;(window as any)
        .showOpenFilePicker(opts)
        .then((handles: any) => getFilesFromEvent(handles))
        .then((files: FileWithPath[]) => {
          setFiles(files, null)
          state.isFileDialogActive = false
        })
        .catch((e: unknown) => {
          if (isAbort(e)) {
            options.onFileDialogCancel?.()
            state.isFileDialogActive = false
          } else if (isSecurityError(e)) {
            if (inputRef.value) {
              inputRef.value.value = ''
              inputRef.value.click()
            } else {
              onErr(
                new Error('Cannot open the file picker: no <input> was rendered as a fallback.'),
              )
            }
          } else {
            onErr(e)
          }
        })
      return
    }

    if (inputRef.value) {
      state.isFileDialogActive = true
      options.onFileDialogOpen?.()
      inputRef.value.value = ''
      inputRef.value.click()
    }
  }

  const onKeyDownCb = (event: KeyboardEvent) => {
    if (!rootRef.value || rootRef.value !== event.target) return
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      openFileDialog()
    }
  }

  const onFocusCb = () => {
    state.isFocused = true
  }
  const onBlurCb = () => {
    state.isFocused = false
  }
  const onClickCb = () => {
    if (!options.noClick?.()) openFileDialog()
  }
  const onInputClickCb = (event: Event) => {
    event.stopPropagation()
  }
  const onInputChangeCb = (event: Event) => {
    onDropCb(event)
  }

  const composeHandler = <T extends (...args: any[]) => void>(fn: T): T | null =>
    options.disabled?.() ? null : fn
  const composeKeyboardHandler = <T extends (...args: any[]) => void>(fn: T): T | null =>
    options.noKeyboard?.() ? null : composeHandler(fn)
  const composeDragHandler = <T extends (...args: any[]) => void>(fn: T): T | null =>
    options.noDrag?.() ? null : composeHandler(fn)

  const getRootProps = (overrides: Record<string, any> = {}): DropzoneRootProps => ({
    onKeydown: composeKeyboardHandler(onKeyDownCb),
    onFocus: composeKeyboardHandler(onFocusCb),
    onBlur: composeKeyboardHandler(onBlurCb),
    onClick: composeHandler(onClickCb),
    onDragenter: composeDragHandler(onDragEnterCb),
    onDragover: composeDragHandler(onDragOverCb),
    onDragleave: composeDragHandler(onDragLeaveCb),
    onDrop: composeDragHandler(onDropCb as any),
    role: 'presentation',
    ref: (el: any) => {
      rootRef.value = el?.$el ?? el ?? null
    },
    ...(!options.disabled?.() && !options.noKeyboard?.() ? { tabindex: 0 } : {}),
    ...overrides,
  })

  const getInputProps = (overrides: Record<string, any> = {}): DropzoneInputProps => ({
    type: 'file',
    accept: acceptAttr.value,
    multiple: options.multiple?.() ?? true,
    style: {
      border: 0,
      clip: 'rect(0, 0, 0, 0)',
      clipPath: 'inset(50%)',
      height: '1px',
      margin: '0 -1px -1px 0',
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      width: '1px',
      whiteSpace: 'nowrap',
    },
    onChange: composeHandler(onInputChangeCb),
    onClick: composeHandler(onInputClickCb),
    tabindex: -1,
    ref: (el: any) => {
      inputRef.value = el?.$el ?? el ?? null
    },
    ...overrides,
  })

  return {
    state,
    rootRef,
    inputRef,
    isFocused: computed(() => state.isFocused && !options.disabled?.()),
    isDragActive: computed(() => state.isDragActive),
    isDragAccept: computed(() => state.isDragAccept),
    isDragReject: computed(() => state.isDragReject),
    getRootProps,
    getInputProps,
    open: () => composeHandler(openFileDialog)?.(),
  }
}

export { noop }
