import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Calendar, handleControlKeyDown } from '../index'
import { cleanupRenderedComponents, render, press, getDay, headerLabels } from './test-utils'

cleanupRenderedComponents()

describe('@mantine-vue/dates handleControlKeyDown', () => {
  it('calls onEdgeCross when navigation runs off the grid', () => {
    const buttons = [0, 1, 2].map(() => {
      const button = document.createElement('button')
      document.body.appendChild(button)
      return button
    })
    const onEdgeCross = vi.fn()
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
    handleControlKeyDown({
      rowIndex: 0,
      cellIndex: 0,
      event,
      controlsRef: [buttons],
      onEdgeCross,
    })
    expect(onEdgeCross).toHaveBeenCalledWith({ edge: 'previous', direction: 'left', cellIndex: 0 })

    handleControlKeyDown({
      rowIndex: 0,
      cellIndex: 1,
      event: new KeyboardEvent('keydown', { key: 'ArrowRight' }),
      controlsRef: [buttons],
      onEdgeCross,
    })
    expect(document.activeElement).toBe(buttons[2])
    expect(onEdgeCross).toHaveBeenCalledTimes(1)
  })
})

describe('@mantine-vue/dates Calendar keyboard navigation', () => {
  it('navigates to outside dates and switches month when navigation runs off the grid', async () => {
    render(Calendar, { defaultDate: '2022-04-11' })
    getDay('1 April 2022')!.focus()
    await press(document.activeElement!, 'ArrowLeft')
    expect(document.activeElement).toBe(getDay('31 March 2022'))
    expect(getDay('31 March 2022')!.hasAttribute('data-outside')).toBe(true)
    expect(headerLabels()).toEqual(['April 2022'])

    await press(document.activeElement!, 'ArrowUp')
    expect(headerLabels()).toEqual(['March 2022'])
    expect(document.activeElement).toBe(getDay('24 March 2022'))
    expect(getDay('24 March 2022')!.hasAttribute('data-outside')).toBe(false)
  })

  it('switches month when hidden outside dates are reached', async () => {
    render(Calendar, { defaultDate: '2022-04-11', hideOutsideDates: true })
    getDay('1 April 2022')!.focus()
    await press(document.activeElement!, 'ArrowLeft')
    expect(headerLabels()).toEqual(['March 2022'])
    expect(document.activeElement).toBe(getDay('31 March 2022'))
  })

  it('does not switch month past minDate and maxDate', async () => {
    render(Calendar, { defaultDate: '2022-04-11', minDate: '2022-04-01', maxDate: '2022-04-30' })
    getDay('1 April 2022')!.focus()
    await press(document.activeElement!, 'ArrowLeft')
    expect(headerLabels()).toEqual(['April 2022'])
    expect(document.activeElement).toBe(getDay('1 April 2022'))
  })

  it('moves focus to the next level control after level change with keyboard', async () => {
    render(Calendar, { defaultDate: '2022-04-11' })
    const level = document.querySelector<HTMLButtonElement>('button[data-level-control]')!
    level.focus()
    level.click()
    await nextTick()
    await nextTick()
    expect(headerLabels()).toEqual(['2022'])
    expect(document.activeElement).toBe(document.querySelector('button[data-level-control]'))
  })

  it('moves focus to the grid after month is selected', async () => {
    render(Calendar, { defaultDate: '2022-04-11', defaultLevel: 'year' })
    const months = document.querySelectorAll<HTMLButtonElement>('button[tabindex]')
    const may = Array.from(months).find((node) => node.textContent === 'May')!
    may.focus()
    may.click()
    await nextTick()
    await nextTick()
    expect(headerLabels()).toEqual(['May 2022'])
    expect(document.activeElement?.getAttribute('tabindex')).toBe('0')
    expect(document.activeElement?.closest('table')).not.toBeNull()
  })

  it('switches year when arrow navigation runs off the months list', async () => {
    render(Calendar, { defaultDate: '2022-04-11', defaultLevel: 'year' })
    const january = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(
      (node) => node.textContent === 'Jan',
    )!
    january.focus()
    await press(january, 'ArrowLeft')
    expect(headerLabels()).toEqual(['2021'])
    expect(document.activeElement?.textContent).toBe('Dec')
  })
})
