import type { LightboxProps } from '../Lightbox.props'
import type { LightboxStore } from '../lightbox.store'
import LightboxProviderComponent from './LightboxProvider.vue'
export { LightboxProviderComponent }
export interface LightboxProviderProps extends Omit<
  LightboxProps,
  'opened' | 'slides' | 'currentIndex'
> {
  store?: LightboxStore
}
