import type { VNodeChild } from 'vue'
import type { Factory } from '@mantine-vue/core'
import type { ToolbarItems, LightboxSlideData } from './types'
import type { lightbox } from './lightbox.store'
import type { LightboxCaption } from './LightboxCaption'
import type { LightboxCloseButton } from './LightboxCloseButton'
import type { LightboxNavigation } from './LightboxNavigation'
import type { LightboxProviderComponent } from './LightboxProvider'
import type { LightboxRootProps, LightboxRootStylesNames } from './LightboxRoot'
import type { LightboxRoot } from './LightboxRoot'
import type { LightboxSlide } from './LightboxSlide'
import type { LightboxSlides } from './LightboxSlides'
import type { LightboxThumbnails } from './LightboxThumbnails'
import type { LightboxToolbar } from './LightboxToolbar'
export type LightboxStylesNames = LightboxRootStylesNames
export interface LightboxProps extends LightboxRootProps {
  toolbarItems?: ToolbarItems
  withNavigation?: boolean
}
export interface LightboxSlots {
  default?: () => VNodeChild
  slide?: (props: { slide: LightboxSlideData; index: number; active: boolean }) => VNodeChild
}
export interface LightboxEmits {
  close: []
  'update:opened': [opened: boolean]
  indexChange: [index: number]
  'update:currentIndex': [index: number]
}
export type LightboxFactory = Factory<{
  props: LightboxProps
  slots: LightboxSlots
  emits: LightboxEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: LightboxStylesNames
  staticComponents: {
    Root: typeof LightboxRoot
    Toolbar: typeof LightboxToolbar
    Slides: typeof LightboxSlides
    Slide: typeof LightboxSlide
    Thumbnails: typeof LightboxThumbnails
    Navigation: typeof LightboxNavigation
    Caption: typeof LightboxCaption
    CloseButton: typeof LightboxCloseButton
    Provider: typeof LightboxProviderComponent
    open: typeof lightbox.open
    close: typeof lightbox.close
    next: typeof lightbox.next
    prev: typeof lightbox.prev
    setIndex: typeof lightbox.setIndex
  }
}>
