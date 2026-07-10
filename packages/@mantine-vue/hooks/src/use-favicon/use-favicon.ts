import { toValue, watch, type MaybeRefOrGetter } from 'vue'
import { useIsomorphicEffect } from '../use-isomorphic-effect/use-isomorphic-effect'

const MIME_TYPES: Record<string, string> = {
  ico: 'image/x-icon',
  png: 'image/png',
  svg: 'image/svg+xml',
  gif: 'image/gif',
}

export function useFavicon(url: MaybeRefOrGetter<string>) {
  let link: HTMLLinkElement | null = null

  useIsomorphicEffect(() => {
    watch(
      () => toValue(url),
      (value) => {
        if (!value) {
          return
        }

        if (!link) {
          const existingElements = document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]')
          existingElements.forEach((element) => document.head.removeChild(element))

          const element = document.createElement('link')
          element.rel = 'shortcut icon'
          link = element
          document.querySelector('head')!.appendChild(element)
        }

        const splittedUrl = value.split('.')
        const extension = splittedUrl[splittedUrl.length - 1].toLowerCase()
        const mimeType = MIME_TYPES[extension]

        if (mimeType) {
          link.setAttribute('type', mimeType)
        } else {
          link.removeAttribute('type')
        }

        link.setAttribute('href', value)
      },
      { immediate: true },
    )
  })
}
