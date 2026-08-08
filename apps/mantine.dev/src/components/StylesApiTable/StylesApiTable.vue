<script setup lang="ts">
import { computed, ref } from 'vue'
import { Tabs, Title } from '@mantine-vue/core'
import { getComponentName } from '../PropsTable/get-component-name'
import TableError from '../TableError/TableError.vue'
import ModifiersTable from './ModifiersTable.vue'
import SelectorsTable from './SelectorsTable.vue'
import VariablesTable from './VariablesTable.vue'
import { getStylesApiData } from './styles-api-data'

const props = defineProps<{ component: string; componentPrefix?: string }>()

const value = ref<string | null>('selectors')

const data = computed(() => getStylesApiData(props.component))
const componentName = computed(() =>
  getComponentName({ component: props.component, componentPrefix: props.componentPrefix }),
)
const hasVariables = computed(() => Object.keys(data.value?.vars ?? {}).length > 0)
const hasModifiers = computed(() => (data.value?.modifiers ?? []).length > 0)
</script>

<template>
  <TableError v-if="!data" error-of="Styles API" />

  <template v-else>
    <Title :order="3" class="title">{{ componentName }} Styles API</Title>

    <Tabs
      v-model="value"
      :class-names="{ panel: 'stylesApiPanel', tab: 'stylesApiTab' }"
      radius="md"
      variant="pills"
    >
      <Tabs.List data-with-radius>
        <Tabs.Tab value="selectors">Selectors</Tabs.Tab>
        <Tabs.Tab v-if="hasVariables" value="variables">CSS variables</Tabs.Tab>
        <Tabs.Tab v-if="hasModifiers" value="modifiers">Data attributes</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="selectors">
        <SelectorsTable :data="data" :component="component" />
      </Tabs.Panel>

      <Tabs.Panel v-if="hasVariables" value="variables">
        <VariablesTable :data="data" />
      </Tabs.Panel>

      <Tabs.Panel v-if="hasModifiers" value="modifiers">
        <ModifiersTable :data="data" />
      </Tabs.Panel>
    </Tabs>
  </template>
</template>

<style scoped>
.title {
  font-family: var(--docs-font-primary);
  font-weight: 600;
  margin-bottom: var(--mantine-spacing-sm);
  margin-top: var(--mantine-spacing-md);
  color: var(--mantine-color-bright);
}
</style>

<style>
.stylesApiPanel {
  padding-top: var(--mantine-spacing-md);
}

.stylesApiTab {
  font-weight: 600;
}

.stylesApiTab[data-active] {
  background-color: light-dark(var(--mantine-color-black), var(--mantine-color-gray-1));
  color: light-dark(var(--mantine-color-white), var(--mantine-color-gray-9));
}
</style>
