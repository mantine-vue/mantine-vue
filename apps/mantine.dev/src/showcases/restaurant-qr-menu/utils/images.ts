import type { ImageAsset } from '../domain/types'

/** Neutral placeholder shown when an image is missing or fails to load. */
export const IMAGE_FALLBACK = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"><rect width="160" height="120" fill="#e9ecef"/><g fill="none" stroke="#adb5bd" stroke-width="4" stroke-linecap="round"><path d="M58 44v32M52 44v12a6 6 0 0 0 12 0V44"/><path d="M100 44c-6 0-8 10-8 18h8v14"/></g></svg>',
)}`

const isResizable = (url: string) => url.startsWith('https://images.unsplash.com/')

/** Returns a URL for the requested display width (CDN-aware). */
export function imageSrc(asset: ImageAsset | undefined, width: number) {
  if (!asset?.url) {
    return IMAGE_FALLBACK
  }
  if (!isResizable(asset.url)) {
    return asset.url
  }
  return `${asset.url}?auto=format&fit=crop&w=${Math.round(width)}&q=70`
}

/** `srcset` with 1x / 2x density variants for crisp images on high-DPI phones. */
export function imageSrcSet(asset: ImageAsset | undefined, width: number) {
  if (!asset?.url || !isResizable(asset.url)) {
    return undefined
  }
  return [1, 2].map((density) => `${imageSrc(asset, width * density)} ${density}x`).join(', ')
}
