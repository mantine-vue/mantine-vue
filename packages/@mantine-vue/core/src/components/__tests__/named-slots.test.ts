import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Alert,
  Button,
  Checkbox,
  ColorInput,
  ComboboxPopover,
  Divider,
  EmptyState,
  MantineProvider,
  PasswordInput,
  Radio,
  Scroller,
  Splitter,
  SplitterPane,
  Stepper,
  StepperStep,
  TextInput,
  Textarea,
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
  it('Alert: prop title/icon and slot title/icon both render, slot taking precedence', () => {
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

    // Slot wins over prop (precedence)
    const both = withProvider(
      Alert,
      { title: 'Prop loses' },
      {
        title: () => h('span', { class: 'slot-title' }, 'Slot wins'),
      },
    )
    expect(both.text()).toContain('Slot wins')
    expect(both.find('.slot-title').exists()).toBe(true)
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

  it('EmptyState: renders icon/title/description from named slots and slots take precedence', () => {
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
      { title: () => h('span', { class: 'slot-title' }, 'Slot title') },
    )
    expect(both.text()).toContain('Slot title')
    expect(both.find('.slot-title').exists()).toBe(true)
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

  it('ComboboxPopover: renders #nothingFound slot and it wins over the nothingFoundMessage prop', () => {
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
        nothingFound: () => h('span', { class: 'slot-nf' }, 'Slot wins'),
      },
    )
    expect(both.text()).toContain('Slot wins')
    expect(both.find('.slot-nf').exists()).toBe(true)
  })

  it('Accordion: #chevron slot is used by every control, chevron prop wins', () => {
    const accordionItems = () => [
      h(AccordionItem, { value: 'item-1' }, () => [
        h(AccordionControl, null, () => 'Label 1'),
        h(AccordionPanel, null, () => 'Panel 1'),
      ]),
      h(AccordionItem, { value: 'item-2' }, () => [
        h(AccordionControl, null, () => 'Label 2'),
        h(AccordionPanel, null, () => 'Panel 2'),
      ]),
    ]

    const fromSlot = withProvider(
      Accordion,
      { transitionDuration: 0 },
      { default: accordionItems, chevron: () => h('span', { class: 'slot-chevron' }, '+') },
    )
    expect(fromSlot.findAll('.slot-chevron')).toHaveLength(2)

    const both = withProvider(
      Accordion,
      { transitionDuration: 0, chevron: h('span', { class: 'prop-chevron' }, '-') },
      { default: accordionItems, chevron: () => h('span', { class: 'slot-chevron' }, '+') },
    )
    expect(both.findAll('.prop-chevron')).toHaveLength(2)
    expect(both.find('.slot-chevron').exists()).toBe(false)
  })

  it('Accordion: chevron={null} still renders no chevron content', () => {
    const wrapper = withProvider(
      Accordion,
      { transitionDuration: 0, chevron: null },
      {
        default: () => [
          h(AccordionItem, { value: 'item-1' }, () => [
            h(AccordionControl, null, () => 'Label 1'),
            h(AccordionPanel, null, () => 'Panel 1'),
          ]),
        ],
      },
    )
    expect(wrapper.find('.mantine-Accordion-chevron svg').exists()).toBe(false)
  })

  it('ColorInput: renders #eyeDropperIcon slot, it wins over the eyeDropperIcon prop', () => {
    ;(window as any).EyeDropper = class {}

    const fromSlot = withProvider(
      ColorInput,
      {},
      { eyeDropperIcon: () => h('span', { class: 'slot-eye' }, 'E') },
    )
    expect(fromSlot.find('.slot-eye').exists()).toBe(true)

    const both = withProvider(
      ColorInput,
      { eyeDropperIcon: h('span', { class: 'prop-eye' }, 'E') },
      { eyeDropperIcon: () => h('span', { class: 'slot-eye' }, 'E') },
    )
    expect(both.find('.slot-eye').exists()).toBe(true)
    expect(both.find('.prop-eye').exists()).toBe(false)

    delete (window as any).EyeDropper
  })

  it('Scroller: renders #startControlIcon and #endControlIcon slots, slots win', () => {
    const fromSlots = withProvider(
      Scroller,
      {},
      {
        default: () => h('div', 'content'),
        startControlIcon: () => h('span', { class: 'slot-start' }, '<'),
        endControlIcon: () => h('span', { class: 'slot-end' }, '>'),
      },
    )
    expect(fromSlots.find('.slot-start').exists()).toBe(true)
    expect(fromSlots.find('.slot-end').exists()).toBe(true)

    const both = withProvider(
      Scroller,
      { startControlIcon: h('span', { class: 'prop-start' }, '<') },
      {
        default: () => h('div', 'content'),
        startControlIcon: () => h('span', { class: 'slot-start' }, '<'),
      },
    )
    expect(both.find('.slot-start').exists()).toBe(true)
    expect(both.find('.prop-start').exists()).toBe(false)
  })

  it('Splitter: renders #handleIcon slot in the handle, it wins over the handleIcon prop', () => {
    const panes = () => [
      h(SplitterPane, { defaultSize: 50 }, () => 'left'),
      h(SplitterPane, { defaultSize: 50 }, () => 'right'),
    ]

    const fromSlot = withProvider(
      Splitter,
      { withHandle: true },
      { default: panes, handleIcon: () => h('span', { class: 'slot-handle' }, '::') },
    )
    expect(fromSlot.find('.slot-handle').exists()).toBe(true)

    const both = withProvider(
      Splitter,
      { withHandle: true, handleIcon: h('span', { class: 'prop-handle' }, '::') },
      { default: panes, handleIcon: () => h('span', { class: 'slot-handle' }, '::') },
    )
    expect(both.find('.slot-handle').exists()).toBe(true)
    expect(both.find('.prop-handle').exists()).toBe(false)
  })

  it('Textarea: renders #bottomSection slot, it wins over the bottomSection prop', () => {
    const fromSlot = withProvider(
      Textarea,
      {},
      { bottomSection: () => h('span', { class: 'slot-bottom' }, '0/100') },
    )
    expect(fromSlot.find('.slot-bottom').exists()).toBe(true)

    const both = withProvider(
      Textarea,
      { bottomSection: h('span', { class: 'prop-bottom' }, '0/100') },
      { bottomSection: () => h('span', { class: 'slot-bottom' }, '0/100') },
    )
    expect(both.find('.slot-bottom').exists()).toBe(true)
    expect(both.find('.prop-bottom').exists()).toBe(false)
  })

  it('PasswordInput: #visibilityToggleIcon slot receives the reveal payload', async () => {
    const wrapper = withProvider(
      PasswordInput,
      {},
      {
        visibilityToggleIcon: ({ reveal }: { reveal: boolean }) =>
          h('span', { class: 'slot-toggle' }, reveal ? 'visible' : 'hidden'),
      },
    )
    expect(wrapper.find('.slot-toggle').text()).toBe('hidden')

    await wrapper.find('button').trigger('mousedown')
    expect(wrapper.find('.slot-toggle').text()).toBe('visible')
  })

  it('PasswordInput: #visibilityToggleIcon slot wins over the visibilityToggleIcon prop', () => {
    const wrapper = withProvider(
      PasswordInput,
      { visibilityToggleIcon: { render: () => h('span', { class: 'prop-toggle' }) } },
      { visibilityToggleIcon: () => h('span', { class: 'slot-toggle' }) },
    )
    expect(wrapper.find('.slot-toggle').exists()).toBe(true)
    expect(wrapper.find('.prop-toggle').exists()).toBe(false)
  })

  it('Stepper.Step: step level #icon slot is not shadowed by the injected step number', () => {
    const wrapper = withProvider(
      Stepper,
      { active: 0 },
      {
        default: () => [
          h(
            StepperStep,
            { label: 'Step 1' },
            { icon: () => h('span', { class: 'slot-icon' }, 'A') },
          ),
          h(StepperStep, { label: 'Step 2' }),
        ],
      },
    )

    expect(wrapper.find('.slot-icon').exists()).toBe(true)
    // The step without its own icon still falls back to the step number
    expect(wrapper.text()).toContain('2')
  })

  it('Stepper.Step: step icon prop wins over the step #icon slot', () => {
    const wrapper = withProvider(
      Stepper,
      { active: 0 },
      {
        default: () => [
          h(
            StepperStep,
            { label: 'Step 1', icon: h('span', { class: 'prop-icon' }) },
            { icon: () => h('span', { class: 'slot-icon' }) },
          ),
        ],
      },
    )

    expect(wrapper.find('.prop-icon').exists()).toBe(true)
    expect(wrapper.find('.slot-icon').exists()).toBe(false)
  })

  it('Stepper: root #icon slot is the fallback for steps without their own icon slot', () => {
    const wrapper = withProvider(
      Stepper,
      { active: 0 },
      {
        default: () => [
          h(StepperStep, { label: 'Step 1' }, { icon: () => h('span', { class: 'own-icon' }) }),
          h(StepperStep, { label: 'Step 2' }),
        ],
        icon: () => h('span', { class: 'inherited-icon' }),
      },
    )

    expect(wrapper.findAll('.own-icon')).toHaveLength(1)
    expect(wrapper.findAll('.inherited-icon')).toHaveLength(1)
  })
})
