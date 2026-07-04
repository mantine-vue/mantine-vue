import { type Ref } from 'vue'
import { createStore, type MantineStore } from '@mantine-vue/store'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export interface SpotlightState {
  opened: boolean
  selected: number
  listId: string
  query: string
  empty: boolean
  registeredActions: Set<string>
}

export type SpotlightStore = MantineStore<SpotlightState>

export const createSpotlightStore = () =>
  createStore<SpotlightState>({
    opened: false,
    empty: false,
    selected: -1,
    listId: '',
    query: '',
    registeredActions: new Set(),
  })

export const useSpotlight = (store: SpotlightStore): Readonly<Ref<SpotlightState>> => store.value

export function updateSpotlightStateAction(
  update: (state: SpotlightState) => Partial<SpotlightState>,
  store: SpotlightStore,
) {
  const state = store.getState()
  store.setState({ ...state, ...update(store.getState()) })
}

export function openSpotlightAction(store: SpotlightStore) {
  updateSpotlightStateAction(() => ({ opened: true, selected: -1 }), store)
}

export function closeSpotlightAction(store: SpotlightStore) {
  updateSpotlightStateAction(() => ({ opened: false }), store)
}

export function toggleSpotlightAction(store: SpotlightStore) {
  updateSpotlightStateAction(
    (state) => ({ opened: !state.opened, selected: state.opened ? state.selected : -1 }),
    store,
  )
}

export function setSelectedAction(index: number, store: SpotlightStore) {
  store.setState((state) => ({ ...state, selected: index }))
}

export function setListId(id: string, store: SpotlightStore) {
  store.setState((state) => ({ ...state, listId: id }))
}

function findElementByQuerySelector<T extends HTMLElement>(
  selector: string,
  root: Document | Element | ShadowRoot = document,
): T | null {
  const element = root.querySelector<T>(selector)

  if (element) {
    return element
  }

  const children = root instanceof ShadowRoot ? root.host.children : root.children

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i]

    if (child.shadowRoot) {
      const shadowElement = findElementByQuerySelector<T>(selector, child.shadowRoot)

      if (shadowElement) {
        return shadowElement
      }
    }

    const nestedElement = findElementByQuerySelector<T>(selector, child)

    if (nestedElement) {
      return nestedElement
    }
  }

  return null
}

export function selectAction(index: number, store: SpotlightStore): number {
  const state = store.getState()
  const actionsList = state.listId ? findElementByQuerySelector(`#${state.listId}`) : null
  const selected = actionsList?.querySelector<HTMLButtonElement>('[data-selected]')
  const actions = actionsList?.querySelectorAll<HTMLButtonElement>('[data-action]') ?? []
  const nextIndex = index === -1 ? actions.length - 1 : index === actions.length ? 0 : index
  const selectedIndex = clamp(nextIndex, 0, actions.length - 1)

  selected?.removeAttribute('data-selected')
  actions[selectedIndex]?.scrollIntoView?.({ block: 'nearest' })
  actions[selectedIndex]?.setAttribute('data-selected', 'true')
  setSelectedAction(selectedIndex, store)

  return selectedIndex
}

export function selectNextAction(store: SpotlightStore) {
  return selectAction(store.getState().selected + 1, store)
}

export function selectPreviousAction(store: SpotlightStore) {
  return selectAction(store.getState().selected - 1, store)
}

export function triggerSelectedAction(store: SpotlightStore) {
  const state = store.getState()
  const selected = state.listId
    ? findElementByQuerySelector<HTMLButtonElement>(`#${state.listId} [data-selected]`)
    : null

  selected?.click()
}

export function registerAction(id: string, store: SpotlightStore) {
  const state = store.getState()
  state.registeredActions.add(id)

  return () => {
    state.registeredActions.delete(id)
  }
}

export function setQuery(query: string, store: SpotlightStore) {
  updateSpotlightStateAction(() => ({ query }), store)
  Promise.resolve().then(() => {
    selectAction(0, store)
    updateSpotlightStateAction(
      (state) => ({
        empty: (state.query.trim().length > 0 && state.registeredActions.size === 0) || false,
      }),
      store,
    )
  })
}

export function clearSpotlightState(
  { clearQuery }: { clearQuery: boolean | undefined },
  store: SpotlightStore,
) {
  store.setState((state) => ({
    ...state,
    selected: -1,
    query: clearQuery ? '' : state.query,
    empty: clearQuery ? false : state.empty,
  }))
}

export const spotlightActions = {
  open: openSpotlightAction,
  close: closeSpotlightAction,
  toggle: toggleSpotlightAction,
  updateState: updateSpotlightStateAction,
  setSelectedAction,
  setListId,
  selectAction,
  selectNextAction,
  selectPreviousAction,
  triggerSelectedAction,
  registerAction,
  setQuery,
  clearSpotlightState,
}

export function createSpotlight() {
  const store = createSpotlightStore()
  const actions = {
    open: () => openSpotlightAction(store),
    close: () => closeSpotlightAction(store),
    toggle: () => toggleSpotlightAction(store),
  }

  return [store, actions] as const
}

export const [spotlightStore, spotlight] = createSpotlight()
export const { open: openSpotlight, close: closeSpotlight, toggle: toggleSpotlight } = spotlight
