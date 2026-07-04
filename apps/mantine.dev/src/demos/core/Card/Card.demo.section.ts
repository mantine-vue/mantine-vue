import { defineComponent, h } from 'vue'
import { ActionIcon, Card, Group, Image, Menu, SimpleGrid, Text } from '@mantine-vue/core'
import { PhDotsThree, PhEye, PhFileZip, PhTrash } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ActionIcon, Card, Group, Image, Menu, SimpleGrid, Text } from '@mantine-vue/core'
import { PhDotsThree, PhEye, PhFileZip, PhTrash } from '@phosphor-icons/vue'

const images = [
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
]
</script>

<template>
  <Card withBorder shadow="sm">
    <Card.Section withBorder inheritPadding py="xs">
      <Group justify="space-between">
        <Text :fw="500">Review pictures</Text>
        <Menu withinPortal position="bottom-end" shadow="sm">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <PhDotsThree :size="16" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item :leftSection="h(PhFileZip, { size: 14 })">Download zip</Menu.Item>
            <Menu.Item :leftSection="h(PhEye, { size: 14 })">Preview all</Menu.Item>
            <Menu.Item :leftSection="h(PhTrash, { size: 14 })" color="red">Delete all</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Card.Section>

    <Text mt="sm" c="dimmed" size="sm">
      <Text span inherit c="var(--mantine-color-anchor)">200+ images uploaded</Text>
      since last visit, review them to select which one should be added to your gallery
    </Text>

    <Card.Section mt="sm">
      <Image src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png" />
    </Card.Section>

    <Card.Section inheritPadding mt="sm" pb="md">
      <SimpleGrid :cols="3">
        <Image v-for="image in images" :key="image" :src="image" radius="sm" />
      </SimpleGrid>
    </Card.Section>
  </Card>
</template>
`

const images = [
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
]

const Demo = defineComponent({
  name: 'CardSectionDemo',
  setup() {
    return () =>
      h(
        Card,
        { withBorder: true, shadow: 'sm' },
        {
          default: () => [
            h(
              Card.Section,
              { withBorder: true, inheritPadding: true, py: 'xs' },
              {
                default: () =>
                  h(
                    Group,
                    { justify: 'space-between' },
                    {
                      default: () => [
                        h(Text, { fw: 500 }, { default: () => 'Review pictures' }),
                        h(
                          Menu,
                          { withinPortal: true, position: 'bottom-end', shadow: 'sm' },
                          {
                            default: () => [
                              h(
                                Menu.Target,
                                {},
                                {
                                  default: () =>
                                    h(
                                      ActionIcon,
                                      { variant: 'subtle', color: 'gray' },
                                      {
                                        default: () => h(PhDotsThree, { size: 16 }),
                                      },
                                    ),
                                },
                              ),
                              h(
                                Menu.Dropdown,
                                {},
                                {
                                  default: () => [
                                    h(
                                      Menu.Item,
                                      { leftSection: h(PhFileZip, { size: 14 }) },
                                      { default: () => 'Download zip' },
                                    ),
                                    h(
                                      Menu.Item,
                                      { leftSection: h(PhEye, { size: 14 }) },
                                      { default: () => 'Preview all' },
                                    ),
                                    h(
                                      Menu.Item,
                                      { leftSection: h(PhTrash, { size: 14 }), color: 'red' },
                                      { default: () => 'Delete all' },
                                    ),
                                  ],
                                },
                              ),
                            ],
                          },
                        ),
                      ],
                    },
                  ),
              },
            ),
            h(
              Text,
              { mt: 'sm', c: 'dimmed', size: 'sm' },
              {
                default: () => [
                  h(
                    Text,
                    { span: true, inherit: true, c: 'var(--mantine-color-anchor)' },
                    { default: () => '200+ images uploaded' },
                  ),
                  ' since last visit, review them to select which one should be added to your gallery',
                ],
              },
            ),
            h(
              Card.Section,
              { mt: 'sm' },
              {
                default: () =>
                  h(Image, {
                    src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
                  }),
              },
            ),
            h(
              Card.Section,
              { inheritPadding: true, mt: 'sm', pb: 'md' },
              {
                default: () =>
                  h(
                    SimpleGrid,
                    { cols: 3 },
                    {
                      default: () =>
                        images.map((image) => h(Image, { key: image, src: image, radius: 'sm' })),
                    },
                  ),
              },
            ),
          ],
        },
      )
  },
})

export const section: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  maxWidth: 340,
  dimmed: true,
  code,
}
