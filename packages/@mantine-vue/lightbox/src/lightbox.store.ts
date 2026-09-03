import { shallowReactive } from 'vue'
import type { LightboxSlideData } from './types'

export interface LightboxState {
  opened: boolean
  slides: LightboxSlideData[]
  currentIndex: number
  loop: boolean
}

export interface LightboxStore {
  state: LightboxState
  getState: () => LightboxState
  setState: (state: LightboxState) => void
}

const clampIndex = (index: number, count: number) =>
  Math.max(0, Math.min(Number.isFinite(index) ? Math.round(index) : 0, Math.max(0, count - 1)))

export const createLightboxStore = (): LightboxStore => {
  const state = shallowReactive<LightboxState>({
    opened: false,
    slides: [],
    currentIndex: 0,
    loop: false,
  })
  return {
    state,
    getState: () => state,
    setState: (next) => Object.assign(state, next),
  }
}

export const useLightboxStore = (store: LightboxStore) => store.state

export function updateLightboxStateAction(
  update: (state: LightboxState) => Partial<LightboxState>,
  store: LightboxStore,
) {
  const state = store.getState()
  store.setState({ ...state, ...update(state) })
}

export const openLightboxAction = (
  payload: { slides: LightboxSlideData[]; startIndex?: number },
  store: LightboxStore,
) =>
  updateLightboxStateAction(
    () => ({
      opened: true,
      slides: payload.slides,
      currentIndex: clampIndex(payload.startIndex ?? 0, payload.slides.length),
    }),
    store,
  )
export const closeLightboxAction = (store: LightboxStore) =>
  updateLightboxStateAction(() => ({ opened: false }), store)
export const nextLightboxAction = (store: LightboxStore) => {
  updateLightboxStateAction((state) => {
    const next = state.currentIndex + 1
    return {
      currentIndex:
        next < state.slides.length
          ? next
          : state.loop && state.slides.length
            ? 0
            : state.currentIndex,
    }
  }, store)
}
export const prevLightboxAction = (store: LightboxStore) => {
  updateLightboxStateAction((state) => {
    const prev = state.currentIndex - 1
    return {
      currentIndex:
        prev >= 0 ? prev : state.loop && state.slides.length ? state.slides.length - 1 : 0,
    }
  }, store)
}
export const setLightboxIndexAction = (index: number, store: LightboxStore) => {
  updateLightboxStateAction(
    (state) => ({ currentIndex: clampIndex(index, state.slides.length) }),
    store,
  )
}

export const lightboxActions = {
  open: openLightboxAction,
  close: closeLightboxAction,
  next: nextLightboxAction,
  prev: prevLightboxAction,
  setIndex: setLightboxIndexAction,
  updateState: updateLightboxStateAction,
}

export function createLightbox() {
  const store = createLightboxStore()
  return [
    store,
    {
      open: (payload: { slides: LightboxSlideData[]; startIndex?: number }) =>
        openLightboxAction(payload, store),
      close: () => closeLightboxAction(store),
      next: () => nextLightboxAction(store),
      prev: () => prevLightboxAction(store),
      setIndex: (index: number) => setLightboxIndexAction(index, store),
    },
  ] as const
}

export const [lightboxStore, lightbox] = createLightbox()
