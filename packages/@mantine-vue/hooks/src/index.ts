// This file is a pure re-export barrel. Every hook lives in its own
// `use-x/use-x.ts` file (mirroring the folder layout of the original React
// Mantine `@mantine/hooks` package) — no implementations should live here.
export * from './utils'

export { useDebouncedCallback } from './use-debounced-callback/use-debounced-callback'
export type {
  UseDebouncedCallbackOptions,
  UseDebouncedCallbackReturnValue,
} from './use-debounced-callback/use-debounced-callback'

export { useClickOutside } from './use-click-outside/use-click-outside'

export { useClipboard } from './use-clipboard/use-clipboard'
export type {
  UseClipboardInput,
  UseClipboardInput as UseClipboardOptions,
  UseClipboardReturnValue,
} from './use-clipboard/use-clipboard'

export { useColorScheme } from './use-color-scheme/use-color-scheme'
export type { UseColorSchemeValue } from './use-color-scheme/use-color-scheme'

export { useCounter } from './use-counter/use-counter'
export type {
  UseCounterOptions,
  UseCounterHandlers,
  UseCounterReturnValue,
} from './use-counter/use-counter'

export { useDebouncedState } from './use-debounced-state/use-debounced-state'
export type {
  UseDebouncedStateOptions,
  UseDebouncedStateReturnValue,
} from './use-debounced-state/use-debounced-state'

export { useDebouncedValue } from './use-debounced-value/use-debounced-value'
export type {
  UseDebouncedValueHandlers,
  UseDebouncedValueOptions,
  UseDebouncedValueReturnValue,
} from './use-debounced-value/use-debounced-value'

export { useDocumentTitle } from './use-document-title/use-document-title'
export { useDocumentVisibility } from './use-document-visibility/use-document-visibility'

export { useFocusReturn } from './use-focus-return/use-focus-return'
export type {
  UseFocusReturnInput,
  UseFocusReturnInput as UseFocusReturnOptions,
} from './use-focus-return/use-focus-return'

export { useDidUpdate } from './use-did-update/use-did-update'

export {
  useFocusTrap,
  scopeTab,
  FOCUS_SELECTOR,
  findTabbableDescendants,
  focusable,
  tabbable,
} from './use-focus-trap/use-focus-trap'

export { useForceUpdate } from './use-force-update/use-force-update'

export { useId } from './use-id/use-id'

export { useIdle } from './use-idle/use-idle'
export type { UseIdleOptions } from './use-idle/use-idle'

export { useInterval } from './use-interval/use-interval'
export type { UseIntervalOptions, UseIntervalReturnValue } from './use-interval/use-interval'

export { useIsomorphicEffect } from './use-isomorphic-effect/use-isomorphic-effect'

export { useListState } from './use-list-state/use-list-state'
export type { UseListStateReturnValue, UseListStateHandlers } from './use-list-state/use-list-state'

export { useLocalStorage, readLocalStorageValue } from './use-local-storage/use-local-storage'
export type {
  UseStorageOptions,
  UseStorageReturnValue,
  StorageType,
} from './use-local-storage/create-storage'

export {
  useSessionStorage,
  readSessionStorageValue,
} from './use-session-storage/use-session-storage'

export { useMediaQuery } from './use-media-query/use-media-query'
export type { UseMediaQueryOptions } from './use-media-query/use-media-query'

export { useMergedRef, mergeRefs, assignRef } from './use-merged-ref/use-merged-ref'
export type { VueRefTarget } from './use-merged-ref/use-merged-ref'

export { useMouse, useMousePosition } from './use-mouse/use-mouse'
export type {
  UseMouseOptions,
  UseMouseReturnValue,
  UseMousePositionReturnValue,
} from './use-mouse/use-mouse'

export { useMove, clampUseMovePosition } from './use-move/use-move'
export type { UseMoveHandlers, UseMovePosition } from './use-move/use-move'

export { usePagination, DOTS } from './use-pagination/use-pagination'
export type { UsePaginationOptions } from './use-pagination/use-pagination'

export { useQueue } from './use-queue/use-queue'
export type { UseQueueOptions, UseQueueReturnValue } from './use-queue/use-queue'

export { usePageLeave } from './use-page-leave/use-page-leave'

export { useReducedMotion } from './use-reduced-motion/use-reduced-motion'

export { useScrollIntoView } from './use-scroll-into-view/use-scroll-into-view'
export type {
  UseScrollIntoViewOptions,
  UseScrollIntoViewReturnValue,
} from './use-scroll-into-view/use-scroll-into-view'

