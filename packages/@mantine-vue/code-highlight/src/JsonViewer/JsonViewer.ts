import { factory } from '@mantine-vue/core'
import JsonViewerComponent, { varsResolver } from './JsonViewer.vue'
import type { JsonViewerFactory } from './JsonViewer.types'
import classes from './JsonViewer.module.css'
export const JsonViewer = factory<JsonViewerFactory>(JsonViewerComponent, { classes, varsResolver })
export type * from './JsonViewer.types'
export { PATH_SEPARATOR, serializePath } from './json-viewer-utils'
export { serializePath as serializeJsonViewerPath } from './json-viewer-utils'
