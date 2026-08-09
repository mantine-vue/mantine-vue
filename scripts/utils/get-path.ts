import path from 'node:path'

/** Resolves a repository-relative path to an absolute posix path. */
export function getPath(filePath: string) {
  return path.posix.resolve(filePath)
}

export function getPaths(filePaths: string[]) {
  return filePaths.map(getPath)
}
