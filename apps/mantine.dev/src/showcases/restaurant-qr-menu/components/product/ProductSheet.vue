<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { Drawer, Modal } from '@mantine-vue/core'
import { useQrMenu } from '../../app/use-qr-menu'
import { useIsMobile } from '../../composables/use-is-mobile'
import { useProductSheet } from '../../composables/use-product-sheet'
import type { CartLine, Product } from '../../domain/types'
import ProductDetails from './ProductDetails.vue'

/** Bottom sheet on phones, centered modal on larger screens. */
const ctx = useQrMenu()
const { data, localize, customer } = ctx
const sheet = useProductSheet()
const isMobile = useIsMobile()

const product = computed(() =>
  sheet.productId.value ? (data.productsById.value.get(sheet.productId.value) ?? null) : null,
)
const editingLine = computed(() =>
  sheet.lineId.value
    ? (ctx.cart.lines.value.find((line) => line.id === sheet.lineId.value) ?? null)
    : null,
)
const opened = computed(() => product.value !== null)
const title = computed(() => (product.value ? localize(product.value.name) : ''))

// Every time the sheet opens the details start fresh (quantity, choices, notes).
const session = ref(0)
watch(opened, (isOpen) => isOpen && session.value++, { immediate: true })

// Keep rendering the last product while the sheet animates out.
const displayed = shallowRef<{ product: Product; line: CartLine | null } | null>(null)

watch(
  [product, editingLine],
  ([next, line]) => {
    if (!next) {
      return
    }
    const current = displayed.value
    const isNewProduct = current?.product.id !== next.id
    // A line disappears right after "Update item" – keep the sheet as it is while it closes.
    const isNewLine = line !== null && line.id !== current?.line?.id
    if (isNewProduct) {
      customer.markViewed(ctx.restaurantId.value, next.id)
    }
    if (isNewProduct || isNewLine || (!line && !sheet.lineId.value)) {
      displayed.value = { product: next, line }
    }
    ctx.overlays.cart = false
  },
  { immediate: true },
)
</script>

<template>
  <Drawer
    v-if="isMobile"
    :opened="opened"
    position="bottom"
    size="94%"
    radius="lg"
    padding="0"
    :withCloseButton="false"
    :aria-label="title"
    @close="sheet.close"
  >
    <ProductDetails
      v-if="displayed"
      :key="`${session}-${displayed.product.id}-${displayed.line?.id ?? 'new'}`"
      :product="displayed.product"
      :editing-line="displayed.line"
      @done="sheet.close"
    />
  </Drawer>
  <Modal
    v-else
    :opened="opened"
    size="lg"
    radius="lg"
    padding="0"
    centered
    :withCloseButton="false"
    :aria-label="title"
    :overlayProps="{ backgroundOpacity: 0.55, blur: 3 }"
    @close="sheet.close"
  >
    <ProductDetails
      v-if="displayed"
      :key="`${session}-${displayed.product.id}-${displayed.line?.id ?? 'new'}`"
      :product="displayed.product"
      :editing-line="displayed.line"
      @done="sheet.close"
    />
  </Modal>
</template>
