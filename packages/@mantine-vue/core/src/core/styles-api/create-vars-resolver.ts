import type { MantineTheme } from '../MantineProvider'

export function createVarsResolver<Props>(
  resolver: (
    theme: MantineTheme,
    props: Props,
    ctx: Record<string, any>,
  ) => Record<string, Record<string, string | undefined>>,
) {
  return resolver
}
