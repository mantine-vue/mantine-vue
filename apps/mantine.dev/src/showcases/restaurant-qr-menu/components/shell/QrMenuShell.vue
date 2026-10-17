<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, reactive, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { AppShell } from '@mantine-vue/core'
import { useDocumentTitle } from '@mantine-vue/hooks'
import { useQrMenu } from '../../app/use-qr-menu'
import type { OrderMode } from '../../domain/types'
import CartDrawer from '../cart/CartDrawer.vue'
import ProductSheet from '../product/ProductSheet.vue'
import AppHeader from './AppHeader.vue'
import ConnectionStatus from './ConnectionStatus.vue'

// Secondary overlays are split into their own chunks and only loaded when opened.
const RestaurantInfoDrawer = defineAsyncComponent(() => import('../info/RestaurantInfoDrawer.vue'))
const ShowcaseSettingsDrawer = defineAsyncComponent(
  () => import('../settings/ShowcaseSettingsDrawer.vue'),
)
const FavoritesDrawer = defineAsyncComponent(() => import('../favorites/FavoritesDrawer.vue'))
const OrdersDrawer = defineAsyncComponent(() => import('../order/OrdersDrawer.vue'))
const ServiceRequestModal = defineAsyncComponent(() => import('../info/ServiceRequestModal.vue'))

const ctx = useQrMenu()
const { t, data, overlays, preferences } = ctx
const route = useRoute()
const router = useRouter()

/** Lazy overlays mount the first time they open and then stay mounted for smooth transitions. */
const mounted = reactive({
  info: false,
  settings: false,
  favorites: false,
  orders: false,
  service: false,
})
watch(
  () => ({ ...overlays }),
  (state) => {
    for (const key of Object.keys(mounted) as (keyof typeof mounted)[]) {
      mounted[key] ||= state[key]
    }
  },
)

/* Simulated QR scan: `?r=<restaurant>&table=<id>&mode=<mode>` starts a session. */
const applyQrParams = () => {
  const { r, table, mode, ...rest } = route.query
  if (!r && !table && !mode) {
    return
  }
  if (typeof r === 'string' && r !== preferences.state.restaurantId) {
    preferences.setRestaurant(r)
  }
  const restaurantId = typeof r === 'string' ? r : preferences.state.restaurantId
  if (typeof table === 'string') {
    ctx.customer.setTable(restaurantId, table)
    ctx.customer.setMode(restaurantId, 'dine-in')
  }
  if (typeof mode === 'string' && ['dine-in', 'takeaway', 'delivery'].includes(mode)) {
    ctx.customer.setMode(restaurantId, mode as OrderMode)
  }
  router.replace({ query: rest })
}

watch(() => route.query, applyQrParams, { immediate: true })

watch(
  ctx.restaurantId,
  (restaurantId, previous) => {
    data.load(restaurantId)
    if (previous && previous !== restaurantId) {
      ctx.menuFilters.reset()
      ctx.removePromoCode()
      window.scrollTo({ top: 0 })
    }
  },
  { immediate: true },
)

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  if (preferences.state.locale !== ctx.i18n.locale.value) {
    void ctx.setLocale(preferences.state.locale)
  }
  timer = setInterval(ctx.tick, 30_000)
})
onBeforeUnmount(() => clearInterval(timer))

const title = computed(() => {
  const name = ctx.localize(data.restaurant.value?.name)
  return name ? `${name} · ${t('app.title')}` : t('app.title')
})
useDocumentTitle(title)
</script>

<template>
  <div class="qrm-root">
    <a class="qrm-skip-link" href="#qrm-main">{{ t('app.skipToMenu') }}</a>
    <AppShell :header="{ height: 60 }" padding="0">
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>
      <AppShell.Main>
        <ConnectionStatus />
        <main id="qrm-main" tabindex="-1">
          <RouterView />
        </main>
      </AppShell.Main>
    </AppShell>

    <ProductSheet />
    <CartDrawer />
    <RestaurantInfoDrawer v-if="mounted.info" />
    <ShowcaseSettingsDrawer v-if="mounted.settings" />
    <FavoritesDrawer v-if="mounted.favorites" />
    <OrdersDrawer v-if="mounted.orders" />
    <ServiceRequestModal v-if="mounted.service" />
  </div>
</template>
