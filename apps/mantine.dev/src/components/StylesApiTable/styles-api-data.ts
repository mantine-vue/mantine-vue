import * as stylesData from '@docs/styles-api'
import type { StylesApiData } from '@docs/styles-api'

export type { StylesApiData }

export const STYLES_API_DATA = stylesData as unknown as Record<string, StylesApiData>

/** Styles API entries are exported as `<Component>StylesApi`. */
export function getStylesApiData(component: string): StylesApiData | undefined {
  return STYLES_API_DATA[`${component}StylesApi`]
}
