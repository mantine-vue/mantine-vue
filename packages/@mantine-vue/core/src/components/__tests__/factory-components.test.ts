import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import {
  Breadcrumbs,
  Card,
  Checkbox,
  Container,
  Drawer,
  Grid,
  Group,
  Loader,
  MantineProvider,
  Modal,
  NativeSelect,
  NumberInput,
  PinInput,
  Progress,
  Radio,
  RangeSlider,
  ScrollArea,
  SimpleGrid,
  Slider,
  Stack,
  Switch,
  TableScrollContainer,
  Textarea,
  Timeline,
} from '../../index'

function render(testCase: FactoryCase, props: Record<string, any> = {}, children?: any) {
  const node = () => h(testCase.component, { ...testCase.required, ...props }, children)

  return mount({
    render: () =>
      h(MantineProvider, { env: 'test' }, () =>
        testCase.parent ? h(testCase.parent, {}, node) : node(),
      ),
  })
}

interface FactoryCase {
  name: string
  component: any
  tag: string
  required?: Record<string, any>
  statics?: string[]
  parent?: any
}

const CASES: FactoryCase[] = [
  { name: 'Stack', component: Stack, tag: 'DIV' },
  { name: 'Container', component: Container, tag: 'DIV' },
  { name: 'Card', component: Card, tag: 'DIV', statics: ['Section'] },
  { name: 'Grid', component: Grid, tag: 'DIV', statics: ['Col'] },
  { name: 'GridCol', component: Grid.Col, tag: 'DIV', parent: Grid },
  { name: 'SimpleGrid', component: SimpleGrid, tag: 'DIV' },
  { name: 'Checkbox', component: Checkbox, tag: 'DIV', statics: ['Group', 'Indicator', 'Card'] },
  { name: 'Radio', component: Radio, tag: 'DIV', statics: ['Group', 'Indicator', 'Card'] },
  { name: 'Switch', component: Switch, tag: 'DIV', statics: ['Group'] },
  { name: 'PinInput', component: PinInput, tag: 'DIV' },
  { name: 'Group', component: Group, tag: 'DIV', statics: ['withProps'] },
  { name: 'Breadcrumbs', component: Breadcrumbs, tag: 'DIV' },
  { name: 'Timeline', component: Timeline, tag: 'DIV', statics: ['Item'] },
  { name: 'Loader', component: Loader, tag: 'SPAN', statics: ['defaultLoaders'] },
  {
    name: 'Progress',
    component: Progress,
    tag: 'DIV',
    required: { value: 50 },
    statics: ['Root', 'Section', 'Label'],
  },
  { name: 'ScrollArea', component: ScrollArea, tag: 'DIV', statics: ['Autosize'] },
  {
    name: 'TableScrollContainer',
    component: TableScrollContainer,
    tag: 'DIV',
    required: { minWidth: 500 },
  },
  { name: 'Slider', component: Slider, tag: 'DIV' },
  { name: 'RangeSlider', component: RangeSlider, tag: 'DIV' },
  { name: 'NativeSelect', component: NativeSelect, tag: 'SELECT', required: { data: ['a', 'b'] } },
  { name: 'NumberInput', component: NumberInput, tag: 'INPUT' },
  { name: 'Textarea', component: Textarea, tag: 'TEXTAREA' },
]

describe('@mantine-vue/core factory() components', () => {
  it.each(CASES)('$name receives the root node through rootRef', async (testCase: FactoryCase) => {
    const rootRef = ref<Element | null>(null)
    render(testCase, { rootRef })
    await nextTick()

    expect(rootRef.value).toBeInstanceOf(Element)
    expect(rootRef.value?.tagName).toBe(testCase.tag)
  })

  it.each(CASES)('$name accepts a callback rootRef', async (testCase: FactoryCase) => {
    let node: Element | null = null
    render(testCase, {
      rootRef: (value: Element | null) => {
        node = value
      },
    })
    await nextTick()

    expect(node).toBeInstanceOf(Element)
  })

  it.each(CASES)('$name exposes rootElement', async (testCase: FactoryCase) => {
    const wrapper = render(testCase)
    await nextTick()

    const instance = wrapper.findComponent(testCase.component)
    expect((instance.vm as any).rootElement).toBeInstanceOf(Element)
  })

  it.each(CASES.filter((testCase) => testCase.statics))(
    '$name attaches the statics its payload advertises',
    (testCase: FactoryCase) => {
      for (const key of testCase.statics!) {
        expect(testCase.component[key]).toBeTruthy()
      }
    },
  )

  it.each(CASES)('$name carries the shared static API', (testCase: FactoryCase) => {
    expect(typeof testCase.component.extend).toBe('function')
    expect(typeof testCase.component.withProps).toBe('function')
  })

  it('withProps is chainable and caller props win', async () => {
    const Fixed = Stack.withProps({ gap: 'xl' })
    const Rechained = Fixed.withProps({ align: 'center' })

    expect(typeof Rechained.withProps).toBe('function')

    const wrapper = render(
      { name: 'Stack.withProps', component: Rechained, tag: 'DIV' },
      {
        gap: 'xs',
      },
    )
    await nextTick()

    expect(wrapper.html()).toContain('--stack-gap: var(--mantine-spacing-xs)')
    expect(wrapper.html()).toContain('--stack-align: center')
  })

  describe('components wired through their compound parts', () => {
    it('Drawer exposes the parts its payload advertises', () => {
      for (const key of [
        'Root',
        'Overlay',
        'Content',
        'Body',
        'Header',
        'Title',
        'CloseButton',
        'Stack',
      ]) {
        expect((Drawer as any)[key]).toBeTruthy()
      }
      expect(typeof Drawer.extend).toBe('function')
      expect(Drawer.classes).toBeTruthy()
    })

    it('Modal exposes the parts its payload advertises', () => {
      for (const key of ['Root', 'Overlay', 'Content', 'Body', 'Header', 'Title', 'CloseButton']) {
        expect((Modal as any)[key]).toBeTruthy()
      }
      expect(typeof Modal.extend).toBe('function')
      expect(Modal.classes).toBeTruthy()
    })
  })
})
