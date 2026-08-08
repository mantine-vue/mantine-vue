<script setup lang="ts">
import { computed, isVNode, useAttrs, useSlots } from 'vue'
import { getThemeColor, useMantineTheme, useProps } from '../../../core'
import { CheckIcon } from '../../Checkbox'
import { Loader } from '../../Loader'
import { Transition as MantineTransition } from '../../Transition'
import { UnstyledButton } from '../../UnstyledButton'
import { useStepperContext } from '../Stepper.context'
import classes from '../Stepper.module.css'
import type {
  StepperStepFragment,
  StepperStepOwnProps,
  StepperStepSlots,
} from './StepperStep.types'

defineOptions({ name: 'StepperStep', inheritAttrs: false })

const rawProps = withDefaults(defineProps<StepperStepOwnProps>(), {
  step: undefined,
  state: undefined,
  color: undefined,
  withIcon: undefined,
  icon: undefined,
  completedIcon: undefined,
  progressIcon: undefined,
  label: undefined,
  description: undefined,
  iconSize: undefined,
  iconPosition: undefined,
  allowStepClick: undefined,
  allowStepSelect: undefined,
  orientation: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  className: undefined,
  style: undefined,
})
defineSlots<StepperStepSlots>()

const attrs = useAttrs()
const slots = useSlots()
const props = useProps(
  'StepperStep',
  { withIcon: true, allowStepClick: true, iconPosition: 'left' } as const,
  rawProps,
)
const ctx = useStepperContext()
const theme = useMantineTheme()
const step = computed(() => props.step ?? 0)
const iconPosition = computed(() => props.iconPosition ?? ctx.iconPosition)
const stylesApi = computed(() => ({
  classNames: props.classNames,
  styles: props.styles,
  props,
}))
const dataAttributes = computed(() => ({
  'data-progress': props.state === 'stepProgress' || undefined,
  'data-completed': props.state === 'stepCompleted' || undefined,
}))

function renderFragment(fragment: StepperStepFragment | undefined) {
  if (typeof fragment === 'function') {
    return fragment({ step: step.value })
  }

  return isVNode(fragment) ? fragment : fragment
}

function resolveFragment(
  prop: StepperStepFragment | undefined,
  slot: ((payload: { step: number }) => any) | undefined,
) {
  return prop !== undefined ? renderFragment(prop) : slot?.({ step: step.value })
}

const iconNode = computed(() => resolveFragment(props.icon, slots.icon))
const progressIconNode = computed(() =>
  props.progressIcon !== undefined || slots.progressIcon
    ? resolveFragment(props.progressIcon, slots.progressIcon)
    : undefined,
)
const currentIcon = computed(() =>
  props.state === 'stepProgress' ? (progressIconNode.value ?? iconNode.value) : iconNode.value,
)
const hasCompletedIcon = computed(
  () => props.completedIcon !== undefined || Boolean(slots.completedIcon),
)
const completed = computed(() =>
  hasCompletedIcon.value ? resolveFragment(props.completedIcon, slots.completedIcon) : undefined,
)
const labelPresent = computed(() => props.label !== undefined || Boolean(slots.label))
const descriptionPresent = computed(
  () => props.description !== undefined || Boolean(slots.description),
)
const labelNode = computed(() => resolveFragment(props.label, slots.label))
const descriptionNode = computed(() => resolveFragment(props.description, slots.description))
const stepStyles = computed(() =>
  ctx.getStyles('step', {
    className: [
      props.className ?? attrs.class,
      classes[`step--${ctx.orientation}` as keyof typeof classes],
    ],
    style: props.style ?? attrs.style,
    ...stylesApi.value,
  }),
)
const rootStyle = computed(() => [
  stepStyles.value.style,
  { '--step-color': props.color ? getThemeColor(props.color, theme.value) : undefined },
  props.style,
  attrs.style,
])

const renderCurrentIcon = () => currentIcon.value
const renderCompleted = () => completed.value
const renderLabel = () => labelNode.value
const renderDescription = () => descriptionNode.value
</script>

<template>
  <UnstyledButton
    v-bind="{ ...attrs, ...stepStyles, ...dataAttributes }"
    :mod="[{ iconPosition, allowClick: props.allowStepClick }, props.mod]"
    :style="rootStyle"
    :tabindex="props.allowStepClick ? 0 : -1"
  >
    <span v-if="props.withIcon" v-bind="ctx.getStyles('stepWrapper', stylesApi)">
      <span v-bind="{ ...ctx.getStyles('stepIcon', stylesApi), ...dataAttributes }">
        <MantineTransition
          :mounted="props.state === 'stepCompleted'"
          transition="scale"
          :duration="200"
        >
          <template #default="transitionStyles">
            <span
              v-bind="
                ctx.getStyles('stepCompletedIcon', {
                  ...stylesApi,
                  style: transitionStyles,
                })
              "
            >
              <Loader
                v-if="props.loading"
                color="var(--mantine-color-white)"
                size="calc(var(--stepper-icon-size) / 2)"
                v-bind="ctx.getStyles('stepLoader', stylesApi)"
              />
              <component :is="renderCompleted" v-else-if="hasCompletedIcon" />
              <CheckIcon v-else width="60%" height="60%" />
            </span>
          </template>
        </MantineTransition>
        <span
          v-if="props.state !== 'stepCompleted'"
          v-bind="ctx.getStyles('stepIconContent', stylesApi)"
        >
          <Loader
            v-if="props.loading"
            size="calc(var(--stepper-icon-size) / 2)"
            :color="props.color"
            v-bind="ctx.getStyles('stepLoader', stylesApi)"
          />
          <component :is="renderCurrentIcon" v-else />
        </span>
      </span>
      <span
        v-if="props.orientation === 'vertical'"
        v-bind="ctx.getStyles('verticalSeparator', stylesApi)"
        :data-active="props.state === 'stepCompleted' || undefined"
      />
    </span>
    <span
      v-if="labelPresent || descriptionPresent"
      v-bind="ctx.getStyles('stepBody', stylesApi)"
      :data-orientation="ctx.orientation"
      :data-icon-position="iconPosition"
    >
      <span v-if="labelPresent" v-bind="ctx.getStyles('stepLabel', stylesApi)">
        <component :is="renderLabel" />
      </span>
      <span v-if="descriptionPresent" v-bind="ctx.getStyles('stepDescription', stylesApi)">
        <component :is="renderDescription" />
      </span>
    </span>
  </UnstyledButton>
</template>
