<script setup lang="ts">
import { ref } from 'vue'
import {
  Alert,
  Button,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  UnstyledButton,
} from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import { PhBellRinging, PhDrop, PhForkKnife, PhReceipt } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import type { ServiceRequestType } from '../../domain/types'
import { isApiError } from '../../services/contracts'

/** Dine-in assistance: call a waiter, ask for the bill, water or cutlery. */
const ctx = useQrMenu()
const { t, overlays, services, settings, table, localize } = ctx

const TYPES: { type: ServiceRequestType; icon: unknown }[] = [
  { type: 'waiter', icon: PhBellRinging },
  { type: 'bill', icon: PhReceipt },
  { type: 'water', icon: PhDrop },
  { type: 'cutlery', icon: PhForkKnife },
]

const type = ref<ServiceRequestType>('waiter')
const note = ref('')
const sending = ref(false)
const error = ref('')

const send = async () => {
  if (!table.value) {
    error.value = t('service.requiresTable')
    return
  }
  error.value = ''
  sending.value = true
  try {
    const request = await services.serviceRequests.create({
      restaurantId: ctx.restaurantId.value,
      tableId: table.value.id,
      type: type.value,
      note: note.value,
    })
    notifications.show({
      color: 'teal',
      title: t('service.sent'),
      message: t('service.sentMessage', { table: table.value.label, minutes: request.etaMinutes }),
    })
    note.value = ''
    overlays.service = false
  } catch (caught) {
    if (isApiError(caught) && caught.code === 'rate-limited') {
      const seconds = (caught.details as { retryInSeconds?: number })?.retryInSeconds ?? 60
      error.value = t('service.rateLimited', { seconds })
    } else {
      error.value = t('errors.network')
    }
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <Modal
    :opened="overlays.service"
    :title="t('service.title')"
    centered
    radius="lg"
    :closeButtonProps="{ 'aria-label': t('app.close') }"
    @close="overlays.service = false"
  >
    <Stack gap="md">
      <Select
        v-if="settings"
        :model-value="table?.id ?? null"
        :data="
          settings.tables.map((item) => ({
            value: item.id,
            label: `${t('table.label', { table: item.label })} · ${localize(item.area)}`,
          }))
        "
        :label="t('table.title')"
        :placeholder="t('table.select')"
        radius="md"
        searchable
        @update:model-value="(value: string | null) => ctx.setTable(value)"
      />
      <SimpleGrid :cols="2" spacing="xs" role="radiogroup" :aria-label="t('service.title')">
        <UnstyledButton
          v-for="item in TYPES"
          :key="item.type"
          role="radio"
          :aria-checked="type === item.type"
          :class="$style.option"
          :data-active="type === item.type || undefined"
          @click="type = item.type"
        >
          <component :is="item.icon" :size="26" weight="duotone" />
          <Text size="sm" fw="600">{{ t(`service.types.${item.type}`) }}</Text>
        </UnstyledButton>
      </SimpleGrid>
      <Textarea
        v-model="note"
        :label="t('service.note')"
        :placeholder="t('service.notePlaceholder')"
        :maxlength="140"
        autosize
        radius="md"
      />
      <Alert v-if="error" color="orange" variant="light" radius="md" role="alert">{{
        error
      }}</Alert>
      <Button radius="xl" size="md" :loading="sending" @click="send">{{
        t('service.send')
      }}</Button>
    </Stack>
  </Modal>
</template>

<style module>
.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--mantine-spacing-md) var(--mantine-spacing-xs);
  border: 1px solid var(--mantine-color-default-border);
  border-radius: var(--mantine-radius-md);
  text-align: center;
  transition:
    border-color 120ms ease,
    background-color 120ms ease;

  &[data-active] {
    border-color: var(--mantine-primary-color-filled);
    background-color: var(--mantine-primary-color-light);
    color: var(--mantine-primary-color-light-color);
  }

  &:focus-visible {
    outline: 2px solid var(--mantine-primary-color-filled);
    outline-offset: 2px;
  }
}
</style>
