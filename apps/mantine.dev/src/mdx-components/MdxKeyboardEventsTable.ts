import { defineComponent, h, type PropType } from 'vue'
import { Code, Kbd, Table } from '@mantine-vue/core'

interface KeyboardEvent {
  key: string
  description: string
  condition?: string
}

export const MdxKeyboardEventsTable = defineComponent({
  name: 'MdxKeyboardEventsTable',
  props: {
    data: {
      type: Array as PropType<KeyboardEvent[]>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const hasCondition = props.data.some((item) => item.condition)

      const rows = props.data.map((item, index) =>
        h(
          Table.Tr,
          { key: index },
          {
            default: () => [
              h(Table.Td, {}, { default: () => h(Kbd, {}, { default: () => item.key }) }),
              h(Table.Td, {}, { default: () => item.description }),
              hasCondition
                ? h(
                    Table.Td,
                    {},
                    {
                      default: () =>
                        item.condition ? h(Code, {}, { default: () => item.condition }) : '–',
                    },
                  )
                : null,
            ],
          },
        ),
      )

      return h(
        Table.ScrollContainer,
        { minWidth: 500 },
        {
          default: () =>
            h(
              Table,
              { verticalSpacing: 'xs' },
              {
                default: () => [
                  h(
                    Table.Thead,
                    {},
                    {
                      default: () =>
                        h(
                          Table.Tr,
                          {},
                          {
                            default: () => [
                              h(Table.Th, {}, { default: () => 'Key' }),
                              h(Table.Th, {}, { default: () => 'Description' }),
                              hasCondition ? h(Table.Th, {}, { default: () => 'Condition' }) : null,
                            ],
                          },
                        ),
                    },
                  ),
                  h('tbody', {}, rows),
                ],
              },
            ),
        },
      )
    }
  },
})
