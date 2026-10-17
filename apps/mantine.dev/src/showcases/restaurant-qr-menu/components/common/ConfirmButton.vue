<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, Popover, Text } from '@mantine-vue/core'
import { useQrMenu } from '../../app/use-qr-menu'

/** Button that asks for confirmation in a popover before running a destructive action. */
withDefaults(
  defineProps<{ message: string; confirmLabel?: string; color?: string; size?: string }>(),
  { confirmLabel: undefined, color: 'red', size: 'compact-sm' },
)
const emit = defineEmits<{ confirm: [] }>()
const { t } = useQrMenu()
const opened = ref(false)

const confirm = () => {
  opened.value = false
  emit('confirm')
}
</script>

<template>
  <Popover v-model:opened="opened" position="top" withArrow shadow="md" :width="260" trapFocus>
    <Popover.Target>
      <Button variant="subtle" :color="color" :size="size" @click="opened = !opened">
        <slot />
      </Button>
    </Popover.Target>
    <Popover.Dropdown>
      <Text size="sm" mb="sm">{{ message }}</Text>
      <Group justify="flex-end" gap="xs">
        <Button variant="default" size="xs" @click="opened = false">{{ t('app.cancel') }}</Button>
        <Button :color="color" size="xs" @click="confirm">{{
          confirmLabel ?? t('app.confirm')
        }}</Button>
      </Group>
    </Popover.Dropdown>
  </Popover>
</template>
