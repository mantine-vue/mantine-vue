import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider, OverflowList, Stepper, StepperCompleted, StepperStep } from '../../index'

function withProvider(render: () => any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, render),
  })
}

describe('@mantine-vue/core Stepper', () => {
  it('exposes compound components and renders active content', () => {
    const wrapper = withProvider(() =>
      h(Stepper, { active: 1 }, () => [
        h(StepperStep, { label: 'First', description: 'First description' }, () => 'First content'),
        h(StepperStep, { label: 'Second' }, () => 'Second content'),
        h(StepperCompleted, null, () => 'Completed content'),
      ]),
    )

    expect(Stepper.Step).toBe(StepperStep)
    expect(Stepper.Completed).toBe(StepperCompleted)
    expect(wrapper.findAll('.mantine-Stepper-step')).toHaveLength(2)
    expect(wrapper.findAll('.mantine-Stepper-separator')).toHaveLength(1)
    expect(wrapper.findAll('.mantine-Stepper-step[data-completed]')).toHaveLength(1)
    expect(wrapper.findAll('.mantine-Stepper-step[data-progress]')).toHaveLength(1)
    expect(wrapper.text()).toContain('Second content')
    expect(wrapper.text()).not.toContain('First content')
  })

  it('supports completed content and keepMounted', () => {
    const wrapper = withProvider(() =>
      h(Stepper, { active: 2, keepMounted: true }, () => [
        h(StepperStep, { label: 'First' }, () => 'First content'),
        h(StepperStep, { label: 'Second' }, () => 'Second content'),
        h(StepperCompleted, null, () => 'Completed content'),
      ]),
    )

    const content = wrapper.findAll('.mantine-Stepper-content')
    expect(content).toHaveLength(3)
    expect(content[0].attributes('style')).toContain('display: none')
    expect(content[2].text()).toBe('Completed content')
    expect(content[2].attributes('style') ?? '').not.toContain('display: none')
  })

  it('enforces selection rules and step overrides', async () => {
    const onStepClick = vi.fn()
    const wrapper = withProvider(() =>
      h(Stepper, { active: 1, allowNextStepsSelect: false, onStepClick }, () => [
        h(StepperStep, { label: 'Previous' }),
        h(StepperStep, { label: 'Current' }),
        h(StepperStep, { label: 'Next' }),
        h(StepperStep, { label: 'Override', allowStepSelect: true }),
      ]),
    )
    const steps = wrapper.findAll('.mantine-Stepper-step')

    await steps[0].trigger('click')
    await steps[1].trigger('click')
    await steps[2].trigger('click')
    await steps[3].trigger('click')

    expect(onStepClick.mock.calls).toEqual([[0], [3]])
    expect(steps[2].attributes('tabindex')).toBe('-1')
    expect(steps[3].attributes('data-allow-click')).toBeDefined()
  })

  it('supports vertical orientation, custom fragments, and variables', () => {
    const wrapper = withProvider(() =>
      h(
        Stepper,
        { active: 0, orientation: 'vertical', iconPosition: 'right', size: 'sm', iconSize: 30 },
        () => [
          h(StepperStep, {
            label: ({ step }: any) => `Step ${step}`,
            icon: ({ step }: any) => `I${step}`,
          }),
        ],
      ),
    )

    expect(wrapper.find('.mantine-Stepper-steps').attributes('data-orientation')).toBe('vertical')
    expect(wrapper.find('.mantine-Stepper-step').classes()).toContain(
      (Stepper.classes as Record<string, string>)['step--vertical'],
    )
    expect(wrapper.text()).toContain('Step 0')
    expect(wrapper.text()).toContain('I0')
    expect(wrapper.find('.mantine-Stepper-root').attributes('style')).toContain(
      '--stepper-icon-size: 1.875rem',
    )
  })
})

describe('@mantine-vue/core OverflowList', () => {
  it('passes source indexes when limiting items from either edge', () => {
    const endIndexes: number[] = []
    const startIndexes: number[] = []
    const data = ['1', '2', '3', '4', '5']

    withProvider(() =>
      h(OverflowList, {
        data,
        maxVisibleItems: 2,
        renderItem: (item: string, index: number) => {
          endIndexes.push(index)
          return h('span', item)
        },
        renderOverflow: (items: string[]) => h('span', `+${items.length}`),
      }),
    )
    withProvider(() =>
      h(OverflowList, {
        data,
        collapseFrom: 'start',
        maxVisibleItems: 2,
        renderItem: (item: string, index: number) => {
          startIndexes.push(index)
          return h('span', item)
        },
        renderOverflow: (items: string[]) => h('span', `+${items.length}`),
      }),
    )

    expect(endIndexes).toEqual([0, 1])
    expect(startIndexes).toEqual([3, 4])
  })

  it('recomputes after same-length primitive data is reordered', async () => {
    const data = ref(['A', 'B', 'LONG'])
    const wrapper = withProvider(() =>
      h(OverflowList, {
        class: 'overflow-test-root',
        data: data.value,
        gap: 0,
        renderItem: (item: string) => h('span', item),
        renderOverflow: (items: string[]) => h('span', `+${items.length}`),
      }),
    )
    const root = wrapper.find('.mantine-OverflowList-root').element as HTMLElement
    vi.spyOn(root, 'getBoundingClientRect').mockReturnValue({ width: 100 } as DOMRect)
    wrapper.findAll('span').forEach((item) =>
      vi.spyOn(item.element, 'getBoundingClientRect').mockReturnValue({
        width: item.text() === 'LONG' ? 95 : 10,
        top: item.text() === 'LONG' ? 20 : 0,
        bottom: item.text() === 'LONG' ? 40 : 20,
        height: 20,
      } as DOMRect),
    )

    data.value = ['LONG', 'A', 'B']
    await nextTick()
    await nextTick()

    expect(wrapper.text()).toContain('LONG')
    expect(wrapper.find('.mantine-OverflowList-root').attributes('style')).toContain(
      '--ol-gap: 0rem',
    )
  })
})
