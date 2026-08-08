<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, luminance } from '../../../core'
import { CheckIcon } from '../../Checkbox'
import { ColorSwatch } from '../../ColorSwatch'
import { useColorPickerContext } from '../ColorPicker.context'
import type { SwatchesOwnProps } from './Swatches.types'

defineOptions({ name: 'Swatches' })

const props = withDefaults(defineProps<SwatchesOwnProps>(), {
  focusable: true,
  value: undefined,
})

const emit = defineEmits<{
  'change-end': [value: string]
}>()

const attrs = useAttrs()
const ctx = useColorPickerContext()!

function onSwatchClick(color: string) {
  props.setValue(color)
  emit('change-end', color)
}

/** White check on dark swatches, black on light ones. */
function checkColor(color: string) {
  return luminance(color) < 0.5 ? 'white' : 'black'
}
</script>

<template>
  <Box v-bind="{ ...attrs, ...ctx.getStyles('swatches') }">
    <ColorSwatch
      v-for="(color, index) in props.data"
      :key="index"
      v-bind="ctx.getStyles('swatch')"
      component="button"
      type="button"
      :color="color"
      radius="sm"
      :unstyled="ctx.unstyled"
      :aria-label="color"
      :tabindex="props.focusable ? 0 : -1"
      data-swatch=""
      @click="onSwatchClick(color)"
    >
      <CheckIcon v-if="props.value === color" width="35%" :color="checkColor(color)" />
    </ColorSwatch>
  </Box>
</template>
