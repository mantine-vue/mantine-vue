import { describe, expect, it } from 'vitest'
import {
  closeLightboxAction,
  createLightbox,
  createLightboxStore,
  lightboxActions,
  nextLightboxAction,
  openLightboxAction,
  prevLightboxAction,
  setLightboxIndexAction,
} from '../lightbox.store'

const slides = [{ src: 'one.jpg' }, { src: 'two.jpg' }, { src: 'three.jpg' }]

describe('@mantine-vue/lightbox store', () => {
  it('opens, closes and clamps indexes', () => {
    const store = createLightboxStore()
    openLightboxAction({ slides, startIndex: 10 }, store)
    expect(store.getState()).toMatchObject({ opened: true, currentIndex: 2, slides })

    setLightboxIndexAction(-10, store)
    expect(store.getState().currentIndex).toBe(0)
    closeLightboxAction(store)
    expect(store.getState().opened).toBe(false)
  })

  it('navigates with and without looping', () => {
    const store = createLightboxStore()
    openLightboxAction({ slides, startIndex: 2 }, store)
    nextLightboxAction(store)
    expect(store.getState().currentIndex).toBe(2)

    lightboxActions.updateState(() => ({ loop: true }), store)
    nextLightboxAction(store)
    expect(store.getState().currentIndex).toBe(0)
    prevLightboxAction(store)
    expect(store.getState().currentIndex).toBe(2)
  })

  it('creates isolated bound stores and actions', () => {
    const [store, actions] = createLightbox()
    actions.open({ slides, startIndex: 1 })
    actions.next()
    expect(store.getState().currentIndex).toBe(2)
    actions.close()
    expect(store.getState().opened).toBe(false)
  })
})
