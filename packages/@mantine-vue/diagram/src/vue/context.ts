import { computed, inject, ref, shallowRef, type ComputedRef, type ShallowRef } from 'vue'
import {
  createSafeContext,
  getThemeColor,
  parseThemeColor,
  useSafeMantineTheme,
} from '@mantine-vue/core'
import type { DiagramLabels } from '../labels'
import type { DiagramController } from './use-diagram'

export interface DiagramElements {
  root: ShallowRef<HTMLElement | null>
  /** Element pointer events are measured against */
  canvas: ShallowRef<HTMLElement | null>
  svg: ShallowRef<SVGSVGElement | null>
  /** Group with the transformed content, used for exports */
  content: ShallowRef<SVGGElement | null>
}

export interface DiagramContextValue {
  controller: DiagramController
  labels: ComputedRef<DiagramLabels>
  getStyles: (selector: string, options?: any) => Record<string, any>
  /** Resolves CSS and Mantine theme colors, `undefined` stays `undefined` */
  resolveColor: (color: string | undefined) => string | undefined
  elements: DiagramElements
  /** DOM id of an element, unique per diagram */
  domId: (id: string) => string
  /** `true` inside a `Diagram`, `false` inside a `DiagramProvider` */
  inCanvas: boolean
  /** Opens the context menu at a client position for the current selection or the canvas */
  openContextMenu: (position: { x: number; y: number }, scope: 'selection' | 'canvas') => void
}

export const [provideDiagramContext, useDiagramContext, DIAGRAM_CONTEXT_KEY] =
  createSafeContext<DiagramContextValue>(
    'Diagram components must be rendered inside a Diagram or a DiagramProvider',
  )

/**
 * Set once a diagram is mounted. Text is measured with an estimate before, which matches what
 * the server renders, so hydration sees the same markup.
 */
export const textMeasurementReady = ref(false)

/** Context when available, `null` outside of a `Diagram` or `DiagramProvider`. */
export function useOptionalDiagramContext() {
  return inject(DIAGRAM_CONTEXT_KEY, null)
}

export function createElements(): DiagramElements {
  return {
    root: shallowRef(null),
    canvas: shallowRef(null),
    svg: shallowRef(null),
    content: shallowRef(null),
  }
}

/** Resolves theme colors like `'blue.6'` to CSS variables, other values are kept. */
export function useColorResolver() {
  const theme = useSafeMantineTheme()
  const cache = computed(() => {
    const map = new Map<string, string>()
    const current = theme.value

    return (color: string) => {
      let resolved = map.get(color)

      if (resolved === undefined) {
        resolved = isPlainCssColor(color) ? color : getThemeColor(color, current)
        map.set(color, resolved)
      }

      return resolved
    }
  })

  return (color: string | undefined) => (color ? cache.value(color) : undefined)
}

export function useContrastColorResolver() {
  const theme = useSafeMantineTheme()

  return (color: string | undefined) => {
    if (!color || isDynamicCssColor(color)) {
      return undefined
    }

    try {
      const parsed = parseThemeColor({ color, theme: theme.value })

      if (
        isDynamicCssColor(parsed.value) ||
        (!parsed.isThemeColor &&
          color !== 'white' &&
          color !== 'black' &&
          !color.startsWith('#') &&
          !color.startsWith('rgb') &&
          !color.startsWith('hsl') &&
          !color.startsWith('oklch('))
      ) {
        return undefined
      }

      return parsed.isLight ? 'var(--mantine-color-black)' : 'var(--mantine-color-white)'
    } catch {
      return undefined
    }
  }
}

function isPlainCssColor(color: string) {
  return (
    color.startsWith('#') ||
    color.startsWith('var(') ||
    color.startsWith('rgb') ||
    color.startsWith('hsl') ||
    color.startsWith('light-dark(') ||
    color.startsWith('color-mix(') ||
    color === 'transparent' ||
    color === 'none' ||
    color === 'currentColor'
  )
}

function isDynamicCssColor(color: string) {
  return (
    color.startsWith('var(') ||
    color.startsWith('light-dark(') ||
    color.startsWith('color-mix(') ||
    color === 'transparent' ||
    color === 'none' ||
    color === 'currentColor'
  )
}
