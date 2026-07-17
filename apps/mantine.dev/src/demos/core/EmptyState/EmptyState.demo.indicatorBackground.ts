import { defineComponent, h } from 'vue'
import { Button, EmptyState } from '@mantine-vue/core'
import { PhShoppingCartSimple } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, EmptyState } from '@mantine-vue/core'
import { PhShoppingCartSimple } from '@phosphor-icons/vue'
</script>

<template>
  <EmptyState withIndicatorBackground title="Your cart is empty">
    <template #icon>
      <PhShoppingCartSimple />
    </template>

    <EmptyState.Description>
      Your shopping cart is empty right now. Browse our catalog and add the items you like to get
      started with your first order.
    </EmptyState.Description>
    <EmptyState.Actions>
      <Button variant="default">Browse products</Button>
    </EmptyState.Actions>
  </EmptyState>
</template>
`

const Demo = defineComponent({
  name: 'EmptyStateIndicatorBackgroundDemo',
  setup() {
    return () =>
      h(
        EmptyState,
        { withIndicatorBackground: true, title: 'Your cart is empty' },
        {
          icon: () => h(PhShoppingCartSimple),
          default: () => [
            h(
              EmptyState.Description,
              null,
              () =>
                'Your shopping cart is empty right now. Browse our catalog and add the items you like to get started with your first order.',
            ),
            h(EmptyState.Actions, null, () =>
              h(Button, { variant: 'default' }, () => 'Browse products'),
            ),
          ],
        },
      )
  },
})

export const indicatorBackground: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 440,
}
