<script lang="ts">
import { createVarsResolver, getShadow, getThemeColor } from '../../core'
const varsResolver = createVarsResolver<any>(
  (theme, { zIndex, overlayColor, tooltipShadow, color }) => ({
    root: {
      '--tour-color': color ? getThemeColor(color, theme) : undefined,
      '--tour-z-index': zIndex?.toString(),
      '--tour-overlay-color': overlayColor,
      '--tour-tooltip-radius': undefined,
      '--tour-tooltip-shadow': getShadow(tooltipShadow),
      '--tour-beacon-size': undefined,
      '--tour-beacon-color': undefined,
    },
  }),
)
export { varsResolver }
</script>

<script setup lang="ts">
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import {
  computed,
  Fragment,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useAttrs,
  useSlots,
  watch,
  type VNode,
} from 'vue'
import { assignRef, useId } from '@mantine-vue/hooks'
import { Box, omitAttrs, useDirection, useProps, useStyles } from '../../core'
import { getFloatingPosition } from '../../utils/Floating'
import { Button } from '../Button'
import { CloseButton } from '../CloseButton'
import { FocusTrap } from '../FocusTrap'
import { Group } from '../Group'
import { OptionalPortal } from '../Portal'
import { Transition as MantineTransition } from '../Transition'
import { defaultTourLabels, provideTourContext } from './Tour.context'
import { getOverlayHitPath } from './get-overlay-hit-path'
import { isElementInView } from './is-element-in-view'
import TourBeaconPositioned from './TourBeaconPositioned.vue'
import TourStep from './TourStep.vue'
import type { TourEmits, TourOwnProps, TourStepData } from './Tour.types'
import classes from './Tour.module.css'

defineOptions({ name: 'Tour', inheritAttrs: false })
const rawProps = withDefaults(defineProps<TourOwnProps>(), {
  active: false,
  defaultStep: 0,
  mode: 'guided',
  withOverlay: true,
  withOverlayInteraction: false,
  withCloseButton: true,
  withKeyboardNavigation: true,
  withScrollIntoView: true,
  spotlightPadding: 8,
  spotlightRadius: 4,
  closeOnEscape: true,
  closeOnOverlayClick: false,
  withinPortal: true,
  zIndex: 10000,
  stepTransitionDuration: 300,
  maxWidth: 360,
  overlayColor: 'rgba(0, 0, 0, 0.5)',
  transitionProps: () => ({ duration: 200, transition: 'pop' }),
  unstyled: false,
})
const emit = defineEmits<TourEmits>()
defineSlots<{ default?: () => any }>()
const attrs = useAttrs()
const slots = useSlots()
const props = useProps('Tour', {} as any, rawProps) as any
const { dir } = useDirection()
const id = useId()
const maskId = computed(() => `${id.value}-mask`)
const titleId = computed(() => `${id.value}-title`)
const bodyId = computed(() => `${id.value}-body`)
const titleMounted = ref(false)
const bodyMounted = ref(false)
const internalStep = ref(props.defaultStep)
const beaconOpenStep = ref<number | null>(null)
const rootElement = ref<Element | null>(null)
const floating = ref<HTMLElement | null>(null)
const targetElement = ref<HTMLElement | null>(null)
const targetRect = ref<{ top: number; left: number; width: number; height: number } | null>(null)
const mutationObserver = ref<MutationObserver>()

const currentStep = computed(() =>
  rawProps.step === undefined ? internalStep.value : rawProps.step,
)
const displayStepIndex = computed(() =>
  props.mode === 'beacon' && beaconOpenStep.value !== null
    ? beaconOpenStep.value
    : currentStep.value,
)
const showTooltip = computed(
  () => props.active && (props.mode === 'guided' || beaconOpenStep.value !== null),
)

function flatten(nodes: any[]): any[] {
  return nodes.flatMap((node) =>
    node?.type === Fragment && Array.isArray(node.children) ? flatten(node.children) : [node],
  )
}
const steps = shallowRef<TourStepData[]>([])

