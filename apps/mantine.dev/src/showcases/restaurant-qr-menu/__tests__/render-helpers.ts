import { createApp, defineComponent, h, nextTick, type Component } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createMemoryStorage } from '../../shared/persistence'
import { createQrMenuContext } from '../app/create-qr-menu-context'
import QrMenuProvider from '../components/shell/QrMenuProvider.vue'
import { createMockServices } from '../services/mock/create-mock-services'
import { SAFFRON_OPEN } from './fixtures'

/** Resolves pending promises and the following render. */
export async function flush() {
  await new Promise((resolve) => setTimeout(resolve, 0))
  await nextTick()
}

/** Context backed by in-memory storage and an instant mock API. */
export function createTestContext() {
  const storage = createMemoryStorage()
  const now = () => new Date(SAFFRON_OPEN)
  const services = createMockServices({ storage, latency: 0, now, random: () => 0.5 })
  const context = createQrMenuContext({ storage, services, now })
  return { context, storage, services }
}

/**
 * Mounts `component` inside the showcase providers with a memory router.
 * Uses plain `createApp` so the docs workspace needs no extra test dependency.
 */
export async function renderWithQrMenu(component: Component, props: Record<string, unknown> = {}) {
  const { context, storage } = createTestContext()
  await context.data.load(context.restaurantId.value)

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', name: 'rqm-menu', component: { render: () => null } }],
  })
  await router.push('/')
  await router.isReady()

  const Root = defineComponent({
    name: 'QrMenuTestRoot',
    setup: () => () => h(QrMenuProvider, { context }, () => h(component, props)),
  })

  const element = document.createElement('div')
  document.body.appendChild(element)
  const app = createApp(Root)
  app.use(router)
  app.mount(element)
  await flush()

  return {
    element,
    context,
    storage,
    router,
    unmount: () => {
      app.unmount()
      element.remove()
    },
  }
}
