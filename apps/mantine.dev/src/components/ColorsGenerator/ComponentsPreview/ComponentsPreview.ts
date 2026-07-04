import { defineComponent, h, type PropType } from 'vue'
import { Button, Input, MantineProvider, Table } from '@mantine-vue/core'
import type { MantineColorsTuple } from '@mantine-vue/core'
import { useDebouncedValue } from '@mantine-vue/hooks'

export const ComponentsPreview = defineComponent({
  name: 'ComponentsPreview',
  props: {
    colors: { type: Array as unknown as PropType<MantineColorsTuple>, required: true },
  },
  setup(props) {
    const [debouncedColors] = useDebouncedValue(() => props.colors, 100)

    return () =>
      h('div', null, [
        h(
          Input.Label,
          { display: 'block', size: 'md', labelElement: 'div', mt: 'xl', mb: 'sm' },
          () => 'Variants preview',
        ),

        h(
          MantineProvider,
          { theme: { colors: { '__colors-generator__': debouncedColors.value } } },
          () =>
            h(Table.ScrollContainer, { minWidth: 600 }, () =>
              h(Table, { withTableBorder: true, withColumnBorders: true }, () => [
                h(Table.Thead, null, () =>
                  h(Table.Tr, null, () => [
                    h(Table.Th, { ta: 'center' }, () => 'Filled'),
                    h(Table.Th, { ta: 'center' }, () => 'Light'),
                    h(Table.Th, { ta: 'center' }, () => 'Outline'),
                    h(Table.Th, { ta: 'center' }, () => 'Subtle'),
                  ]),
                ),

                h(Table.Tbody, null, () =>
                  h(Table.Tr, null, () => [
                    h(Table.Td, null, () =>
                      h(
                        Button,
                        { color: '__colors-generator__', fullWidth: true, autoContrast: true },
                        () => 'Button',
                      ),
                    ),
                    h(Table.Td, null, () =>
                      h(
                        Button,
                        { color: '__colors-generator__', variant: 'light', fullWidth: true },
                        () => 'Button',
                      ),
                    ),
                    h(Table.Td, null, () =>
                      h(
                        Button,
                        { color: '__colors-generator__', variant: 'outline', fullWidth: true },
                        () => 'Button',
                      ),
                    ),
                    h(Table.Td, null, () =>
                      h(
                        Button,
                        { color: '__colors-generator__', variant: 'subtle', fullWidth: true },
                        () => 'Button',
                      ),
                    ),
                  ]),
                ),
              ]),
            ),
        ),
      ])
  },
})
