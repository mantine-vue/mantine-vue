import { defineComponent, h, ref } from 'vue'
import { Button, Menu, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Menu, Text } from '@mantine-vue/core'

const data = [
  'Dashboard', 'Customers', 'Products', 'Orders', 'Reports',
  'Settings', 'Integrations', 'Billing', 'Team members', 'Help center',
]

const query = ref('')
const items = computed(() =>
  data.filter((item) => item.toLowerCase().includes(query.value.toLowerCase().trim()))
)
</script>

<template>
  <Menu shadow="md" :width="240">
    <Menu.Target>
      <Button>Toggle menu</Button>
    </Menu.Target>

    <Menu.Dropdown>
      <Menu.Search
        :value="query"
        @change="(e) => query = e.target.value"
        placeholder="Search items"
      />

      <template v-if="items.length > 0">
        <Menu.Item v-for="item in items" :key="item">{{ item }}</Menu.Item>
      </template>
      <Text v-else c="dimmed" size="sm" ta="center" py="xs">Nothing found</Text>
    </Menu.Dropdown>
  </Menu>
</template>
`

const data = [
  'Dashboard',
  'Customers',
  'Products',
  'Orders',
  'Reports',
  'Settings',
  'Integrations',
  'Billing',
  'Team members',
  'Help center',
]

const Demo = defineComponent({
  name: 'MenuSearchDemo',
  setup() {
    const query = ref('')

    return () => {
      const items = data.filter((item) =>
        item.toLowerCase().includes(query.value.toLowerCase().trim()),
      )

      return h(
        Menu,
        { shadow: 'md', width: 240 },
        {
          default: () => [
            h(Menu.Target, null, { default: () => h(Button, null, () => 'Toggle menu') }),
            h(Menu.Dropdown, null, {
              default: () => [
                h(Menu.Search, {
                  value: query.value,
                  placeholder: 'Search items',
                  onChange: (e: Event) => {
                    query.value = (e.target as HTMLInputElement).value
                  },
                }),
                items.length > 0
                  ? items.map((item) => h(Menu.Item, { key: item }, () => item))
                  : h(
                      Text,
                      { c: 'dimmed', size: 'sm', ta: 'center', py: 'xs' },
                      () => 'Nothing found',
                    ),
              ],
            }),
          ],
        },
      )
    }
  },
})

export const search: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
