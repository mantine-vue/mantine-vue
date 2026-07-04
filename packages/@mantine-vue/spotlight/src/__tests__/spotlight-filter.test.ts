import { describe, expect, it } from 'vitest'
import { defaultSpotlightFilter } from '../default-spotlight-filter'
import { limitActions } from '../limit-actions'
import type { SpotlightActions } from '../Spotlight'

const actions: SpotlightActions[] = [
  { id: '1', label: 'Dashboard', description: 'Home page' },
  { id: '2', label: 'Settings', description: 'Preferences', keywords: ['profile', 'account'] },
  {
    group: 'Docs',
    actions: [
      { id: '3', label: 'Components', description: 'UI reference' },
      { id: '4', label: 'Hooks', description: 'Composables reference' },
    ],
  },
]

describe('@mantine-vue/spotlight filtering', () => {
  it('filters by label, description and keywords', () => {
    expect(
      defaultSpotlightFilter('dash', actions).map((item) => ('id' in item ? item.id : item.group)),
    ).toEqual(['1'])
    expect(
      defaultSpotlightFilter('account', actions).map((item) =>
        'id' in item ? item.id : item.group,
      ),
    ).toEqual(['2'])
    expect(
      defaultSpotlightFilter('reference', actions).map((item) =>
        'id' in item ? item.id : item.group,
      ),
    ).toEqual(['2', 'Docs'])
  })

  it('limits actions across groups', () => {
    const limited = limitActions(actions, 3)

    expect(limited).toHaveLength(3)
    expect(limited[2]).toMatchObject({ group: 'Docs' })
    expect('actions' in limited[2] ? limited[2].actions : []).toHaveLength(1)
  })
})
