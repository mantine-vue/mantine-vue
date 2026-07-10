import { ref, type Ref } from 'vue'
import { useIsomorphicEffect } from '../use-isomorphic-effect/use-isomorphic-effect'

export interface EyeDropperOpenOptions {
  signal?: AbortSignal
}

export interface EyeDropperOpenReturnType {
  sRGBHex: string
}

export interface UseEyeDropperReturnValue {
  supported: Ref<boolean>
  open: (options?: EyeDropperOpenOptions) => Promise<EyeDropperOpenReturnType | undefined>
}

function isOpera(): boolean {
  return navigator.userAgent.includes('OPR')
}

export function useEyeDropper(): UseEyeDropperReturnValue {
  const supported = ref(false)

  useIsomorphicEffect(() => {
    supported.value = typeof window !== 'undefined' && !isOpera() && 'EyeDropper' in window
  })

  const open = (
    options: EyeDropperOpenOptions = {},
  ): Promise<EyeDropperOpenReturnType | undefined> => {
    if (supported.value) {
      const eyeDropper = new (window as any).EyeDropper()
      return eyeDropper.open(options)
    }

    return Promise.resolve(undefined)
  }

  return { supported, open }
}
