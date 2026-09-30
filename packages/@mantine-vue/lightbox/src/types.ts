import type { Component, VNodeChild } from 'vue'
export interface LightboxRenderThumbPayload {
  active: boolean
}
export interface LightboxImageSlide {
  type?: 'image'
  src: string
  alt?: string
  renderThumb?: (payload: LightboxRenderThumbPayload) => VNodeChild
  thumbSrc?: string
  caption?: VNodeChild
  srcSet?: string
  sizes?: string
  loading?: 'eager' | 'lazy'
}
export interface LightboxVideoSlideTrack {
  src: string
  kind?: string
  srcLang?: string
  label?: string
  default?: boolean
}
export interface LightboxVideoSlide {
  type: 'video'
  src: string
  label?: string
  renderThumb?: (payload: LightboxRenderThumbPayload) => VNodeChild
  thumbSrc?: string
  caption?: VNodeChild
  autoPlay?: boolean
  poster?: string
  tracks?: LightboxVideoSlideTrack[]
}
export interface LightboxCustomSlide {
  type: 'custom'
  render: (props: { active: boolean }) => VNodeChild
  renderThumb?: (payload: LightboxRenderThumbPayload) => VNodeChild
  thumbSrc?: string
  caption?: VNodeChild
}
export type LightboxSlideData = LightboxImageSlide | LightboxVideoSlide | LightboxCustomSlide
export interface LightboxLabels {
  lightboxLabel: string
  slideLabel: (index: number, total: number) => string
  slidesLabel: string
  previousSlideLabel: string
  nextSlideLabel: string
  thumbnailLabel: (index: number, total: number) => string
  enterFullscreenLabel: string
  exitFullscreenLabel: string
  showThumbnailsLabel: string
  hideThumbnailsLabel: string
  downloadLabel: string
  closeLabel: string
}
export interface ToolbarItem {
  key: string
  icon: VNodeChild | Component
  label: string
  onClick: () => void
  position?: 'left' | 'right'
}
export interface ToolbarItemsPayload {
  slides: LightboxSlideData[]
  currentIndex: number
  setIndex: (index: number) => void
  next: () => void
  prev: () => void
  close: () => void
  thumbnailsVisible: boolean
  toggleThumbnails: () => void
  isFullscreen: boolean
  toggleFullscreen: () => void
  zoomed: boolean
  toggleZoom: () => void
  labels: LightboxLabels
}
export type ToolbarItems = ToolbarItem[] | ((payload: ToolbarItemsPayload) => ToolbarItem[])
