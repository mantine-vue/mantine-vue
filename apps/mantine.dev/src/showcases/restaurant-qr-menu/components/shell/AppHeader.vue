<script setup lang="ts">
import { computed, h, type Component } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  ActionIcon,
  Avatar,
  Group,
  Indicator,
  Menu,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine-vue/core'
import {
  PhArrowLeft,
  PhDotsThreeVertical,
  PhHeart,
  PhInfo,
  PhPaintBrushBroad,
  PhReceipt,
  PhShoppingBag,
  PhTranslate,
} from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import { LOCALES } from '../../i18n'
import { imageSrc } from '../../utils/images'
import OpenStatusBadge from '../common/OpenStatusBadge.vue'

const ctx = useQrMenu()
const { t, data, overlays, cart, i18n } = ctx
const route = useRoute()
const router = useRouter()

const restaurantName = computed(() => ctx.localize(data.restaurant.value?.name))
const icon = (component: Component) => h(component, { size: 18 })
const cartLabel = computed(() => t('header.cartWithCount', { count: cart.itemCount.value }))

const goHome = () => {
  if (route.name === 'rqm-menu') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.push({ name: 'rqm-menu' })
  }
}
</script>

<template>
  <Group h="100%" px="md" justify="space-between" wrap="nowrap" gap="xs" :class="$style.header">
    <UnstyledButton
      :class="$style.brand"
      :aria-label="restaurantName || t('app.title')"
      @click="goHome"
    >
      <Avatar
        :src="data.restaurant.value ? imageSrc(data.restaurant.value.logo, 80) : undefined"
        :alt="''"
        size="md"
        radius="xl"
      />
      <div :class="$style.brandText">
        <Text fw="700" size="md" truncate class="qrm-heading" lh="1.2">
          {{ restaurantName || t('app.title') }}
        </Text>
        <OpenStatusBadge v-if="data.restaurant.value" size="xs" :with-detail="false" />
      </div>
    </UnstyledButton>

    <Group :gap="4" wrap="nowrap">
      <Menu position="bottom-end" :width="180" shadow="md">
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray" size="lg" :aria-label="t('header.language')">
            <PhTranslate :size="20" />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{{ t('header.language') }}</Menu.Label>
          <Menu.Item
            v-for="locale in LOCALES"
            :key="locale.code"
            :lang="locale.code"
            :dir="locale.dir"
            :aria-current="i18n.locale.value === locale.code || undefined"
            :fw="i18n.locale.value === locale.code ? 700 : 400"
            @click="ctx.setLocale(locale.code)"
          >
            {{ locale.nativeLabel }}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Tooltip :label="t('header.settings')">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          :aria-label="t('header.settings')"
          @click="overlays.settings = true"
        >
          <PhPaintBrushBroad :size="20" />
        </ActionIcon>
      </Tooltip>

      <Indicator
        :label="ctx.format.number(cart.itemCount.value)"
        :disabled="cart.itemCount.value === 0"
        :size="18"
        :offset="6"
        color="brand"
      >
        <ActionIcon variant="light" size="lg" :aria-label="cartLabel" @click="overlays.cart = true">
          <PhShoppingBag :size="20" />
        </ActionIcon>
      </Indicator>

      <Menu position="bottom-end" :width="220" shadow="md">
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray" size="lg" :aria-label="t('header.more')">
            <PhDotsThreeVertical :size="22" weight="bold" />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item :left-section="icon(PhInfo)" @click="overlays.info = true">
            {{ t('header.info') }}
          </Menu.Item>
          <Menu.Item :left-section="icon(PhHeart)" @click="overlays.favorites = true">
            {{ t('header.favorites') }}
          </Menu.Item>
          <Menu.Item :left-section="icon(PhReceipt)" @click="overlays.orders = true">
            {{ t('header.orders') }}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            :component="RouterLink"
            to="/showcases"
            :left-section="icon(PhArrowLeft)"
            :class="$style.backItem"
          >
            {{ t('app.backToDocs') }}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  </Group>
</template>

<style module>
.header {
  max-width: var(--qrm-content-width);
  margin-inline: auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--mantine-spacing-sm);
  min-width: 0;
  flex: 1;
}

.brandText {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 0;
}

.backItem :global(svg) {
  @mixin rtl {
    transform: scaleX(-1);
  }
}
</style>
