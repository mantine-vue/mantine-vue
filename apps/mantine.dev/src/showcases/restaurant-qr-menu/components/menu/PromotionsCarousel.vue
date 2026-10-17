<script setup lang="ts">
import { computed, ref } from 'vue'
import Autoplay from 'embla-carousel-autoplay'
import { Badge, Button, CopyButton, Group, Text, Title } from '@mantine-vue/core'
import { Carousel } from '@mantine-vue/carousel'
import { notifications } from '@mantine-vue/notifications'
import { PhCheck, PhCopy, PhTicket } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import { usePromoMessages } from '../../composables/use-promo-messages'
import { useProductSheet } from '../../composables/use-product-sheet'
import type { Promotion } from '../../domain/types'
import { imageSrc } from '../../utils/images'

/** Offers carousel: copy or apply codes, or jump to the promoted dish. */
const ctx = useQrMenu()
const { t, data, localize, i18n, format } = ctx
const sheet = useProductSheet()
const promoMessages = usePromoMessages()
const applying = ref<string | null>(null)

const promotions = computed(() => data.promotions.value)
const autoplay = Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true })

const apply = async (promotion: Promotion) => {
  if (!promotion.code) {
    return
  }
  applying.value = promotion.id
  const result = await ctx.applyPromoCode(promotion.code)
  applying.value = null
  notifications.show(
    result.ok
      ? { color: 'teal', message: t('promo.applied', { code: promotion.code }) }
      : { color: 'orange', message: promoMessages.error(result) },
  )
}
</script>

<template>
  <section v-if="promotions.length" :aria-label="t('promotions.title')">
    <Group justify="space-between" mb="xs">
      <Title :order="2" size="h4">{{ t('promotions.title') }}</Title>
    </Group>
    <Carousel
      :key="i18n.dir.value"
      :slide-size="{ base: '88%', sm: '60%', md: '45%' }"
      slide-gap="md"
      :emblaOptions="{ align: 'start', loop: promotions.length > 2, direction: i18n.dir.value }"
      :plugins="[autoplay]"
      :withControls="promotions.length > 1"
      withIndicators
      :controlSize="28"
      :class="$style.carousel"
    >
      <Carousel.Slide v-for="promotion in promotions" :key="promotion.id">
        <div
          :class="$style.card"
          :style="{
            backgroundImage: promotion.image ? `url(${imageSrc(promotion.image, 720)})` : undefined,
          }"
        >
          <div :class="$style.content">
            <Badge color="brand" variant="filled" size="sm" radius="sm">
              <PhTicket :size="12" :class="$style.badgeIcon" />
              {{
                promotion.code
                  ? t('promotions.code', { code: promotion.code })
                  : t('promotions.title')
              }}
            </Badge>
            <Title :order="3" size="h4" :class="$style.title">{{
              localize(promotion.title)
            }}</Title>
            <Text size="sm" :class="$style.description">{{ localize(promotion.description) }}</Text>
            <Text v-if="promotion.validUntil" size="xs" :class="$style.description">
              {{ t('promotions.validUntil', { date: format.date(promotion.validUntil) }) }}
            </Text>
            <Group gap="xs" mt="xs">
              <template v-if="promotion.code">
                <Button
                  size="xs"
                  radius="xl"
                  variant="white"
                  color="dark"
                  :loading="applying === promotion.id"
                  :disabled="ctx.cart.cart.value.promoCode === promotion.code"
                  @click="apply(promotion)"
                >
                  {{
                    ctx.cart.cart.value.promoCode === promotion.code
                      ? t('promotions.applied')
                      : t('promotions.apply')
                  }}
                </Button>
                <CopyButton :value="promotion.code">
                  <template #default="{ copied, copy }">
                    <Button
                      size="xs"
                      radius="xl"
                      variant="outline"
                      color="white"
                      :class="$style.ghost"
                      @click="copy"
                    >
                      <template #leftSection>
                        <PhCheck v-if="copied" :size="14" />
                        <PhCopy v-else :size="14" />
                      </template>
                      {{ copied ? t('app.copied') : t('promotions.copyCode') }}
                    </Button>
                  </template>
                </CopyButton>
              </template>
              <Button
                v-if="promotion.productId && data.productsById.value.has(promotion.productId)"
                size="xs"
                radius="xl"
                variant="subtle"
                color="white"
                :class="$style.ghost"
                @click="sheet.open(promotion.productId)"
              >
                {{ t('promotions.viewDish') }}
              </Button>
            </Group>
          </div>
        </div>
      </Carousel.Slide>
    </Carousel>
  </section>
</template>

<style module>
.carousel {
  margin-inline: calc(var(--mantine-spacing-md) * -1);
  padding-inline: var(--mantine-spacing-md);
  overflow: hidden;
}

.card {
  position: relative;
  min-height: 190px;
  height: 100%;
  border-radius: var(--mantine-radius-lg);
  overflow: hidden;
  background-color: var(--mantine-color-brand-filled);
  background-size: cover;
  background-position: center;
  color: var(--mantine-color-white);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      110deg,
      rgba(0, 0, 0, 0.78) 0%,
      rgba(0, 0, 0, 0.35) 70%,
      rgba(0, 0, 0, 0.1)
    );

    @mixin rtl {
      background: linear-gradient(
        250deg,
        rgba(0, 0, 0, 0.78) 0%,
        rgba(0, 0, 0, 0.35) 70%,
        rgba(0, 0, 0, 0.1)
      );
    }
  }
}

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: var(--mantine-spacing-md);
  max-width: 85%;
}

.title {
  color: var(--mantine-color-white);
}

.description {
  color: rgba(255, 255, 255, 0.88);
}

.badgeIcon {
  margin-inline-end: 4px;
  vertical-align: -2px;
}

.ghost {
  color: var(--mantine-color-white);
  border-color: rgba(255, 255, 255, 0.6);
}
</style>
