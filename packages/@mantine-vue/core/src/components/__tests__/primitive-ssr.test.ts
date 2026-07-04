import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import {
  Flex,
  FocusTrap,
  FocusTrapInitialFocus,
  AspectRatio,
  Center,
  Container,
  Divider,
  Anchor,
  ActionIcon,
  ActionIconGroup,
  ActionIconGroupSection,
  AngleSlider,
  BackgroundImage,
  Badge,
  Button,
  ButtonGroup,
  ButtonGroupSection,
  Burger,
  Collapse,
  CopyButton,
  LoadingOverlay,
  Card,
  CardSection,
  Alert,
  Blockquote,
  Breadcrumbs,
  List,
  ListItem,
  Indicator,
  Avatar,
  AvatarGroup,
  SimpleGrid,
  Grid,
  GridCol,
  ScrollArea,
  Scroller,
  Table,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  TableTbody,
  Progress,
  ProgressLabel,
  ProgressRoot,
  ProgressSection,
  RingProgress,
  RollingNumber,
  Timeline,
  TimelineItem,
  Highlight,
  Typography,
  SemiCircleProgress,
  Spoiler,
  Fieldset,
  FileButton,
  FileInput,
  Notification,
  NumberFormatter,
  NumberInput,
  PinInput,
  NativeSelect,
  NavLink,
  Marquee,
  Affix,
  Dialog,
  Rating,
  FloatingIndicator,
  SegmentedControl,
  Pagination,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Input,
  InputWrapper,
  JsonInput,
  TextInput,
  Textarea,
  PasswordInput,
  Pill,
  PillGroup,
  PillsInput,
  PillsInputField,
  Checkbox,
  CheckboxCard,
  CheckboxGroup,
  CheckboxIndicator,
  Chip,
  ChipGroup,
  Radio,
  RadioCard,
  RadioGroup,
  RadioIndicator,
  Switch,
  SwitchGroup,
  Code,
  CloseButton,
  ColorSwatch,
  Loader,
  MantineProvider,
  Mark,
  Image,
  Overlay,
  Paper,
  Portal,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Skeleton,
  UnstyledButton,
  VisuallyHidden,
  Stepper,
  StepperStep,
  StepperCompleted,
  OverflowList,
  TableOfContents,
  FloatingWindow,
  Slider,
  RangeSlider,
  ColorPicker,
  HueSlider,
  AlphaSlider,
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  AppShellAside,
  AppShellFooter,
} from '../../index'

