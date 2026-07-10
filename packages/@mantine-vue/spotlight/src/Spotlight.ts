import { computed, defineComponent, h, ref, type PropType } from 'vue'
import { getDefaultZIndex, useProps } from '@mantine-vue/core'
import { defaultSpotlightFilter } from './default-spotlight-filter'
import { isActionsGroup } from './is-actions-group'
import { limitActions } from './limit-actions'
import { spotlight, spotlightStore } from './spotlight.store'
import {
  SpotlightAction,
  type SpotlightActionProps,
  type SpotlightActionStylesNames,
} from './SpotlightAction'
import {
  SpotlightActionsGroup,
  type SpotlightActionsGroupProps,
  type SpotlightActionsGroupStylesNames,
} from './SpotlightActionsGroup'
import {
  SpotlightActionsList,
  type SpotlightActionsListProps,
  type SpotlightActionsListStylesNames,
} from './SpotlightActionsList'
import {
  SpotlightEmpty,
  type SpotlightEmptyProps,
  type SpotlightEmptyStylesNames,
} from './SpotlightEmpty'
import {
  SpotlightFooter,
  type SpotlightFooterProps,
  type SpotlightFooterStylesNames,
} from './SpotlightFooter'
import {
  SpotlightRoot,
  type SpotlightRootProps,
  type SpotlightRootStylesNames,
} from './SpotlightRoot'
import {
  SpotlightSearch,
  type SpotlightSearchProps,
  type SpotlightSearchStylesNames,
} from './SpotlightSearch'
import classes from './Spotlight.module.css'

export type SpotlightFilterFunction = (
  query: string,
  actions: SpotlightActions[],
) => SpotlightActions[]

export interface SpotlightActionData extends SpotlightActionProps {
  id: string
  group?: string
}

export interface SpotlightActionGroupData {
  group: string
  actions: SpotlightActionData[]
}

export type SpotlightActions = SpotlightActionData | SpotlightActionGroupData
export type SpotlightStylesNames = SpotlightRootStylesNames

export interface SpotlightProps extends SpotlightRootProps {
  searchProps?: SpotlightSearchProps
  actions: SpotlightActions[]
  filter?: SpotlightFilterFunction
  nothingFound?: any
  highlightQuery?: boolean
  limit?: number
  scrollAreaProps?: Partial<SpotlightActionsListProps>
}

const defaultProps = {
  size: 600,
  yOffset: 80,
  limit: Infinity,
  zIndex: getDefaultZIndex('max'),
  overlayProps: { backgroundOpacity: 0.35, blur: 7 },
  transitionProps: { duration: 200, transition: 'pop' },
  store: spotlightStore,
  filter: defaultSpotlightFilter,
  clearQueryOnClose: true,
  closeOnActionTrigger: true,
  shortcut: 'mod + K',
} satisfies Partial<SpotlightProps>

function renderContent(value: any) {
  return typeof value === 'function' ? value() : value
}

const SpotlightBase = defineComponent({
  name: 'Spotlight',
  inheritAttrs: false,
  props: {
    searchProps: { type: Object as PropType<SpotlightSearchProps>, default: undefined },
    actions: { type: Array as PropType<SpotlightActions[]>, required: true },
    filter: { type: Function as PropType<SpotlightFilterFunction>, default: undefined },
    nothingFound: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
    highlightQuery: { type: Boolean, default: false },
    limit: { type: Number, default: undefined },
    scrollAreaProps: {
      type: Object as PropType<Partial<SpotlightActionsListProps>>,
      default: undefined,
    },
    query: { type: String, default: undefined },
    onQueryChange: { type: Function as PropType<(query: string) => void>, default: undefined },
    store: { type: Object as PropType<SpotlightRootProps['store']>, default: undefined },
    clearQueryOnClose: { type: Boolean, default: undefined },
    shortcut: { type: [String, Array] as PropType<string | string[] | null>, default: undefined },
    tagsToIgnore: { type: Array as PropType<string[]>, default: undefined },
    triggerOnContentEditable: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: false },
    onSpotlightOpen: { type: Function as PropType<() => void>, default: undefined },
    onSpotlightClose: { type: Function as PropType<() => void>, default: undefined },
    forceOpened: { type: Boolean, default: false },
    closeOnActionTrigger: { type: Boolean, default: undefined },
    maxHeight: { type: [String, Number] as PropType<string | number>, default: undefined },
    scrollable: { type: Boolean, default: false },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs }) {
    const props = useProps<SpotlightProps>('Spotlight', defaultProps, rawProps as any)
    const uncontrolledQuery = ref('')
    const currentQuery = computed(() =>
      typeof props.query === 'string' ? props.query : uncontrolledQuery.value,
    )

    const setQuery = (query: string) => {
      if (typeof props.query !== 'string') {
        uncontrolledQuery.value = query
      }

      props.onQueryChange?.(query)
    }

    return () => {
      const filteredActions = limitActions(
        props.filter!(currentQuery.value, props.actions),
        props.limit!,
      )
      const renderedActions = filteredActions.map((item) => {
        if (isActionsGroup(item)) {
          return h(SpotlightActionsGroup, { key: item.group, label: item.group }, () =>
            item.actions.map(({ id, ...actionData }) =>
              h(SpotlightAction, {
                key: id,
                highlightQuery: props.highlightQuery,
                ...actionData,
              }),
            ),
          )
        }

        const { id, ...actionData } = item
        return h(SpotlightAction, {
          key: id,
          highlightQuery: props.highlightQuery,
          ...actionData,
        })
      })
      const {
        searchProps: _searchProps,
        actions: _actions,
        filter: _filter,
        nothingFound: _nothingFound,
        highlightQuery: _highlightQuery,
        limit: _limit,
        scrollAreaProps: _scrollAreaProps,
        query: _query,
        onQueryChange: _onQueryChange,
        ...rootProps
      } = props

      return h(
        SpotlightRoot,
        {
          ...attrs,
          ...rootProps,
          query: currentQuery.value,
          onQueryChange: setQuery,
        },
        () => [
          h(SpotlightSearch, props.searchProps),
          renderedActions.length > 0
            ? h(SpotlightActionsList, props.scrollAreaProps, () => renderedActions)
            : null,
          renderedActions.length === 0 && props.nothingFound
            ? h(SpotlightEmpty, null, () => renderContent(props.nothingFound))
            : null,
        ],
      )
    }
  },
})

export const Spotlight = Object.assign(SpotlightBase, {
  classes,
  Search: SpotlightSearch,
  ActionsList: SpotlightActionsList,
  Action: SpotlightAction,
  Empty: SpotlightEmpty,
  Footer: SpotlightFooter,
  ActionsGroup: SpotlightActionsGroup,
  Root: SpotlightRoot,
  open: spotlight.open,
  close: spotlight.close,
  toggle: spotlight.toggle,
})

export type {
  SpotlightActionProps,
  SpotlightActionStylesNames,
  SpotlightActionsGroupProps,
  SpotlightActionsGroupStylesNames,
  SpotlightActionsListProps,
  SpotlightActionsListStylesNames,
  SpotlightEmptyProps,
  SpotlightEmptyStylesNames,
  SpotlightFooterProps,
  SpotlightFooterStylesNames,
  SpotlightRootProps,
  SpotlightRootStylesNames,
  SpotlightSearchProps,
  SpotlightSearchStylesNames,
}
