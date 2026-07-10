import { onBeforeUnmount, ref, type Ref } from 'vue'
import { useIsomorphicEffect } from '../use-isomorphic-effect/use-isomorphic-effect'

export interface UseOrientationOptions {
  /** Default angle value, used until the real can be retrieved
   * (during server side rendering and before js executes on the page)
   * If not provided, the default value is `0`
   * */
  defaultAngle?: number

  /** Default angle value, used until the real can be retrieved
   * (during server side rendering and before js executes on the page)
   * If not provided, the default value is `'landscape-primary'`
   * */
  defaultType?: OrientationType

  /** If true, the initial value will be resolved after mount (ssr safe)
   *  If false, the initial value will be resolved synchronously (ssr unsafe)
   *  True by default.
   */
  getInitialValueInEffect?: boolean
}

export interface UseOrientationReturnType {
  angle: number
  type: OrientationType
}

function getInitialValue(
  initialValue: UseOrientationReturnType,
  getInitialValueInEffect: boolean,
): UseOrientationReturnType {
  if (getInitialValueInEffect) {
    return initialValue
  }

  if (typeof window !== 'undefined' && 'screen' in window) {
    return {
      angle: window.screen.orientation?.angle ?? initialValue.angle,
      type: window.screen.orientation?.type ?? initialValue.type,
    }
  }

  return initialValue
}

export function useOrientation(options: UseOrientationOptions = {}): Ref<UseOrientationReturnType> {
  const {
    defaultAngle = 0,
    defaultType = 'landscape-primary',
    getInitialValueInEffect = true,
  } = options

  const orientation = ref<UseOrientationReturnType>(
    getInitialValue({ angle: defaultAngle, type: defaultType }, getInitialValueInEffect),
  ) as Ref<UseOrientationReturnType>

  const handleOrientationChange = (event: Event): void => {
    const target = event.currentTarget as ScreenOrientation
    orientation.value = { angle: target?.angle || 0, type: target?.type || 'landscape-primary' }
  }

  useIsomorphicEffect(() => {
    if (window.screen.orientation) {
      orientation.value = {
        angle: window.screen.orientation.angle,
        type: window.screen.orientation.type,
      }
      window.screen.orientation.addEventListener('change', handleOrientationChange)
    }
  })

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.screen.orientation?.removeEventListener('change', handleOrientationChange)
    }
  })

  return orientation
}
