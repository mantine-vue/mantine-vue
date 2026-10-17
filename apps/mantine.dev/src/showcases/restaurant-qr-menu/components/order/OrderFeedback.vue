<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, Paper, Rating, Stack, Text, Textarea, Title } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import { useQrMenu } from '../../app/use-qr-menu'
import type { Order } from '../../domain/types'

/** Post-order rating and comment, sent to the order service. */
const props = defineProps<{ order: Order }>()
const emit = defineEmits<{ updated: [order: Order] }>()
const { t, services } = useQrMenu()

const rating = ref(0)
const comment = ref('')
const submitting = ref(false)

const submit = async () => {
  submitting.value = true
  try {
    const updated = await services.orders.submitFeedback(props.order.id, {
      rating: rating.value,
      comment: comment.value,
    })
    notifications.show({ color: 'teal', message: t('order.feedbackThanks') })
    emit('updated', updated)
  } catch {
    notifications.show({ color: 'red', message: t('errors.network') })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Paper withBorder radius="lg" p="md">
    <Title :order="2" size="h5" mb="sm">{{ t('order.feedbackTitle') }}</Title>
    <Stack v-if="order.feedback" gap="xs">
      <Rating :model-value="order.feedback.rating" readonly />
      <Text v-if="order.feedback.comment" size="sm" c="dimmed">“{{ order.feedback.comment }}”</Text>
      <Text size="sm" c="teal">{{ t('order.feedbackThanks') }}</Text>
    </Stack>
    <form v-else @submit.prevent="submit">
      <Stack gap="sm">
        <Group gap="xs">
          <Text size="sm" id="qrm-feedback-rating">{{ t('order.feedbackRating') }}</Text>
          <Rating v-model="rating" size="lg" aria-labelledby="qrm-feedback-rating" />
        </Group>
        <Textarea
          v-model="comment"
          :placeholder="t('order.feedbackPlaceholder')"
          autosize
          :minRows="2"
          :maxlength="500"
          radius="md"
        />
        <Group justify="flex-end">
          <Button type="submit" radius="xl" :disabled="rating === 0" :loading="submitting">
            {{ t('order.feedbackSubmit') }}
          </Button>
        </Group>
      </Stack>
    </form>
  </Paper>
</template>
