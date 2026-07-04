import { describe, expect, it, vi } from 'vitest'
import {
  closeAllModalsAction,
  closeModalAction,
  createModalsStore,
  openConfirmModalAction,
  openContextModalAction,
  openModalAction,
  updateContextModalAction,
  updateModalAction,
} from '../modals.store'

describe('@mantine-vue/modals store', () => {
  it('opens a regular modal and adds it to the modals list', () => {
    const store = createModalsStore()
    const id = openModalAction({ children: 'Modal content' }, store)

    expect(store.getState().modals).toHaveLength(1)
    expect(store.getState().modals[0]).toMatchObject({ id, type: 'content' })
    expect(store.getState().current?.id).toBe(id)
  })

  it('uses the provided modalId instead of generating a random one', () => {
    const store = createModalsStore()
    const id = openModalAction({ modalId: 'my-modal', children: 'content' }, store)

    expect(id).toBe('my-modal')
    expect(store.getState().modals[0].id).toBe('my-modal')
  })

  it('does not open a duplicate modal with the same modalId', () => {
    const store = createModalsStore()
    openModalAction({ modalId: 'dup', children: 'first' }, store)
    openModalAction({ modalId: 'dup', children: 'second' }, store)

    expect(store.getState().modals).toHaveLength(1)
    expect((store.getState().modals[0].props as any).children).toBe('first')
  })

  it('closes a modal by id and calls onClose', () => {
    const store = createModalsStore()
    const onClose = vi.fn()
    const id = openModalAction({ children: 'content', onClose }, store)

    closeModalAction(id, false, store)

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(store.getState().modals).toHaveLength(0)
  })

  it('keeps the last modal as current after closing so exit transitions can run', () => {
    const store = createModalsStore()
    const firstId = openModalAction({ children: 'first' }, store)
    const secondId = openModalAction({ children: 'second' }, store)

    closeModalAction(secondId, false, store)

    expect(store.getState().modals).toHaveLength(1)
    expect(store.getState().current?.id).toBe(firstId)
  })

  it('calls onCancel then onClose when a confirm modal is closed with canceled=true', () => {
    const store = createModalsStore()
    const onCancel = vi.fn()
    const onClose = vi.fn()
    const id = openConfirmModalAction({ children: 'Are you sure?', onCancel, onClose }, store)

    closeModalAction(id, true, store)

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onCancel for a confirm modal closed without canceled=true', () => {
    const store = createModalsStore()
    const onCancel = vi.fn()
    const onClose = vi.fn()
    const id = openConfirmModalAction({ children: 'Are you sure?', onCancel, onClose }, store)

    closeModalAction(id, false, store)

    expect(onCancel).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes all modals in reverse order and clears the modals list', () => {
    const store = createModalsStore()
    const calls: string[] = []
    openModalAction({ modalId: 'a', onClose: () => calls.push('a') }, store)
    openModalAction({ modalId: 'b', onClose: () => calls.push('b') }, store)

    closeAllModalsAction(false, store)

    expect(calls).toEqual(['b', 'a'])
    expect(store.getState().modals).toEqual([])
  })

  it('opens a context modal with innerProps and updates them via updateContextModal', () => {
    const store = createModalsStore()
    const id = openContextModalAction('example', { innerProps: { value: 1 } }, store)

    expect(store.getState().modals[0]).toMatchObject({
      id,
      type: 'context',
      ctx: 'example',
      props: { innerProps: { value: 1 } },
    })

    updateContextModalAction({ modalId: id, innerProps: { value: 2 } as any }, store)

    expect((store.getState().modals[0].props as any).innerProps).toEqual({ value: 2 })
  })

  it('updates modal props via updateModal without closing it', () => {
    const store = createModalsStore()
    const id = openModalAction({ title: 'Old title' }, store)

    updateModalAction({ modalId: id, title: 'New title' }, store)

    expect((store.getState().modals[0].props as any).title).toBe('New title')
    expect(store.getState().modals).toHaveLength(1)
  })
})
