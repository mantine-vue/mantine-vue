import { defineComponent, h } from 'vue'
import {
  PhSmiley,
  PhSmileyMeh,
  PhSmileyNervous,
  PhSmileySad,
  PhSmileyWink,
} from '@phosphor-icons/vue'
import { Rating } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Rating } from '@mantine-vue/core'
import {
  PhSmileySad,
  PhSmileyNervous,
  PhSmiley,
  PhSmileyMeh,
  PhSmileyWink,
} from '@phosphor-icons/vue'

const getIconStyle = (color?: string) => ({
  width: 24,
  height: 24,
  color: color ? \`var(--mantine-color-\${color}-7)\` : undefined,
})

const getEmptyIcon = (value: number) => {
  const iconStyle = getIconStyle()
  switch (value) {
    case 1: return h(PhSmileySad, { style: iconStyle })
    case 2: return h(PhSmileyNervous, { style: iconStyle })
    case 3: return h(PhSmiley, { style: iconStyle })
    case 4: return h(PhSmileyMeh, { style: iconStyle })
    case 5: return h(PhSmileyWink, { style: iconStyle })
    default: return null
  }
}

const getFullIcon = (value: number) => {
  switch (value) {
    case 1: return h(PhSmileySad, { style: getIconStyle('red') })
    case 2: return h(PhSmileyNervous, { style: getIconStyle('orange') })
    case 3: return h(PhSmiley, { style: getIconStyle('yellow') })
    case 4: return h(PhSmileyMeh, { style: getIconStyle('lime') })
    case 5: return h(PhSmileyWink, { style: getIconStyle('green') })
    default: return null
  }
}
</script>

<template>
  <Rating :empty-symbol="getEmptyIcon" :full-symbol="getFullIcon" highlight-selected-only />
</template>
`

const getIconStyle = (color?: string) => ({
  width: 24,
  height: 24,
  color: color ? `var(--mantine-color-${color}-7)` : undefined,
})

const getEmptyIcon = (value: number) => {
  const iconStyle = getIconStyle()
  switch (value) {
    case 1:
      return h(PhSmileySad, { style: iconStyle })
    case 2:
      return h(PhSmileyNervous, { style: iconStyle })
    case 3:
      return h(PhSmiley, { style: iconStyle })
    case 4:
      return h(PhSmileyMeh, { style: iconStyle })
    case 5:
      return h(PhSmileyWink, { style: iconStyle })
    default:
      return null
  }
}

const getFullIcon = (value: number) => {
  switch (value) {
    case 1:
      return h(PhSmileySad, { style: getIconStyle('red') })
    case 2:
      return h(PhSmileyNervous, { style: getIconStyle('orange') })
    case 3:
      return h(PhSmiley, { style: getIconStyle('yellow') })
    case 4:
      return h(PhSmileyMeh, { style: getIconStyle('lime') })
    case 5:
      return h(PhSmileyWink, { style: getIconStyle('green') })
    default:
      return null
  }
}

const Demo = defineComponent({
  name: 'RatingCustomSymbolDemo',
  setup: () => () =>
    h(Rating, {
      emptySymbol: getEmptyIcon,
      fullSymbol: getFullIcon,
      highlightSelectedOnly: true,
    }),
})

export const customSymbol: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
