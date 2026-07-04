import { defineComponent, h, type PropType } from 'vue'
import type { TableData } from './Table'
import {
  TableCaption,
  TableTbody,
  TableTd,
  TableTfoot,
  TableTh,
  TableThead,
  TableTr,
} from './Table.components'

export const TableDataRenderer = defineComponent({
  name: 'TableDataRenderer',
  props: {
    data: { type: Object as PropType<TableData>, required: true },
  },
  setup(props) {
    return () => [
      props.data.caption ? h(TableCaption, null, () => props.data.caption) : null,
      props.data.head
        ? h(TableThead, null, () =>
            h(TableTr, null, () =>
              props.data.head?.map((item, index) => h(TableTh, { key: index }, () => item)),
            ),
          )
        : null,
      props.data.body
        ? h(TableTbody, null, () =>
            props.data.body?.map((row, rowIndex) =>
              h(TableTr, { key: rowIndex }, () =>
                row.map((item, index) => h(TableTd, { key: index }, () => item)),
              ),
            ),
          )
        : null,
      props.data.foot
        ? h(TableTfoot, null, () =>
            h(TableTr, null, () =>
              props.data.foot?.map((item, index) => h(TableTh, { key: index }, () => item)),
            ),
          )
        : null,
    ]
  },
})
