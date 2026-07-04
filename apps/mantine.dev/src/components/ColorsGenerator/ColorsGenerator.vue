<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Title } from '@mantine-vue/core'
import { useLocalStorage } from '@mantine-vue/hooks'
import { generateColorsMap, type MantineColorsTuple } from '@mantine-vue/colors-generator'
import { ColorsInput } from './ColorsInput/ColorsInput'
import { ColorsList } from './ColorsList/ColorsList'
import { ColorsOutput } from './ColorsOutput/ColorsOutput'
import { ComponentsPreview } from './ComponentsPreview/ComponentsPreview'

const route = useRoute()

const color = ref('#5474B4')
const [displayColorsInfo, setDisplayColorsInfo] = useLocalStorage({
  key: 'display-colors-info',
  defaultValue: true,
})

const colorsMap = computed(() => generateColorsMap(color.value))
const colors = computed(() => colorsMap.value.colors)
const baseColorIndex = computed(() => colorsMap.value.baseColorIndex)

function setColor(value: string) {
  color.value = value
}

watch(
  () => route.query.color,
  (value) => {
    const urlColor = `#${value ?? ''}`
    if (/^#[0-9A-F]{6}$/i.test(urlColor)) {
      color.value = urlColor
    }
  },
  { immediate: true },
)
</script>

<template>
  <div :style="{ maxWidth: 'calc(100vw - var(--mantine-spacing-lg) * 2)' }">
    <Title :fw="500" mb="md" pt="lg" c="bright"> Mantine colors generator </Title>

    <ColorsInput
      :value="color"
      :on-change="setColor"
      :display-colors-info="displayColorsInfo"
      :set-display-colors-info="setDisplayColorsInfo"
    />

    <ColorsList
      :colors="colors"
      :base-color-index="baseColorIndex"
      :display-colors-info="displayColorsInfo"
    />

    <ComponentsPreview :colors="colors.map((c) => c.hex()) as unknown as MantineColorsTuple" />

    <ColorsOutput :colors="colors.map((c) => c.hex())" />
  </div>
</template>