export { useResizeObserver, useElementSize } from './use-resize-observer/use-resize-observer'
export type {
  UseElementSizeReturnValue,
  UseResizeObserverReturnValue,
  ObserverRect,
} from './use-resize-observer/use-resize-observer'

export { useShallowEffect } from './use-shallow-effect/use-shallow-effect'

export { useToggle } from './use-toggle/use-toggle'
export type { UseToggleReturnValue } from './use-toggle/use-toggle'

export { useUncontrolled } from './use-uncontrolled/use-uncontrolled'
export type {
  UseUncontrolledOptions,
  UseUncontrolledReturnValue,
} from './use-uncontrolled/use-uncontrolled'

export { useViewportSize } from './use-viewport-size/use-viewport-size'
export type { UseViewportSizeReturnValue } from './use-viewport-size/use-viewport-size'

export { useWindowEvent } from './use-window-event/use-window-event'

export { useWindowScroll } from './use-window-scroll/use-window-scroll'
export type {
  UseWindowScrollPosition,
  UseWindowScrollTo,
  UseWindowScrollReturnValue,
} from './use-window-scroll/use-window-scroll'

export { useIntersection } from './use-intersection/use-intersection'
export type { UseIntersectionReturnValue } from './use-intersection/use-intersection'

export { useHash } from './use-hash/use-hash'
export type {
  UseHashInput,
  UseHashInput as UseHashOptions,
  UseHashReturnValue,
} from './use-hash/use-hash'

export { useHotkeys, getHotkeyHandler } from './use-hotkeys/use-hotkeys'
export type { HotkeyItemOptions, HotkeyItem } from './use-hotkeys/use-hotkeys'

export { useFullscreenDocument, useFullscreenElement } from './use-fullscreen/use-fullscreen'
export type {
  UseFullscreenElementReturnValue,
  UseFullscreenDocumentReturnValue,
} from './use-fullscreen/use-fullscreen'

export { useLogger } from './use-logger/use-logger'

export { useHover } from './use-hover/use-hover'
export type { UseHoverReturnValue } from './use-hover/use-hover'

export { useValidatedState } from './use-validated-state/use-validated-state'
export type {
  UseValidatedStateValue,
  UseValidatedStateReturnValue,
} from './use-validated-state/use-validated-state'

export { useOs } from './use-os/use-os'
export type { UseOSReturnValue, UseOsOptions } from './use-os/use-os'

export { useSetState } from './use-set-state/use-set-state'
export type { UseSetStateCallback, UseSetStateReturnValue } from './use-set-state/use-set-state'

export { useInputState } from './use-input-state/use-input-state'
export type { UseInputStateReturnValue } from './use-input-state/use-input-state'

export { useEventListener } from './use-event-listener/use-event-listener'

export { useDisclosure } from './use-disclosure/use-disclosure'
export type {
  UseDisclosureOptions,
  UseDisclosureHandlers,
  UseDisclosureReturnValue,
} from './use-disclosure/use-disclosure'

export { useFocusWithin } from './use-focus-within/use-focus-within'
export type {
  UseFocusWithinOptions,
  UseFocusWithinReturnValue,
} from './use-focus-within/use-focus-within'

export { useNetwork } from './use-network/use-network'
export type { UserNetworkReturnValue } from './use-network/use-network'

export { useTimeout } from './use-timeout/use-timeout'
export type { UseTimeoutOptions, UseTimeoutReturnValue } from './use-timeout/use-timeout'

export { useTextSelection } from './use-text-selection/use-text-selection'

export { usePrevious } from './use-previous/use-previous'

export { useFavicon } from './use-favicon/use-favicon'

export {
  useHeadroom,
  isFixed,
  isPinned,
  isReleased,
  isPinnedOrReleased,
} from './use-headroom/use-headroom'
export type {
  UseHeadroomInput,
  UseHeadroomInput as UseHeadroomOptions,
  UseHeadroomReturnValue,
} from './use-headroom/use-headroom'

export { useScrollDirection } from './use-scroll-direction/use-scroll-direction'
export type { ScrollDirection } from './use-scroll-direction/use-scroll-direction'

export { useEyeDropper } from './use-eye-dropper/use-eye-dropper'
export type {
  EyeDropperOpenOptions,
  EyeDropperOpenReturnType,
  UseEyeDropperReturnValue,
} from './use-eye-dropper/use-eye-dropper'