function getSteps(nodes: VNode[]) {
  return flatten(nodes).flatMap((node) => {
    if (node?.type !== TourStep) return []
    const content = typeof node.children === 'object' ? node.children.default : undefined
    return [{ ...node.props, content }]
  }) as TourStepData[]
}

function areStepsEqual(current: TourStepData[], next: TourStepData[]) {
  if (current.length !== next.length) return false

  return current.every((step, index) => {
    const nextStep = next[index]
    const keys = new Set([...Object.keys(step), ...Object.keys(nextStep)])
    keys.delete('content')
    return [...keys].every(
      (key) => step[key as keyof TourStepData] === nextStep[key as keyof TourStepData],
    )
  })
}

const renderSteps = Object.assign(
  (slotProps: { nodes?: () => VNode[] }) => {
    const nextSteps = getSteps(slotProps.nodes?.() ?? [])
    if (!areStepsEqual(steps.value, nextSteps)) steps.value = nextSteps
    return null
  },
  { props: { nodes: { type: Function, required: false } } },
)
const displayStep = computed(() => steps.value[displayStepIndex.value] ?? null)
const labels = computed(() => ({ ...defaultTourLabels, ...props.labels }))
const resolvedPadding = computed(
  () => displayStep.value?.spotlightPadding ?? props.spotlightPadding,
)
const resolvedRadius = computed(() => displayStep.value?.spotlightRadius ?? props.spotlightRadius)
const resolvedWithOverlay = computed(() => displayStep.value?.withOverlay ?? props.withOverlay)
const isCentered = computed(() => !targetElement.value)

const placement = computed(() =>
  getFloatingPosition(dir.value, displayStep.value?.position ?? 'bottom'),
)
const { floatingStyles, update } = useFloating(targetElement, floating, {
  open: showTooltip,
  placement,
  transform: false,
  middleware: [offset(12), flip(), shift({ padding: 8 })],
  whileElementsMounted: autoUpdate,
})

const getStyles = useStyles({
  name: 'Tour',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames,
  styles: props.styles,
  vars: props.vars,
  unstyled: props.unstyled,
  varsResolver,
})
const rootStyles = computed(() => getStyles('root', { className: attrs.class, style: attrs.style }))
const tooltipStyles = computed(() => getStyles('tooltip'))

