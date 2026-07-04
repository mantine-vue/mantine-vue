import { describe, expect, it, vi } from 'vitest'
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
})
