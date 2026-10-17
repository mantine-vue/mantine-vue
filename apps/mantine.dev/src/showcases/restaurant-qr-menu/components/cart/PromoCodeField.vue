<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, Pill, Text, TextInput } from '@mantine-vue/core'
import { PhTicket } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import { usePromoMessages } from '../../composables/use-promo-messages'

/** Promo code entry with server-side validation and a removable applied state. */
const ctx = useQrMenu()
const { t, cart, promotionEligibility } = ctx
const promoMessages = usePromoMessages()

const code = ref('')
const error = ref('')
const loading = ref(false)

const apply = async () => {
  error.value = ''
  loading.value = true
  const result = await ctx.applyPromoCode(code.value)
  loading.value = false
  if (result.ok) {
    code.value = ''
  } else {
    error.value = promoMessages.error(result)
  }
}

const ineligibleMessage = () => {
  const eligibility = promotionEligibility.value
  return eligibility && !eligibility.eligible
    ? promoMessages.error({
        ok: false,
        reason: eligibility.reason,
        minSubtotal: eligibility.minSubtotal,
      })
    : ''
}
</script>

<template>
  <div>
    <template v-if="cart.cart.value.promoCode">
      <Group gap="xs">
        <Text size="sm" fw="600">{{ t('promo.label') }}</Text>
        <Pill
          withRemoveButton
          size="md"
          :removeButtonProps="{
            'aria-label': t('promo.remove', { code: cart.cart.value.promoCode }),
          }"
          @remove="ctx.removePromoCode()"
        >
          <PhTicket :size="14" :class="$style.icon" />
          {{ cart.cart.value.promoCode }}
        </Pill>
      </Group>
      <Text v-if="ineligibleMessage()" size="xs" c="orange" :mt="4" role="status">{{
        ineligibleMessage()
      }}</Text>
    </template>
    <form v-else :class="$style.form" @submit.prevent="apply">
      <TextInput
        v-model="code"
        :label="t('promo.label')"
        :placeholder="t('promo.placeholder')"
        :error="error || undefined"
        autocapitalize="characters"
        autocomplete="off"
        spellcheck="false"
        radius="md"
        flex="1"
        @update:model-value="error = ''"
      >
        <template #leftSection><PhTicket :size="16" /></template>
      </TextInput>
      <Button
        type="submit"
        variant="light"
        radius="md"
        :loading="loading"
        :disabled="!code.trim()"
        :class="$style.button"
      >
        {{ t('promo.apply') }}
      </Button>
    </form>
  </div>
</template>

<style module>
.form {
  display: flex;
  align-items: flex-start;
  gap: var(--mantine-spacing-xs);
}

.button {
  margin-top: 25px;
}

.icon {
  margin-inline-end: 4px;
  vertical-align: -2px;
}
</style>
