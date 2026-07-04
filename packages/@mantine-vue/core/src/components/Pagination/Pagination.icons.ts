import { defineComponent, h } from 'vue'

function createPaginationIcon(name: string, path: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs }) {
      return () =>
        h(
          'svg',
          {
            viewBox: '0 0 16 16',
            xmlns: 'http://www.w3.org/2000/svg',
            'aria-hidden': true,
            focusable: false,
            ...attrs,
            style: [
              {
                width: 'calc(var(--pagination-control-size) / 1.8)',
                height: 'calc(var(--pagination-control-size) / 1.8)',
              },
              attrs.style as any,
            ],
          },
          h('path', { d: path, fill: 'currentColor', fillRule: 'evenodd', clipRule: 'evenodd' }),
        )
    },
  })
}

export const PaginationNextIcon = createPaginationIcon(
  'PaginationNextIcon',
  'M5.293 2.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L9.586 8 5.293 3.707a1 1 0 0 1 0-1.414Z',
)

export const PaginationPreviousIcon = createPaginationIcon(
  'PaginationPreviousIcon',
  'M10.707 2.293a1 1 0 0 1 0 1.414L6.414 8l4.293 4.293a1 1 0 0 1-1.414 1.414l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 0 1 1.414 0Z',
)

export const PaginationFirstIcon = createPaginationIcon(
  'PaginationFirstIcon',
  'M4 2a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm8.707.293a1 1 0 0 1 0 1.414L8.414 8l4.293 4.293a1 1 0 0 1-1.414 1.414l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 0 1 1.414 0Z',
)

export const PaginationLastIcon = createPaginationIcon(
  'PaginationLastIcon',
  'M12 2a1 1 0 0 0-1 1v10a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1ZM3.293 2.293a1 1 0 0 0 0 1.414L7.586 8l-4.293 4.293a1 1 0 1 0 1.414 1.414l5-5a1 1 0 0 0 0-1.414l-5-5a1 1 0 0 0-1.414 0Z',
)

export const PaginationDotsIcon = createPaginationIcon(
  'PaginationDotsIcon',
  'M2 8a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm4.5 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm4.5 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z',
)
