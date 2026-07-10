import { defineComponent, h, ref } from 'vue'
import { ActionIcon, ColorSwatch, Group, Text } from '@mantine-vue/core'
import { useEyeDropper } from '@mantine-vue/hooks'
import { PhCrosshair } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { ActionIcon, ColorSwatch, Group, Text } from '@mantine-vue/core'
import { PhCrosshair } from '@phosphor-icons/vue'
import { useEyeDropper } from '@mantine-vue/hooks'

const color = ref('')
const error = ref<Error | null>(null)
const { supported, open } = useEyeDropper()

const pickColor = async () => {
  try {
    const result = await open()
    if (result) {
      color.value = result.sRGBHex
    }
  } catch (e) {
    error.value = e as Error
  }
}
</script>

<template>
  <Text v-if="!supported" ta="center">EyeDropper API is not supported in your browser</Text>
  <Group v-else>
    <ActionIcon variant="default" size="xl" @click="pickColor">
      <PhCrosshair :size="28" />
    </ActionIcon>
    <Group v-if="color" gap="xs">
      <ColorSwatch :color="color" />
      <Text>Picked color: {{ color }}</Text>
    </Group>
    <Text v-else>Click the button to pick color</Text>
    <Text v-if="error" c="red">Error: {{ error.message }}</Text>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'UseEyeDropperUsageDemo',
  setup() {
    const color = ref('')
    const error = ref<Error | null>(null)
    const { supported, open } = useEyeDropper()

    const pickColor = async () => {
      try {
        const result = await open()
        if (result) {
          color.value = result.sRGBHex
        }
      } catch (e) {
        error.value = e as Error
      }
    }

    return () => {
      if (!supported.value) {
        return h(Text, { ta: 'center' }, () => 'EyeDropper API is not supported in your browser')
      }

      return h(Group, null, () => [
        h(ActionIcon, { variant: 'default', size: 'xl', onClick: pickColor }, () =>
          h(PhCrosshair, { size: 28 }),
        ),
        color.value
          ? h(Group, { gap: 'xs' }, () => [
              h(ColorSwatch, { color: color.value }),
              h(Text, null, () => `Picked color: ${color.value}`),
            ])
          : h(Text, null, () => 'Click the button to pick color'),
        error.value ? h(Text, { c: 'red' }, () => `Error: ${error.value?.message}`) : null,
      ])
    }
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