function setStep(value: number) {
  if (rawProps.step === undefined) internalStep.value = value
  if (props.mode === 'beacon' && beaconOpenStep.value !== null) beaconOpenStep.value = value
  emit('update:step', value)
  emit('stepChange', value)
}
function close() {
  beaconOpenStep.value = null
  emit('close')
}
function resolveTarget(): HTMLElement | null {
  const target = displayStep.value?.target
  if (!target || typeof document === 'undefined') return null
  return typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target.value
}
function updateRect() {
  const rect = targetElement.value?.getBoundingClientRect()
  targetRect.value = rect
    ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
    : null
  update()
}
function setResolvedTarget() {
  mutationObserver.value?.disconnect()
  targetElement.value = showTooltip.value ? resolveTarget() : null
  if (!targetElement.value && showTooltip.value && typeof displayStep.value?.target === 'string') {
    mutationObserver.value = new MutationObserver(() => {
      const found = resolveTarget()
      if (found) {
        targetElement.value = found
        mutationObserver.value?.disconnect()
        nextTick(updateRect)
      }
    })
    mutationObserver.value.observe(document.body, { childList: true, subtree: true })
  }
  nextTick(() => {
    updateRect()
    if (props.withScrollIntoView && targetElement.value) {
      if (props.scrollToHandler) props.scrollToHandler(targetElement.value)
      else if (!isElementInView(targetElement.value))
        targetElement.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

let reportedStep: number | null = null
watch(
  [showTooltip, displayStepIndex],
  () => {
    const next = showTooltip.value ? displayStepIndex.value : null
    if (reportedStep === next) return
    if (reportedStep !== null) {
      steps.value[reportedStep]?.onStepClose?.()
      emit('stepClose', reportedStep)
    }
    reportedStep = next
    if (next !== null) {
      steps.value[next]?.onStepOpen?.()
      emit('stepOpen', next)
    }
  },
  { immediate: true },
)
watch([showTooltip, displayStepIndex, () => displayStep.value?.target], setResolvedTarget, {
  immediate: true,
})
watch(
  () => props.active,
  (active, previous) => {
    if (previous && !active && rawProps.step === undefined) internalStep.value = props.defaultStep
    if (!active) beaconOpenStep.value = null
  },
)

function onKeydown(event: KeyboardEvent) {
  if (!showTooltip.value || event.isComposing) return
  if (
    event.key === 'Escape' &&
    props.closeOnEscape &&
    (event.target as HTMLElement)?.dataset?.mantineStopPropagation !== 'true'
  ) {
    close()
    return
  }
  if (
    props.mode !== 'guided' ||
    !props.withKeyboardNavigation ||
    targetElement.value?.contains(event.target as Node)
  )
    return
  const nextKey = dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
  const previousKey = dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
  if (event.key === nextKey) {
    event.preventDefault()
    if (currentStep.value < steps.value.length - 1) setStep(currentStep.value + 1)
    else close()
  } else if (event.key === previousKey && currentStep.value > 0) {
    event.preventDefault()
    setStep(currentStep.value - 1)
  }
}
onMounted(() => {
  window.addEventListener('resize', updateRect)
  window.addEventListener('scroll', updateRect, true)
  window.addEventListener('keydown', onKeydown, true)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateRect)
  window.removeEventListener('scroll', updateRect, true)
  window.removeEventListener('keydown', onKeydown, true)
  mutationObserver.value?.disconnect()
})

provideTourContext({
  getStyles,
  get step() {
    return displayStepIndex.value
  },
  setStep,
  get stepsCount() {
    return steps.value.length
  },
  close,
  get withOverlay() {
    return resolvedWithOverlay.value
  },
  get withOverlayInteraction() {
    return props.withOverlayInteraction
  },
  get withCloseButton() {
    return props.withCloseButton
  },
  get closeOnOverlayClick() {
    return props.closeOnOverlayClick
  },
  get spotlightPadding() {
    return resolvedPadding.value
  },
  get spotlightRadius() {
    return resolvedRadius.value
  },
  get color() {
    return props.color
  },
  get labels() {
    return labels.value
  },
  get titleId() {
    return titleId.value
  },
  get bodyId() {
    return bodyId.value
  },
  get titleMounted() {
    return titleMounted.value
  },
  get bodyMounted() {
    return bodyMounted.value
  },
  registerTitle: (value) => {
    titleMounted.value = value !== null
  },
  registerBody: (value) => {
    bodyMounted.value = value !== null
  },
  get targetElement() {
    return targetElement.value
  },
  setTargetElement: (element) => {
    targetElement.value = element
  },
})

const renderTitle = () => displayStep.value?.title as any
const renderBody = () => displayStep.value?.content?.() as any
const overlayPath = computed(() => getOverlayHitPath(targetRect.value, resolvedPadding.value))
const beaconData = computed(() =>
  props.active && props.mode === 'beacon' && beaconOpenStep.value === null
    ? steps.value
        .map((step, index) => ({ index, step }))
        .filter(({ step }) => step.withBeacon !== false)
    : [],
)
function setRootRef(node: any) {
  rootElement.value = node?.$el ?? node ?? null
  assignRef(props.rootRef, rootElement.value)
}

function openBeacon(index: number) {
  beaconOpenStep.value = index
  setStep(index)
}
</script>

<template>
  <component :is="renderSteps" :nodes="slots.default" />
  <OptionalPortal v-bind="props.portalProps" :within-portal="props.withinPortal">
    <Box
      v-if="props.active"
      v-bind="{ ...omitAttrs(attrs, ['class', 'style']), ...rootStyles }"
      :root-ref="setRootRef"
    >
      <MantineTransition
        :mounted="showTooltip && resolvedWithOverlay"
        transition="fade"
        :duration="props.transitionProps?.duration ?? 200"
      >
        <template #default="transitionStyle">
          <svg
            v-bind="getStyles('overlay')"
            role="presentation"
            width="100%"
            height="100%"
            :style="transitionStyle"
            :data-with-overlay-interaction="props.withOverlayInteraction || undefined"
            @mousedown.prevent
            @click="props.closeOnOverlayClick && close()"
          >
            <defs>
              <mask :id="maskId">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <rect
                  v-if="targetRect"
                  :x="targetRect.left - resolvedPadding"
                  :y="targetRect.top - resolvedPadding"
                  :width="targetRect.width + resolvedPadding * 2"
                  :height="targetRect.height + resolvedPadding * 2"
                  :rx="resolvedRadius"
                  :ry="resolvedRadius"
                  fill="black"
                  v-bind="getStyles('spotlight')"
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              style="fill: var(--tour-overlay-color)"
              :mask="`url(#${maskId})`"
            />
            <path
              v-if="props.withOverlayInteraction"
              :d="overlayPath"
              fill-rule="evenodd"
              fill="transparent"
              style="pointer-events: auto"
            />
          </svg>
        </template>
      </MantineTransition>

      <TourBeaconPositioned
        v-for="beacon in beaconData"
        :key="beacon.index"
        :target="beacon.step.target"
        :label="`${labels.beacon}${typeof beacon.step.title === 'string' ? `: ${beacon.step.title}` : ''}`"
        @click="openBeacon(beacon.index)"
      />

      <MantineTransition :mounted="showTooltip && !!displayStep" v-bind="props.transitionProps">
        <template #default="transitionStyle">
          <FocusTrap :active="resolvedWithOverlay && !props.withOverlayInteraction">
            <Box
              :root-ref="(node: any) => (floating = node?.$el ?? node)"
              role="dialog"
              :tabindex="-1"
              :aria-labelledby="displayStep?.title ? titleId : undefined"
              :aria-label="
                displayStep?.title
                  ? undefined
                  : labels.stepCounter(displayStepIndex + 1, steps.length)
              "
              :aria-describedby="displayStep?.content ? bodyId : undefined"
              v-bind="tooltipStyles"
              :data-centered="isCentered || undefined"
              :style="[
                tooltipStyles.style,
                isCentered ? { width: `${props.maxWidth}px` } : floatingStyles,
                transitionStyle,
                { maxWidth: `${props.maxWidth}px` },
              ]"
            >
              <FocusTrap.InitialFocus v-if="resolvedWithOverlay && !props.withOverlayInteraction" />
              <CloseButton
                v-if="props.withCloseButton"
                :aria-label="labels.close"
                v-bind="getStyles('closeButton')"
                @click="close"
              />
              <Box
                v-if="displayStep?.title"
                component="h3"
                :id="titleId"
                v-bind="getStyles('title')"
                ><component :is="renderTitle"
              /></Box>
              <Box v-if="displayStep?.content" :id="bodyId" v-bind="getStyles('body')"
                ><component :is="renderBody"
              /></Box>
              <Box v-bind="getStyles('navigation')"
                ><Group justify="space-between" wrap="nowrap">
                  <Button
                    variant="default"
                    size="compact-sm"
                    v-bind="getStyles('navigationButton')"
                    @click="close"
                    >{{ labels.skip }}</Button
                  >
                  <Box component="span" aria-live="polite" v-bind="getStyles('stepCounter')">{{
                    labels.stepCounter(displayStepIndex + 1, steps.length)
                  }}</Box>
                  <Group gap="xs" wrap="nowrap">
                    <Button
                      v-if="displayStepIndex > 0"
                      variant="default"
                      size="compact-sm"
                      v-bind="getStyles('navigationButton')"
                      @click="setStep(displayStepIndex - 1)"
                      >{{ labels.back }}</Button
                    >
                    <Button
                      size="compact-sm"
                      :color="props.color"
                      v-bind="getStyles('navigationButton')"
                      @click="
                        displayStepIndex === steps.length - 1
                          ? close()
                          : setStep(displayStepIndex + 1)
                      "
                      >{{
                        displayStepIndex === steps.length - 1 ? labels.close : labels.next
                      }}</Button
                    >
                  </Group>
                </Group></Box
              >
            </Box>
          </FocusTrap>
        </template>
      </MantineTransition>
    </Box>
  </OptionalPortal>
</template>
