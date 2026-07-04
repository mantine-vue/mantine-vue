import { defineComponent, h, ref } from 'vue'
import { PhStar } from '@phosphor-icons/vue'
import { Button, Menu } from '@mantine-vue/core'
import type { MantineDemo } from '@/types'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { PhStar } from '@phosphor-icons/vue'
import { Button, Menu } from '@mantine-vue/core'

const sort = ref('newest')
const starIcon = h(PhStar, { size: 14, weight: 'fill' })
</script>

<template>
  <Menu shadow="md" :width="220" :close-on-item-click="false" :check-icon="starIcon">
    <Menu.Target>
      <Button>Sort by</Button>
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Label>Order</Menu.Label>
      <Menu.RadioGroup :value="sort" @change="sort = $event">
        <Menu.RadioItem value="newest">Newest first</Menu.RadioItem>
        <Menu.RadioItem value="oldest">Oldest first</Menu.RadioItem>
        <Menu.RadioItem value="popular">Most popular</Menu.RadioItem>
        <Menu.RadioItem value="commented">Most commented</Menu.RadioItem>
      </Menu.RadioGroup>
    </Menu.Dropdown>
  </Menu>
</template>
`

const Demo = defineComponent({
  name: 'MenuCheckIconDemo',
  setup() {
    const sort = ref('newest')
    const starIcon = h(PhStar, { size: 14, weight: 'fill' })

    return () =>
      h(
        Menu,
        { shadow: 'md', width: 220, closeOnItemClick: false, checkIcon: starIcon },
        {
          default: () => [
            h(Menu.Target, null, { default: () => h(Button, null, () => 'Sort by') }),
            h(Menu.Dropdown, null, {
              default: () => [
                h(Menu.Label, null, () => 'Order'),
                h(
                  Menu.RadioGroup,
                  {
                    value: sort.value,
                    onChange: (v: string) => {
                      sort.value = v
                    },
                  },
                  {
                    default: () => [
                      h(Menu.RadioItem, { value: 'newest' }, () => 'Newest first'),
                      h(Menu.RadioItem, { value: 'oldest' }, () => 'Oldest first'),
                      h(Menu.RadioItem, { value: 'popular' }, () => 'Most popular'),
                      h(Menu.RadioItem, { value: 'commented' }, () => 'Most commented'),
                    ],
                  },
                ),
              ],
            }),
          ],
        },
      )
  },
})

export const checkIcon: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
