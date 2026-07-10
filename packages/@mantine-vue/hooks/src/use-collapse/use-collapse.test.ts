import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useCollapse } from './use-collapse'
import { useHorizontalCollapse } from './use-horizontal-collapse'

describe('@mantine-vue/hooks/use-collapse', () => {
  it('creates vertical and horizontal collapse props from refs', () => {
    const expanded = ref(false)
    const collapse = useCollapse({ expanded, keepMounted: false })
    const horizontal = useHorizontalCollapse({ expanded, keepMounted: false })

    expect(collapse.state.value).toBe('exited')
    expect(collapse.getCollapseProps().style).toMatchObject({
      height: 0,
      overflow: 'hidden',
      display: 'none',
    })
    expect(collapse.getCollapseProps()['aria-hidden']).toBe(true)
    expect(horizontal.getCollapseProps().style).toMatchObject({
      width: 0,
      overflow: 'hidden',
      display: 'none',
    })
  })
})
