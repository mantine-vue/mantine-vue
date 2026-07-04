import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  Accordion,
  AccordionChevron,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  MantineProvider,
} from '../../index'

function renderAccordion(props: Record<string, any> = {}, controlProps: Record<string, any> = {}) {
  return mount(
    {
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(Accordion, { transitionDuration: 0, ...props }, () => [
            h(AccordionItem, { value: 'item-1' }, () => [
              h(AccordionControl, { icon: '$$', ...controlProps }, () => 'Label 1'),
              h(AccordionPanel, null, () => 'test-item-1'),
            ]),
            h(AccordionItem, { value: 'item-2' }, () => [
              h(AccordionControl, null, () => 'Label 2'),
              h(AccordionPanel, null, () => 'test-item-2'),
            ]),
            h(AccordionItem, { value: 'item-3' }, () => [
              h(AccordionControl, null, () => 'Label 3'),
              h(AccordionPanel, null, () => 'test-item-3'),
            ]),
          ]),
        ),
    },
    { attachTo: document.body },
  )
}

function buttons(wrapper: any) {
  return wrapper.findAll('[data-accordion-control]')
}

describe('@mantine-vue/core Accordion', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders items and exposes active panel', () => {
    const wrapper = renderAccordion({ defaultValue: 'item-1' })

    expect(wrapper.findAll('.mantine-Accordion-item')).toHaveLength(3)
    expect(wrapper.text()).toContain('test-item-1')
    expect(wrapper.text()).not.toContain('test-item-2')
  })

  it('supports uncontrolled single state', async () => {
    const onChange = vi.fn()
    const wrapper = renderAccordion({ defaultValue: 'item-2', onChange })

    await buttons(wrapper)[0].trigger('click')

    expect(onChange).toHaveBeenCalledWith('item-1')
    expect(wrapper.text()).toContain('test-item-1')
    expect(wrapper.text()).not.toContain('test-item-2')
  })

  it('supports uncontrolled multiple state', async () => {
    const wrapper = renderAccordion({ multiple: true, defaultValue: ['item-2'] })

    await buttons(wrapper)[0].trigger('click')

    expect(wrapper.text()).toContain('test-item-1')
    expect(wrapper.text()).toContain('test-item-2')
  })

  it('supports controlled state', async () => {
    const onChange = vi.fn()
    const wrapper = renderAccordion({ value: 'item-2', onChange })

    await buttons(wrapper)[0].trigger('click')

    expect(onChange).toHaveBeenCalledWith('item-1')
    expect(wrapper.text()).toContain('test-item-2')
    expect(wrapper.text()).not.toContain('test-item-1')
  })

  it('supports arrow key navigation and loop control', async () => {
    const wrapper = renderAccordion({ defaultValue: 'item-1', loop: false })

    buttons(wrapper)[0].element.focus()
    await buttons(wrapper)[0].trigger('keydown', { key: 'ArrowUp' })
    expect(buttons(wrapper)[0].element).toBe(document.activeElement)

    await buttons(wrapper)[0].trigger('keydown', { key: 'ArrowDown' })
    expect(buttons(wrapper)[1].element).toBe(document.activeElement)
  })

  it('wraps controls with heading when order is set', () => {
    const wrapper = renderAccordion({ defaultValue: 'item-1', order: 3 })

    expect(wrapper.find('h3 .mantine-Accordion-control').exists()).toBe(true)
  })

  it('does not change state when control is disabled', async () => {
    const wrapper = renderAccordion({ defaultValue: 'item-2' }, { disabled: true })

    await buttons(wrapper)[0].trigger('click')

    expect(wrapper.text()).toContain('test-item-2')
    expect(wrapper.text()).not.toContain('test-item-1')
  })

  it('exposes static compound components', () => {
    expect(Accordion.Item).toBe(AccordionItem)
    expect(Accordion.Control).toBe(AccordionControl)
    expect(Accordion.Panel).toBe(AccordionPanel)
    expect(Accordion.Chevron).toBe(AccordionChevron)
  })
})
