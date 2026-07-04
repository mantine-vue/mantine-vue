export interface FileWithPath extends File {
  readonly path?: string
}

export interface FileError {
  message: string
  code: string
}

export interface FileRejection {
  file: FileWithPath
  errors: FileError[]
}

/** Mime type -> array of accepted file extensions (e.g. `{ 'image/png': ['.png'] }`) */
export type Accept = Record<string, string[]>

export type DropEvent = DragEvent | Event | FileSystemFileHandle[]
