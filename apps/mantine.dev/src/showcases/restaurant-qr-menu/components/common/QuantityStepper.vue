<script setup lang="ts">
import { ActionIcon, Group, Text } from '@mantine-vue/core'
import { PhMinus, PhPlus, PhTrash } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'

/** Touch-friendly quantity control. Emits `remove` instead of going below `min`. */
const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    size?: 'sm' | 'md' | 'lg'
    /** Shows a trash icon at the minimum and emits `remove`. */
    removable?: boolean
    label?: string
  }>(),
  { min: 1, max: 99, size: 'md', removable: false, label: undefined },
)

const emit = defineEmits<{ 'update:modelValue': [value: number]; remove: [] }>()
const { t, format } = useQrMenu()

const decrease = () => {
  if (props.modelValue <= props.min) {
    if (props.removable) {
      emit('remove')
    }
    return
  }
  emit('update:modelValue', props.modelValue - 1)
}

const increase = () => {
  if (props.modelValue < props.max) {
    emit('update:modelValue', props.modelValue + 1)
  }
}

const iconSize = { sm: 14, md: 16, lg: 18 }
</script>

<template>
  <Group
    gap="xs"
    wrap="nowrap"
    role="group"
    :aria-label="label ?? t('details.quantity')"
    :class="$style.root"
  >
    <ActionIcon
      :size="size === 'lg' ? 'xl' : size === 'md' ? 'lg' : 'md'"
      variant="default"
      radius="xl"
      :disabled="modelValue <= min && !removable"
      :aria-label="modelValue <= min && removable ? t('app.remove') : t('details.decrease')"
      @click="decrease"
    >
      <PhTrash v-if="modelValue <= min && removable" :size="iconSize[size]" />
      <PhMinus v-else :size="iconSize[size]" weight="bold" />
    </ActionIcon>
    <Text
      :size="size"
      fw="700"
      ta="center"
      class="qrm-tabular"
      :class="$style.value"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ format.number(modelValue) }}
    </Text>
    <ActionIcon
      :size="size === 'lg' ? 'xl' : size === 'md' ? 'lg' : 'md'"
      variant="default"
      radius="xl"
      :disabled="modelValue >= max"
      :aria-label="t('details.increase')"
      @click="increase"
    >
      <PhPlus :size="iconSize[size]" weight="bold" />
    </ActionIcon>
  </Group>
</template>

<style module>
.root {
  flex-shrink: 0;
}

.value {
  min-width: 1.75em;
}
</style>
