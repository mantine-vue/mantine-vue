import { describe, expect, it } from 'vitest'
import {
  clearSpotlightState,
  closeSpotlightAction,
  createSpotlightStore,
  openSpotlightAction,
  setListId,
  setQuery,
  toggleSpotlightAction,
  triggerSelectedAction,
} from '../spotlight.store'

describe('@mantine-vue/spotlight store', () => {
  it('opens, closes and toggles spotlight state', () => {
    const store = createSpotlightStore()

    openSpotlightAction(store)
    expect(store.getState().opened).toBe(true)
    expect(store.getState().selected).toBe(-1)

    toggleSpotlightAction(store)
    expect(store.getState().opened).toBe(false)

    closeSpotlightAction(store)
    expect(store.getState().opened).toBe(false)
  })

  it('sets query and clears state', async () => {
    const store = createSpotlightStore()

    setQuery('test', store)
    expect(store.getState().query).toBe('test')
    await Promise.resolve()

    clearSpotlightState({ clearQuery: true }, store)
    expect(store.getState().query).toBe('')
    expect(store.getState().selected).toBe(-1)
  })

  it('does not throw when triggering selected action without list id', () => {
    const store = createSpotlightStore()
    expect(() => triggerSelectedAction(store)).not.toThrow()
  })

  it('sets list id', () => {
    const store = createSpotlightStore()
    setListId('actions', store)
    expect(store.getState().listId).toBe('actions')
  })
})
