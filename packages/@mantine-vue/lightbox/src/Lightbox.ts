import { factory } from '@mantine-vue/core'
import LightboxComponent from './Lightbox.vue'
import { lightbox } from './lightbox.store'
import { LightboxCaption } from './LightboxCaption'
import { LightboxCloseButton } from './LightboxCloseButton'
import { LightboxNavigation } from './LightboxNavigation'
import { LightboxProviderComponent } from './LightboxProvider'
import { LightboxRoot } from './LightboxRoot'
import { LightboxSlide } from './LightboxSlide'
import { LightboxSlides } from './LightboxSlides'
import { LightboxThumbnails } from './LightboxThumbnails'
import { LightboxToolbar } from './LightboxToolbar'
import type { LightboxFactory } from './Lightbox.props'
import classes from './Lightbox.module.css'
export const Lightbox = factory<LightboxFactory>(LightboxComponent, {
  classes,
  Root: LightboxRoot,
  Toolbar: LightboxToolbar,
  Slides: LightboxSlides,
  Slide: LightboxSlide,
  Thumbnails: LightboxThumbnails,
  Navigation: LightboxNavigation,
  Caption: LightboxCaption,
  CloseButton: LightboxCloseButton,
  Provider: LightboxProviderComponent,
  open: lightbox.open,
  close: lightbox.close,
  next: lightbox.next,
  prev: lightbox.prev,
  setIndex: lightbox.setIndex,
})
export type {
  LightboxFactory,
  LightboxEmits,
  LightboxProps,
  LightboxSlots,
  LightboxStylesNames,
} from './Lightbox.props'
