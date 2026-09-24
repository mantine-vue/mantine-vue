import { testUtils } from '../../test-utils'
import { applyCascadeLayout, type CascadePositionedEvent } from './apply-cascade-layout'

function createPositionedEvent(id: number, column: number): CascadePositionedEvent {
  return {
    ...testUtils.createEvent({ id }),
    position: { allDay: false, column, width: 0, offset: 0, overlaps: 0 },
  }
}

describe('@mantine-vue/schedule/apply-cascade-layout', () => {
  it('indents overlapping event columns and preserves a minimum top width', () => {
    const events = Array.from({ length: 8 }, (_, index) => createPositionedEvent(index, index))

    applyCascadeLayout(events)

    expect(events[0].position).toMatchObject({ offset: 0, width: 100, overlaps: 8 })
    expect(events[7].position.offset).toBeCloseTo(40, 5)
    expect(events[7].position.width).toBeCloseTo(60, 5)
  })

  it('sizes independent overlap clusters separately', () => {
    const events = [
      createPositionedEvent(1, 0),
      createPositionedEvent(2, 1),
      {
        ...createPositionedEvent(3, 0),
        start: `${testUtils.testDate} 14:00:00`,
        end: `${testUtils.testDate} 15:00:00`,
      },
    ]

    applyCascadeLayout(events)

    expect(events[0].position).toMatchObject({ offset: 0, overlaps: 2 })
    expect(events[1].position).toMatchObject({ offset: 20, overlaps: 2 })
    expect(events[2].position).toMatchObject({ offset: 0, width: 100, overlaps: 1 })
  })
})
