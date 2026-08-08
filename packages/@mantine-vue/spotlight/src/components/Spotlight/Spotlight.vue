<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { getDefaultZIndex, useProps } from '@mantine-vue/core'
import SpotlightAction from '../SpotlightAction/SpotlightAction.vue'
import SpotlightActionsGroup from '../SpotlightActionsGroup/SpotlightActionsGroup.vue'
import SpotlightActionsList from '../SpotlightActionsList/SpotlightActionsList.vue'
import SpotlightEmpty from '../SpotlightEmpty/SpotlightEmpty.vue'
import SpotlightRoot from '../SpotlightRoot/SpotlightRoot.vue'
import SpotlightSearch from '../SpotlightSearch/SpotlightSearch.vue'
import { defaultSpotlightFilter } from '../../default-spotlight-filter'
import { isActionsGroup } from '../../is-actions-group'
import { limitActions } from '../../limit-actions'
import { spotlightStore } from '../../spotlight.store'
import type { SpotlightActionData, SpotlightEmits, SpotlightProps } from './Spotlight.types'

defineOptions({ name: 'Spotlight', inheritAttrs: false })
const rawProps = withDefaults(defineProps<SpotlightProps>(), {
  limit: Infinity,
  store: () => spotlightStore,
  filter: defaultSpotlightFilter,
  clearQueryOnClose: true,
  closeOnActionTrigger: true,
  shortcut: 'mod + K',
  highlightQuery: false,
})
const emit = defineEmits<SpotlightEmits>()
const attrs = useAttrs()
const props = useProps(
  'Spotlight',
  {
    size: 600,
    yOffset: 80,
    zIndex: getDefaultZIndex('max'),
    overlayProps: { backgroundOpacity: 0.35, blur: 7 },
    transitionProps: { duration: 200, transition: 'pop' },
  },
  rawProps,
)
const uncontrolledQuery = ref('')
const currentQuery = computed(() =>
  typeof props.query === 'string' ? props.query : uncontrolledQuery.value,
)
const filteredActions = computed(() =>
  limitActions(props.filter(currentQuery.value, props.actions), props.limit),
)
const rootProps = computed(() => {
  const value = { ...attrs, ...props }
  for (const key of [
    'searchProps',
    'actions',
    'filter',
    'nothingFound',
    'highlightQuery',
    'limit',
    'scrollAreaProps',
    'query',
  ])
    delete value[key]
  return value
})

function setQuery(query: string) {
  if (typeof props.query !== 'string') uncontrolledQuery.value = query
  emit('update:query', query)
  emit('query-change', query)
}

function actionProps(action: SpotlightActionData) {
  const value = { ...action }
  delete (value as Partial<SpotlightActionData>).id
  delete (value as Partial<SpotlightActionData>).group
  return value
}

const renderNothingFound = () =>
  typeof props.nothingFound === 'function' ? props.nothingFound() : props.nothingFound
</script>

<template>
  <SpotlightRoot v-bind="rootProps" :query="currentQuery" @query-change="setQuery">
    <SpotlightSearch v-bind="props.searchProps" />
    <SpotlightActionsList v-if="filteredActions.length" v-bind="props.scrollAreaProps">
      <template v-for="item in filteredActions" :key="isActionsGroup(item) ? item.group : item.id">
        <SpotlightActionsGroup v-if="isActionsGroup(item)" :label="item.group">
          <SpotlightAction
            v-for="action in item.actions"
            :key="action.id"
            v-bind="actionProps(action)"
            :highlight-query="props.highlightQuery"
          />
        </SpotlightActionsGroup>
        <SpotlightAction
          v-else
          v-bind="actionProps(item)"
          :highlight-query="props.highlightQuery"
        />
      </template>
    </SpotlightActionsList>
    <SpotlightEmpty v-else-if="props.nothingFound">
      <component :is="renderNothingFound" />
    </SpotlightEmpty>
  </SpotlightRoot>
</template>
