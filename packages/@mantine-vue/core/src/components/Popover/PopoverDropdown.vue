<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useFocusReturn } from '@mantine-vue/hooks'
import { Box, omitAttrs, rem, useDirection } from '../../core'
import { FloatingArrow, getArrowMergeDropdownStyles } from '../../utils/Floating'
import { FocusTrap } from '../FocusTrap'
import { OptionalPortal } from '../Portal'
import { Transition as MantineTransitionComponent } from '../Transition'
import { usePopoverContext } from './Popover.context'
import { call } from './popover-utils'
import type { PopoverDropdownSlots } from './Popover.types'

defineOptions({
  name: 'PopoverDropdown',
  inheritAttrs: false,
})

defineSlots<PopoverDropdownSlots>()

const attrs = useAttrs()
const ctx = usePopoverContext()
const { dir } = useDirection()

const returnFocus = useFocusReturn({
  opened: () => ctx.opened,
  shouldReturnFocus: () => ctx.returnFocus,
})

/** The roles are opt-out because components like `Menu` supply their own. */
const roleAttrs = computed(() =>
  ctx.withRoles
    ? {
        role: 'dialog',
        tabindex: -1,
        id: ctx.getDropdownId(),
        'aria-labelledby': ctx.getTargetId(),
      }
    : {},
)

/**
 * The consumer handler is chained explicitly below, so it must not also reach the
 * element through the fallthrough attributes or it would fire twice.
 */
const dropdownAttrs = computed(() => omitAttrs(attrs, ['onKeydownCapture']))

const dropdownStyles = computed(() =>
  ctx.getStyles('dropdown', { className: attrs.class, style: attrs.style }),
)

/** `merge` draws the arrow as part of the dropdown body, which needs extra styles. */
const mergeStyles = computed(() =>
  ctx.arrowPosition === 'merge' && ctx.withArrow
    ? getArrowMergeDropdownStyles({ position: ctx.placement, dir: dir.value })
    : null,
)

const dropdownStyle = computed(() => (transitionStyle: any) => [
  ctx.getStyles('dropdown').style,
  transitionStyle,
  mergeStyles.value,
  {
    zIndex: ctx.zIndex,
    top: `${ctx.y}px`,
    left: `${ctx.x}px`,
    // `target` is resolved from the measured target width rather than by CSS, because
    // the dropdown is usually portalled out of the target's containing block.
    width:
      ctx.width === 'target'
        ? ctx.targetWidth === undefined
          ? undefined
          : `${ctx.targetWidth}px`
        : rem(ctx.width as any),
  },
  attrs.style,
])

/**
 * Capture phase: the dropdown may contain nested widgets that also handle `Escape`, and
 * the popover has to see it first.
 */
function onKeydownCapture(event: KeyboardEvent) {
  call((attrs as any).onKeydownCapture, event)

  if (event.key === 'Escape' && ctx.closeOnEscape) {
    ctx.onClose()
    ctx.onDismiss?.()
    returnFocus()
  }
}
</script>

<template>
  <OptionalPortal v-if="!ctx.disabled" v-bind="ctx.portalProps" :within-portal="ctx.withinPortal">
    <!-- Aliased: a bare `<Transition>` in a template resolves to Vue's built-in. -->
    <MantineTransitionComponent
      v-bind="ctx.transitionProps"
      :mounted="ctx.opened"
      :keep-mounted="ctx.keepMounted"
    >
      <template #default="transitionStyle">
        <FocusTrap :active="ctx.trapFocus && ctx.opened" :inner-ref="ctx.floating">
          <Box
            v-bind="{ ...roleAttrs, ...dropdownAttrs, ...dropdownStyles }"
            :data-position="ctx.placement"
            :data-fixed="ctx.floatingStrategy === 'fixed' || undefined"
            :style="dropdownStyle(transitionStyle)"
            @keydown.capture="onKeydownCapture"
          >
            <slot />
            <FloatingArrow
              :ref="ctx.arrowRef"
              v-bind="ctx.getStyles('arrow')"
              :visible="ctx.withArrow"
              :position="ctx.placement"
              :arrow-size="ctx.arrowSize"
              :arrow-offset="ctx.arrowOffset"
              :arrow-radius="ctx.arrowRadius"
              :arrow-position="ctx.arrowPosition"
              :arrow-x="ctx.arrowX"
              :arrow-y="ctx.arrowY"
            />
          </Box>
        </FocusTrap>
      </template>
    </MantineTransitionComponent>
  </OptionalPortal>
</template>
