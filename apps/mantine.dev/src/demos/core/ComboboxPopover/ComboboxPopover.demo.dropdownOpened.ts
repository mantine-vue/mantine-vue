import { defineComponent, h } from 'vue'
import { Button, ComboboxPopover, Group } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, ComboboxPopover, Group } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'

const [dropdownOpened, { toggle }] = useDisclosure()
</script>

<template>
  <Group>
    <Button @click="toggle">Toggle dropdown</Button>
    <ComboboxPopover :data="['React', 'Angular', 'Vue', 'Svelte']" :dropdown-opened="dropdownOpened">
      <ComboboxPopover.Target>
        <Button variant="default" :miw="200">Select framework</Button>
      </ComboboxPopover.Target>
    </ComboboxPopover>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxPopoverDropdownOpenedDemo',
  setup() {
    const [dropdownOpened, { toggle }] = useDisclosure()
    return () =>
      h(Group, null, () => [
        h(Button, { onClick: () => toggle() }, () => 'Toggle dropdown'),
        h(
          ComboboxPopover,
          { data: ['React', 'Angular', 'Vue', 'Svelte'], dropdownOpened: dropdownOpened.value },
          () =>
            h(ComboboxPopover.Target, null, () =>
              h(Button, { variant: 'default', miw: 200 }, () => 'Select framework'),
            ),
        ),
      ])
  },
})

export const dropdownOpened: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
