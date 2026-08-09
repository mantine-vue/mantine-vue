<script setup lang="ts">
import { computed, onUnmounted, useAttrs } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { Input } from '../Input'
import { useMenuContext } from './Menu.context'
import { call, clearActive, getActiveIndex, menuItems, setActive } from './menu-utils'
import type { MenuSearchProps } from './Menu.types'

defineOptions({
  name: 'MenuSearch',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MenuSearchProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  clearSearchOnClose: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const attrs = useAttrs()
const ctx = useMenuContext()

const [value, setValue] = useUncontrolled<string>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: '',
  onChange: (nextValue) => {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
})

/** Tells the menu a search field exists, which changes the dropdown's key handling. */
const unregister = ctx.registerSearch()

ctx.setSearchExitClear(
  props.clearSearchOnClose
    ? () => {
        clearActive(document.querySelector('[data-menu-dropdown]'))
        setValue('')
      }
    : null,
)

onUnmounted(() => {
  unregister()
  ctx.setSearchExitClear(null)
})

const searchStyles = computed(() =>
  ctx.getStyles('search', { className: attrs.class, style: attrs.style }),
)

/**
 * The search styles have to be merged into the `input` selector of the underlying
 * `Input` rather than applied to its root, so `class`, `style`, `classNames` and
 * `styles` are all consumed here. The handlers are chained explicitly below.
 */
const forwarded = computed(() => {
  const result = { ...attrs } as Record<string, any>
  delete result.class
  delete result.style
  delete result.classNames
  delete result.styles
  delete result.onKeydown
  delete result.onChange
  delete result.onInput
  return result
})

const inputClassNames = computed(() => {
  const consumer = (attrs as any).classNames as Record<string, any> | undefined

  return {
    ...consumer,
    // Joined rather than left as an array: `ClassNames` values are class
    // strings, and the rendered `class` attribute is identical either way.
    input: [searchStyles.value.class, consumer?.input].filter(Boolean).join(' '),
  }
})

const inputStyles = computed(() => {
  const consumer = (attrs as any).styles as Record<string, any> | undefined

  return {
    ...consumer,
    input: {
      ...searchStyles.value.style,
      ...consumer?.input,
    },
  }
})

function onInput(event: Event) {
  call((attrs as any).onInput, event)
  setValue((event.currentTarget as HTMLInputElement).value)
  // The previous highlight refers to an item the new query may have filtered out.
  clearActive((event.currentTarget as HTMLElement).closest('[data-menu-dropdown]'))
}

/**
 * The field keeps focus while the highlight moves, so the items are marked active with
 * an attribute instead of being focused. `Enter` then acts on the marked one.
 */
function onKeydown(event: KeyboardEvent) {
  call((attrs as any).onKeydown, event)

  if (event.defaultPrevented) {
    return
  }

  const root = (event.currentTarget as HTMLElement).closest('[data-menu-dropdown]')
  const items = menuItems(root)
  const current = getActiveIndex(items)

  if (event.key === 'ArrowDown') {
    event.preventDefault()

    if (items.length > 0) {
      const next = current >= items.length - 1 ? (ctx.loop ? 0 : current) : current + 1
      setActive(items[next] ?? null, root)
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()

    if (items.length > 0) {
      // Nothing highlighted yet: ArrowUp enters the list from the bottom.
      const next =
        current <= 0
          ? current === -1
            ? items.length - 1
            : ctx.loop
              ? items.length - 1
              : 0
          : current - 1
      setActive(items[next] ?? null, root)
    }
  } else if (event.key === 'Home') {
    event.preventDefault()
    setActive(items[0] ?? null, root)
  } else if (event.key === 'End') {
    event.preventDefault()
    setActive(items.at(-1) ?? null, root)
  } else if (event.key === 'Enter') {
    // An IME composition ends with Enter; acting on it would eat the candidate.
    if ((event as any).isComposing || (event as any).keyCode === 229) {
      return
    }

    const target = items[current]

    if (target) {
      event.preventDefault()

      // A submenu item opens rather than activates, which is what ArrowRight does.
      if (target.hasAttribute('data-sub-menu-item')) {
        target.focus()
        target.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
      } else {
        target.click()
      }
    }
  }
}
</script>

<template>
  <Input
    v-bind="forwarded"
    :model-value="value"
    type="search"
    data-autofocus=""
    data-mantine-stop-propagation=""
    __static-selector="Menu"
    :class-names="inputClassNames"
    :styles="inputStyles"
    @input="onInput"
    @keydown="onKeydown"
  />
</template>
