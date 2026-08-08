<script setup lang="ts">
import { computed, ref } from 'vue'
import { Text, TextInput, Title } from '@mantine-vue/core'
import { useMediaQuery } from '@mantine-vue/hooks'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import { filterProps, getComponentProps, getComponentSlots } from './filter-props'
import { getComponentName } from './get-component-name'
import PropsTable from './PropsTable.vue'
import SlotsTable from './SlotsTable.vue'

const props = defineProps<{ components: string[]; componentPrefix?: string }>()

const query = ref('')

// Autofocus the search field on devices with a real pointer only
// on touch devices it would pop the keyboard open as soon as the tab is opened.
const isNonTouchDevice = useMediaQuery('(hover: hover) and (pointer: fine)', false)

const sections = computed(() =>
  props.components.map((component) => {
    const componentProps = getComponentProps(component)
    const componentSlots = getComponentSlots(component)

    // A component whose only props are inherited ones, and that declares no
    // `*Slots` interface at all – the "does not have any props" fallback
    // should only show up in that case, not just because a search matched
    // nothing in props but something in slots (or vice versa).
    const emptyProps = componentProps !== null && componentProps.length === 0
    const emptySlots = componentSlots === null || componentSlots.length === 0

    return {
      component,
      // `null` means the component is missing from docgen.json PropsTable
      // renders an error for it, so the section must stay visible.
      missing: componentProps === null,
      empty: emptyProps && emptySlots,
      props: componentProps ? filterProps(componentProps, query.value) : [],
      slots: componentSlots ? filterProps(componentSlots, query.value) : [],
    }
  }),
)

const visibleSections = computed(() =>
  sections.value.filter(
    (section) =>
      section.missing ||
      section.props.length > 0 ||
      section.slots.length > 0 ||
      (section.empty && !query.value.trim()),
  ),
)

const nothingFound = computed(() => visibleSections.value.length === 0)
</script>

<template>
  <div class="root">
    <TextInput
      v-model="query"
      class="search"
      placeholder="Search props and slots"
      radius="md"
      size="lg"
      :pt="7"
      :autofocus="isNonTouchDevice"
    >
      <template #leftSection>
        <PhMagnifyingGlass class="searchIcon" />
      </template>
    </TextInput>

    <div
      v-for="section in visibleSections"
      :key="section.component"
      class="section"
      data-props-table-section
    >
      <Title :order="2" class="title">
        {{ getComponentName({ component: section.component, componentPrefix }) }} props
      </Title>

      <PropsTable
        v-if="section.missing || section.props.length > 0 || section.empty"
        :component="section.component"
        :props-list="section.props"
        :query="query"
      />

      <template v-if="section.slots.length > 0">
        <Title :order="3" class="subtitle">Slots</Title>
        <SlotsTable :slots-list="section.slots" :query="query" />
      </template>
    </div>

    <Text v-if="nothingFound" class="nothingFound">Nothing found...</Text>
  </div>
</template>

<style scoped>
.searchIcon {
  width: 22px;
  height: 22px;
  color: light-dark(var(--mantine-color-gray-6), var(--mantine-color-dark-3));
}

.title {
  font-family: var(--docs-font-primary);
  font-weight: 600;
  margin-bottom: var(--mantine-spacing-sm);
  color: var(--mantine-color-bright);
  padding-inline-start: var(--mantine-spacing-xs);

  @mixin smaller-than $docsMdxBreakpoint {
    font-size: var(--mantine-font-size-xl);
  }
}

.subtitle {
  font-family: var(--docs-font-primary);
  font-weight: 600;
  font-size: var(--mantine-font-size-lg);
  margin-top: var(--mantine-spacing-xl);
  margin-bottom: var(--mantine-spacing-sm);
  color: var(--mantine-color-bright);
  padding-inline-start: var(--mantine-spacing-xs);
}

.section {
  border: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4));
  border-radius: var(--mantine-radius-md);
  padding: var(--mantine-spacing-sm);
  padding-bottom: 0;
  padding-top: var(--mantine-spacing-md);
}

.section + .section {
  margin-top: var(--mantine-spacing-xl);
}

.search {
  margin-bottom: var(--mantine-spacing-xl);
}

.nothingFound {
  font-size: var(--mantine-font-size-lg);
  color: var(--mantine-color-dimmed);
}
</style>
