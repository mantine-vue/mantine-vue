<script lang="ts">
import { createVarsResolver, getSpacing } from '../../core'

const varsResolver = createVarsResolver<any>(
  (theme, { variant, color, childrenOffset, autoContrast }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      variant: variant || 'light',
      autoContrast,
    })

    return {
      root: {
        '--nl-bg': color || variant ? colors.background : undefined,
        '--nl-hover': color || variant ? colors.hover : undefined,
        '--nl-color': color || variant ? colors.color : undefined,
      },
      children: { '--nl-offset': getSpacing(childrenOffset) },
    }
  },
)

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { Box, hasNode, resolveNode, useStyles } from '../../core'
import { AccordionChevron } from '../Accordion'
import { Collapse } from '../Collapse'
import { UnstyledButton } from '../UnstyledButton'
import type { NavLinkOwnProps, NavLinkSlots } from './NavLink.types'
import classes from './NavLink.module.css'

defineOptions({ name: 'NavLink', inheritAttrs: false })

const props = withDefaults(defineProps<NavLinkOwnProps>(), {
  component: 'a',
  label: undefined,
  description: undefined,
  leftSection: undefined,
  rightSection: undefined,
  color: undefined,
  opened: undefined,
  defaultOpened: undefined,
  childrenOffset: 'lg',
  autoContrast: undefined,
  keepMounted: undefined,
  variant: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<NavLinkSlots>()

const emit = defineEmits<{
  'update:opened': [opened: boolean]
}>()

const attrs = useAttrs()
const slots = useSlots()
const [opened, setOpened] = useUncontrolled<boolean>({
  value: () => props.opened,
  defaultValue: props.defaultOpened,
  finalValue: false,
  onChange: (value) => emit('update:opened', value),
})
const getStyles = useStyles({
  name: 'NavLink',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

const children = computed(() => slots.default?.() ?? [])
const withChildren = computed(() => hasNode(children.value))
const rightSection = computed(() => resolveNode(props.rightSection, slots.rightSection))
const leftSection = computed(() => resolveNode(props.leftSection, slots.leftSection))
const label = computed(() => resolveNode(props.label, slots.label))
const description = computed(() => resolveNode(props.description, slots.description))
const descriptionPresent = computed(() => Boolean(props.description || slots.description))
const rootAttrs = computed(() => {
  const { onClick: _onClick, onKeydown: _onKeydown, onKeyDown: _onKeyDown, ...rest } = attrs
  return rest
})

const renderContent = (content: any) => (typeof content === 'function' ? content() : content)
const renderLeftSection = () => renderContent(leftSection.value)
const renderRightSection = () => renderContent(rightSection.value)
const renderLabel = () => renderContent(label.value)
const renderDescription = () => renderContent(description.value)
const renderChildren = () => children.value

function callHandler(handler: any, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((item) => item?.(event))
  } else {
    handler?.(event)
  }
}

function toggle(event: Event) {
  if (withChildren.value) {
    event.preventDefault()
    setOpened(!opened.value)
  }
}

function handleClick(event: MouseEvent) {
  callHandler((attrs as any).onClick, event)
  toggle(event)
}

function handleKeydown(event: KeyboardEvent) {
  callHandler((attrs as any).onKeydown ?? (attrs as any).onKeyDown, event)
  if (event.code === 'Space' && withChildren.value) {
    toggle(event)
  }
}
</script>

<template>
  <UnstyledButton
    v-bind="{
      ...rootAttrs,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    :component="props.component"
    :unstyled="props.unstyled"
    :variant="props.variant"
    :mod="[{ disabled: props.disabled, active: props.active, expanded: opened }, props.mod]"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <Box
      v-if="hasNode(leftSection)"
      component="span"
      v-bind="getStyles('section')"
      :mod="{ position: 'left' }"
      ><component :is="renderLeftSection"
    /></Box>
    <Box v-bind="getStyles('body')" :mod="{ 'no-wrap': props.noWrap }">
      <Box component="span" v-bind="getStyles('label')"><component :is="renderLabel" /></Box>
      <Box
        v-if="descriptionPresent"
        component="span"
        :mod="{ active: props.active }"
        v-bind="getStyles('description')"
        ><component :is="renderDescription"
      /></Box>
    </Box>
    <Box
      v-if="withChildren || hasNode(rightSection)"
      v-bind="getStyles('section')"
      component="span"
      :mod="{
        rotate: opened && !props.disableRightSectionRotation,
        position: 'right',
      }"
    >
      <template v-if="withChildren">
        <component :is="renderRightSection" v-if="hasNode(rightSection)" />
        <AccordionChevron v-else v-bind="getStyles('chevron')" />
      </template>
      <component :is="renderRightSection" v-else />
    </Box>
  </UnstyledButton>
  <Collapse
    v-if="withChildren"
    :expanded="opened"
    :keep-mounted="props.keepMounted"
    v-bind="getStyles('collapse')"
  >
    <div v-bind="getStyles('children')"><component :is="renderChildren" /></div>
  </Collapse>
</template>