export { useInViewport } from './use-in-viewport/use-in-viewport'
export type { UseInViewportReturnValue } from './use-in-viewport/use-in-viewport'

export {
  useMutationObserver,
  useMutationObserverTarget,
} from './use-mutation-observer/use-mutation-observer'

export { useMounted } from './use-mounted/use-mounted'

export { useStateHistory } from './use-state-history/use-state-history'
export type {
  UseStateHistoryHandlers,
  UseStateHistoryValue,
  UseStateHistoryValue as StateHistory,
  UseStateHistoryReturnValue,
} from './use-state-history/use-state-history'

export { useMap } from './use-map/use-map'

export { useSet, readonlySetLikeToSet } from './use-set/use-set'
export type { ReadonlySetLike } from './use-set/use-set'

export { useThrottledCallback } from './use-throttled-callback/use-throttled-callback'

export { useThrottledState } from './use-throttled-state/use-throttled-state'
export type { UseThrottledStateReturnValue } from './use-throttled-state/use-throttled-state'

export { useThrottledValue } from './use-throttled-value/use-throttled-value'

export { useIsFirstRender } from './use-is-first-render/use-is-first-render'

export { useOrientation } from './use-orientation/use-orientation'
export type {
  UseOrientationOptions,
  UseOrientationReturnType,
} from './use-orientation/use-orientation'

export { useFetch } from './use-fetch/use-fetch'
export type { UseFetchOptions, UseFetchReturnValue } from './use-fetch/use-fetch'

export { useRadialMove, normalizeRadialValue } from './use-radial-move/use-radial-move'
export type {
  UseRadialMoveOptions,
  UseRadialMoveReturnValue,
} from './use-radial-move/use-radial-move'

export { useScrollSpy } from './use-scroll-spy/use-scroll-spy'
export type { UseScrollSpyHeadingData, UseScrollSpyOptions } from './use-scroll-spy/use-scroll-spy'

export { useScroller } from './use-scroller/use-scroller'
export type {
  UseScrollerOptions,
  UseScrollerReturnValue,
  UseScrollerScrollState,
} from './use-scroller/use-scroller'

export { useFileDialog } from './use-file-dialog/use-file-dialog'
export type {
  UseFileDialogOptions,
  UseFileDialogReturnValue,
} from './use-file-dialog/use-file-dialog'

export { useLongPress } from './use-long-press/use-long-press'
export type {
  UseLongPressEvent,
  UseLongPressOptions,
  UseLongPressReturnValue,
} from './use-long-press/use-long-press'

export { useSelection } from './use-selection/use-selection'
export type {
  UseSelectionHandlers,
  UseSelectionInput,
  UseSelectionReturnValue,
} from './use-selection/use-selection'

export { useFloatingWindow } from './use-floating-window/use-floating-window'
export type {
  FloatingWindowPosition,
  FloatingWindowPositionConfig,
  SetFloatingWindowPosition,
  UseFloatingWindowOptions,
} from './use-floating-window/use-floating-window'

export { useCollapse, createCollapse, getElementContentSize } from './use-collapse/use-collapse'
export type {
  UseCollapseInput,
  UseCollapseReturnValue,
  UseCollapseState,
  GetCollapsePropsInput,
  GetCollapsePropsReturnValue,
} from './use-collapse/use-collapse'

export { useHorizontalCollapse } from './use-collapse/use-horizontal-collapse'
export type {
  UseHorizontalCollapseInput,
  UseHorizontalCollapseReturnValue,
} from './use-collapse/use-horizontal-collapse'

export {
  useMask,
  formatMask,
  unformatMask,
  isMaskComplete,
  generatePattern,
} from './use-mask/use-mask'
export type { UseMaskOptions, UseMaskReturnValue, MaskState } from './use-mask/use-mask'

export { useRovingIndex } from './use-roving-index/use-roving-index'
export type {
  UseRovingIndexInput,
  UseRovingIndexGetItemPropsInput,
  UseRovingIndexReturnValue,
} from './use-roving-index/use-roving-index'

export { useDrag } from './use-drag/use-drag'
export type { UseDragState, UseDragOptions, UseDragReturnValue } from './use-drag/use-drag'

export { useSplitter } from './use-splitter/use-splitter'
export type {
  UseSplitterPanel,
  UseSplitterOptions,
  UseSplitterReturnValue,
  UseSplitterRedistributeInput,
  UseSplitterRedistributeFn,
} from './use-splitter/use-splitter'
