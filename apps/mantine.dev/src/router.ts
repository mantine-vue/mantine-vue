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
    path: '/browser-support',
    name: 'browser-support',
    component: mdxRoute(() => import('./pages/browser-support.mdx')),
  },
  {
    path: '/contribute',
    name: 'contribute',
    component: mdxRoute(() => import('./pages/contribute.mdx')),
  },
  {
    path: '/about',
    name: 'about',
    component: mdxRoute(() => import('./pages/about.mdx')),
  },
  {
    path: '/support',
    name: 'support',
    component: mdxRoute(() => import('./pages/support.mdx')),
  },
  {
    path: '/guides/storybook',
    name: 'guide-storybook',
    component: mdxRoute(() => import('./pages/guides/storybook.mdx')),
  },
  {
    path: '/guides/typescript',
    name: 'guide-typescript',
    component: mdxRoute(() => import('./pages/guides/typescript.mdx')),
  },
  {
    path: '/guides/javascript',
    name: 'guide-javascript',
    component: mdxRoute(() => import('./pages/guides/javascript.mdx')),
  },
  {
    path: '/guides/jest',
    name: 'guide-jest',
    component: mdxRoute(() => import('./pages/guides/jest.mdx')),
  },
  {
    path: '/guides/vitest',
    name: 'guide-vitest',
    component: mdxRoute(() => import('./pages/guides/vitest.mdx')),
  },
  {
    path: '/guides/oxc-config-mantine',
    name: 'guide-oxc-config-mantine',
    component: mdxRoute(() => import('./pages/guides/oxc-config-mantine.mdx')),
  },
  {
    path: '/guides/icons',
    name: 'guide-icons',
    component: mdxRoute(() => import('./pages/guides/icons.mdx')),
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
    path: '/core/combobox-popover',
    name: 'core-combobox-popover',
    component: mdxRoute(() => import('./pages/core/combobox-popover.mdx')),
  },
  {
    path: '/core/data-list',
    name: 'core-data-list',
    component: mdxRoute(() => import('./pages/core/data-list.mdx')),
  },
  {
    path: '/core/empty-state',
    name: 'core-empty-state',
    component: mdxRoute(() => import('./pages/core/empty-state.mdx')),
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
  { path: '/schedule', redirect: '/schedule/getting-started' },
  {
    path: '/schedule/getting-started',
    name: 'schedule-getting-started',
    component: mdxRoute(() => import('./pages/schedule/getting-started.mdx')),
  },
  {
    path: '/schedule/schedule',
    name: 'schedule-schedule',
    component: mdxRoute(() => import('./pages/schedule/schedule.mdx')),
  },
  {
    path: '/schedule/day-view',
    name: 'schedule-day-view',
    component: mdxRoute(() => import('./pages/schedule/day-view.mdx')),
  },
  {
    path: '/schedule/week-view',
    name: 'schedule-week-view',
    component: mdxRoute(() => import('./pages/schedule/week-view.mdx')),
  },
  {
    path: '/schedule/month-view',
    name: 'schedule-month-view',
    component: mdxRoute(() => import('./pages/schedule/month-view.mdx')),
  },
  {
    path: '/schedule/year-view',
    name: 'schedule-year-view',
    component: mdxRoute(() => import('./pages/schedule/year-view.mdx')),
  },
  {
    path: '/schedule/mobile-month-view',
    name: 'schedule-mobile-month-view',
    component: mdxRoute(() => import('./pages/schedule/mobile-month-view.mdx')),
  },
  {
    path: '/schedule/recurring-events',
    name: 'schedule-recurring-events',
    component: mdxRoute(() => import('./pages/schedule/recurring-events.mdx')),
  },
  {
    path: '/schedule/events-data',
    name: 'schedule-events-data',
    component: mdxRoute(() => import('./pages/schedule/events-data.mdx')),
  },
  {
    path: '/charts/getting-started',
    name: 'charts-getting-started',
    component: mdxRoute(() => import('./pages/charts/getting-started.mdx')),
  },
  {
    path: '/charts/area-chart',
    name: 'charts-area-chart',
    component: mdxRoute(() => import('./pages/charts/area-chart.mdx')),
  },
  {
    path: '/charts/bar-chart',
    name: 'charts-bar-chart',
    component: mdxRoute(() => import('./pages/charts/bar-chart.mdx')),
  },
  {
    path: '/charts/bars-list',
    name: 'charts-bars-list',
    component: mdxRoute(() => import('./pages/charts/bars-list.mdx')),
  },
  {
    path: '/charts/bubble-chart',
    name: 'charts-bubble-chart',
    component: mdxRoute(() => import('./pages/charts/bubble-chart.mdx')),
  },
  {
    path: '/charts/composite-chart',
    name: 'charts-composite-chart',
    component: mdxRoute(() => import('./pages/charts/composite-chart.mdx')),
  },
  {
    path: '/charts/donut-chart',
    name: 'charts-donut-chart',
    component: mdxRoute(() => import('./pages/charts/donut-chart.mdx')),
  },
  {
    path: '/charts/funnel-chart',
    name: 'charts-funnel-chart',
    component: mdxRoute(() => import('./pages/charts/funnel-chart.mdx')),
  },
  {
    path: '/charts/heatmap',
    name: 'charts-heatmap',
    component: mdxRoute(() => import('./pages/charts/heatmap.mdx')),
  },
  {
    path: '/charts/line-chart',
    name: 'charts-line-chart',
    component: mdxRoute(() => import('./pages/charts/line-chart.mdx')),
  },
  {
    path: '/charts/pie-chart',
    name: 'charts-pie-chart',
    component: mdxRoute(() => import('./pages/charts/pie-chart.mdx')),
  },
  {
    path: '/charts/radar-chart',
    name: 'charts-radar-chart',
    component: mdxRoute(() => import('./pages/charts/radar-chart.mdx')),
  },
  {
    path: '/charts/radial-bar-chart',
    name: 'charts-radial-bar-chart',
    component: mdxRoute(() => import('./pages/charts/radial-bar-chart.mdx')),
  },
  {
    path: '/charts/sankey-chart',
    name: 'charts-sankey-chart',
    component: mdxRoute(() => import('./pages/charts/sankey-chart.mdx')),
  },
  {
    path: '/charts/scatter-chart',
    name: 'charts-scatter-chart',
    component: mdxRoute(() => import('./pages/charts/scatter-chart.mdx')),
  },
  {
    path: '/charts/sparkline',
    name: 'charts-sparkline',
    component: mdxRoute(() => import('./pages/charts/sparkline.mdx')),
  },
  {
    path: '/charts/treemap',
    name: 'charts-treemap',
    component: mdxRoute(() => import('./pages/charts/treemap.mdx')),
  },
  { path: '/form', redirect: '/form/use-form' },
  {
    path: '/form/package',
    name: 'form-package',
    component: mdxRoute(() => import('./pages/form/package.mdx')),
  },
  {
    path: '/form/use-form',
    name: 'form-use-form',
    component: mdxRoute(() => import('./pages/form/use-form.mdx')),
  },
  {
    path: '/form/values',
    name: 'form-values',
    component: mdxRoute(() => import('./pages/form/values.mdx')),
  },
  {
    path: '/form/get-input-props',
    name: 'form-get-input-props',
    component: mdxRoute(() => import('./pages/form/get-input-props.mdx')),
  },
  {
    path: '/form/validation',
    name: 'form-validation',
    component: mdxRoute(() => import('./pages/form/validation.mdx')),
  },
  {
    path: '/form/errors',
    name: 'form-errors',
    component: mdxRoute(() => import('./pages/form/errors.mdx')),
  },
  {
    path: '/form/status',
    name: 'form-status',
    component: mdxRoute(() => import('./pages/form/status.mdx')),
  },
  {
    path: '/form/validators',
    name: 'form-validators',
    component: mdxRoute(() => import('./pages/form/validators.mdx')),
  },
  {
    path: '/form/schema-validation',
    name: 'form-schema-validation',
    component: mdxRoute(() => import('./pages/form/schema-validation.mdx')),
  },
  {
    path: '/form/use-field',
    name: 'form-use-field',
    component: mdxRoute(() => import('./pages/form/use-field.mdx')),
  },
  {
    path: '/form/create-form-context',
    name: 'form-create-form-context',
    component: mdxRoute(() => import('./pages/form/create-form-context.mdx')),
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

  {
    path: '/hooks/use-debounced-callback',
    name: 'hooks-use-debounced-callback',
    component: mdxRoute(() => import('./pages/hooks/use-debounced-callback.mdx')),
  },
  {
    path: '/hooks/use-click-outside',
    name: 'hooks-use-click-outside',
    component: mdxRoute(() => import('./pages/hooks/use-click-outside.mdx')),
  },
  {
    path: '/hooks/use-clipboard',
    name: 'hooks-use-clipboard',
    component: mdxRoute(() => import('./pages/hooks/use-clipboard.mdx')),
  },
  {
    path: '/hooks/use-color-scheme',
    name: 'hooks-use-color-scheme',
    component: mdxRoute(() => import('./pages/hooks/use-color-scheme.mdx')),
  },
  {
    path: '/hooks/use-counter',
    name: 'hooks-use-counter',
    component: mdxRoute(() => import('./pages/hooks/use-counter.mdx')),
  },
  {
    path: '/hooks/use-debounced-state',
    name: 'hooks-use-debounced-state',
    component: mdxRoute(() => import('./pages/hooks/use-debounced-state.mdx')),
  },
  {
    path: '/hooks/use-debounced-value',
    name: 'hooks-use-debounced-value',
    component: mdxRoute(() => import('./pages/hooks/use-debounced-value.mdx')),
  },
  {
    path: '/hooks/use-document-title',
    name: 'hooks-use-document-title',
    component: mdxRoute(() => import('./pages/hooks/use-document-title.mdx')),
  },
  {
    path: '/hooks/use-document-visibility',
    name: 'hooks-use-document-visibility',
    component: mdxRoute(() => import('./pages/hooks/use-document-visibility.mdx')),
  },
  {
    path: '/hooks/use-focus-return',
    name: 'hooks-use-focus-return',
    component: mdxRoute(() => import('./pages/hooks/use-focus-return.mdx')),
  },
  {
    path: '/hooks/use-did-update',
    name: 'hooks-use-did-update',
    component: mdxRoute(() => import('./pages/hooks/use-did-update.mdx')),
  },
  {
    path: '/hooks/use-focus-trap',
    name: 'hooks-use-focus-trap',
    component: mdxRoute(() => import('./pages/hooks/use-focus-trap.mdx')),
  },
  {
    path: '/hooks/use-force-update',
    name: 'hooks-use-force-update',
    component: mdxRoute(() => import('./pages/hooks/use-force-update.mdx')),
  },
  {
    path: '/hooks/use-id',
    name: 'hooks-use-id',
    component: mdxRoute(() => import('./pages/hooks/use-id.mdx')),
  },
  {
    path: '/hooks/use-idle',
    name: 'hooks-use-idle',
    component: mdxRoute(() => import('./pages/hooks/use-idle.mdx')),
  },
  {
    path: '/hooks/use-interval',
    name: 'hooks-use-interval',
    component: mdxRoute(() => import('./pages/hooks/use-interval.mdx')),
  },
  {
    path: '/hooks/use-isomorphic-effect',
    name: 'hooks-use-isomorphic-effect',
    component: mdxRoute(() => import('./pages/hooks/use-isomorphic-effect.mdx')),
  },
  {
    path: '/hooks/use-list-state',
    name: 'hooks-use-list-state',
    component: mdxRoute(() => import('./pages/hooks/use-list-state.mdx')),
  },
  {
    path: '/hooks/use-local-storage',
    name: 'hooks-use-local-storage',
    component: mdxRoute(() => import('./pages/hooks/use-local-storage.mdx')),
  },
  {
    path: '/hooks/use-session-storage',
    name: 'hooks-use-session-storage',
    component: mdxRoute(() => import('./pages/hooks/use-session-storage.mdx')),
  },
  {
    path: '/hooks/use-media-query',
    name: 'hooks-use-media-query',
    component: mdxRoute(() => import('./pages/hooks/use-media-query.mdx')),
  },
  {
    path: '/hooks/use-merged-ref',
    name: 'hooks-use-merged-ref',
    component: mdxRoute(() => import('./pages/hooks/use-merged-ref.mdx')),
  },
  {
    path: '/hooks/use-mouse',
    name: 'hooks-use-mouse',
    component: mdxRoute(() => import('./pages/hooks/use-mouse.mdx')),
  },
  {
    path: '/hooks/use-move',
    name: 'hooks-use-move',
    component: mdxRoute(() => import('./pages/hooks/use-move.mdx')),
  },
  {
    path: '/hooks/use-pagination',
    name: 'hooks-use-pagination',
    component: mdxRoute(() => import('./pages/hooks/use-pagination.mdx')),
  },
  {
    path: '/hooks/use-queue',
    name: 'hooks-use-queue',
    component: mdxRoute(() => import('./pages/hooks/use-queue.mdx')),
  },
  {
    path: '/hooks/use-page-leave',
    name: 'hooks-use-page-leave',
    component: mdxRoute(() => import('./pages/hooks/use-page-leave.mdx')),
  },
  {
    path: '/hooks/use-reduced-motion',
    name: 'hooks-use-reduced-motion',
    component: mdxRoute(() => import('./pages/hooks/use-reduced-motion.mdx')),
  },
  {
    path: '/hooks/use-scroll-into-view',
    name: 'hooks-use-scroll-into-view',
    component: mdxRoute(() => import('./pages/hooks/use-scroll-into-view.mdx')),
  },
  {
    path: '/hooks/use-resize-observer',
    name: 'hooks-use-resize-observer',
    component: mdxRoute(() => import('./pages/hooks/use-resize-observer.mdx')),
  },
  {
    path: '/hooks/use-element-size',
    name: 'hooks-use-element-size',
    component: mdxRoute(() => import('./pages/hooks/use-element-size.mdx')),
  },
  {
    path: '/hooks/use-shallow-effect',
    name: 'hooks-use-shallow-effect',
    component: mdxRoute(() => import('./pages/hooks/use-shallow-effect.mdx')),
  },
  {
    path: '/hooks/use-toggle',
    name: 'hooks-use-toggle',
    component: mdxRoute(() => import('./pages/hooks/use-toggle.mdx')),
  },
  {
    path: '/hooks/use-uncontrolled',
    name: 'hooks-use-uncontrolled',
    component: mdxRoute(() => import('./pages/hooks/use-uncontrolled.mdx')),
  },
  {
    path: '/hooks/use-viewport-size',
    name: 'hooks-use-viewport-size',
    component: mdxRoute(() => import('./pages/hooks/use-viewport-size.mdx')),
  },
  {
    path: '/hooks/use-window-event',
    name: 'hooks-use-window-event',
    component: mdxRoute(() => import('./pages/hooks/use-window-event.mdx')),
  },
  {
    path: '/hooks/use-window-scroll',
    name: 'hooks-use-window-scroll',
    component: mdxRoute(() => import('./pages/hooks/use-window-scroll.mdx')),
  },
  {
    path: '/hooks/use-intersection',
    name: 'hooks-use-intersection',
    component: mdxRoute(() => import('./pages/hooks/use-intersection.mdx')),
  },
  {
    path: '/hooks/use-hash',
    name: 'hooks-use-hash',
    component: mdxRoute(() => import('./pages/hooks/use-hash.mdx')),
  },
  {
    path: '/hooks/use-hotkeys',
    name: 'hooks-use-hotkeys',
    component: mdxRoute(() => import('./pages/hooks/use-hotkeys.mdx')),
  },
  {
    path: '/hooks/use-fullscreen',
    name: 'hooks-use-fullscreen',
    component: mdxRoute(() => import('./pages/hooks/use-fullscreen.mdx')),
  },
  {
    path: '/hooks/use-logger',
    name: 'hooks-use-logger',
    component: mdxRoute(() => import('./pages/hooks/use-logger.mdx')),
  },
  {
    path: '/hooks/use-hover',
    name: 'hooks-use-hover',
    component: mdxRoute(() => import('./pages/hooks/use-hover.mdx')),
  },
  {
    path: '/hooks/use-validated-state',
    name: 'hooks-use-validated-state',
    component: mdxRoute(() => import('./pages/hooks/use-validated-state.mdx')),
  },
  {
    path: '/hooks/use-os',
    name: 'hooks-use-os',
    component: mdxRoute(() => import('./pages/hooks/use-os.mdx')),
  },
  {
    path: '/hooks/use-set-state',
    name: 'hooks-use-set-state',
    component: mdxRoute(() => import('./pages/hooks/use-set-state.mdx')),
  },
  {
    path: '/hooks/use-input-state',
    name: 'hooks-use-input-state',
    component: mdxRoute(() => import('./pages/hooks/use-input-state.mdx')),
  },
  {
    path: '/hooks/use-event-listener',
    name: 'hooks-use-event-listener',
    component: mdxRoute(() => import('./pages/hooks/use-event-listener.mdx')),
  },
  {
    path: '/hooks/use-disclosure',
    name: 'hooks-use-disclosure',
    component: mdxRoute(() => import('./pages/hooks/use-disclosure.mdx')),
  },
  {
    path: '/hooks/use-focus-within',
    name: 'hooks-use-focus-within',
    component: mdxRoute(() => import('./pages/hooks/use-focus-within.mdx')),
  },
  {
    path: '/hooks/use-network',
    name: 'hooks-use-network',
    component: mdxRoute(() => import('./pages/hooks/use-network.mdx')),
  },
  {
    path: '/hooks/use-timeout',
    name: 'hooks-use-timeout',
    component: mdxRoute(() => import('./pages/hooks/use-timeout.mdx')),
  },
  {
    path: '/hooks/use-text-selection',
    name: 'hooks-use-text-selection',
    component: mdxRoute(() => import('./pages/hooks/use-text-selection.mdx')),
  },
  {
    path: '/hooks/use-previous',
    name: 'hooks-use-previous',
    component: mdxRoute(() => import('./pages/hooks/use-previous.mdx')),
  },
  {
    path: '/hooks/use-favicon',
    name: 'hooks-use-favicon',
    component: mdxRoute(() => import('./pages/hooks/use-favicon.mdx')),
  },
  {
    path: '/hooks/use-headroom',
    name: 'hooks-use-headroom',
    component: mdxRoute(() => import('./pages/hooks/use-headroom.mdx')),
  },
  {
    path: '/hooks/use-scroll-direction',
    name: 'hooks-use-scroll-direction',
    component: mdxRoute(() => import('./pages/hooks/use-scroll-direction.mdx')),
  },
  {
    path: '/hooks/use-eye-dropper',
    name: 'hooks-use-eye-dropper',
    component: mdxRoute(() => import('./pages/hooks/use-eye-dropper.mdx')),
  },
  {
    path: '/hooks/use-in-viewport',
    name: 'hooks-use-in-viewport',
    component: mdxRoute(() => import('./pages/hooks/use-in-viewport.mdx')),
  },
  {
    path: '/hooks/use-mutation-observer',
    name: 'hooks-use-mutation-observer',
    component: mdxRoute(() => import('./pages/hooks/use-mutation-observer.mdx')),
  },
  {
    path: '/hooks/use-mounted',
    name: 'hooks-use-mounted',
    component: mdxRoute(() => import('./pages/hooks/use-mounted.mdx')),
  },
  {
    path: '/hooks/use-state-history',
    name: 'hooks-use-state-history',
    component: mdxRoute(() => import('./pages/hooks/use-state-history.mdx')),
  },
  {
    path: '/hooks/use-map',
    name: 'hooks-use-map',
    component: mdxRoute(() => import('./pages/hooks/use-map.mdx')),
  },
  {
    path: '/hooks/use-set',
    name: 'hooks-use-set',
    component: mdxRoute(() => import('./pages/hooks/use-set.mdx')),
  },
  {
    path: '/hooks/use-throttled-callback',
    name: 'hooks-use-throttled-callback',
    component: mdxRoute(() => import('./pages/hooks/use-throttled-callback.mdx')),
  },
  {
    path: '/hooks/use-throttled-state',
    name: 'hooks-use-throttled-state',
    component: mdxRoute(() => import('./pages/hooks/use-throttled-state.mdx')),
  },
  {
    path: '/hooks/use-throttled-value',
    name: 'hooks-use-throttled-value',
    component: mdxRoute(() => import('./pages/hooks/use-throttled-value.mdx')),
  },
  {
    path: '/hooks/use-is-first-render',
    name: 'hooks-use-is-first-render',
    component: mdxRoute(() => import('./pages/hooks/use-is-first-render.mdx')),
  },
  {
    path: '/hooks/use-orientation',
    name: 'hooks-use-orientation',
    component: mdxRoute(() => import('./pages/hooks/use-orientation.mdx')),
  },
  {
    path: '/hooks/use-fetch',
    name: 'hooks-use-fetch',
    component: mdxRoute(() => import('./pages/hooks/use-fetch.mdx')),
  },
  {
    path: '/hooks/use-radial-move',
    name: 'hooks-use-radial-move',
    component: mdxRoute(() => import('./pages/hooks/use-radial-move.mdx')),
  },
  {
    path: '/hooks/use-scroll-spy',
    name: 'hooks-use-scroll-spy',
    component: mdxRoute(() => import('./pages/hooks/use-scroll-spy.mdx')),
  },
  {
    path: '/hooks/use-scroller',
    name: 'hooks-use-scroller',
    component: mdxRoute(() => import('./pages/hooks/use-scroller.mdx')),
  },
  {
    path: '/hooks/use-file-dialog',
    name: 'hooks-use-file-dialog',
    component: mdxRoute(() => import('./pages/hooks/use-file-dialog.mdx')),
  },
  {
    path: '/hooks/use-long-press',
    name: 'hooks-use-long-press',
    component: mdxRoute(() => import('./pages/hooks/use-long-press.mdx')),
  },
  {
    path: '/hooks/use-selection',
    name: 'hooks-use-selection',
    component: mdxRoute(() => import('./pages/hooks/use-selection.mdx')),
  },
  {
    path: '/hooks/use-floating-window',
    name: 'hooks-use-floating-window',
    component: mdxRoute(() => import('./pages/hooks/use-floating-window.mdx')),
  },
  {
    path: '/hooks/use-collapse',
    name: 'hooks-use-collapse',
    component: mdxRoute(() => import('./pages/hooks/use-collapse.mdx')),
  },
  {
    path: '/hooks/use-mask',
    name: 'hooks-use-mask',
    component: mdxRoute(() => import('./pages/hooks/use-mask.mdx')),
  },
  {
    path: '/hooks/use-roving-index',
    name: 'hooks-use-roving-index',
    component: mdxRoute(() => import('./pages/hooks/use-roving-index.mdx')),
  },
  {
    path: '/hooks/use-drag',
    name: 'hooks-use-drag',
    component: mdxRoute(() => import('./pages/hooks/use-drag.mdx')),
  },
  {
    path: '/hooks/use-splitter',
    name: 'hooks-use-splitter',
    component: mdxRoute(() => import('./pages/hooks/use-splitter.mdx')),
  },
  {
    path: '/hooks/use-horizontal-collapse',
    name: 'hooks-use-horizontal-collapse',
    component: mdxRoute(() => import('./pages/hooks/use-horizontal-collapse.mdx')),
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
