import {
  exportImage,
  exportSvg,
  downloadFile,
  printSvg,
  type DiagramImageExportOptions,
  type DiagramSvgExportOptions,
} from '../core/export'
import { serializeDiagram } from '../core/serialization'
import { useOptionalDiagramContext } from './context'
import type { DiagramController } from './use-diagram'

/** Export helpers of a mounted diagram: JSON, SVG, raster images, downloads and printing. */
export function useDiagramExport(controller?: DiagramController) {
  const ctrl = controller ?? useOptionalDiagramContext()?.controller

  if (!ctrl) {
    throw new Error(
      '[@mantine-vue/diagram] Pass a controller or use useDiagramExport inside a Diagram or DiagramProvider',
    )
  }

  const content = () => {
    const element = ctrl.elements.value.content

    if (!element) {
      throw new Error('[@mantine-vue/diagram] The diagram must be mounted to export images')
    }

    return element
  }

  const bounds = (options: DiagramSvgExportOptions) => {
    if (options.bounds) {
      return options.bounds
    }

    const settings = ctrl.editor.settings.bounds
    const contentBounds = ctrl.editor.getContentBounds()

    return settings ?? contentBounds
  }

  const toSvg = (options: DiagramSvgExportOptions = {}) =>
    exportSvg(content(), bounds(options), options)

  return {
    /** Document as formatted JSON */
    toJson: (space = 2) => serializeDiagram(ctrl.toDocument(), space),
    toSvg,
    toImage: (options: DiagramImageExportOptions = {}) =>
      exportImage(content(), bounds(options), options),
    downloadJson: (fileName = 'diagram.json') =>
      downloadFile(serializeDiagram(ctrl.toDocument(), 2), fileName, 'application/json'),
    downloadSvg: (fileName = 'diagram.svg', options: DiagramSvgExportOptions = {}) =>
      downloadFile(toSvg(options), fileName, 'image/svg+xml'),
    downloadImage: async (fileName = 'diagram.png', options: DiagramImageExportOptions = {}) =>
      downloadFile(await exportImage(content(), bounds(options), options), fileName),
    print: (options: DiagramSvgExportOptions & { title?: string; landscape?: boolean } = {}) =>
      printSvg(toSvg({ background: '#ffffff', ...options }), options),
  }
}
