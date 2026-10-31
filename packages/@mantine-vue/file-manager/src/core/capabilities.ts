import type { FileEntry, FileEntryPermissions, FileSystemAdapter } from '../types'
import type { FileSystemCapabilities } from '../types'

/**
 * Derives what the interface may offer from the methods an adapter implements.
 *
 * An explicit `false` in `adapter.capabilities` always wins. An explicit `true` cannot resurrect
 * a feature whose method is missing, because the control would look functional and then fail.
 */
export function resolveCapabilities(adapter: FileSystemAdapter): FileSystemCapabilities {
  const detected: FileSystemCapabilities = {
    createFolder: !!adapter.createFolder,
    rename: !!adapter.rename,
    move: !!adapter.move,
    copy: !!adapter.copy,
    delete: !!adapter.delete,
    trash: !!adapter.trash && !!adapter.listTrash,
    restore: !!adapter.restore,
    emptyTrash: !!adapter.emptyTrash,
    upload: !!adapter.upload || !!adapter.chunkedUpload,
    folderUpload: false,
    chunkedUpload: !!adapter.chunkedUpload,
    download: !!adapter.download,
    downloadMany: !!adapter.downloadMany,
    search: !!adapter.search,
    preview: !!adapter.getPreview,
    thumbnails: !!adapter.getThumbnail,
    favorites: !!adapter.setStarred && !!adapter.listStarred,
    recent: !!adapter.listRecent,
    serverSort: false,
  }

  const overrides = adapter.capabilities ?? {}
  const resolved = { ...detected }

  for (const key of Object.keys(detected) as (keyof FileSystemCapabilities)[]) {
    if (overrides[key] === false) {
      resolved[key] = false
    }
  }

  // These two describe how an implemented method behaves, so they can only be declared.
  resolved.folderUpload = !!overrides.folderUpload && detected.upload
  resolved.serverSort = !!overrides.serverSort

  return resolved
}

/** `undefined` means the backend set no restriction, only `false` denies. */
export function hasPermission(
  entry: Pick<FileEntry, 'permissions'> | null | undefined,
  permission: keyof FileEntryPermissions,
) {
  return entry?.permissions?.[permission] !== false
}

/** Whether every entry allows the permission. */
export function allHavePermission(
  entries: Pick<FileEntry, 'permissions'>[],
  permission: keyof FileEntryPermissions,
) {
  return entries.every((entry) => hasPermission(entry, permission))
}
