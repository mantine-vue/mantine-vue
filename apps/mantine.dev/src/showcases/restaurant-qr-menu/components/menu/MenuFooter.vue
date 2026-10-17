<script setup lang="ts">
import { computed } from 'vue'
import { Anchor, Divider, Group, Stack, Text } from '@mantine-vue/core'
import { useQrMenu } from '../../app/use-qr-menu'
import type { Restaurant } from '../../domain/types'
import SocialLinks from '../info/SocialLinks.vue'

/** Footer with legal notices about allergens, taxes and currency. */
const props = defineProps<{ restaurant: Restaurant }>()
const { t, localize, format, overlays } = useQrMenu()

const taxNote = computed(() => {
  const ordering = props.restaurant.ordering
  const tax = `${localize(ordering.taxLabel)} ${format.percent(ordering.taxRate)}`
  return ordering.pricesIncludeTax
    ? t('menu.pricesIncludeTax', { tax })
    : t('menu.pricesExcludeTax', { tax })
})
</script>

<template>
  <footer :class="$style.footer">
    <Divider mb="lg" />
    <Stack gap="xs" align="center" ta="center">
      <Text size="xs" c="dimmed" :maw="560">{{ t('menu.allergenNotice') }}</Text>
      <Text size="xs" c="dimmed">
        {{ t('menu.pricesNote', { currency: restaurant.currency }) }} {{ taxNote }}
      </Text>
      <SocialLinks :links="restaurant.social" size="md" />
      <Group gap="xs" justify="center">
        <Anchor component="button" type="button" size="xs" @click="overlays.info = true">
          {{ t('header.info') }}
        </Anchor>
        <Text size="xs" c="dimmed">·</Text>
        <Anchor component="button" type="button" size="xs" @click="overlays.settings = true">
          {{ t('header.settings') }}
        </Anchor>
      </Group>
      <Text size="xs" c="dimmed">{{ t('app.poweredBy') }}</Text>
    </Stack>
  </footer>
</template>

<style module>
.footer {
  padding-block: var(--mantine-spacing-xl);
}
</style>
