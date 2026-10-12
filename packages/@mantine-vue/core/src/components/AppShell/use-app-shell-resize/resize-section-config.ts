import type { AppShellResizeSection } from '../AppShell.types'

export interface ResizeSectionConfig {
  axis: 'horizontal' | 'vertical'
  orientation: 'vertical' | 'horizontal'
  sizeVariable: string
  offsetVariable: string
  gridWidthVariable?: string
  safeAreaVariable?: string
  sign: 1 | -1
}

export const RESIZE_SECTIONS: Record<AppShellResizeSection, ResizeSectionConfig> = {
  navbar: {
    axis: 'horizontal',
    orientation: 'vertical',
    sizeVariable: '--app-shell-navbar-width',
    offsetVariable: '--app-shell-navbar-offset',
    gridWidthVariable: '--app-shell-navbar-grid-width',
    sign: 1,
  },
  aside: {
    axis: 'horizontal',
    orientation: 'vertical',
    sizeVariable: '--app-shell-aside-width',
    offsetVariable: '--app-shell-aside-offset',
    gridWidthVariable: '--app-shell-aside-grid-width',
    sign: -1,
  },
  header: {
    axis: 'vertical',
    orientation: 'horizontal',
    sizeVariable: '--app-shell-header-height',
    offsetVariable: '--app-shell-header-offset',
    sign: 1,
  },
  footer: {
    axis: 'vertical',
    orientation: 'horizontal',
    sizeVariable: '--app-shell-footer-height',
    offsetVariable: '--app-shell-footer-offset',
    safeAreaVariable: '--app-shell-footer-safe-area',
    sign: -1,
  },
}

export const RESIZE_SECTION_NAMES = Object.keys(RESIZE_SECTIONS) as AppShellResizeSection[]

export function getResizeDelta({
  section,
  deltaX,
  deltaY,
  dir,
}: {
  section: AppShellResizeSection
  deltaX: number
  deltaY: number
  dir: 'ltr' | 'rtl'
}) {
  const config = RESIZE_SECTIONS[section]
  return config.axis === 'vertical'
    ? deltaY * config.sign
    : deltaX * config.sign * (dir === 'rtl' ? -1 : 1)
}
