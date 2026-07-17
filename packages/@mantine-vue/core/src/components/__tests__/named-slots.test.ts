import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  Alert,
  Button,
  Checkbox,
  ComboboxPopover,
  Divider,
  EmptyState,
  MantineProvider,
  Radio,
  TextInput,
  Timeline,
  TimelineItem,
} from '../../index'

function withProvider(
  component: any,
  props: Record<string, any> = {},
  slots?: Record<string, any>,
) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => h(component, props, slots)),
  })
}

describe('@mantine-vue/core named slots', () => {
  it('Alert: prop title/icon and slot title/icon both render, prop taking precedence', () => {
    const fromProps = withProvider(Alert, {
      title: 'Prop title',
      icon: () => h('span', { class: 'prop-icon' }, 'I'),
    })
    expect(fromProps.text()).toContain('Prop title')
    expect(fromProps.find('.prop-icon').exists()).toBe(true)

    const fromSlots = withProvider(
      Alert,
      {},
      {
        title: () => h('span', { class: 'slot-title' }, 'Slot title'),
        icon: () => h('span', { class: 'slot-icon' }, 'I'),
        default: () => 'Message',
      },
    )
    expect(fromSlots.find('.slot-title').exists()).toBe(true)
    expect(fromSlots.find('.slot-icon').exists()).toBe(true)
    expect(fromSlots.text()).toContain('Message')

    // Prop wins over slot (precedence)
    const both = withProvider(
      Alert,
      { title: 'Prop wins' },
      {
        title: () => h('span', { class: 'slot-title' }, 'Slot loses'),
      },
    )
    expect(both.text()).toContain('Prop wins')
    expect(both.find('.slot-title').exists()).toBe(false)
  })

  it('Checkbox: renders label and description from named slots', () => {
    const wrapper = withProvider(
      Checkbox,
      {},
      {
        label: () => h('span', { class: 'slot-label' }, 'Accept'),
        description: () => h('span', { class: 'slot-desc' }, 'Terms'),
      },
    )
    expect(wrapper.find('.slot-label').exists()).toBe(true)
    expect(wrapper.find('.slot-desc').exists()).toBe(true)
  })

  it('Checkbox: renders custom icon via scoped slot', () => {
    const wrapper = withProvider(
      Checkbox,
      { indeterminate: true },
      {
        icon: ({ indeterminate }: { indeterminate?: boolean }) =>
          h('span', { class: 'slot-icon' }, indeterminate ? 'minus' : 'check'),
      },
    )
    expect(wrapper.find('.slot-icon').text()).toBe('minus')
  })

  it('Radio: prop label with scoped icon slot', () => {
    const wrapper = withProvider(
      Radio,
      { label: 'Option A' },
      {
        icon: () => h('span', { class: 'slot-icon' }, 'dot'),
      },
    )
    expect(wrapper.text()).toContain('Option A')
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
  })

  it('Divider: label named slot and default slot both work', () => {
    const named = withProvider(
      Divider,
      {},
      {
        label: () => h('span', { class: 'slot-label' }, 'Or'),
      },
    )
    expect(named.find('.slot-label').exists()).toBe(true)

    const def = withProvider(Divider, {}, { default: () => 'Section' })
    expect(def.text()).toContain('Section')
  })

  it('TextInput: forwards label and section slots through InputBase', () => {
    const wrapper = withProvider(
      TextInput,
      {},
      {
        label: () => h('span', { class: 'slot-label' }, 'Email'),
        leftSection: () => h('span', { class: 'slot-left' }, '@'),
      },
    )
    expect(wrapper.find('.slot-label').exists()).toBe(true)
    expect(wrapper.find('.slot-left').exists()).toBe(true)
  })

  it('TimelineItem: renders bullet and title from named slots', () => {
    const wrapper = mount({
      render: () =>
        h(MantineProvider, { env: 'test' }, () =>
          h(Timeline, null, () =>
            h(
              TimelineItem,
              {},
              {
                bullet: () => h('span', { class: 'slot-bullet' }, 'B'),
                title: () => h('span', { class: 'slot-title' }, 'Step 1'),
                default: () => 'Body',
              },
            ),
          ),
        ),
    })
    expect(wrapper.find('.slot-bullet').exists()).toBe(true)
    expect(wrapper.find('.slot-title').exists()).toBe(true)
    expect(wrapper.text()).toContain('Body')
  })

  it('preserves existing prop-based API (h render functions)', () => {
    const wrapper = withProvider(Alert, {
      icon: () => h('span', { class: 'prop-icon' }, 'I'),
      title: () => h('span', { class: 'prop-title' }, 'T'),
    })
    expect(wrapper.find('.prop-icon').exists()).toBe(true)
    expect(wrapper.find('.prop-title').exists()).toBe(true)
  })

  it('EmptyState: renders icon/title/description from named slots and props take precedence', () => {
    const fromSlots = withProvider(
      EmptyState,
      {},
      {
        icon: () => h('span', { class: 'slot-icon' }, 'I'),
        title: () => h('span', { class: 'slot-title' }, 'Slot title'),
        description: () => h('span', { class: 'slot-description' }, 'Slot description'),
      },
    )
    expect(fromSlots.find('.slot-icon').exists()).toBe(true)
    expect(fromSlots.find('.slot-title').exists()).toBe(true)
    expect(fromSlots.find('.slot-description').exists()).toBe(true)

    const both = withProvider(
      EmptyState,
      { title: 'Prop title' },
      { title: () => h('span', { class: 'slot-title' }, 'Slot loses') },
    )
    expect(both.text()).toContain('Prop title')
    expect(both.find('.slot-title').exists()).toBe(false)
  })

  it('EmptyState: preserves existing prop-based API (VNode and h render functions)', () => {
    const wrapper = withProvider(EmptyState, {
      icon: h('span', { class: 'prop-icon' }, 'I'),
      title: () => h('span', { class: 'prop-title' }, 'T'),
      description: 'Prop description',
    })
    expect(wrapper.find('.prop-icon').exists()).toBe(true)
    expect(wrapper.find('.prop-title').exists()).toBe(true)
    expect(wrapper.text()).toContain('Prop description')
  })

  it('ComboboxPopover: renders custom option content from the #option slot', () => {
    const wrapper = withProvider(
      ComboboxPopover,
      { data: ['React', 'Vue'], dropdownOpened: true, comboboxProps: { withinPortal: false } },
      {
        default: () => h(ComboboxPopover.Target, null, () => h(Button, null, () => 'Open')),
        option: ({ option }: { option: { value: string; label: string } }) =>
          h('span', { class: 'custom-option' }, `★ ${option.label}`),
      },
    )
    expect(wrapper.findAll('.custom-option').length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('★ React')
  })

  it('ComboboxPopover: renders #nothingFound slot and nothingFoundMessage prop wins', () => {
    const fromSlot = withProvider(
      ComboboxPopover,
      { data: [], dropdownOpened: true, comboboxProps: { withinPortal: false } },
      {
        default: () => h(ComboboxPopover.Target, null, () => h(Button, null, () => 'Open')),
        nothingFound: () => h('span', { class: 'slot-nf' }, 'No data'),
      },
    )
    expect(fromSlot.find('.slot-nf').exists()).toBe(true)

    const both = withProvider(
      ComboboxPopover,
      {
        data: [],
        dropdownOpened: true,
        nothingFoundMessage: 'Prop message',
        comboboxProps: { withinPortal: false },
      },
      {
        default: () => h(ComboboxPopover.Target, null, () => h(Button, null, () => 'Open')),
        nothingFound: () => h('span', { class: 'slot-nf' }, 'Slot loses'),
      },
    )
    expect(both.text()).toContain('Prop message')
    expect(both.find('.slot-nf').exists()).toBe(false)
  })
})
