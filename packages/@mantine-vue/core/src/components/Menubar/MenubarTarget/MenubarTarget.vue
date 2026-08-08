<script lang="ts">
const defaultProps = { refProp: 'ref' } as const

function isPrintableKey(event: KeyboardEvent) {
  return (
    event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey
  )
}

function getTargetLabel(node: HTMLElement) {
  return (node.textContent ?? '').trim().toLowerCase()
}

/**
 * Runs the consumer's handler first and skips the built-in behaviour if it called
 * `preventDefault`, which is how a consumer opts out of the menubar's keyboard model.
 */
function runComposed(userHandler: any, event: Event, internal: (event: any) => void) {
  if (Array.isArray(userHandler)) {
    userHandler.forEach((fn) => fn?.(event))
  } else {
    userHandler?.(event)
  }

  if (!event.defaultPrevented) {
    internal(event)
  }
}

export { defaultProps, isPrintableKey, getTargetLabel, runComposed }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { omitAttrs, useDirection, useProps } from '../../../core'
import { PopoverTarget } from '../../Popover'
import { UnstyledButton } from '../../UnstyledButton'
import { useMenubarContext, useMenubarMenuContext } from '../Menubar.context'
import type { MenubarTargetOwnProps, MenubarTargetSlots } from './MenubarTarget.types'

defineOptions({
  name: 'MenubarTarget',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<MenubarTargetOwnProps>(), {
  disabled: false,
})

defineSlots<MenubarTargetSlots>()

const attrs = useAttrs()
const props = useProps('MenubarTarget', defaultProps, rawProps)

const ctx = useMenubarContext()
const menuCtx = useMenubarMenuContext()
const { dir } = useDirection()

const hasDataDisabled = computed(() => {
  const value = (attrs as any)['data-disabled']
  return value != null && value !== false
})

const isDisabled = computed(() => props.disabled || hasDataDisabled.value)
const isActive = computed(() => ctx.activeIndex === menuCtx.index)

/**
 * Before the menu indexes resolve from the DOM, the target stays focusable so keyboard
 * users can always enter the menubar.
 */
const isUnresolvedTabStop = computed(() => menuCtx.index === -1 && !isDisabled.value)

function moveToAdjacent(direction: 1 | -1) {
  const nextIndex = ctx.getAdjacentIndex(menuCtx.index, direction)
  ctx.setActiveIndex(nextIndex)
  ctx.focusTarget(nextIndex)

  if (ctx.openIndex !== null) {
    ctx.openMenu(nextIndex, 'click')
  }
}

function openAndFocusItem(position: 'first' | 'last') {
  ctx.openMenu(menuCtx.index, 'click')
  ctx.setActiveIndex(menuCtx.index)
  ctx.focusMenuItem(menuCtx.index, position)
}

/** Jumps to the next target whose label starts with the typed character. */
function typeAhead(event: KeyboardEvent) {
  const targets = ctx.getTargets()

  if (targets.length === 0) {
    return
  }

  const char = event.key.toLowerCase()

  for (let offset = 1; offset <= targets.length; offset += 1) {
    const index = (menuCtx.index + offset) % targets.length
    const node = targets[index]

    if (
      node &&
      !node.disabled &&
      !node.hasAttribute('data-disabled') &&
      getTargetLabel(node).startsWith(char)
    ) {
      event.preventDefault()
      ctx.setActiveIndex(index)
      node.focus()

      if (ctx.openIndex !== null) {
        ctx.openMenu(index, 'click')
      }

      break
    }
  }
}

function onClick(event: MouseEvent) {
  runComposed((attrs as any).onClick, event, () => {
    if (isDisabled.value) {
      return
    }

    if (ctx.openIndex === menuCtx.index && ctx.getOpenSource() !== 'hover') {
      ctx.closeMenu()
    } else {
      ctx.openMenu(menuCtx.index, 'click')
      ctx.setActiveIndex(menuCtx.index)
    }
  })
}

function onMouseenter(event: MouseEvent) {
  runComposed((attrs as any).onMouseenter, event, () => {
    if (isDisabled.value) {
      return
    }

    ctx.cancelClose()

    if (ctx.trigger === 'hover') {
      ctx.openMenu(menuCtx.index, 'hover')
      ctx.setActiveIndex(menuCtx.index)
    } else if (ctx.openIndex !== null && ctx.openIndex !== menuCtx.index) {
      // Hover-switching with `trigger="click"` keeps 'click' as the open source, so the
      // next click on the target closes the menu — the desktop application pattern.
      ctx.openMenu(menuCtx.index, 'click')
      ctx.setActiveIndex(menuCtx.index)
    }
  })
}

function onMouseleave(event: MouseEvent) {
  runComposed((attrs as any).onMouseleave, event, () => {
    if (ctx.trigger === 'hover') {
      ctx.scheduleClose()
    }
  })
}

function onFocus(event: FocusEvent) {
  runComposed((attrs as any).onFocus, event, () => ctx.setActiveIndex(menuCtx.index))
}

function onKeydown(event: KeyboardEvent) {
  runComposed((attrs as any).onKeydown, event, () => {
    if (isDisabled.value) {
      return
    }

    const forwardKey = dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    const backKey = dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft'

    if (event.key === forwardKey) {
      event.preventDefault()
      moveToAdjacent(1)
    } else if (event.key === backKey) {
      event.preventDefault()
      moveToAdjacent(-1)
    } else if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openAndFocusItem('first')
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      openAndFocusItem('last')
    } else if (event.key === 'Home') {
      event.preventDefault()
      const enabled = ctx.getEnabledIndexes()

      if (enabled.length > 0) {
        ctx.setActiveIndex(enabled[0])
        ctx.focusTarget(enabled[0])
      }
    } else if (event.key === 'End') {
      event.preventDefault()
      const enabled = ctx.getEnabledIndexes()

      if (enabled.length > 0) {
        const last = enabled[enabled.length - 1]
        ctx.setActiveIndex(last)
        ctx.focusTarget(last)
      }
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      if (menuCtx.opened) {
        ctx.closeMenu()
      }
    } else if (isPrintableKey(event)) {
      typeAhead(event)
    }
  })
}

/**
 * The handlers above invoke the consumer's listeners through `runComposed`, and
 * `class`/`style` are fed to `getStyles`, so all of them are dropped from the spread.
 */
const forwardedAttrs = computed(() =>
  omitAttrs(attrs, [
    'onClick',
    'onMouseenter',
    'onMouseleave',
    'onFocus',
    'onKeydown',
    'class',
    'style',
  ]),
)

const targetStyles = computed(() =>
  ctx.getStyles('target', { className: (attrs as any).class, style: (attrs as any).style }),
)
</script>

<template>
  <PopoverTarget :ref-prop="props.refProp" popup-type="menu">
    <UnstyledButton
      v-bind="{ ...forwardedAttrs, ...targetStyles }"
      :unstyled="ctx.unstyled"
      role="menuitem"
      :tabindex="isActive || isUnresolvedTabStop ? 0 : -1"
      :disabled="props.disabled"
      data-menubar-target=""
      :data-menubar-id="menuCtx.id"
      :data-disabled="hasDataDisabled || undefined"
      :data-expanded="menuCtx.opened || undefined"
      :data-mantine-stop-propagation="menuCtx.opened || undefined"
      @click="onClick"
      @mouseenter="onMouseenter"
      @mouseleave="onMouseleave"
      @focus="onFocus"
      @keydown="onKeydown"
    >
      <slot />
    </UnstyledButton>
  </PopoverTarget>
</template>
