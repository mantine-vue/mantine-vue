<script setup lang="ts">
import { ActionIcon } from '@mantine-vue/core'
import { PhHeart } from '@phosphor-icons/vue'
import { useQrMenu } from '../../../app/use-qr-menu'

defineProps<{ active: boolean; floating?: boolean }>()
defineEmits<{ toggle: [] }>()
const { t } = useQrMenu()
</script>

<template>
  <ActionIcon
    :variant="floating ? 'default' : 'subtle'"
    :color="active ? 'red' : 'gray'"
    radius="xl"
    size="md"
    :aria-pressed="active"
    :aria-label="active ? t('product.favoriteRemove') : t('product.favoriteAdd')"
    @click.stop="$emit('toggle')"
  >
    <PhHeart
      :size="16"
      :weight="active ? 'fill' : 'regular'"
      :color="active ? 'var(--mantine-color-red-6)' : undefined"
    />
  </ActionIcon>
</template>
