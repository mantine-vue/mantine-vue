<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, Badge, Button, Group, Rating, Stack, Text, Title } from '@mantine-vue/core'
import { PhInfo, PhMapPin } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import type { Restaurant } from '../../domain/types'
import { imageSrc } from '../../utils/images'
import OpenStatusBadge from '../common/OpenStatusBadge.vue'
import SmartImage from '../common/SmartImage.vue'

/** Restaurant branding block. The layout preset picks one of four presentations. */
const props = defineProps<{ restaurant: Restaurant }>()
const ctx = useQrMenu()
const { t, layout, localize, format, overlays } = ctx

const variant = computed(() => layout.value.hero)
const name = computed(() => localize(props.restaurant.name))
const priceRange = computed(() => '$'.repeat(props.restaurant.priceRange))
</script>

<template>
  <header :class="$style.hero" :data-variant="variant">
    <div v-if="variant !== 'minimal'" :class="$style.cover">
      <SmartImage
        :asset="restaurant.cover"
        :width="1200"
        :ratio="variant === 'banner' ? 3.2 : 16 / 7"
        eager
      />
      <div :class="$style.shade" />
      <Stack v-if="variant === 'centered'" :class="$style.centeredText" align="center" gap="xs">
        <Text :class="$style.kicker">{{ restaurant.cuisines.map(localize).join(' · ') }}</Text>
        <Title :order="1" :class="$style.centeredTitle">{{ name }}</Title>
        <Text :class="$style.centeredTagline">{{ localize(restaurant.tagline) }}</Text>
      </Stack>
    </div>

    <div class="qrm-container" :class="$style.body">
      <Group
        :align="variant === 'cover' ? 'flex-end' : 'center'"
        wrap="nowrap"
        gap="md"
        :class="$style.identity"
      >
        <Avatar
          v-if="variant !== 'centered'"
          :src="imageSrc(restaurant.logo, 160)"
          :alt="name"
          :size="variant === 'minimal' ? 56 : 84"
          radius="xl"
          :class="$style.logo"
        />
        <div :class="$style.titles">
          <Title v-if="variant !== 'centered'" :order="1" :class="$style.title">{{ name }}</Title>
          <Text v-if="variant !== 'centered'" c="dimmed" size="sm">{{
            localize(restaurant.tagline)
          }}</Text>
        </div>
      </Group>

      <Group
        gap="xs"
        mt="sm"
        wrap="wrap"
        :justify="variant === 'centered' ? 'center' : 'flex-start'"
      >
        <OpenStatusBadge />
        <Group
          :gap="4"
          wrap="nowrap"
          :aria-label="t('product.rating', { rating: format.decimal(restaurant.rating.average) })"
        >
          <Rating :model-value="restaurant.rating.average" :fractions="10" readonly size="xs" />
          <Text size="xs" fw="600">{{ format.decimal(restaurant.rating.average) }}</Text>
          <Text size="xs" c="dimmed"
            >({{ t('hero.reviews', { count: restaurant.rating.count }) }})</Text
          >
        </Group>
        <Badge variant="default" radius="xl" tt="none" :aria-label="t('hero.priceRange')">{{
          priceRange
        }}</Badge>
        <Badge
          v-for="cuisine in variant === 'centered' ? [] : restaurant.cuisines"
          :key="localize(cuisine)"
          variant="default"
          radius="xl"
          tt="none"
        >
          {{ localize(cuisine) }}
        </Badge>
      </Group>

      <Group gap="xs" mt="sm" :justify="variant === 'centered' ? 'center' : 'flex-start'">
        <Text size="xs" c="dimmed" :class="$style.address">
          <PhMapPin :size="14" />
          {{ localize(restaurant.address.line) }}, {{ localize(restaurant.address.city) }}
        </Text>
        <Button variant="subtle" size="compact-sm" @click="overlays.info = true">
          <template #leftSection><PhInfo :size="16" /></template>
          {{ t('hero.moreInfo') }}
        </Button>
      </Group>
    </div>
  </header>
</template>

<style module>
.hero {
  position: relative;
}

.cover {
  position: relative;
  max-height: 340px;
  overflow: hidden;

  & > div:first-child {
    max-height: 340px;
  }
}

.shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.55) 100%);
  pointer-events: none;
}

.body {
  position: relative;
  padding-top: var(--mantine-spacing-md);
}

.hero[data-variant='cover'] .logo {
  /* Only the logo overlaps the cover photo; the text stays on the page background. */
  margin-top: -52px;
  flex-shrink: 0;
  border: 4px solid var(--mantine-color-body);
  box-shadow: var(--mantine-shadow-md);
}

.hero[data-variant='cover'] .titles {
  padding-bottom: 4px;
}

.identity {
  min-width: 0;
}

.titles {
  min-width: 0;
}

.title {
  font-size: clamp(1.5rem, 5vw, 2.25rem);
  line-height: 1.15;
}

.hero[data-variant='centered'] .shade {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.7));
}

.hero[data-variant='centered'] .body {
  text-align: center;
}

.hero[data-variant='centered'] .identity {
  display: none;
}

.centeredText {
  position: absolute;
  inset: 0;
  justify-content: center;
  padding: var(--mantine-spacing-lg);
  color: var(--mantine-color-white);
  text-align: center;
}

.kicker {
  font-size: var(--mantine-font-size-xs);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.85;
}

.centeredTitle {
  color: var(--mantine-color-white);
  font-size: clamp(2rem, 8vw, 3.5rem);
  font-weight: 500;
}

.centeredTagline {
  font-style: italic;
  opacity: 0.9;
}

.address {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