describe('@mantine-vue/core primitive SSR', () => {
  it('renders provider and primitive components without browser globals', async () => {
    const app = createSSRApp({
      render: () =>
        h(MantineProvider, null, () => [
          h(VisuallyHidden, null, () => 'Accessible'),
          h(FocusTrap, { active: false }, () =>
            h('div', [h(FocusTrapInitialFocus), h('button', 'SSR focus trap')]),
          ),
          h(Flex, { gap: 'md' }, () => h(Stack, { gap: 'xs' }, () => 'Layout')),
          h(Center, null, () => h(Container, { size: 'sm' }, () => h(AspectRatio, { ratio: 1 }))),
          h(Divider, { label: 'SSR divider' }),
          h(Title, { order: 2 }, () => 'SSR title'),
          h(Text, { span: true }, () => h(Mark, null, () => 'SSR text')),
          h(Anchor, { href: '#ssr' }, () => h(Code, null, () => 'SSR code')),
          h(Image, { src: '/ssr.png', radius: 'sm' }),
          h(BackgroundImage, { src: '/bg.png' }, () => 'SSR background'),
          h(Skeleton, { visible: true, height: 16 }),
          h(ColorSwatch, { color: '#fff' }),
          h(AngleSlider, { defaultValue: 90, name: 'ssr-angle' }),
          h(Badge, { variant: 'light' }, () => 'SSR badge'),
          h(ThemeIcon, { variant: 'outline' }, () => 'T'),
          h(ActionIconGroup, null, () => [
            h(ActionIcon, null, () => 'SSR action'),
            h(ActionIconGroupSection, null, () => 'SSR section'),
          ]),
          h(ButtonGroup, null, () => [
            h(Button, { leftSection: 'L' }, () => 'SSR button'),
            h(ButtonGroupSection, null, () => 'SSR button section'),
          ]),
          h(Burger, null, () => h(VisuallyHidden, null, () => 'SSR burger')),
          h(Collapse, { expanded: true }, () => 'SSR collapse'),
          h(
            CopyButton,
            { value: 'SSR copy' },
            {
              default: ({ copied }: any) =>
                h(Button, null, () => (copied ? 'SSR copied' : 'SSR copy')),
            },
          ),
          h(LoadingOverlay, { visible: true }),
          h(Card, { withBorder: true }, () => [
            h(CardSection, null, () => 'SSR card section'),
            h('span', 'SSR card'),
          ]),
          h(Alert, { title: 'SSR alert title' }, () => 'SSR alert'),
          h(Blockquote, { cite: 'SSR cite' }, () => 'SSR quote'),
          h(Breadcrumbs, null, () => [h('span', 'SSR crumb 1'), h('span', 'SSR crumb 2')]),
          h(List, null, () => h(ListItem, null, () => 'SSR list item')),
          h(Indicator, { label: 'SSR indicator' }, () => 'SSR target'),
          h(AvatarGroup, null, () => h(Avatar, { name: 'SSR User' })),
          h(SimpleGrid, { cols: 2 }, () => [h('span', 'SSR grid a'), h('span', 'SSR grid b')]),
          h(Grid, null, () => h(GridCol, { span: 6 }, () => 'SSR grid col')),
          h(ScrollArea, { type: 'always', h: 80 }, () => h('div', 'SSR scroll area')),
          h(Scroller, { showEndControl: true }, () => h('span', 'SSR scroller item')),
          h(Table, { withColumnBorders: true }, () => [
            h(TableThead, null, () =>
              h(TableTr, null, () => h(TableTh, null, () => 'SSR heading')),
            ),
            h(TableTbody, null, () => h(TableTr, null, () => h(TableTd, null, () => 'SSR cell'))),
          ]),
          h(Progress, { value: 40, 'aria-label': 'SSR progress' }),
          h(ProgressRoot, null, () => [
            h(ProgressSection, { value: 60 }, () =>
              h(ProgressLabel, null, () => 'SSR progress label'),
            ),
          ]),
          h(RingProgress, { sections: [{ value: 45, color: 'blue' }], label: 'SSR ring progress' }),
          h(RollingNumber, {
            value: 1234.5,
            prefix: 'SSR rolling ',
            thousandSeparator: true,
            decimalScale: 1,
          }),
          h(Timeline, { active: 1 }, () => [
            h(
              TimelineItem,
              { title: 'SSR timeline first', bullet: '1' },
              () => 'SSR timeline body',
            ),
            h(
              TimelineItem,
              { title: 'SSR timeline second', bullet: '2' },
              () => 'SSR timeline body 2',
            ),
          ]),
          h(Highlight, { highlight: 'SSR' }, () => 'SSR highlighted text'),
          h(Typography, null, () => h('p', 'SSR typography paragraph')),
          h(SemiCircleProgress, { value: 55, label: 'SSR semicircle' }),
          h(
            Spoiler,
            { showLabel: 'Show SSR', hideLabel: 'Hide SSR', maxHeight: 20 },
            () => 'SSR spoiler content',
          ),
          h(Fieldset, { legend: 'SSR fieldset legend' }, () => 'SSR fieldset content'),
          h(
            FileButton,
            { onChange: () => {} },
            { default: ({ onClick }: any) => h(Button, { onClick }, () => 'SSR file button') },
          ),
          h(FileInput, { placeholder: 'SSR file input placeholder' }),
          h(Notification, { title: 'SSR notification', icon: '!' }, () => 'SSR notification body'),
          h(NumberFormatter, { value: 123456, thousandSeparator: ',' }),
          h(NumberInput, {
            id: 'ssr-number-input',
            label: 'SSR number input label',
            defaultValue: 12,
          }),
          h(PinInput, { id: 'ssr-pin-input', defaultValue: '123', name: 'ssr-pin' }),
          h(NativeSelect, {
            id: 'ssr-native-select',
            label: 'SSR native select label',
            data: ['SSR native option'],
          }),
          h(
            NavLink,
            { label: 'SSR nav link', description: 'SSR nav description', defaultOpened: true },
            () => h(NavLink, { label: 'SSR nested nav link' }),
          ),
          h(Marquee, { repeat: 2 }, () => h('span', 'SSR marquee item')),
          h(Affix, { withinPortal: false }, () => 'SSR affix'),
          h(
            Dialog,
            {
              opened: true,
              withinPortal: false,
              withCloseButton: true,
              transitionProps: { duration: 0 },
            },
            () => 'SSR dialog',
          ),
          h(Rating, { value: 3, readOnly: true }),
          h(FloatingIndicator, { parent: null, target: null }),
          h(SegmentedControl, {
            data: ['SSR segment one', 'SSR segment two'],
            transitionDuration: 0,
          }),
          h(Pagination, { total: 8, withEdges: true }),
          h(Tabs, { defaultValue: 'first', id: 'ssr-tabs' }, () => [
            h(TabsList, null, () => [
              h(TabsTab, { value: 'first' }, () => 'SSR tab first'),
              h(TabsTab, { value: 'second' }, () => 'SSR tab second'),
            ]),
            h(TabsPanel, { value: 'first' }, () => 'SSR tab panel'),
          ]),
          h(
            Accordion,
            { defaultValue: 'item-1', id: 'ssr-accordion', transitionDuration: 0 },
            () => [
              h(AccordionItem, { value: 'item-1' }, () => [
                h(AccordionControl, null, () => 'SSR accordion control'),
                h(AccordionPanel, null, () => 'SSR accordion panel'),
              ]),
            ],
          ),
          h(
            InputWrapper,
            { id: 'ssr-input', label: 'SSR input label', description: 'SSR input description' },
            () => h(Input, { placeholder: 'SSR input' }),
          ),
          h(JsonInput, {
            id: 'ssr-json-input',
            label: 'SSR json input label',
            defaultValue: '{"ok":true}',
          }),
          h(TextInput, {
            id: 'ssr-text-input',
            label: 'SSR text input label',
            placeholder: 'SSR text input',
          }),
          h(Textarea, {
            id: 'ssr-textarea',
            label: 'SSR textarea label',
            value: 'SSR textarea value',
          }),
          h(PasswordInput, { id: 'ssr-password', label: 'SSR password label', value: 'secret' }),
          h(PillGroup, null, () => h(Pill, { withRemoveButton: true }, () => 'SSR pill')),
          h(PillsInput, { id: 'ssr-pills', label: 'SSR pills input label' }, () =>
            h(PillGroup, null, () => [
              h(Pill, null, () => 'SSR pills input pill'),
              h(PillsInputField, { placeholder: 'SSR pills field' }),
            ]),
          ),
          h(Checkbox, { id: 'ssr-checkbox', label: 'SSR checkbox label', checked: true }),
          h(
            CheckboxGroup,
            { defaultValue: ['first'], name: 'ssr-checkbox-group', label: 'SSR checkbox group' },
            () => [
              h(Checkbox, { value: 'first', label: 'SSR checkbox group item' }),
              h(CheckboxCard, { value: 'second' }, () => h(CheckboxIndicator)),
            ],
          ),
          h(Chip, { value: 'ssr-chip', checked: true }, () => 'SSR chip'),
          h(ChipGroup, { defaultValue: 'first' }, () => [
            h(Chip, { value: 'first' }, () => 'SSR chip group first'),
            h(Chip, { value: 'second' }, () => 'SSR chip group second'),
          ]),
          h(Radio, { id: 'ssr-radio', label: 'SSR radio label', checked: true }),
          h(
            RadioGroup,
            { defaultValue: 'first', name: 'ssr-radio-group', label: 'SSR radio group' },
            () => [
              h(Radio, { value: 'first', label: 'SSR radio group item' }),
              h(RadioCard, { value: 'second' }, () => h(RadioIndicator)),
            ],
          ),
          h(Switch, { id: 'ssr-switch', label: 'SSR switch label', checked: true }),
          h(
            SwitchGroup,
            { defaultValue: ['first'], name: 'ssr-switch-group', label: 'SSR switch group' },
            () => h(Switch, { value: 'first', label: 'SSR switch group item' }),
          ),
          h(CloseButton, null),
          h(Paper, { withBorder: true }, () => h(UnstyledButton, null, () => 'Action')),
          h(Overlay, { center: true }, () => h(Loader, { type: 'bars' })),
          h(Portal, null, () => 'Client only'),
          h(Stepper, { active: 1 }, () => [
            h(StepperStep, { label: 'SSR step one' }, () => 'SSR first step content'),
            h(StepperStep, { label: 'SSR step two' }, () => 'SSR active step content'),
            h(StepperCompleted, null, () => 'SSR completed content'),
          ]),
          h(OverflowList, {
            data: ['SSR overflow one', 'SSR overflow two'],
            renderItem: (item: string) => h('span', item),
            renderOverflow: (items: string[]) => h('span', `+${items.length}`),
          }),
          h(TableOfContents, {
            initialData: [{ depth: 1, value: 'SSR table of contents', id: 'ssr-toc' }],
          }),
          h(
            FloatingWindow,
            { withinPortal: false, initialPosition: { left: 10, top: 10 } },
            () => 'SSR floating window',
          ),
          h(Slider, {
            defaultValue: 35,
            name: 'ssr-slider',
            marks: [{ value: 35, label: 'SSR slider mark' }],
          }),
          h(RangeSlider, { defaultValue: [20, 80], name: 'ssr-range-slider' }),
          h(ColorPicker, {
            defaultValue: '#ff000080',
            format: 'hexa',
            name: 'ssr-color-picker',
            swatches: ['#ff0000'],
          }),
          h(HueSlider, { value: 120, 'aria-label': 'SSR hue slider' }),
          h(AlphaSlider, { value: 0.5, color: '#00ff00', 'aria-label': 'SSR alpha slider' }),
          h(
            AppShell,
            {
              id: 'ssr-app-shell',
              mode: 'static',
              header: { height: 50 },
              navbar: { width: 200, breakpoint: 'sm' },
              aside: { width: 160, breakpoint: 'md' },
              footer: { height: 40 },
            },
            () => [
              h(AppShellHeader, null, () => 'SSR app header'),
              h(AppShellNavbar, null, () => 'SSR app navbar'),
              h(AppShellAside, null, () => 'SSR app aside'),
              h(AppShellMain, null, () => 'SSR app main'),
              h(AppShellFooter, null, () => 'SSR app footer'),
            ],
          ),
        ]),
    })

    const html = await renderToString(app)

    expect(html).toContain('Accessible')
    expect(html).toContain('SSR focus trap')
    expect(html).toContain('Layout')
    expect(html).toContain('SSR divider')
    expect(html).toContain('SSR title')
    expect(html).toContain('SSR text')
    expect(html).toContain('SSR code')
    expect(html).toContain('SSR background')
    expect(html).toContain('ssr-angle')
    expect(html).toContain('SSR badge')
    expect(html).toContain('SSR action')
    expect(html).toContain('SSR section')
    expect(html).toContain('SSR button')
    expect(html).toContain('SSR button section')
    expect(html).toContain('SSR burger')
    expect(html).toContain('SSR collapse')
    expect(html).toContain('SSR copy')
    expect(html).toContain('mantine-LoadingOverlay-root')
    expect(html).toContain('SSR card section')
    expect(html).toContain('SSR card')
    expect(html).toContain('SSR alert title')
    expect(html).toContain('SSR alert')
    expect(html).toContain('SSR quote')
    expect(html).toContain('SSR cite')
    expect(html).toContain('SSR crumb 1')
    expect(html).toContain('SSR crumb 2')
    expect(html).toContain('SSR list item')
    expect(html).toContain('SSR indicator')
    expect(html).toContain('SSR target')
    expect(html).toContain('SU')
    expect(html).toContain('SSR grid a')
    expect(html).toContain('SSR grid b')
    expect(html).toContain('SSR grid col')
    expect(html).toContain('SSR scroll area')
    expect(html).toContain('SSR scroller item')
    expect(html).toContain('SSR heading')
    expect(html).toContain('SSR cell')
    expect(html).toContain('SSR progress label')
    expect(html).toContain('SSR ring progress')
    expect(html).toContain('SSR rolling 1,234.5')
    expect(html).toContain('SSR timeline first')
    expect(html).toContain('SSR timeline body')
    expect(html).toContain('data-highlight="SSR"')
    expect(html).toContain('highlighted text')
    expect(html).toContain('SSR typography paragraph')
    expect(html).toContain('SSR semicircle')
    expect(html).toContain('SSR spoiler content')
    expect(html).toContain('SSR fieldset legend')
    expect(html).toContain('SSR file button')
    expect(html).toContain('SSR file input placeholder')
    expect(html).toContain('SSR notification')
    expect(html).toContain('123,456')
    expect(html).toContain('SSR number input label')
    expect(html).toContain('ssr-pin')
    expect(html).toContain('SSR native select label')
    expect(html).toContain('SSR native option')
    expect(html).toContain('SSR nav link')
    expect(html).toContain('SSR nav description')
    expect(html).toContain('SSR nested nav link')
    expect(html).toContain('SSR marquee item')
    expect(html).toContain('SSR affix')
    expect(html).toContain('SSR dialog')
    expect(html).toContain('mantine-Rating-root')
    expect(html).toContain('SSR segment one')
    expect(html).toContain('SSR segment two')
    expect(html).toContain('mantine-Pagination-root')
    expect(html).toContain('SSR tab panel')
    expect(html).toContain('SSR accordion panel')
    expect(html).toContain('SSR input label')
    expect(html).toContain('SSR json input label')
    expect(html).toContain('SSR text input label')
    expect(html).toContain('SSR textarea label')
    expect(html).toContain('SSR password label')
    expect(html).toContain('SSR pill')
    expect(html).toContain('SSR pills input label')
    expect(html).toContain('SSR pills input pill')
    expect(html).toContain('SSR checkbox label')
    expect(html).toContain('SSR checkbox group')
    expect(html).toContain('SSR checkbox group item')
    expect(html).toContain('SSR chip')
    expect(html).toContain('SSR chip group first')
    expect(html).toContain('SSR chip group second')
    expect(html).toContain('SSR radio label')
    expect(html).toContain('SSR radio group')
    expect(html).toContain('SSR radio group item')
    expect(html).toContain('SSR switch label')
    expect(html).toContain('SSR switch group')
    expect(html).toContain('SSR switch group item')
    expect(html).toContain('Action')
    expect(html).not.toContain('Client only')
    expect(html).toContain('SSR step one')
    expect(html).toContain('SSR active step content')
    expect(html).toContain('SSR overflow one')
    expect(html).toContain('SSR table of contents')
    expect(html).toContain('SSR floating window')
    expect(html).toContain('SSR slider mark')
    expect(html).toContain('ssr-range-slider_from')
    expect(html).toContain('ssr-color-picker')
    expect(html).toContain('SSR hue slider')
    expect(html).toContain('SSR alpha slider')
    expect(html).toContain('SSR app header')
    expect(html).toContain('SSR app navbar')
    expect(html).toContain('SSR app main')
  })
})
