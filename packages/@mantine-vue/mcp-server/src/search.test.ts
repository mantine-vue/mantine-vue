import { describe, expect, it } from 'vitest'
import { scoreItem, scoreSection, suggestNames } from './search'
import type { IndexItem, SectionRecord } from './types'

const button: IndexItem = {
  id: 'core--button',
  name: 'Button',
  kind: 'component',
  group: 'components',
  category: 'core',
  package: '@mantine-vue/core',
  description: 'Button component',
  url: 'https://mantine-vue.dev/core/button',
  searchText: 'button loading disabled submit action',
  propsCount: 10,
  sectionCount: 3,
}

describe('MCP search', () => {
  it('prioritizes exact item names', () => {
    expect(scoreItem(button, 'Button')).toBeGreaterThan(scoreItem(button, 'loading action'))
  })

  it('scores matching sections', () => {
    const section: SectionRecord = {
      id: button.id,
      slug: 'loading-state',
      heading: 'Loading state',
      snippet: 'Disable the button while an action is pending',
    }
    expect(scoreSection(section, 'loading')).toBeGreaterThan(0)
  })

  it('suggests close component names', () => {
    expect(suggestNames([button], 'Buton')).toEqual(['Button'])
  })
})
