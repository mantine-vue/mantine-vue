<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { Button, EmptyState, Stack } from '@mantine-vue/core'
import { createSpotlight } from '@mantine-vue/spotlight'
import { PhArrowClockwise, PhForkKnife, PhMagnifyingGlass } from '@phosphor-icons/vue'
import { useQrMenu } from '../app/use-qr-menu'
import { useSectionSpy } from '../composables/use-section-spy'
import CartBar from '../components/cart/CartBar.vue'
import MenuSkeleton from '../components/common/MenuSkeleton.vue'
import ActiveFilters from '../components/menu/ActiveFilters.vue'
import AnnouncementsList from '../components/menu/AnnouncementsList.vue'
import CategoryNav from '../components/menu/CategoryNav.vue'
import FiltersDrawer from '../components/menu/FiltersDrawer.vue'
import MenuFooter from '../components/menu/MenuFooter.vue'
import MenuSearch from '../components/menu/MenuSearch.vue'
import MenuSectionBlock from '../components/menu/MenuSectionBlock.vue'
import OrderContextBar from '../components/menu/OrderContextBar.vue'
import ProductRail from '../components/menu/ProductRail.vue'
import PromotionsCarousel from '../components/menu/PromotionsCarousel.vue'
import RestaurantHero from '../components/menu/RestaurantHero.vue'

const ctx = useQrMenu()
const { t, data, layout, menuFilters, customer, overlays } = ctx

const [spotlightStore, spotlight] = createSpotlight()

const sectionId = (categoryId: string) => `qrm-cat-${categoryId}`
const sections = computed(() => menuFilters.sections.value)
const sectionIds = computed(() => sections.value.map((section) => sectionId(section.category.id)))

const spy = useSectionSpy({
  ids: sectionIds,
  offset: () => 60 + 56 + 24,
})
const activeCategory = computed(() => spy.active.value?.replace('qrm-cat-', '') ?? null)

watch(sectionIds, () => nextTick(spy.refresh))

const featured = computed(() =>
  data.products.value.filter((product) => product.featured && product.available),
)
const recentlyViewed = computed(() =>
  customer
    .recentlyViewed(ctx.restaurantId.value)
    .map((id) => data.productsById.value.get(id))
    .filter((product) => product !== undefined),
)

const scrollToCategory = (categoryId: string) => spy.scrollTo(sectionId(categoryId))

const showAllResults = (query: string) => {
  menuFilters.setQuery(query)
  spotlight.close()
  nextTick(() => document.getElementById('qrm-menu-sections')?.scrollIntoView({ block: 'start' }))
}

const showInitialLoading = computed(() => data.status.value === 'loading' && !data.restaurant.value)
const showError = computed(() => data.status.value === 'error' && !data.restaurant.value)
</script>

<template>
  <MenuSkeleton v-if="showInitialLoading" />

  <div v-else-if="showError" class="qrm-container" :class="$style.error">
    <EmptyState size="lg" variant="light" color="red" :title="t('app.errorTitle')">
      <template #icon><PhForkKnife :size="32" /></template>
      <template #description>
        {{
          ctx.data.error.value?.code === 'not-found' ? t('errors.notFound') : t('app.errorMessage')
        }}
      </template>
      <Stack gap="xs" align="center" mt="md">
        <Button radius="xl" @click="data.load(ctx.restaurantId.value)">
          <template #leftSection><PhArrowClockwise :size="16" /></template>
          {{ t('app.retry') }}
        </Button>
        <Button variant="subtle" radius="xl" @click="overlays.settings = true">
          {{ t('header.settings') }}
        </Button>
      </Stack>
    </EmptyState>
  </div>

  <template v-else-if="data.restaurant.value">
    <RestaurantHero :restaurant="data.restaurant.value" />

    <div class="qrm-container" :class="$style.top">
      <Stack gap="lg">
        <OrderContextBar />
        <AnnouncementsList />
        <PromotionsCarousel />
        <ProductRail
          v-if="layout.showFeatured && !menuFilters.isFiltering.value"
          :title="t('menu.featured')"
          :products="featured"
          :item-width="layout.card === 'feature' ? 220 : 156"
        />
        <ProductRail
          v-if="!menuFilters.isFiltering.value"
          :title="t('menu.recentlyViewed')"
          :products="recentlyViewed"
          :item-width="128"
        />
      </Stack>
    </div>

    <CategoryNav
      :sections="sections"
      :active="activeCategory"
      :section-id="sectionId"
      @select="scrollToCategory"
      @search="spotlight.open()"
      @filters="overlays.filters = true"
    />

    <div id="qrm-menu-sections" class="qrm-container" :class="$style.sections">
      <ActiveFilters />

      <EmptyState
        v-if="sections.length === 0"
        size="md"
        variant="light"
        :title="t('menu.noResults')"
        :description="t('menu.noResultsHint')"
        :class="$style.empty"
      >
        <template #icon><PhMagnifyingGlass :size="28" /></template>
        <Button mt="md" radius="xl" variant="light" @click="menuFilters.reset()">
          {{ t('menu.resetFilters') }}
        </Button>
      </EmptyState>

      <MenuSectionBlock
        v-for="section in sections"
        :key="section.category.id"
        :section="section"
        :anchor-id="sectionId(section.category.id)"
      />

      <MenuFooter :restaurant="data.restaurant.value" />
    </div>

    <MenuSearch :store="spotlightStore" @category="scrollToCategory" @show-all="showAllResults" />
    <FiltersDrawer />
    <CartBar />
  </template>
</template>

<style module>
.top {
  padding-block: var(--mantine-spacing-md);
}

.sections {
  padding-bottom: var(--qrm-bottom-bar-space);
}

.error {
  padding-block: 64px;
}

.empty {
  padding-block: 48px;
}
</style>
