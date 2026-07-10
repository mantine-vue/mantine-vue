import { describe, expect, it, vi } from 'vitest'
import { useDisclosure } from './use-disclosure'

describe('@mantine-vue/hooks/use-disclosure', () => {
  it('handles close correctly', () => {
    const [opened, handlers] = useDisclosure(true)
    expect(opened.value).toBe(true)

    handlers.close()
    expect(opened.value).toBe(false)
  })

  it('handles open correctly', () => {
    const [opened, handlers] = useDisclosure(false)
    expect(opened.value).toBe(false)

    handlers.open()
    expect(opened.value).toBe(true)
  })

  it('handles toggle correctly', () => {
    const [opened, handlers] = useDisclosure(false)
    expect(opened.value).toBe(false)

    handlers.toggle()
    expect(opened.value).toBe(true)
    handlers.toggle()
    expect(opened.value).toBe(false)
  })

  it('calls onClose when close is called', () => {
    const spy = vi.fn()
    const [, handlers] = useDisclosure(true, { onClose: spy })

    handlers.close()
    expect(spy).toHaveBeenCalledTimes(1)
    handlers.close()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('calls onOpen when open is called', () => {
    const spy = vi.fn()
    const [, handlers] = useDisclosure(false, { onOpen: spy })

    handlers.open()
    expect(spy).toHaveBeenCalledTimes(1)
    handlers.open()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('calls onOpen and onClose correctly when toggle is called', () => {
    const onClose = vi.fn()
    const onOpen = vi.fn()
    const [, handlers] = useDisclosure(false, { onOpen, onClose })

    handlers.toggle()
    expect(onOpen).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(0)
    handlers.toggle()
    expect(onOpen).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
    handlers.toggle()
    expect(onOpen).toHaveBeenCalledTimes(2)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
