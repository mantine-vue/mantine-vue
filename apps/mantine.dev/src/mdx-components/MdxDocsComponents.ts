import { defineComponent, h, type PropType, type VNodeChild } from 'vue'
import { RouterLink } from 'vue-router'

function renderCell(tag: 'th' | 'td', cell: VNodeChild) {
  return h(tag, undefined, [cell] as any)
}

export const MdxExamplesButton = defineComponent({
  name: 'MdxExamplesButton',
  props: {
    link: { type: String, required: true },
    label: { type: String, required: true },
  },
  setup(props) {
    return () =>
      h('p', { class: 'mdx-p' }, [
        h(
          RouterLink,
          {
            to: props.link,
            class: 'mdx-link mdx-examples-button',
          },
          { default: () => props.label },
        ),
      ])
  },
})

export const MdxDataTable = defineComponent({
  name: 'MdxDataTable',
  props: {
    head: { type: Array as PropType<VNodeChild[]>, required: true },
    data: { type: Array as PropType<VNodeChild[][]>, required: true },
  },
  setup(props) {
    return () =>
      h('div', { class: 'mdx-table-wrap' }, [
        h('table', { class: 'mdx-table' }, [
          h('thead', undefined, [
            h(
              'tr',
              undefined,
              props.head.map((cell) => renderCell('th', cell)),
            ),
          ]),
          h(
            'tbody',
            undefined,
            props.data.map((row) =>
              h(
                'tr',
                undefined,
                row.map((cell) => renderCell('td', cell)),
              ),
            ),
          ),
        ]),
      ])
  },
})
