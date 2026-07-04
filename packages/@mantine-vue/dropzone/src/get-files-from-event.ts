import type { DropEvent, FileWithPath } from './types'

function toFileWithPath(file: File, path?: string): FileWithPath {
  const fileWithPath = file as FileWithPath
  const relativePath = path || (file as any).webkitRelativePath || file.name

  if (fileWithPath.path === undefined) {
    try {
      Object.defineProperty(fileWithPath, 'path', {
        value: relativePath,
        writable: false,
        configurable: true,
        enumerable: true,
      })
    } catch {
      // Some environments (e.g. jsdom) may disallow redefining File properties – safe to ignore,
      // `path` is a convenience addition, not required for accept/size validation.
    }
  }

  return fileWithPath
}

async function fromDataTransferItem(item: DataTransferItem): Promise<FileWithPath[]> {
  // `webkitGetAsEntry` enables (shallow) directory traversal when a folder is dropped; fall back
  // to `getAsFile` for browsers/items that don't support it.
  const entry = (item as any).webkitGetAsEntry?.()

  if (entry?.isDirectory) {
    return fromDirectoryEntry(entry)
  }

  const file = item.getAsFile()
  return file ? [toFileWithPath(file)] : []
}

function fromDirectoryEntry(dirEntry: any, path = ''): Promise<FileWithPath[]> {
  const reader = dirEntry.createReader()

  return new Promise((resolve) => {
    const entries: any[] = []

    const readEntries = () => {
      reader.readEntries(
        async (batch: any[]) => {
          if (batch.length === 0) {
            const files = await Promise.all(
              entries.map((entry) =>
                entry.isDirectory
                  ? fromDirectoryEntry(entry, `${path}${dirEntry.name}/`)
                  : new Promise<FileWithPath[]>((res) => {
                      entry.file((file: File) =>
                        res([toFileWithPath(file, `${path}${dirEntry.name}/${file.name}`)]),
                      )
                    }),
              ),
            )
            resolve(files.flat())
            return
          }

          entries.push(...batch)
          readEntries()
        },
        () => resolve([]),
      )
    }

    readEntries()
  })
}

async function fromDataTransfer(dataTransfer: DataTransfer): Promise<FileWithPath[]> {
  if (dataTransfer.items && dataTransfer.items.length > 0) {
    const items = Array.from(dataTransfer.items).filter((item) => item.kind === 'file')
    const files = await Promise.all(items.map(fromDataTransferItem))
    return files.flat()
  }

  return Array.from(dataTransfer.files || []).map((file) => toFileWithPath(file))
}

export async function getFilesFromEvent(event: DropEvent): Promise<FileWithPath[]> {
  if (Array.isArray(event)) {
    // FileSystemFileHandle[] returned by `window.showOpenFilePicker`.
    const files = await Promise.all(event.map((handle) => (handle as any).getFile()))
    return files.map((file) => toFileWithPath(file))
  }

  const dragEvent = event as DragEvent
  if (dragEvent.dataTransfer) {
    return fromDataTransfer(dragEvent.dataTransfer)
  }

  const target = event.target as HTMLInputElement | null
  if (target?.files) {
    return Array.from(target.files).map((file) => toFileWithPath(file))
  }

  return []
}
