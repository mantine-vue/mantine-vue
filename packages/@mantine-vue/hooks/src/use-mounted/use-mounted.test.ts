import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import { useMounted } from './use-mounted'

describe('@mantine-vue/hooks/use-mounted', () => {
  it('returns true after mount', () => {
    let mounted!: ReturnType<typeof useMounted>

    mount(
      defineComponent({
        setup() {
          mounted = useMounted()
          return () => null
        },
      }),
    )

    expect(mounted.value).toBe(true)
  })
})
