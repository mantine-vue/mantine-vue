<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'
import { Modal, getDefaultZIndex, rem, useProps, useStyles } from '@mantine-vue/core'
import { useHotkeys } from '@mantine-vue/hooks'
import { getHotkeys } from '../../get-hotkeys'
import { provideSpotlightContext } from '../../Spotlight.context'
import { mergeClassNames, mergeStyles } from '../../style-api'
import { spotlightActions, spotlightStore, useSpotlight } from '../../spotlight.store'
import type {
  SpotlightRootEmits,
  SpotlightRootProps,
  SpotlightRootSlots,
} from './SpotlightRoot.types'
import classes from '../../Spotlight.module.css'

defineOptions({ name: 'SpotlightRoot', inheritAttrs: false })
const rawProps = withDefaults(defineProps<SpotlightRootProps>(), {
  store: () => spotlightStore,
  clearQueryOnClose: true,
  shortcut: 'mod + K',
  disabled: false,
  forceOpened: false,
  closeOnActionTrigger: true,
  maxHeight: 400,
  scrollable: false,
})
const emit = defineEmits<SpotlightRootEmits>()
defineSlots<SpotlightRootSlots>()
const attrs = useAttrs()
const props = useProps(
  'SpotlightRoot',
  {
    size: 600,
    yOffset: 80,
    zIndex: getDefaultZIndex('max'),
    overlayProps: { backgroundOpacity: 0.35, blur: 7 },
    transitionProps: { duration: 200, transition: 'pop' },
  },
  rawProps,
)
const state = useSpotlight(props.store)
const previousOpened = ref(state.value.opened)
const currentQuery = computed(() =>
  typeof props.query === 'string' ? props.query : state.value.query,
)

function setQuery(query: string) {
  emit('update:query', query)
  emit('query-change', query)
  spotlightActions.setQuery(query, props.store)
}

const getStyles = useStyles({
  name: 'Spotlight',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
})

provideSpotlightContext({
  get query() {
    return currentQuery.value
  },
  setQuery,
  getStyles,
  store: props.store,
  get closeOnActionTrigger() {
    return props.closeOnActionTrigger
  },
})

useHotkeys(
  () => getHotkeys(props.shortcut, props.store),
  () => props.tagsToIgnore,
  () => props.triggerOnContentEditable,
)

watch(
  () => state.value.opened,
  (opened) => {
    if (opened === previousOpened.value) return
    if (opened) emit('spotlight-open')
    else emit('spotlight-close')
    previousOpened.value = opened
  },
)

const rootStyles = computed(() =>
  getStyles('root', { className: attrs.class, style: attrs.style as any }),
)
const modalAttrs = computed(() => {
  const value = { ...attrs, ...props }
  for (const key of [
    'classNames',
    'styles',
    'vars',
    'unstyled',
    'store',
    'query',
    'clearQueryOnClose',
    'shortcut',
    'tagsToIgnore',
    'triggerOnContentEditable',
    'disabled',
    'forceOpened',
    'closeOnActionTrigger',
    'maxHeight',
    'scrollable',
    'class',
    'style',
  ])
    delete value[key]
  return value
})

function close() {
  spotlightActions.close(props.store)
}

function exitTransitionEnd() {
  if (props.clearQueryOnClose) setQuery('')
  spotlightActions.clearSpotlightState({ clearQuery: props.clearQueryOnClose }, props.store)
  props.transitionProps?.onExited?.()
  emit('exit-transition-end')
}
</script>

<template>
  <Modal
    v-if="!props.disabled"
    v-bind="modalAttrs"
    :with-close-button="false"
    :opened="state.opened || props.forceOpened"
    :padding="0"
    :class="rootStyles.class"
    :style="rootStyles.style"
    :class-names="
      mergeClassNames({ body: classes.body, content: classes.content }, props.classNames)
    "
    :styles="mergeStyles(props.styles)"
    :vars="
      mergeStyles(
        { root: { '--spotlight-max-height': props.scrollable ? rem(props.maxHeight) : undefined } },
        props.vars,
      )
    "
    :data-scrollable="props.scrollable || undefined"
    @close="close"
    @exit-transition-end="exitTransitionEnd"
  >
    <slot />
  </Modal>
</template>
