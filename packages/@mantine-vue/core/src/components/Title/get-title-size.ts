import { rem } from '../../core'

export type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6
export type TitleSize = `h${TitleOrder}` | string | number

const headings: unknown[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const sizes: unknown[] = ['xs', 'sm', 'md', 'lg', 'xl']

export function getTitleSize(order: TitleOrder, size?: TitleSize) {
  const titleSize = size !== undefined ? size : `h${order}`

  if (headings.includes(titleSize)) {
    return {
      fontSize: `var(--mantine-${titleSize}-font-size)`,
      fontWeight: `var(--mantine-${titleSize}-font-weight)`,
      lineHeight: `var(--mantine-${titleSize}-line-height)`,
    }
  }

  if (sizes.includes(titleSize)) {
    return {
      fontSize: `var(--mantine-font-size-${titleSize})`,
      fontWeight: `var(--mantine-h${order}-font-weight)`,
      lineHeight: `var(--mantine-h${order}-line-height)`,
    }
  }

  return {
    fontSize: rem(titleSize),
    fontWeight: `var(--mantine-h${order}-font-weight)`,
    lineHeight: `var(--mantine-h${order}-line-height)`,
  }
}
