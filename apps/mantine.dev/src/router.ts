import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { defineAsyncComponent, defineComponent, h } from 'vue'
import { mdxComponents } from './mdx-components'

function mdxRoute(loader: () => Promise<unknown>) {
  const Content = defineAsyncComponent(loader as never)
  return defineComponent({
    name: 'MdxRoute',
    setup() {
      return () => h(Content, { components: mdxComponents })
    },
  })
}

function getHashTarget(hash: string) {
  const id = decodeURIComponent(hash.slice(1))
  const escapedId = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(id) : id

  return document.getElementById(id) ?? document.querySelector(`#${escapedId}`)
}

function waitForHashTarget(hash: string) {
  return new Promise<HTMLElement | null>((resolve) => {
    let attempts = 0
    const find = () => {
      const target = getHashTarget(hash)

      if (target || attempts >= 10) {
        resolve(target as HTMLElement | null)
      } else {
        attempts += 1
        requestAnimationFrame(find)
      }
    }

    find()
  })
}

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/getting-started' },
  {
    path: '/getting-started',
    name: 'getting-started',
    component: mdxRoute(() => import('./pages/getting-started.mdx')),
  },
  {
    path: '/guides/vite',
    name: 'guide-vite',
    component: mdxRoute(() => import('./pages/guides/vite.mdx')),
  },
  {
    path: '/guides/nuxt',
    name: 'guide-nuxt',
    component: mdxRoute(() => import('./pages/guides/nuxt.mdx')),
  },
  {
    path: '/guides/vue-router',
    name: 'guide-vue-router',
    component: mdxRoute(() => import('./pages/guides/vue-router.mdx')),
  },
  {
    path: '/guides/without-framework',
    name: 'guide-without-framework',
    component: mdxRoute(() => import('./pages/guides/without-framework.mdx')),
  },
  {
    path: '/app-shell',
    name: 'app-shell-examples',
    component: () => import('./app-shell-examples/AppShellPage.vue'),
  },
  {
    path: '/colors-generator',
    name: 'colors-generator',
    component: () => import('./pages/ColorsGeneratorPage.vue'),
  },
  {
    path: '/core/button',
    name: 'core-button',
    component: mdxRoute(() => import('./pages/core/button.mdx')),
  },
  {
    path: '/core/app-shell',
    name: 'core-app-shell',
    component: mdxRoute(() => import('./pages/core/app-shell.mdx')),
  },
  {
    path: '/core/autocomplete',
    name: 'core-autocomplete',
    component: mdxRoute(() => import('./pages/core/autocomplete.mdx')),
  },
  {
    path: '/core/combobox',
    name: 'core-combobox',
    component: mdxRoute(() => import('./pages/core/combobox.mdx')),
  },
  {
    path: '/core/multi-select',
    name: 'core-multi-select',
    component: mdxRoute(() => import('./pages/core/multi-select.mdx')),
  },
  {
    path: '/core/pill',
    name: 'core-pill',
    component: mdxRoute(() => import('./pages/core/pill.mdx')),
  },
  {
    path: '/core/pills-input',
    name: 'core-pills-input',
    component: mdxRoute(() => import('./pages/core/pills-input.mdx')),
  },
  {
    path: '/core/select',
    name: 'core-select',
    component: mdxRoute(() => import('./pages/core/select.mdx')),
  },
  {
    path: '/core/tags-input',
    name: 'core-tags-input',
    component: mdxRoute(() => import('./pages/core/tags-input.mdx')),
  },
  {
    path: '/core/tree-select',
    name: 'core-tree-select',
    component: mdxRoute(() => import('./pages/core/tree-select.mdx')),
  },
  {
    path: '/core/drawer',
    name: 'core-drawer',
    component: mdxRoute(() => import('./pages/core/drawer.mdx')),
  },
  {
    path: '/core/floating-indicator',
    name: 'core-floating-indicator',
    component: mdxRoute(() => import('./pages/core/floating-indicator.mdx')),
  },
  {
    path: '/core/floating-window',
    name: 'core-floating-window',
    component: mdxRoute(() => import('./pages/core/floating-window.mdx')),
  },
  {
    path: '/core/popover',
    name: 'core-popover',
    component: mdxRoute(() => import('./pages/core/popover.mdx')),
  },
  {
    path: '/core/tooltip',
    name: 'core-tooltip',
    component: mdxRoute(() => import('./pages/core/tooltip.mdx')),
  },
  {
    path: '/core/hover-card',
    name: 'core-hover-card',
    component: mdxRoute(() => import('./pages/core/hover-card.mdx')),
  },
  {
    path: '/core/overlay',
    name: 'core-overlay',
    component: mdxRoute(() => import('./pages/core/overlay.mdx')),
  },
  {
    path: '/core/modal',
    name: 'core-modal',
    component: mdxRoute(() => import('./pages/core/modal.mdx')),
  },
  {
    path: '/core/loading-overlay',
    name: 'core-loading-overlay',
    component: mdxRoute(() => import('./pages/core/loading-overlay.mdx')),
  },
  {
    path: '/core/menu',
    name: 'core-menu',
    component: mdxRoute(() => import('./pages/core/menu.mdx')),
  },
  {
    path: '/core/affix',
    name: 'core-affix',
    component: mdxRoute(() => import('./pages/core/affix.mdx')),
  },
  {
    path: '/core/dialog',
    name: 'core-dialog',
    component: mdxRoute(() => import('./pages/core/dialog.mdx')),
  },
  {
    path: '/core/segmented-control',
    name: 'core-segmented-control',
    component: mdxRoute(() => import('./pages/core/segmented-control.mdx')),
  },
  {
    path: '/core/switch',
    name: 'core-switch',
    component: mdxRoute(() => import('./pages/core/switch.mdx')),
  },
  {
    path: '/core/space',
    name: 'core-space',
    component: mdxRoute(() => import('./pages/core/space.mdx')),
  },
  {
    path: '/core/stack',
    name: 'core-stack',
    component: mdxRoute(() => import('./pages/core/stack.mdx')),
  },
  {
    path: '/core/flex',
    name: 'core-flex',
    component: mdxRoute(() => import('./pages/core/flex.mdx')),
  },
  {
    path: '/core/grid',
    name: 'core-grid',
    component: mdxRoute(() => import('./pages/core/grid.mdx')),
  },
  {
    path: '/core/group',
    name: 'core-group',
    component: mdxRoute(() => import('./pages/core/group.mdx')),
  },
  {
    path: '/core/simple-grid',
    name: 'core-simple-grid',
    component: mdxRoute(() => import('./pages/core/simple-grid.mdx')),
  },
  {
    path: '/core/close-button',
    name: 'core-close-button',
    component: mdxRoute(() => import('./pages/core/close-button.mdx')),
  },
  {
    path: '/core/copy-button',
    name: 'core-copy-button',
    component: mdxRoute(() => import('./pages/core/copy-button.mdx')),
  },
  {
    path: '/core/burger',
    name: 'core-burger',
    component: mdxRoute(() => import('./pages/core/burger.mdx')),
  },
  {
    path: '/core/checkbox',
    name: 'core-checkbox',
    component: mdxRoute(() => import('./pages/core/checkbox.mdx')),
  },
  {
    path: '/core/chip',
    name: 'core-chip',
    component: mdxRoute(() => import('./pages/core/chip.mdx')),
  },
  {
    path: '/core/color-input',
    name: 'core-color-input',
    component: mdxRoute(() => import('./pages/core/color-input.mdx')),
  },
  {
    path: '/core/color-picker',
    name: 'core-color-picker',
    component: mdxRoute(() => import('./pages/core/color-picker.mdx')),
  },
  {
    path: '/core/fieldset',
    name: 'core-fieldset',
    component: mdxRoute(() => import('./pages/core/fieldset.mdx')),
  },
  {
    path: '/core/file-input',
    name: 'core-file-input',
    component: mdxRoute(() => import('./pages/core/file-input.mdx')),
  },
  {
    path: '/core/hue-slider',
    name: 'core-hue-slider',
    component: mdxRoute(() => import('./pages/core/hue-slider.mdx')),
  },
  {
    path: '/core/input',
    name: 'core-input',
    component: mdxRoute(() => import('./pages/core/input.mdx')),
  },
  {
    path: '/core/json-input',
    name: 'core-json-input',
    component: mdxRoute(() => import('./pages/core/json-input.mdx')),
  },
  {
    path: '/core/mask-input',
    name: 'core-mask-input',
    component: mdxRoute(() => import('./pages/core/mask-input.mdx')),
  },
  {
    path: '/core/native-select',
    name: 'core-native-select',
    component: mdxRoute(() => import('./pages/core/native-select.mdx')),
  },
  {
    path: '/core/number-input',
    name: 'core-number-input',
    component: mdxRoute(() => import('./pages/core/number-input.mdx')),
  },
  {
    path: '/core/password-input',
    name: 'core-password-input',
    component: mdxRoute(() => import('./pages/core/password-input.mdx')),
  },
  {
    path: '/core/pin-input',
    name: 'core-pin-input',
    component: mdxRoute(() => import('./pages/core/pin-input.mdx')),
  },
  {
    path: '/core/radio',
    name: 'core-radio',
    component: mdxRoute(() => import('./pages/core/radio.mdx')),
  },
  {
    path: '/core/range-slider',
    name: 'core-range-slider',
    component: mdxRoute(() => import('./pages/core/range-slider.mdx')),
  },
  {
    path: '/core/rating',
    name: 'core-rating',
    component: mdxRoute(() => import('./pages/core/rating.mdx')),
  },
  {
    path: '/core/slider',
    name: 'core-slider',
    component: mdxRoute(() => import('./pages/core/slider.mdx')),
  },
  {
    path: '/core/textarea',
    name: 'core-textarea',
    component: mdxRoute(() => import('./pages/core/textarea.mdx')),
  },
  {
    path: '/core/text-input',
    name: 'core-text-input',
    component: mdxRoute(() => import('./pages/core/text-input.mdx')),
  },
  {
    path: '/core/breadcrumbs',
    name: 'core-breadcrumbs',
    component: mdxRoute(() => import('./pages/core/breadcrumbs.mdx')),
  },
  {
    path: '/core/alert',
    name: 'core-alert',
    component: mdxRoute(() => import('./pages/core/alert.mdx')),
  },
  {
    path: '/core/skeleton',
    name: 'core-skeleton',
    component: mdxRoute(() => import('./pages/core/skeleton.mdx')),
  },
  {
    path: '/core/kbd',
    name: 'core-kbd',
    component: mdxRoute(() => import('./pages/core/kbd.mdx')),
  },
  {
    path: '/core/mark',
    name: 'core-mark',
    component: mdxRoute(() => import('./pages/core/mark.mdx')),
  },
  {
    path: '/core/highlight',
    name: 'core-highlight',
    component: mdxRoute(() => import('./pages/core/highlight.mdx')),
  },
  {
    path: '/core/blockquote',
    name: 'core-blockquote',
    component: mdxRoute(() => import('./pages/core/blockquote.mdx')),
  },
  {
    path: '/core/theme-icon',
    name: 'core-theme-icon',
    component: mdxRoute(() => import('./pages/core/theme-icon.mdx')),
  },
  {
    path: '/core/number-formatter',
    name: 'core-number-formatter',
    component: mdxRoute(() => import('./pages/core/number-formatter.mdx')),
  },
  {
    path: '/core/avatar',
    name: 'core-avatar',
    component: mdxRoute(() => import('./pages/core/avatar.mdx')),
  },
  {
    path: '/core/anchor',
    name: 'core-anchor',
    component: mdxRoute(() => import('./pages/core/anchor.mdx')),
  },
  {
    path: '/core/nav-link',
    name: 'core-nav-link',
    component: mdxRoute(() => import('./pages/core/nav-link.mdx')),
  },
  {
    path: '/core/splitter',
    name: 'core-splitter',
    component: mdxRoute(() => import('./pages/core/splitter.mdx')),
  },
  {
    path: '/core/aspect-ratio',
    name: 'core-aspect-ratio',
    component: mdxRoute(() => import('./pages/core/aspect-ratio.mdx')),
  },
  {
    path: '/core/center',
    name: 'core-center',
    component: mdxRoute(() => import('./pages/core/center.mdx')),
  },
  {
    path: '/core/alpha-slider',
    name: 'core-alpha-slider',
    component: mdxRoute(() => import('./pages/core/alpha-slider.mdx')),
  },
  {
    path: '/core/file-button',
    name: 'core-file-button',
    component: mdxRoute(() => import('./pages/core/file-button.mdx')),
  },
  {
    path: '/core/unstyled-button',
    name: 'core-unstyled-button',
    component: mdxRoute(() => import('./pages/core/unstyled-button.mdx')),
  },
  {
    path: '/core/loader',
    name: 'core-loader',
    component: mdxRoute(() => import('./pages/core/loader.mdx')),
  },
  {
    path: '/core/notification',
    name: 'core-notification',
    component: mdxRoute(() => import('./pages/core/notification.mdx')),
  },
  {
    path: '/core/progress',
    name: 'core-progress',
    component: mdxRoute(() => import('./pages/core/progress.mdx')),
  },
  {
    path: '/core/ring-progress',
    name: 'core-ring-progress',
    component: mdxRoute(() => import('./pages/core/ring-progress.mdx')),
  },
  {
    path: '/core/semi-circle-progress',
    name: 'core-semi-circle-progress',
    component: mdxRoute(() => import('./pages/core/semi-circle-progress.mdx')),
  },
  {
    path: '/core/background-image',
    name: 'core-background-image',
    component: mdxRoute(() => import('./pages/core/background-image.mdx')),
  },
  {
    path: '/core/badge',
    name: 'core-badge',
    component: mdxRoute(() => import('./pages/core/badge.mdx')),
  },
  {
    path: '/core/timeline',
    name: 'core-timeline',
    component: mdxRoute(() => import('./pages/core/timeline.mdx')),
  },
  {
    path: '/core/indicator',
    name: 'core-indicator',
    component: mdxRoute(() => import('./pages/core/indicator.mdx')),
  },
  {
    path: '/core/image',
    name: 'core-image',
    component: mdxRoute(() => import('./pages/core/image.mdx')),
  },
  {
    path: '/core/color-swatch',
    name: 'core-color-swatch',
    component: mdxRoute(() => import('./pages/core/color-swatch.mdx')),
  },
  {
    path: '/core/spoiler',
    name: 'core-spoiler',
    component: mdxRoute(() => import('./pages/core/spoiler.mdx')),
  },
  {
    path: '/core/rolling-number',
    name: 'core-rolling-number',
    component: mdxRoute(() => import('./pages/core/rolling-number.mdx')),
  },
  {
    path: '/core/overflow-list',
    name: 'core-overflow-list',
    component: mdxRoute(() => import('./pages/core/overflow-list.mdx')),
  },
  {
    path: '/core/card',
    name: 'core-card',
    component: mdxRoute(() => import('./pages/core/card.mdx')),
  },
  {
    path: '/core/accordion',
    name: 'core-accordion',
    component: mdxRoute(() => import('./pages/core/accordion.mdx')),
  },
  {
    path: '/core/divider',
    name: 'core-divider',
    component: mdxRoute(() => import('./pages/core/divider.mdx')),
  },
  {
    path: '/core/paper',
    name: 'core-paper',
    component: mdxRoute(() => import('./pages/core/paper.mdx')),
  },
  {
    path: '/core/collapse',
    name: 'core-collapse',
    component: mdxRoute(() => import('./pages/core/collapse.mdx')),
  },
  {
    path: '/core/marquee',
    name: 'core-marquee',
    component: mdxRoute(() => import('./pages/core/marquee.mdx')),
  },
  {
    path: '/core/scroll-area',
    name: 'core-scroll-area',
    component: mdxRoute(() => import('./pages/core/scroll-area.mdx')),
  },
  {
    path: '/core/scroller',
    name: 'core-scroller',
    component: mdxRoute(() => import('./pages/core/scroller.mdx')),
  },
  {
    path: '/core/visually-hidden',
    name: 'core-visually-hidden',
    component: mdxRoute(() => import('./pages/core/visually-hidden.mdx')),
  },
  {
    path: '/core/box',
    name: 'core-box',
    component: mdxRoute(() => import('./pages/core/box.mdx')),
  },
  {
    path: '/core/title',
    name: 'core-title',
    component: mdxRoute(() => import('./pages/core/title.mdx')),
  },
  {
    path: '/core/text',
    name: 'core-text',
    component: mdxRoute(() => import('./pages/core/text.mdx')),
  },
  {
    path: '/core/list',
    name: 'core-list',
    component: mdxRoute(() => import('./pages/core/list.mdx')),
  },
  {
    path: '/core/code',
    name: 'core-code',
    component: mdxRoute(() => import('./pages/core/code.mdx')),
  },
  {
    path: '/core/table',
    name: 'core-table',
    component: mdxRoute(() => import('./pages/core/table.mdx')),
  },
  {
    path: '/core/stepper',
    name: 'core-stepper',
    component: mdxRoute(() => import('./pages/core/stepper.mdx')),
  },
  {
    path: '/core/pagination',
    name: 'core-pagination',
    component: mdxRoute(() => import('./pages/core/pagination.mdx')),
  },
  {
    path: '/core/table-of-contents',
    name: 'core-table-of-contents',
    component: mdxRoute(() => import('./pages/core/table-of-contents.mdx')),
  },
  {
    path: '/core/tabs',
    name: 'core-tabs',
    component: mdxRoute(() => import('./pages/core/tabs.mdx')),
  },
  {
    path: '/core/tree',
    name: 'core-tree',
    component: mdxRoute(() => import('./pages/core/tree.mdx')),
  },
  {
    path: '/core/container',
    name: 'core-container',
    component: mdxRoute(() => import('./pages/core/container.mdx')),
  },
  {
    path: '/core/action-icon',
    name: 'core-action-icon',
    component: mdxRoute(() => import('./pages/core/action-icon.mdx')),
  },
  {
    path: '/core/focus-trap',
    name: 'core-focus-trap',
    component: mdxRoute(() => import('./pages/core/focus-trap.mdx')),
  },
  {
    path: '/core/portal',
    name: 'core-portal',
    component: mdxRoute(() => import('./pages/core/portal.mdx')),
  },
  {
    path: '/core/transition',
    name: 'core-transition',
    component: mdxRoute(() => import('./pages/core/transition.mdx')),
  },
  {
    path: '/core/angle-slider',
    name: 'core-angle-slider',
    component: mdxRoute(() => import('./pages/core/angle-slider.mdx')),
  },
  {
    path: '/x/nprogress',
    name: 'x-nprogress',
    component: mdxRoute(() => import('./pages/x/nprogress.mdx')),
  },
  {
    path: '/x/notifications',
    name: 'x-notifications',
    component: mdxRoute(() => import('./pages/x/notifications.mdx')),
  },
  {
    path: '/x/spotlight',
    name: 'x-spotlight',
    component: mdxRoute(() => import('./pages/x/spotlight.mdx')),
  },
  {
    path: '/x/modals',
    name: 'x-modals',
    component: mdxRoute(() => import('./pages/x/modals.mdx')),
  },
  {
    path: '/x/dropzone',
    name: 'x-dropzone',
    component: mdxRoute(() => import('./pages/x/dropzone.mdx')),
  },
  {
    path: '/x/carousel',
    name: 'x-carousel',
    component: mdxRoute(() => import('./pages/x/carousel.mdx')),
  },
  {
    path: '/x/tiptap',
    name: 'x-tiptap',
    component: mdxRoute(() => import('./pages/x/tiptap.mdx')),
  },
  {
    path: '/x/code-highlight',
    name: 'x-code-highlight',
    component: mdxRoute(() => import('./pages/x/code-highlight.mdx')),
  },
  {
    path: '/dates/getting-started',
    name: 'dates-getting-started',
    component: mdxRoute(() => import('./pages/dates/getting-started.mdx')),
  },
  {
    path: '/dates/calendar',
    name: 'dates-calendar',
    component: mdxRoute(() => import('./pages/dates/calendar.mdx')),
  },
  {
    path: '/dates/date-input',
    name: 'dates-date-input',
    component: mdxRoute(() => import('./pages/dates/date-input.mdx')),
  },
  {
    path: '/dates/date-picker',
    name: 'dates-date-picker',
    component: mdxRoute(() => import('./pages/dates/date-picker.mdx')),
  },
  {
    path: '/dates/date-picker-input',
    name: 'dates-date-picker-input',
    component: mdxRoute(() => import('./pages/dates/date-picker-input.mdx')),
  },
  {
    path: '/dates/date-time-picker',
    name: 'dates-date-time-picker',
    component: mdxRoute(() => import('./pages/dates/date-time-picker.mdx')),
  },
  {
    path: '/dates/inline-date-time-picker',
    name: 'dates-inline-date-time-picker',
    component: mdxRoute(() => import('./pages/dates/inline-date-time-picker.mdx')),
  },
  {
    path: '/dates/mini-calendar',
    name: 'dates-mini-calendar',
    component: mdxRoute(() => import('./pages/dates/mini-calendar.mdx')),
  },
  {
    path: '/dates/month-picker',
    name: 'dates-month-picker',
    component: mdxRoute(() => import('./pages/dates/month-picker.mdx')),
  },
  {
    path: '/dates/month-picker-input',
    name: 'dates-month-picker-input',
    component: mdxRoute(() => import('./pages/dates/month-picker-input.mdx')),
  },
  {
    path: '/dates/year-picker',
    name: 'dates-year-picker',
    component: mdxRoute(() => import('./pages/dates/year-picker.mdx')),
  },
  {
    path: '/dates/year-picker-input',
    name: 'dates-year-picker-input',
    component: mdxRoute(() => import('./pages/dates/year-picker-input.mdx')),
  },
  {
    path: '/dates/time-input',
    name: 'dates-time-input',
    component: mdxRoute(() => import('./pages/dates/time-input.mdx')),
  },
  {
    path: '/dates/time-picker',
    name: 'dates-time-picker',
    component: mdxRoute(() => import('./pages/dates/time-picker.mdx')),
  },
  {
    path: '/dates/time-grid',
    name: 'dates-time-grid',
    component: mdxRoute(() => import('./pages/dates/time-grid.mdx')),
  },
  {
    path: '/dates/time-value',
    name: 'dates-time-value',
    component: mdxRoute(() => import('./pages/dates/time-value.mdx')),
  },

  { path: '/:pathMatch(.*)*', redirect: '/getting-started' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  async scrollBehavior(to) {
    if (to.hash) {
      const target = await waitForHashTarget(to.hash)
      return target ? { el: target, top: 80, behavior: 'smooth' } : { top: 0 }
    }
    return { top: 0 }
  },
})
