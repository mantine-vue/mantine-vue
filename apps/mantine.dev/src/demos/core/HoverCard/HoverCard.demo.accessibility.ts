import { defineComponent, h } from 'vue'
import { Anchor, Button, Group, HoverCard, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const card = (target: any, body: any, props: Record<string, any> = {}) =>
  h(HoverCard, { width: 280, shadow: 'md', ...props }, () => [
    h(HoverCard.Target, null, () => target),
    h(HoverCard.Dropdown, null, () => h(Text, { size: 'sm' }, () => body)),
  ])

export const events: MantineDemo = {
  type: 'code',
  component: defineComponent({
    setup: () => () =>
      h(Group, { justify: 'center' }, () => [
        card(
          h(Button, null, () => 'Hover only'),
          'Focusing the target does not open this dropdown',
          { events: { focus: false } },
        ),
        card(
          h(Button, null, () => 'Hover, focus and touch'),
          'This dropdown is also opened by a tap on touch devices',
          { events: { touch: true } },
        ),
      ]),
  }),
  code: `<template>
  <HoverCard :events="{ focus: false }"><HoverCard.Target><Button>Hover only</Button></HoverCard.Target><HoverCard.Dropdown>Focusing the target does not open this dropdown</HoverCard.Dropdown></HoverCard>
  <HoverCard :events="{ touch: true }"><HoverCard.Target><Button>Hover, focus and touch</Button></HoverCard.Target><HoverCard.Dropdown>This dropdown is also opened by a tap on touch devices</HoverCard.Dropdown></HoverCard>
</template>`,
}

export const interactive: MantineDemo = {
  type: 'code',
  component: defineComponent({
    setup: () => () =>
      h(Group, { justify: 'center' }, () => [
        card(
          h(Button, null, () => 'Interactive'),
          [
            'Move the pointer diagonally to the ',
            h(Anchor, { href: 'https://mantine.dev', target: '_blank' }, () => 'link'),
            ' – the dropdown stays open',
          ],
          { interactive: true, position: 'bottom-end', offset: 40 },
        ),
        card(
          h(Button, { variant: 'default' }, () => 'Not interactive'),
          'Moving the pointer outside of the target closes this dropdown',
          { position: 'bottom-end', offset: 40 },
        ),
      ]),
  }),
  code: `<template>
  <HoverCard interactive position="bottom-end" :offset="40">
    <HoverCard.Target><Button>Interactive</Button></HoverCard.Target>
    <HoverCard.Dropdown>Move the pointer diagonally to the link – the dropdown stays open</HoverCard.Dropdown>
  </HoverCard>
</template>`,
}

export const keyboard: MantineDemo = {
  type: 'code',
  component: defineComponent({
    setup: () => () =>
      h(Group, { justify: 'center' }, () => [
        h(Button, { variant: 'default' }, () => 'Press Tab to move focus'),
        card(
          h(Button, null, () => 'Hover or focus me'),
          'The dropdown opens when the target is hovered or focused. Press Escape to close it.',
        ),
      ]),
  }),
  code: `<template><Button variant="default">Press Tab to move focus</Button><HoverCard><HoverCard.Target><Button>Hover or focus me</Button></HoverCard.Target><HoverCard.Dropdown>Press Escape to close it.</HoverCard.Dropdown></HoverCard></template>`,
}

export const role: MantineDemo = {
  type: 'code',
  component: defineComponent({
    setup: () => () =>
      h(Group, { justify: 'center' }, () =>
        card(
          h(Text, { td: 'underline dotted', tabindex: 0, w: 'fit-content' }, () => 'Hydration'),
          'Attaching Vue event handlers to the HTML that was rendered on the server',
          { role: 'tooltip' },
        ),
      ),
  }),
  code: `<template><HoverCard role="tooltip"><HoverCard.Target><Text td="underline dotted" tabindex="0">Hydration</Text></HoverCard.Target><HoverCard.Dropdown>Attaching Vue event handlers to server-rendered HTML</HoverCard.Dropdown></HoverCard></template>`,
}
