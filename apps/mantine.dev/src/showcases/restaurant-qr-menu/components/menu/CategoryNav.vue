<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import {
  ActionIcon,
  FloatingIndicator,
  Indicator,
  Tooltip,
  UnstyledButton,
} from '@mantine-vue/core'
import { PhMagnifyingGlass, PhSlidersHorizontal } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import type { MenuSection } from '../../domain/menu-query'

/**
 * Sticky, horizontally scrolling category navigation. The active category follows
 * the scroll position and the floating indicator animates between categories.
 */
const props = defineProps<{
  sections: MenuSection[]
  active: string | null
  sectionId: (id: string) => string
}>()
const emit = defineEmits<{ select: [categoryId: string]; search: []; filters: [] }>()

const { t, layout, localize, menuFilters, i18n, format } = useQrMenu()
const variant = computed(() => layout.value.categoryNav)

const scroller = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)
const buttons = new Map<string, HTMLElement>()
const activeButton = ref<HTMLElement | null>(null)

const setButton = (id: string, element: unknown) => {
  const node = (element as { $el?: HTMLElement } | null)?.$el ?? (element as HTMLElement | null)
  if (node) {
    buttons.set(id, node)
  } else {
    buttons.delete(id)
  }
}

/** Keeps the active category visible inside the horizontal scroller (RTL aware). */
const revealActive = () => {
  const button = props.active ? buttons.get(props.sectionId(props.active)) : null
  activeButton.value = button ?? null
  const container = scroller.value
  if (!button || !container) {
    return
  }
  const centered = button.offsetLeft - (container.clientWidth - button.offsetWidth) / 2
  const left =
    i18n.dir.value === 'rtl' ? centered - (container.scrollWidth - container.clientWidth) : centered
  container.scrollTo({ left, behavior: 'smooth' })
}

watch(
  () => [props.active, props.sections.length, variant.value, i18n.dir.value],
  () => nextTick(revealActive),
  { immediate: true },
)
</script>

<template>
  <nav :class="$style.nav" :data-variant="variant" :aria-label="t('menu.categories')">
    <div :class="$style.inner">
      <Tooltip :label="t('header.search')">
        <ActionIcon
          variant="default"
          radius="xl"
          size="lg"
          :aria-label="t('header.search')"
          @click="emit('search')"
        >
          <PhMagnifyingGlass :size="18" />
        </ActionIcon>
      </Tooltip>

      <div ref="scroller" :class="$style.scroller">
        <div ref="list" :class="$style.list">
          <UnstyledButton
            v-for="section in sections"
            :key="section.category.id"
            :ref="(element) => setButton(sectionId(section.category.id), element)"
            :class="$style.item"
            :data-active="active === section.category.id || undefined"
            :aria-current="active === section.category.id ? 'location' : undefined"
            @click="emit('select', section.category.id)"
          >
            {{ localize(section.category.name) }}
            <span v-if="variant !== 'text'" :class="$style.count">{{
              format.number(section.products.length)
            }}</span>
          </UnstyledButton>
          <FloatingIndicator
            v-if="variant !== 'text'"
            :target="activeButton"
            :parent="list"
            :class="$style.indicator"
          />
        </div>
      </div>

      <Indicator
        :label="format.number(menuFilters.activeCount.value)"
        :disabled="menuFilters.activeCount.value === 0"
        :size="16"
        :offset="4"
      >
        <ActionIcon
          :variant="menuFilters.activeCount.value ? 'light' : 'default'"
          radius="xl"
          size="lg"
          :aria-label="`${t('filters.title')}${menuFilters.activeCount.value ? ` (${t('filters.active', { count: menuFilters.activeCount.value })})` : ''}`"
          @click="emit('filters')"
        >
          <PhSlidersHorizontal :size="18" />
        </ActionIcon>
      </Indicator>
    </div>
  </nav>
</template>

<style module>
.nav {
  position: sticky;
  top: var(--qrm-header-height);
  z-index: 90;
  height: var(--qrm-nav-height);
  background-color: alpha(var(--mantine-color-body), 0.92);
  backdrop-filter: saturate(1.6) blur(10px);
  border-bottom: 1px solid var(--mantine-color-default-border);
}

.inner {
  display: flex;
  align-items: center;
  gap: var(--mantine-spacing-xs);
  height: 100%;
  max-width: var(--qrm-content-width);
  margin-inline: auto;
  padding-inline: var(--mantine-spacing-md);
}

.scroller {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
  mask-image: linear-gradient(90deg, transparent 0, #000 12px, #000 calc(100% - 12px), transparent);

  &::-webkit-scrollbar {
    display: none;
  }
}

.list {
  position: relative;
  display: flex;
  gap: 4px;
  width: max-content;
  padding: 6px 8px;
}

.item {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding-inline: 14px;
  border-radius: var(--mantine-radius-xl);
  font-size: var(--mantine-font-size-sm);
  font-weight: 600;
  white-space: nowrap;
  color: var(--mantine-color-dimmed);
  transition: color 150ms ease;

  &[data-active] {
    color: var(--mantine-color-text);
  }

  &:focus-visible {
    outline: 2px solid var(--mantine-primary-color-filled);
    outline-offset: -2px;
  }
}

.count {
  font-size: 11px;
  font-weight: 500;
  opacity: 0.7;
}

.indicator {
  z-index: 0;
}

.nav[data-variant='pills'] {
  .item[data-active] {
    color: var(--mantine-primary-color-contrast);
  }

  .indicator {
    border-radius: var(--mantine-radius-xl);
    background-color: var(--mantine-primary-color-filled);
    box-shadow: var(--mantine-shadow-sm);
  }
}

.nav[data-variant='underline'] {
  .item {
    border-radius: 0;
    padding-inline: 10px;
  }

  .item[data-active] {
    color: var(--mantine-primary-color-filled);
  }

  .indicator {
    border-radius: 0;
    background: transparent;
    border-bottom: 3px solid var(--mantine-primary-color-filled);
  }
}

.nav[data-variant='text'] {
  .item {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 11px;
    padding-inline: 10px;
  }

  .item[data-active] {
    color: var(--mantine-primary-color-filled);
    text-decoration: underline;
    text-underline-offset: 6px;
  }
}
</style>
