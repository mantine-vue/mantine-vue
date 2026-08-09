import type * as Components from './index'
import type * as Core from '../core'

/**
 * Derives a component's public props from its runtime declaration.
 *
 * note `PropsOf` exposes prop names, types, required flags and defaults, but it cannot carry
 * prop descriptions, so these components show empty descriptions in generated
 * documentation.
 */
type PropsOf<T> = T extends abstract new (...args: any[]) => { $props: infer Props } ? Props : never

export type NativeSelectOptionProps = PropsOf<typeof Components.NativeSelectOption>
export type PaginationDotsProps = PropsOf<typeof Components.PaginationDots>
export type AppShellHeaderProps = PropsOf<typeof Components.AppShellHeader>
export type AppShellNavbarProps = PropsOf<typeof Components.AppShellNavbar>
export type AppShellAsideProps = PropsOf<typeof Components.AppShellAside>
export type AppShellFooterProps = PropsOf<typeof Components.AppShellFooter>
export type FocusTrapInitialFocusProps = PropsOf<typeof Components.FocusTrapInitialFocus>
export type DirectionProviderProps = PropsOf<typeof Core.DirectionProvider>
export type HeadlessMantineProviderProps = PropsOf<typeof Core.HeadlessMantineProvider>
export type MantineThemeProviderProps = PropsOf<typeof Core.MantineThemeProvider>
export type InlineStylesProps = PropsOf<typeof Core.InlineStyles>
export type MantineClassesProps = PropsOf<typeof Core.MantineClasses>
export type MantineCssVariablesProps = PropsOf<typeof Core.MantineCssVariables>
export type TableDataRendererProps = PropsOf<typeof Components.TableDataRenderer>
