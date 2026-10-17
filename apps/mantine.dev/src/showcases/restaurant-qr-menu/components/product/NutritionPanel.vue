<script setup lang="ts">
import { Accordion, Badge, Group, Table, Text } from '@mantine-vue/core'
import { PhInfo } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import type { Product } from '../../domain/types'

/** Allergens, dietary information and nutrition facts in an accordion. */
defineProps<{ product: Product }>()
const { t, localize } = useQrMenu()
</script>

<template>
  <Accordion variant="contained" radius="md">
    <Accordion.Item value="nutrition">
      <Accordion.Control>
        <template #icon><PhInfo :size="18" /></template>
        {{ t('details.nutrition') }}
      </Accordion.Control>
      <Accordion.Panel>
        <Text size="sm" fw="600" :mb="6">{{ t('details.contains') }}</Text>
        <Group v-if="product.allergens.length" :gap="6" mb="md">
          <Badge
            v-for="allergen in product.allergens"
            :key="allergen"
            color="red"
            variant="outline"
            tt="none"
          >
            {{ t(`allergens.${allergen}`) }}
          </Badge>
        </Group>
        <Text v-else size="sm" c="dimmed" mb="md">{{ t('details.noAllergens') }}</Text>

        <Table variant="vertical" withTableBorder layout="fixed" fz="sm">
          <Table.Tbody>
            <Table.Tr v-if="product.dietary.length">
              <Table.Th w="40%">{{ t('details.dietary') }}</Table.Th>
              <Table.Td>{{
                product.dietary.map((tag) => t(`dietary.${tag}`)).join(' · ')
              }}</Table.Td>
            </Table.Tr>
            <Table.Tr v-if="product.calories">
              <Table.Th>{{ t('details.energy') }}</Table.Th>
              <Table.Td>{{ t('product.calories', { count: product.calories }) }}</Table.Td>
            </Table.Tr>
            <Table.Tr v-if="product.portion">
              <Table.Th>{{ t('details.portion') }}</Table.Th>
              <Table.Td>{{ localize(product.portion) }}</Table.Td>
            </Table.Tr>
            <Table.Tr v-if="product.preparationMinutes">
              <Table.Th>{{ t('details.preparation') }}</Table.Th>
              <Table.Td>{{ t('product.minutes', { count: product.preparationMinutes }) }}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>{{ t('details.spice') }}</Table.Th>
              <Table.Td>{{ t(`spice.${product.spiceLevel ?? 0}`) }}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        <Text size="xs" c="dimmed" mt="sm">{{ t('menu.allergenNotice') }}</Text>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>
</template>
