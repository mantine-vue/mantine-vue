import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { useHash } from './use-hash'

function renderHook(options?: Parameters<typeof useHash>[0]) {
  let result!: ReturnType<typeof useHash>
  mount(
    defineComponent({
      setup() {
        result = useHash(options)
        return () => null
      },
    }),
  )

  return result
}

beforeEach(() => {
  window.location.hash = ''
})

describe('@mantine-vue/hooks/use-hash', () => {
  it('returns empty string initially when hash is not set', () => {
    const [hash] = renderHook()
    expect(typeof hash.value).toBe('string')
  })

  it('reads window.location.hash synchronously when getInitialValueInEffect is false', () => {
    window.location.hash = '#hello'
    const [hash] = renderHook({ getInitialValueInEffect: false })
    expect(hash.value).toBe('#hello')
  })

  it('setter updates state and writes to window.location.hash', () => {
    const [hash, setHash] = renderHook({ getInitialValueInEffect: false })

    setHash('world')
    expect(hash.value).toBe('#world')
    expect(window.location.hash).toBe('#world')
  })

  it('setter does not double-prepend # when already present', () => {
    const [hash, setHash] = renderHook({ getInitialValueInEffect: false })

    setHash('#section')
    expect(hash.value).toBe('#section')
  })

  it('reacts to external hashchange events', () => {
    const [hash] = renderHook({ getInitialValueInEffect: false })

    window.location.hash = '#external'
    window.dispatchEvent(new Event('hashchange'))
    expect(hash.value).toBe('#external')
  })
})
