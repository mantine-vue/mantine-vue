import { defineComponent, h } from 'vue'
import { Table, Text } from '@mantine-vue/core'
import { useNetwork } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text, Table } from '@mantine-vue/core'
import { useNetwork } from '@mantine-vue/hooks'

const networkStatus = useNetwork()
</script>

<template>
  <Table :maw="300" layout="fixed" mx="auto">
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Property</Table.Th>
        <Table.Th>Value</Table.Th>
      </Table.Tr>
    </Table.Thead>

    <Table.Tbody>
      <Table.Tr>
        <Table.Td>Online</Table.Td>
        <Table.Td>
          <Text size="sm" :c="networkStatus.online ? 'teal.6' : 'red.6'">
            {{ networkStatus.online ? 'Online' : 'Offline' }}
          </Text>
        </Table.Td>
      </Table.Tr>

      <Table.Tr>
        <Table.Td>rtt</Table.Td>
        <Table.Td>{{ networkStatus.rtt }}</Table.Td>
      </Table.Tr>

      <Table.Tr>
        <Table.Td>downlink</Table.Td>
        <Table.Td>{{ networkStatus.downlink }}</Table.Td>
      </Table.Tr>

      <Table.Tr>
        <Table.Td>effectiveType</Table.Td>
        <Table.Td>{{ networkStatus.effectiveType }}</Table.Td>
      </Table.Tr>

      <Table.Tr>
        <Table.Td>saveData</Table.Td>
        <Table.Td>
          <Text size="sm" :c="networkStatus.saveData ? 'teal.6' : 'red.6'">
            {{ networkStatus.saveData ? 'true' : 'false' }}
          </Text>
        </Table.Td>
      </Table.Tr>
    </Table.Tbody>
  </Table>
</template>
`

const Demo = defineComponent({
  name: 'UseNetworkUsageDemo',
  setup() {
    const networkStatus = useNetwork()

    return () =>
      h(Table, { maw: 300, layout: 'fixed', mx: 'auto' }, () => [
        h(Table.Thead, null, () =>
          h(Table.Tr, null, () => [
            h(Table.Th, null, () => 'Property'),
            h(Table.Th, null, () => 'Value'),
          ]),
        ),
        h(Table.Tbody, null, () => [
          h(Table.Tr, null, () => [
            h(Table.Td, null, () => 'Online'),
            h(Table.Td, null, () =>
              h(
                Text,
                { size: 'sm', c: networkStatus.value.online ? 'teal.6' : 'red.6' },
                { default: () => (networkStatus.value.online ? 'Online' : 'Offline') },
              ),
            ),
          ]),
          h(Table.Tr, null, () => [
            h(Table.Td, null, () => 'rtt'),
            h(Table.Td, null, () => String(networkStatus.value.rtt ?? '')),
          ]),
          h(Table.Tr, null, () => [
            h(Table.Td, null, () => 'downlink'),
            h(Table.Td, null, () => String(networkStatus.value.downlink ?? '')),
          ]),
          h(Table.Tr, null, () => [
            h(Table.Td, null, () => 'effectiveType'),
            h(Table.Td, null, () => String(networkStatus.value.effectiveType ?? '')),
          ]),
          h(Table.Tr, null, () => [
            h(Table.Td, null, () => 'saveData'),
            h(Table.Td, null, () =>
              h(
                Text,
                { size: 'sm', c: networkStatus.value.saveData ? 'teal.6' : 'red.6' },
                { default: () => (networkStatus.value.saveData ? 'true' : 'false') },
              ),
            ),
          ]),
        ]),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
