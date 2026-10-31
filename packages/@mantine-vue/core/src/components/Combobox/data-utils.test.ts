import { afterEach, describe, expect, it } from 'vitest'
import { isExternalInputChange } from './data-utils'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('@mantine-vue/core/Combobox/data-utils', () => {
  it('detects external input changes in documents, iframes and shadow roots', () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    expect(isExternalInputChange({ currentTarget: input } as any)).toBe(true)
    input.focus()
    expect(isExternalInputChange({ currentTarget: input } as any)).toBe(false)

    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    const frameInput = iframe.contentDocument!.createElement('input')
    iframe.contentDocument!.body.appendChild(frameInput)
    frameInput.focus()
    expect(isExternalInputChange({ currentTarget: frameInput } as any)).toBe(false)

    const host = document.createElement('div')
    document.body.appendChild(host)
    const shadowInput = document.createElement('input')
    host.attachShadow({ mode: 'open' }).appendChild(shadowInput)
    shadowInput.focus()
    expect(isExternalInputChange({ currentTarget: shadowInput } as any)).toBe(false)
  })
})
