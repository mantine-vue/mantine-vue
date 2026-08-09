import { mount } from '@vue/test-utils'
import { MantineProvider } from '@mantine-vue/core'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { Notifications } from '../components/Notifications'
import { NotificationContainer } from '../components/NotificationContainer'
import {
  cleanNotifications,
  cleanNotificationsQueue,
  createNotificationsStore,
  hideNotification,
  showNotification,
  updateNotification,
} from '../notifications.store'

describe('@mantine-vue/notifications store', () => {
  it('distributes notifications by position limit and queue', () => {
    const store = createNotificationsStore()
    store.setState({ ...store.getState(), limit: 1, defaultPosition: 'top-right' })

    showNotification({ id: '1', message: 'one' }, store)
    showNotification({ id: '2', message: 'two' }, store)
    showNotification({ id: '3', message: 'three', position: 'bottom-left' }, store)

    expect(store.getState().notifications.map((item) => item.id)).toEqual(['1', '3'])
    expect(store.getState().queue.map((item) => item.id)).toEqual(['2'])
  })

  it('moves queued notifications into visible list when a visible notification is hidden', () => {
    const store = createNotificationsStore()
    store.setState({ ...store.getState(), limit: 1 })

    showNotification({ id: '1', message: 'one' }, store)
    showNotification({ id: '2', message: 'two' }, store)
    hideNotification('1', store)

    expect(store.getState().notifications.map((item) => item.id)).toEqual(['2'])
    expect(store.getState().queue).toEqual([])
  })

  it('orders notifications by priority and preserves FIFO order for equal priorities', () => {
    const store = createNotificationsStore()
    store.setState({ ...store.getState(), limit: 2 })

    showNotification({ id: 'normal', message: 'normal' }, store)
    showNotification({ id: 'urgent-first', message: 'urgent first', priority: 10 }, store)
    showNotification({ id: 'urgent-second', message: 'urgent second', priority: 10 }, store)

    expect(store.getState().notifications.map((item) => item.id)).toEqual([
      'urgent-first',
      'urgent-second',
    ])
    expect(store.getState().queue.map((item) => item.id)).toEqual(['normal'])
  })

  it('skips duplicate explicit ids and calls onClose on hide', () => {
    const store = createNotificationsStore()
    const onClose = vi.fn()

    showNotification({ id: 'same', message: 'one', onClose }, store)
    showNotification({ id: 'same', message: 'two' }, store)
    hideNotification('same', store)

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(store.getState().notifications).toEqual([])
  })

  it('updates notifications and cleans queue', () => {
    const store = createNotificationsStore()
    store.setState({ ...store.getState(), limit: 1 })

    showNotification({ id: '1', message: 'one' }, store)
    showNotification({ id: '2', message: 'two' }, store)
    updateNotification({ id: '2', message: 'updated' }, store)
    cleanNotificationsQueue(store)

    expect(store.getState().notifications).toHaveLength(1)
    expect(store.getState().queue).toEqual([])

    cleanNotifications(store)
    expect(store.getState().notifications).toEqual([])
  })

  it('does not mutate notification data with component instances while rendering', async () => {
    const store = createNotificationsStore()
    showNotification(
      {
        id: 'serializable',
        title: 'Title',
        message: h('span', 'Message'),
        icon: h(MantineProvider, { env: 'test' }),
      },
      store,
    )

    mount(MantineProvider, {
      props: { env: 'test' },
      slots: {
        default: () => h(Notifications, { store, autoClose: false, withinPortal: false }),
      },
      attachTo: document.body,
    })
    await nextTick()

    expect(() => JSON.stringify(store.getState().notifications)).not.toThrow()
  })

  it('closes a notification after the default delay', async () => {
    vi.useFakeTimers()
    const store = createNotificationsStore()
    showNotification({ id: 'auto-close', message: 'Message' }, store)

    const wrapper = mount(MantineProvider, {
      props: { env: 'test' },
      slots: {
        default: () => h(Notifications, { store, withinPortal: false, transitionDuration: 0 }),
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(store.getState().notifications).toHaveLength(1)

    await vi.advanceTimersByTimeAsync(4000)
    await nextTick()
    expect(store.getState().notifications).toHaveLength(0)

    wrapper.unmount()
    vi.useRealTimers()
  })

  it('does not leave auto close paused when a hovered notification is removed', async () => {
    vi.useFakeTimers()
    const store = createNotificationsStore()
    showNotification({ id: 'hovered', message: 'Hovered' }, store)

    const wrapper = mount(MantineProvider, {
      props: { env: 'test' },
      slots: {
        default: () => h(Notifications, { store, withinPortal: false, transitionDuration: 0 }),
      },
      attachTo: document.body,
    })
    await nextTick()

    await wrapper.findComponent(NotificationContainer).trigger('mouseenter')
    hideNotification('hovered', store)
    await nextTick()
    showNotification({ id: 'next', message: 'Next' }, store)
    await nextTick()

    await vi.advanceTimersByTimeAsync(4000)
    await nextTick()
    expect(store.getState().notifications).toHaveLength(0)

    wrapper.unmount()
    vi.useRealTimers()
  })
})
