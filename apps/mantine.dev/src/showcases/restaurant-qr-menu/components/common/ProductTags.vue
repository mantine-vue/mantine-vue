<script setup lang="ts">
import { computed } from 'vue'
import { Badge, Group, Tooltip } from '@mantine-vue/core'
import { PhGrainsSlash, PhLeaf, PhPepper, PhPlant, PhSealCheck } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import type { DietaryTag, Product } from '../../domain/types'
import { BADGE_COLORS } from '../../utils/badges'

/** Product badges (popular, new…) and compact dietary icons. */
const props = withDefaults(
  defineProps<{
    product: Product
    /** Maximum number of badges, `0` hides badges. */
    maxBadges?: number
    withDietary?: boolean
    size?: 'xs' | 'sm' | 'md'
  }>(),
  { maxBadges: 2, withDietary: true, size: 'xs' },
)

const { t } = useQrMenu()

const DIETARY_ICONS: Partial<Record<DietaryTag, { icon: unknown; color: string }>> = {
  vegan: { icon: PhPlant, color: 'var(--mantine-color-green-7)' },
  vegetarian: { icon: PhLeaf, color: 'var(--mantine-color-green-6)' },
  'gluten-free': { icon: PhGrainsSlash, color: 'var(--mantine-color-yellow-8)' },
  halal: { icon: PhSealCheck, color: 'var(--mantine-color-teal-7)' },
}

const badges = computed(() => props.product.badges.slice(0, props.maxBadges))
const dietary = computed(() =>
  props.withDietary
    ? props.product.dietary
        // Vegan already implies vegetarian.
        .filter((tag) => !(tag === 'vegetarian' && props.product.dietary.includes('vegan')))
        .filter((tag) => DIETARY_ICONS[tag])
    : [],
)
</script>

<template>
  <Group v-if="badges.length || dietary.length" :gap="4" wrap="wrap" :class="$style.root">
    <Badge
      v-for="badge in badges"
      :key="badge"
      :color="BADGE_COLORS[badge]"
      :size="size"
      variant="light"
      radius="sm"
      tt="none"
    >
      <PhPepper v-if="badge === 'spicy'" :size="11" weight="fill" :class="$style.badgeIcon" />
      {{ t(`badges.${badge}`) }}
    </Badge>
    <Tooltip v-for="tag in dietary" :key="tag" :label="t(`dietary.${tag}`)" withinPortal>
      <span
        :class="$style.dietary"
        :style="{ color: DIETARY_ICONS[tag]!.color }"
        role="img"
        :aria-label="t(`dietary.${tag}`)"
      >
        <component :is="DIETARY_ICONS[tag]!.icon" :size="15" weight="duotone" />
      </span>
    </Tooltip>
  </Group>
</template>

<style module>
.root {
  row-gap: 4px;
}

.badgeIcon {
  margin-inline-end: 2px;
  vertical-align: -1px;
}

.dietary {
  display: inline-flex;
  align-items: center;
}
</style>
