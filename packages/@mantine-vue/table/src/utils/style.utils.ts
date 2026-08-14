import { type CSSProperties } from 'vue'

import { type MantineTheme } from '@mantine-vue/core'

import { type MantineShade } from '../types'

export const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_')

/**
 * Width/flex styles that bind a cell to its column's live size variables, so
 * custom cells (server-grouping group rows, …) stay aligned with the root
 * table while columns are resized or reordered.
 */
export const getMVT_ColumnWidthStyles = ({
  columnId,
  grow,
  layoutMode,
  minSize,
}: {
  columnId: string
  grow?: boolean | number
  layoutMode?: 'grid' | 'grid-no-grow' | 'semantic'
  minSize?: number
}): CSSProperties => {
  const cssVar = `--col-${parseCSSVarId(columnId)}-size`
  const styles: CSSProperties = {
    minWidth: `max(calc(var(${cssVar}) * 1px), ${minSize ?? 30}px)`,
    width: `calc(var(${cssVar}) * 1px)`,
  }
  if (layoutMode === 'grid') {
    styles.flex = `${[0, false].includes(grow as any) ? 0 : `var(${cssVar})`} 0 auto`
  } else if (layoutMode === 'grid-no-grow') {
    styles.flex = `${+(grow || 0)} 0 auto`
  }
  return styles
}

export const getPrimaryShade = (theme: MantineTheme): number =>
  typeof theme.primaryShade === 'number' ? theme.primaryShade : (theme.primaryShade?.dark ?? 7)

export const getPrimaryColor = (theme: MantineTheme, shade?: MantineShade): string =>
  theme.colors[theme.primaryColor][shade ?? getPrimaryShade(theme)]

export function dataVariable(name: string, value: boolean | number | string | undefined) {
  const key = `data-${name}`
  switch (typeof value) {
    case 'boolean':
      return value ? { [key]: '' } : null
    case 'number':
      return { [key]: `${value}` }
    case 'string':
      return { [key]: value }
    default:
      return null
  }
}
