import { defineComponent, h } from 'vue'

export interface IconProps {
  style?: any
  class?: any
}

function createIcon(name: string, children: any[]) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs }) {
      return () =>
        h(
          'svg',
          {
            ...attrs,
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
            strokeWidth: '1.5',
            stroke: 'currentColor',
            fill: 'none',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          },
          [h('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }), ...children],
        )
    },
  })
}

const path = (d: string) => h('path', { d })

export const IconBold = createIcon('IconBold', [
  path('M7 5h6a3.5 3.5 0 0 1 0 7h-6z'),
  path('M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7'),
])
export const IconItalic = createIcon('IconItalic', [
  path('M11 5l6 0'),
  path('M7 19l6 0'),
  path('M14 5l-4 14'),
])
export const IconUnderline = createIcon('IconUnderline', [
  path('M7 5v5a5 5 0 0 0 10 0v-5'),
  path('M5 19h14'),
])
export const IconStrikethrough = createIcon('IconStrikethrough', [
  path('M5 12l14 0'),
  path('M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5'),
])
export const IconClearFormatting = createIcon('IconClearFormatting', [
  path('M17 15l4 4m0 -4l-4 4'),
  path('M7 6v-1h11v1'),
  path('M7 19l4 0'),
  path('M13 5l-4 14'),
])
export const IconH1 = createIcon('IconH1', [
  path('M19 18v-8l-2 2'),
  path('M4 6v12'),
  path('M12 6v12'),
  path('M11 18h2'),
  path('M3 18h2'),
  path('M4 12h8'),
  path('M3 6h2'),
  path('M11 6h2'),
])
export const IconH2 = createIcon('IconH2', [
  path('M17 12a2 2 0 1 1 4 0c0 .591 -.417 1.318 -.816 1.858l-3.184 4.143l4 0'),
  path('M4 6v12'),
  path('M12 6v12'),
  path('M11 18h2'),
  path('M3 18h2'),
  path('M4 12h8'),
  path('M3 6h2'),
  path('M11 6h2'),
])
export const IconH3 = createIcon('IconH3', [
  path('M19 14a2 2 0 1 0 -2 -2'),
  path('M17 16a2 2 0 1 0 2 -2'),
  path('M4 6v12'),
  path('M12 6v12'),
  path('M11 18h2'),
  path('M3 18h2'),
  path('M4 12h8'),
  path('M3 6h2'),
  path('M11 6h2'),
])
export const IconH4 = createIcon('IconH4', [
  path('M20 18v-8l-4 6h5'),
  path('M4 6v12'),
  path('M12 6v12'),
  path('M11 18h2'),
  path('M3 18h2'),
  path('M4 12h8'),
  path('M3 6h2'),
  path('M11 6h2'),
])
export const IconH5 = createIcon('IconH5', [
  path('M17 18h2a2 2 0 1 0 0 -4h-2v-4h4'),
  path('M4 6v12'),
  path('M12 6v12'),
  path('M11 18h2'),
  path('M3 18h2'),
  path('M4 12h8'),
  path('M3 6h2'),
  path('M11 6h2'),
])
export const IconH6 = createIcon('IconH6', [
  path('M19 14a2 2 0 1 0 0 4a2 2 0 0 0 0 -4z'),
  path('M21 12a2 2 0 1 0 -4 0v4'),
  path('M4 6v12'),
  path('M12 6v12'),
  path('M11 18h2'),
  path('M3 18h2'),
  path('M4 12h8'),
  path('M3 6h2'),
  path('M11 6h2'),
])
export const IconList = createIcon('IconList', [
  path('M9 6l11 0'),
  path('M9 12l11 0'),
  path('M9 18l11 0'),
  path('M5 6l0 .01'),
  path('M5 12l0 .01'),
  path('M5 18l0 .01'),
])
export const IconListNumbers = createIcon('IconListNumbers', [
  path('M11 6h9'),
  path('M11 12h9'),
  path('M12 18h8'),
  path('M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4'),
  path('M6 10v-6l-2 2'),
])
export const IconUnlink = createIcon('IconUnlink', [
  path('M17 22v-2'),
  path('M9 15l6 -6'),
  path('M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464'),
  path('M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463'),
  path('M20 17h2'),
  path('M2 7h2'),
  path('M7 2v2'),
])
export const IconBlockquote = createIcon('IconBlockquote', [
  path('M6 15h15'),
  path('M21 19h-15'),
  path('M15 11h6'),
  path('M21 7h-6'),
  path('M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2'),
  path('M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2'),
])
export const IconAlignLeft = createIcon('IconAlignLeft', [
  path('M4 6l16 0'),
  path('M4 12l10 0'),
  path('M4 18l14 0'),
])
export const IconAlignRight = createIcon('IconAlignRight', [
  path('M4 6l16 0'),
  path('M10 12l10 0'),
  path('M6 18l14 0'),
])
export const IconAlignCenter = createIcon('IconAlignCenter', [
  path('M4 6l16 0'),
  path('M8 12l8 0'),
  path('M6 18l12 0'),
])
export const IconAlignJustified = createIcon('IconAlignJustified', [
  path('M4 6l16 0'),
  path('M4 12l16 0'),
  path('M4 18l12 0'),
])
export const IconSubscript = createIcon('IconSubscript', [
  path('M5 7l8 10m-8 0l8 -10'),
  path('M21 20h-4l3.5 -4a1.73 1.73 0 0 0 -3.5 -2'),
])
export const IconSuperscript = createIcon('IconSuperscript', [
  path('M5 7l8 10m-8 0l8 -10'),
  path('M21 11h-4l3.5 -4a1.73 1.73 0 0 0 -3.5 -2'),
])
export const IconCode = createIcon('IconCode', [
  path('M7 8l-4 4l4 4'),
  path('M17 8l4 4l-4 4'),
  path('M14 4l-4 16'),
])
export const IconHighlight = createIcon('IconHighlight', [
  path('M3 19h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4'),
  path('M12.5 5.5l4 4'),
  path('M4.5 13.5l4 4'),
  path('M21 15v4h-8l4 -4z'),
])
export const IconLineDashed = createIcon('IconLineDashed', [
  path('M5 12h2'),
  path('M17 12h2'),
  path('M11 12h2'),
])
export const IconCircleOff = createIcon('IconCircleOff', [
  path('M20.042 16.045a9 9 0 0 0 -12.087 -12.087m-2.318 1.677a9 9 0 1 0 12.725 12.73'),
  path('M3 3l18 18'),
])
export const IconColorPicker = createIcon('IconColorPicker', [
  path('M11 7l6 6'),
  path('M4 16l11.7 -11.7a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4l-11.7 11.7h-4v-4z'),
])
export const IconX = createIcon('IconX', [path('M18 6l-12 12'), path('M6 6l12 12')])
export const IconPalette = createIcon('IconPalette', [
  path(
    'M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25',
  ),
  path('M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0'),
  path('M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0'),
  path('M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0'),
])
export const IconCheck = createIcon('IconCheck', [path('M5 12l5 5l10 -10')])
export const IconLink = createIcon('IconLink', [
  path('M9 15l6 -6'),
  path('M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464'),
  path('M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463'),
])
export const IconExternalLink = createIcon('IconExternalLink', [
  path('M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6'),
  path('M11 13l9 -9'),
  path('M15 4h5v5'),
])
export const IconArrowBackUp = createIcon('IconArrowBackUp', [
  path('M9 14l-4 -4l4 -4'),
  path('M5 10h11a4 4 0 1 1 0 8h-1'),
])
export const IconArrowForwardUp = createIcon('IconArrowForwardUp', [
  path('M15 14l4 -4l-4 -4'),
  path('M19 10h-11a4 4 0 1 0 0 8h1'),
])
export const IconListCheck = createIcon('IconListCheck', [
  path('M3.5 5.5l1.5 1.5l2.5 -2.5'),
  path('M3.5 11.5l1.5 1.5l2.5 -2.5'),
  path('M3.5 17.5l1.5 1.5l2.5 -2.5'),
  path('M11 6l9 0'),
  path('M11 12l9 0'),
  path('M11 18l9 0'),
])
export const IconIndentIncrease = createIcon('IconIndentIncrease', [
  path('M20 6l-11 0'),
  path('M20 12l-7 0'),
  path('M20 18l-11 0'),
  path('M4 8l4 4l-4 4'),
])
export const IconIndentDecrease = createIcon('IconIndentDecrease', [
  path('M20 6l-7 0'),
  path('M20 12l-9 0'),
  path('M20 18l-7 0'),
  path('M8 8l-4 4l4 4'),
])
export const IconBraces = createIcon('IconBraces', [
  path(
    'M19 3v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z',
  ),
  path('M10 11l-2 2 2 2'),
  path('M14 11l2 2-2 2'),
])
