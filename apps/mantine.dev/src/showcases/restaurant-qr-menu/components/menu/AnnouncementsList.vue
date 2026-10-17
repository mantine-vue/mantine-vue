<script setup lang="ts">
import { computed } from 'vue'
import { Alert, Anchor, Stack } from '@mantine-vue/core'
import { PhInfo, PhMegaphone, PhWarningCircle } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import { useProductSheet } from '../../composables/use-product-sheet'

/** Dismissible restaurant announcements (events, new dishes, notices). */
const { data, customer, localize, t } = useQrMenu()
const sheet = useProductSheet()

const announcements = computed(() =>
  (data.restaurant.value?.announcements ?? []).filter(
    (item) => !customer.isAnnouncementDismissed(item.id),
  ),
)

const colors = { info: 'blue', promo: 'brand', warning: 'orange' } as const
</script>

<template>
  <Stack v-if="announcements.length" gap="xs">
    <Alert
      v-for="item in announcements"
      :key="item.id"
      :color="colors[item.tone]"
      variant="light"
      radius="lg"
      :title="localize(item.title)"
      withCloseButton
      :closeButtonLabel="t('announcements.dismiss')"
      @close="customer.dismissAnnouncement(item.id)"
    >
      <template #icon>
        <PhMegaphone v-if="item.tone === 'promo'" :size="20" />
        <PhWarningCircle v-else-if="item.tone === 'warning'" :size="20" />
        <PhInfo v-else :size="20" />
      </template>
      {{ localize(item.message) }}
      <Anchor
        v-if="item.productId && data.productsById.value.has(item.productId)"
        component="button"
        type="button"
        size="sm"
        fw="600"
        :ms="4"
        @click="sheet.open(item.productId)"
      >
        {{ t('announcements.view') }}
      </Anchor>
    </Alert>
  </Stack>
</template>
