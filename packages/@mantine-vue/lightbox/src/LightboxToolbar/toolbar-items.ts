import { h } from 'vue'
import { DEFAULT_LABELS } from '../default-labels'
import type { LightboxLabels, ToolbarItem } from '../types'

const ALLOWED_DOWNLOAD_PROTOCOLS = ['http:', 'https:', 'blob:', 'data:']
const downloadsInProgress = new Set<string>()

const icon = (path: string) =>
  h(
    'svg',
    { viewBox: '0 0 24 24', width: 20, height: 20, fill: 'currentColor', 'aria-hidden': 'true' },
    [h('path', { d: path })],
  )

function parseDownloadUrl(src: string) {
  try {
    const url = new URL(src, window.location.href)
    return ALLOWED_DOWNLOAD_PROTOCOLS.includes(url.protocol) ? url : null
  } catch {
    return null
  }
}

function getDownloadFileName(url: URL) {
  if (url.protocol === 'data:') return 'download'
  const lastSegment = url.pathname.split('/').pop() || ''
  try {
    return decodeURIComponent(lastSegment) || 'download'
  } catch {
    return lastSegment || 'download'
  }
}

function openInNewTab(src: string) {
  const link = document.createElement('a')
  link.href = src
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

function downloadFile(src: string) {
  const url = parseDownloadUrl(src)
  if (!url || downloadsInProgress.has(src)) return

  const isCrossOrigin =
    (url.protocol === 'http:' || url.protocol === 'https:') && url.origin !== window.location.origin

  if (isCrossOrigin) {
    openInNewTab(src)
    return
  }

  downloadsInProgress.add(src)
  fetch(src)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to download ${src}: ${response.status}`)
      return response.blob()
    })
    .then((blob) => {
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = getDownloadFileName(url)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    })
    .catch(() => openInNewTab(src))
    .finally(() => downloadsInProgress.delete(src))
}

export function createFullscreenToolbarItem(
  toggle: () => void,
  isFullscreen: boolean,
  labels: LightboxLabels = DEFAULT_LABELS,
): ToolbarItem {
  return {
    key: 'fullscreen',
    icon: icon(
      isFullscreen
        ? 'M9 3v6H3V7h4V3h2zm6 0h2v4h4v2h-6V3zM3 15h6v6H7v-4H3v-2zm12 0h6v2h-4v4h-2v-6z'
        : 'M3 3h6v2H5v4H3V3zm12 0h6v6h-2V5h-4V3zM3 15h2v4h4v2H3v-6zm18 0v6h-6v-2h4v-4h2z',
    ),
    label: isFullscreen ? labels.exitFullscreenLabel : labels.enterFullscreenLabel,
    onClick: toggle,
    position: 'right',
  }
}
export function createThumbnailsToolbarItem(
  toggle: () => void,
  visible: boolean,
  labels: LightboxLabels = DEFAULT_LABELS,
): ToolbarItem {
  return {
    key: 'thumbnails',
    icon: icon('M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z'),
    label: visible ? labels.hideThumbnailsLabel : labels.showThumbnailsLabel,
    onClick: toggle,
    position: 'left',
  }
}
export function createDownloadToolbarItem(
  src: string,
  labels: LightboxLabels = DEFAULT_LABELS,
): ToolbarItem {
  return {
    key: 'download',
    icon: icon('M12 16l-6-6h4V4h4v6h4l-6 6zm-8 2h16v2H4v-2z'),
    label: labels.downloadLabel,
    position: 'right',
    onClick: () => downloadFile(src),
  }
}
export function createCloseToolbarItem(
  onClose: () => void,
  labels: LightboxLabels = DEFAULT_LABELS,
): ToolbarItem {
  return {
    key: 'close',
    icon: icon(
      'M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 0 0-1.4 1.4L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z',
    ),
    label: labels.closeLabel,
    onClick: onClose,
    position: 'right',
  }
}
