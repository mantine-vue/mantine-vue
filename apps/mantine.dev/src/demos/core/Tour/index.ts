import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { PhBell, PhGearSix, PhMagnifyingGlass } from '@phosphor-icons/vue'
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Group,
  Indicator,
  ScrollArea,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  TextInput,
  Tour,
} from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import classes from './Tour.demo.styles.module.css'

interface StepConfig {
  target?: string
  title: string
  body: string
  position?: any
  targetLabel?: string
  input?: boolean
  startsTour?: boolean
  variant?: string
}

function guidedComponent(prefix: string, steps: StepConfig[], options: Record<string, any> = {}) {
  void prefix
  return defineComponent({
    inheritAttrs: false,
    setup(_props, { attrs }) {
      const active = ref(false)
      const step = ref(0)
      const start = (at = 0) => {
        step.value = at
        active.value = true
      }
      return () =>
        h('div', [
          h(Group, null, () =>
            steps
              .filter((item) => item.target)
              .map((item) =>
                item.input
                  ? h(TextInput, { id: item.target!.slice(1), placeholder: item.targetLabel })
                  : h(
                      Button,
                      {
                        id: item.target!.slice(1),
                        variant: item.variant,
                        onClick: item.startsTour ? () => start(0) : undefined,
                      },
                      () => item.targetLabel,
                    ),
              ),
          ),
          h(Group, { mt: 'md' }, () =>
            options.controlled
              ? steps.map((_item, index) =>
                  h(Button, { onClick: () => start(index) }, () => `Go to step ${index + 1}`),
                )
              : steps.some((item) => item.startsTour)
                ? null
                : h(Button, { onClick: () => start(0) }, () => options.startLabel ?? 'Start tour'),
          ),
          h(
            Tour,
            {
              ...attrs,
              ...options.props,
              active: active.value,
              step: step.value,
              'onUpdate:step': (value: number) => (step.value = value),
              onClose: () => (active.value = false),
            },
            () =>
              steps.map((item) =>
                h(
                  Tour.Step,
                  {
                    target: item.target,
                    title: item.title,
                    position: item.position,
                  },
                  () => item.body,
                ),
              ),
          ),
        ])
    },
  })
}

const demoCode = (extra = '') => `<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, TextInput, Tour } from '@mantine-vue/core'
const active = ref(false)
const step = ref(0)
</script>
<template>
  <Group><Button id="tour-target-1">First target</Button><TextInput id="tour-target-2" placeholder="Second target" /><Button id="tour-target-3" variant="outline">Third target</Button></Group>
  <Button mt="md" @click="step = 0; active = true">Start tour</Button>
  <Tour :active="active" v-model:step="step" @close="active = false"${extra}>
    <Tour.Step target="#tour-target-1" title="Step 1">This is the first step of the tour.</Tour.Step>
    <Tour.Step target="#tour-target-2" title="Step 2">This is the second step of the tour.</Tour.Step>
    <Tour.Step target="#tour-target-3" title="Step 3">This is the third and final step.</Tour.Step>
  </Tour>
</template>`

const controlledCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, TextInput, Tour } from '@mantine-vue/core'
const active = ref(false)
const step = ref(0)
const open = (value: number) => { step.value = value; active.value = true }
</script>
<template>
  <Group><Button id="controlled-target-1">First target</Button><TextInput id="controlled-target-2" placeholder="Second target" /></Group>
  <Group mt="md"><Button @click="open(0)">Go to step 1</Button><Button @click="open(1)">Go to step 2</Button></Group>
  <Tour :active="active" v-model:step="step" @close="active = false">
    <Tour.Step target="#controlled-target-1" title="Step 1">This is the first step.</Tour.Step>
    <Tour.Step target="#controlled-target-2" title="Step 2">This is the second step.</Tour.Step>
  </Tour>
</template>`

const centeredCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, Tour } from '@mantine-vue/core'
const active = ref(false)
const step = ref(0)
</script>
<template>
  <Button id="centered-target" @click="step = 0; active = true">Start tour</Button>
  <Tour :active="active" v-model:step="step" @close="active = false">
    <Tour.Step title="Welcome">This step has no target and is displayed in the center of the screen.</Tour.Step>
    <Tour.Step target="#centered-target" title="Target step">This step highlights the button.</Tour.Step>
    <Tour.Step title="All done">This final step is also centered with no target.</Tour.Step>
  </Tour>
</template>`

const positionCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, Center, Tour } from '@mantine-vue/core'
const active = ref(false)
const step = ref(0)
</script>
<template>
  <Center :mih="360"><Button id="position-target" @click="step = 0; active = true">Start tour</Button></Center>
  <Tour :active="active" v-model:step="step" @close="active = false">
    <Tour.Step target="#position-target" title="Bottom" position="bottom">Tooltip positioned at the bottom.</Tour.Step>
    <Tour.Step target="#position-target" title="Top" position="top">Tooltip positioned at the top.</Tour.Step>
    <Tour.Step target="#position-target" title="Left" position="left">Tooltip positioned at the left.</Tour.Step>
    <Tour.Step target="#position-target" title="Right" position="right">Tooltip positioned at the right.</Tour.Step>
  </Tour>
</template>`

const labelsCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, TextInput, Tour } from '@mantine-vue/core'
const active = ref(false)
const step = ref(0)
const labels = { next: 'Siguiente', back: 'Anterior', skip: 'Omitir', close: 'Cerrar', stepCounter: (current: number, total: number) => \`\${current} de \${total}\` }
</script>
<template>
  <Group><Button id="labels-target-1">Primer objetivo</Button><TextInput id="labels-target-2" placeholder="Segundo objetivo" /></Group>
  <Button mt="md" @click="step = 0; active = true">Iniciar recorrido</Button>
  <Tour :active="active" v-model:step="step" :labels="labels" @close="active = false">
    <Tour.Step target="#labels-target-1" title="Paso 1">Este es el primer paso del recorrido.</Tour.Step>
    <Tour.Step target="#labels-target-2" title="Paso 2">Este es el segundo paso del recorrido.</Tour.Step>
  </Tour>
</template>`

const beaconCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, TextInput, Tour } from '@mantine-vue/core'
const active = ref(false)
</script>
<template>
  <Group><Button id="beacon-target-1">First target</Button><TextInput id="beacon-target-2" placeholder="Second target" /><Button id="beacon-target-3" variant="outline">Third target</Button></Group>
  <Button mt="md" @click="active = !active">{{ active ? 'End beacon tour' : 'Start beacon tour' }}</Button>
  <Tour :active="active" mode="beacon" :defaultStep="-1" color="teal">
    <Tour.Step target="#beacon-target-1" title="Beacon 1">Click the beacon to see this tooltip.</Tour.Step>
    <Tour.Step target="#beacon-target-2" title="Beacon 2">This is the second beacon tooltip.</Tour.Step>
    <Tour.Step target="#beacon-target-3" title="Beacon 3">This is the third beacon tooltip.</Tour.Step>
  </Tour>
</template>`

const overlayCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, Tour } from '@mantine-vue/core'
const active = ref(false)
const step = ref(0)
</script>
<template>
  <Group><Button id="overlay-target-1">First target</Button><Button id="overlay-target-2" variant="light">Second target</Button></Group>
  <Button mt="md" @click="step = 0; active = true">Start tour</Button>
  <Tour :active="active" v-model:step="step" @close="active = false"{{props}}>
    <Tour.Step target="#overlay-target-1" title="First step">This is the first step of the tour.</Tour.Step>
    <Tour.Step target="#overlay-target-2" title="Second step">This is the second step of the tour.</Tour.Step>
  </Tour>
</template>`

const complexCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PhBell, PhGearSix, PhMagnifyingGlass } from '@phosphor-icons/vue'
import { ActionIcon, Avatar, Badge, Box, Button, Card, Group, Indicator, ScrollArea, Stack, Switch, Table, Tabs, Text, TextInput, Tour } from '@mantine-vue/core'
const active = ref(false)
const step = ref(0)
</script>
<template>
  <Card withBorder>
    <Group justify="space-between" mb="md">
      <Group><Avatar id="complex-avatar" color="blue" radius="xl">JD</Avatar><div><Text size="sm" :fw="500">John Doe</Text><Text size="xs" c="dimmed">Admin</Text></div></Group>
      <Group gap="xs"><TextInput id="complex-search" placeholder="Search..." size="xs" :w="200"><template #leftSection><PhMagnifyingGlass :size="14" /></template></TextInput><Indicator id="complex-notifications" processing><ActionIcon variant="default" size="lg"><PhBell :size="18" /></ActionIcon></Indicator><ActionIcon id="complex-settings" variant="default" size="lg"><PhGearSix :size="18" /></ActionIcon></Group>
    </Group>
    <Tabs id="complex-tabs" defaultValue="overview" mb="md"><Tabs.List><Tabs.Tab value="overview">Overview</Tabs.Tab><Tabs.Tab value="analytics">Analytics</Tabs.Tab><Tabs.Tab value="reports">Reports</Tabs.Tab><Tabs.Tab value="settings">Settings</Tabs.Tab></Tabs.List></Tabs>
    <ScrollArea :h="200" type="always"><Stack gap="md">
      <Group justify="space-between"><Text :fw="500">Recent activity</Text><Badge id="complex-badge" variant="light" color="green">12 new</Badge></Group>
      <Table id="complex-table"><Table.Thead><Table.Tr><Table.Th>User</Table.Th><Table.Th>Action</Table.Th><Table.Th>Status</Table.Th></Table.Tr></Table.Thead><Table.Tbody><Table.Tr><Table.Td>Alice</Table.Td><Table.Td>Created project</Table.Td><Table.Td><Badge color="green" variant="light" size="sm">Complete</Badge></Table.Td></Table.Tr><Table.Tr><Table.Td>Bob</Table.Td><Table.Td>Updated settings</Table.Td><Table.Td><Badge color="blue" variant="light" size="sm">In progress</Badge></Table.Td></Table.Tr><Table.Tr><Table.Td>Carol</Table.Td><Table.Td>Deleted file</Table.Td><Table.Td><Badge color="red" variant="light" size="sm">Failed</Badge></Table.Td></Table.Tr><Table.Tr><Table.Td>Dave</Table.Td><Table.Td>Uploaded report</Table.Td><Table.Td><Badge color="green" variant="light" size="sm">Complete</Badge></Table.Td></Table.Tr><Table.Tr><Table.Td>Eve</Table.Td><Table.Td>Reviewed PR</Table.Td><Table.Td><Badge color="yellow" variant="light" size="sm">Pending</Badge></Table.Td></Table.Tr></Table.Tbody></Table>
      <Box id="complex-preferences" p="md" style="border: 1px solid var(--mantine-color-default-border); border-radius: var(--mantine-radius-default)"><Text :fw="500" mb="xs">Preferences</Text><Stack gap="xs"><Switch label="Email notifications" defaultChecked /><Switch label="Push notifications" /><Switch label="Weekly digest" defaultChecked /></Stack></Box>
    </Stack></ScrollArea>
  </Card>
  <Button mt="md" @click="step = 0; active = true">Start tour</Button>
  <Tour :active="active" v-model:step="step" closeOnOverlayClick @close="active = false">
    <Tour.Step title="Welcome to the dashboard">Let us show you around! This tour will walk you through the main features of your new dashboard.</Tour.Step>
    <Tour.Step target="#complex-avatar" title="Your profile" position="bottom-start">This is your profile section. Click on your avatar to manage account settings, change your role, or sign out.</Tour.Step>
    <Tour.Step target="#complex-search" title="Search" position="bottom">Use the search bar to quickly find projects, users, reports, and settings across the entire application.</Tour.Step>
    <Tour.Step target="#complex-notifications" title="Notifications" position="bottom-end">The notification bell shows real-time alerts. The pulsing indicator means you have unread notifications.</Tour.Step>
    <Tour.Step target="#complex-tabs" title="Navigation tabs" position="bottom">Switch between different sections of your dashboard using these tabs.</Tour.Step>
    <Tour.Step target="#complex-table" title="Activity feed" position="top" :spotlightPadding="16">The activity table shows recent actions by your team members.</Tour.Step>
    <Tour.Step target="#complex-preferences" title="Preferences" position="top" :spotlightPadding="0">Customize which alerts you receive and how often. You are all set!</Tour.Step>
  </Tour>
</template>`

const stylesCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, TextInput, Tour } from '@mantine-vue/core'
import classes from './Demo.module.css'
const active = ref(false)
const step = ref(0)
</script>
<template>
  <Group><Button id="styles-target-1">First target</Button><TextInput id="styles-target-2" placeholder="Second target" /><Button id="styles-target-3" variant="outline">Third target</Button></Group>
  <Button mt="md" @click="step = 0; active = true">Start tour</Button>
  <Tour :active="active" v-model:step="step" :classNames="classes" @close="active = false">
    <Tour.Step target="#styles-target-1" title="Step 1: Welcome">This tour demonstrates how to customize Tour styles with classNames.</Tour.Step>
    <Tour.Step target="#styles-target-2" title="Step 2: Input">You can style every part of the tooltip independently.</Tour.Step>
    <Tour.Step target="#styles-target-3" title="Step 3: Actions">The tooltip, navigation buttons, and counters are all customized.</Tour.Step>
  </Tour>
</template>`

const compoundCode = `<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Button, Group, Tour } from '@mantine-vue/core'
const steps = [{ target: '#compound-1', title: 'Welcome', body: 'Click here to get started with the app.', position: 'bottom' }, { target: '#compound-2', title: 'Settings', body: 'Configure your preferences here.', position: 'bottom' }]
const active = ref(false)
const step = ref(0)
const targetElement = ref<HTMLElement | null>(null)
const targetRect = ref<DOMRect | null>(null)
const currentStep = computed(() => steps[step.value])
const updateRect = () => { targetRect.value = targetElement.value?.getBoundingClientRect() ?? null }
watch([active, step], async () => { await nextTick(); targetElement.value = active.value ? document.querySelector(currentStep.value.target) : null; updateRect() })
onMounted(() => { window.addEventListener('scroll', updateRect, true); window.addEventListener('resize', updateRect) })
onBeforeUnmount(() => { window.removeEventListener('scroll', updateRect, true); window.removeEventListener('resize', updateRect) })
</script>
<template>
  <Group><Button id="compound-1" @click="active = true; step = 0">Start tour</Button><Button id="compound-2" variant="light">Settings</Button></Group>
  <Tour.Root :active="active" v-model:step="step" :stepsCount="steps.length" @close="active = false">
    <Tour.Overlay :targetRect="targetRect" />
    <Tour.Tooltip :targetElement="targetElement" :position="currentStep.position" :mounted="active"><Tour.CloseButton /><Tour.Title>{{ currentStep.title }}</Tour.Title><Tour.Body>{{ currentStep.body }}</Tour.Body><Tour.Navigation /></Tour.Tooltip>
  </Tour.Root>
</template>`

const basicSteps: StepConfig[] = [
  {
    target: '#tour-target-1',
    targetLabel: 'First target',
    title: 'Step 1',
    body: 'This is the first step of the tour.',
  },
  {
    target: '#tour-target-2',
    targetLabel: 'Second target',
    input: true,
    title: 'Step 2',
    body: 'This is the second step of the tour.',
  },
  {
    target: '#tour-target-3',
    targetLabel: 'Third target',
    variant: 'outline',
    title: 'Step 3',
    body: 'This is the third and final step.',
  },
]

export const usage: MantineDemo = {
  type: 'code',
  component: guidedComponent('tour', basicSteps),
  code: demoCode(),
}

export const controlled: MantineDemo = {
  type: 'code',
  component: guidedComponent(
    'controlled',
    [
      {
        target: '#controlled-target-1',
        targetLabel: 'First target',
        title: 'Step 1',
        body: 'This is the first step.',
      },
      {
        target: '#controlled-target-2',
        targetLabel: 'Second target',
        input: true,
        title: 'Step 2',
        body: 'This is the second step.',
      },
    ],
    { controlled: true },
  ),
  code: controlledCode,
}

export const centered: MantineDemo = {
  type: 'code',
  component: guidedComponent('centered', [
    {
      title: 'Welcome',
      body: 'This step has no target and is displayed in the center of the screen.',
    },
    {
      target: '#centered-target',
      targetLabel: 'Start tour',
      startsTour: true,
      title: 'Target step',
      body: 'This step highlights the button.',
    },
    { title: 'All done', body: 'This final step is also centered with no target.' },
  ]),
  code: centeredCode,
}

export const position: MantineDemo = {
  type: 'code',
  component: defineComponent({
    setup() {
      const active = ref(false)
      const step = ref(0)
      return () =>
        h('div', [
          h(Center, { mih: 360 }, () =>
            h(
              Button,
              {
                id: 'position-target',
                onClick: () => {
                  step.value = 0
                  active.value = true
                },
              },
              () => 'Start tour',
            ),
          ),
          h(
            Tour,
            {
              active: active.value,
              step: step.value,
              'onUpdate:step': (v: number) => (step.value = v),
              onClose: () => (active.value = false),
            },
            () =>
              (['bottom', 'top', 'left', 'right'] as const).map((side) =>
                h(
                  Tour.Step,
                  {
                    target: '#position-target',
                    title: side[0].toUpperCase() + side.slice(1),
                    position: side,
                  },
                  () => `Tooltip positioned at the ${side}.`,
                ),
              ),
          ),
        ])
    },
  }),
  code: positionCode,
}

export const labels: MantineDemo = {
  type: 'code',
  component: guidedComponent(
    'labels',
    [
      {
        target: '#labels-target-1',
        targetLabel: 'Primer objetivo',
        title: 'Paso 1',
        body: 'Este es el primer paso del recorrido.',
      },
      {
        target: '#labels-target-2',
        targetLabel: 'Segundo objetivo',
        input: true,
        title: 'Paso 2',
        body: 'Este es el segundo paso del recorrido.',
      },
    ],
    {
      startLabel: 'Iniciar recorrido',
      props: {
        labels: {
          next: 'Siguiente',
          back: 'Anterior',
          skip: 'Omitir',
          close: 'Cerrar',
          stepCounter: (current: number, total: number) => `${current} de ${total}`,
        },
      },
    },
  ),
  code: labelsCode,
}

export const beacon: MantineDemo = {
  type: 'code',
  component: defineComponent({
    setup() {
      const active = ref(false)
      return () =>
        h('div', [
          h(Group, null, () => [
            h(Button, { id: 'beacon-target-1' }, () => 'First target'),
            h(TextInput, { id: 'beacon-target-2', placeholder: 'Second target' }),
            h(Button, { id: 'beacon-target-3', variant: 'outline' }, () => 'Third target'),
          ]),
          h(Button, { mt: 'md', onClick: () => (active.value = !active.value) }, () =>
            active.value ? 'End beacon tour' : 'Start beacon tour',
          ),
          h(Tour, { active: active.value, mode: 'beacon', defaultStep: -1, color: 'teal' }, () =>
            [1, 2, 3].map((n) =>
              h(Tour.Step, { target: `#beacon-target-${n}`, title: `Beacon ${n}` }, () =>
                n === 1
                  ? 'Click the beacon to see this tooltip.'
                  : `This is the ${n === 2 ? 'second' : 'third'} beacon tooltip.`,
              ),
            ),
          ),
        ])
    },
  }),
  code: beaconCode,
}

const OverlayDemo = guidedComponent('overlay', [
  {
    target: '#overlay-target-1',
    targetLabel: 'First target',
    title: 'First step',
    body: 'This is the first step of the tour.',
  },
  {
    target: '#overlay-target-2',
    targetLabel: 'Second target',
    variant: 'light',
    title: 'Second step',
    body: 'This is the second step of the tour.',
  },
])
export const overlay: MantineDemo = {
  type: 'configurator',
  component: OverlayDemo,
  code: overlayCode,
  controls: [
    { prop: 'withOverlay', type: 'boolean', initialValue: true, libraryValue: true },
    { prop: 'withOverlayInteraction', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'closeOnOverlayClick', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'closeOnEscape', type: 'boolean', initialValue: true, libraryValue: true },
    { prop: 'withCloseButton', type: 'boolean', initialValue: true, libraryValue: true },
  ],
}

export const complex: MantineDemo = {
  type: 'code',
  component: defineComponent({
    setup() {
      const active = ref(false)
      const step = ref(0)
      const status = (label: string, color: string) =>
        h(Badge, { color, variant: 'light', size: 'sm' }, () => label)
      const row = (user: string, action: string, label: string, color: string) =>
        h(Table.Tr, null, () => [
          h(Table.Td, null, () => user),
          h(Table.Td, null, () => action),
          h(Table.Td, null, () => status(label, color)),
        ])
      return () =>
        h('div', [
          h(Card, { withBorder: true }, () => [
            h(Group, { justify: 'space-between', mb: 'md' }, () => [
              h(Group, null, () => [
                h(Avatar, { id: 'complex-avatar', color: 'blue', radius: 'xl' }, () => 'JD'),
                h('div', [
                  h(Text, { size: 'sm', fw: 500 }, () => 'John Doe'),
                  h(Text, { size: 'xs', c: 'dimmed' }, () => 'Admin'),
                ]),
              ]),
              h(Group, { gap: 'xs' }, () => [
                h(TextInput, {
                  id: 'complex-search',
                  placeholder: 'Search...',
                  size: 'xs',
                  w: 200,
                  leftSection: h(PhMagnifyingGlass, { size: 14 }),
                }),
                h(Indicator, { id: 'complex-notifications', processing: true }, () =>
                  h(ActionIcon, { variant: 'default', size: 'lg' }, () => h(PhBell, { size: 18 })),
                ),
                h(ActionIcon, { id: 'complex-settings', variant: 'default', size: 'lg' }, () =>
                  h(PhGearSix, { size: 18 }),
                ),
              ]),
            ]),
            h(Tabs, { id: 'complex-tabs', defaultValue: 'overview', mb: 'md' }, () =>
              h(Tabs.List, null, () =>
                ['Overview', 'Analytics', 'Reports', 'Settings'].map((label) =>
                  h(Tabs.Tab, { value: label.toLowerCase() }, () => label),
                ),
              ),
            ),
            h(ScrollArea, { h: 200, type: 'always' }, () =>
              h(Stack, { gap: 'md' }, () => [
                h(Group, { justify: 'space-between' }, () => [
                  h(Text, { fw: 500 }, () => 'Recent activity'),
                  h(
                    Badge,
                    { id: 'complex-badge', variant: 'light', color: 'green' },
                    () => '12 new',
                  ),
                ]),
                h(Table, { id: 'complex-table' }, () => [
                  h(Table.Thead, null, () =>
                    h(Table.Tr, null, () =>
                      ['User', 'Action', 'Status'].map((label) => h(Table.Th, null, () => label)),
                    ),
                  ),
                  h(Table.Tbody, null, () => [
                    row('Alice', 'Created project', 'Complete', 'green'),
                    row('Bob', 'Updated settings', 'In progress', 'blue'),
                    row('Carol', 'Deleted file', 'Failed', 'red'),
                    row('Dave', 'Uploaded report', 'Complete', 'green'),
                    row('Eve', 'Reviewed PR', 'Pending', 'yellow'),
                  ]),
                ]),
                h(
                  Box,
                  {
                    id: 'complex-preferences',
                    p: 'md',
                    style: {
                      border: '1px solid var(--mantine-color-default-border)',
                      borderRadius: 'var(--mantine-radius-default)',
                    },
                  },
                  () => [
                    h(Text, { fw: 500, mb: 'xs' }, () => 'Preferences'),
                    h(Stack, { gap: 'xs' }, () => [
                      h(Switch, { label: 'Email notifications', defaultChecked: true }),
                      h(Switch, { label: 'Push notifications' }),
                      h(Switch, { label: 'Weekly digest', defaultChecked: true }),
                    ]),
                  ],
                ),
              ]),
            ),
          ]),
          h(
            Button,
            {
              mt: 'md',
              onClick: () => {
                step.value = 0
                active.value = true
              },
            },
            () => 'Start tour',
          ),
          h(
            Tour,
            {
              active: active.value,
              step: step.value,
              closeOnOverlayClick: true,
              'onUpdate:step': (v: number) => (step.value = v),
              onClose: () => (active.value = false),
            },
            () => [
              h(
                Tour.Step,
                { title: 'Welcome to the dashboard' },
                () =>
                  'Let us show you around! This tour will walk you through the main features of your new dashboard.',
              ),
              h(
                Tour.Step,
                { target: '#complex-avatar', title: 'Your profile', position: 'bottom-start' },
                () =>
                  'This is your profile section. Click on your avatar to manage account settings, change your role, or sign out.',
              ),
              h(
                Tour.Step,
                { target: '#complex-search', title: 'Search', position: 'bottom' },
                () =>
                  'Use the search bar to quickly find projects, users, reports, and settings across the entire application.',
              ),
              h(
                Tour.Step,
                {
                  target: '#complex-notifications',
                  title: 'Notifications',
                  position: 'bottom-end',
                },
                () =>
                  'The notification bell shows real-time alerts. The pulsing indicator means you have unread notifications.',
              ),
              h(
                Tour.Step,
                { target: '#complex-tabs', title: 'Navigation tabs', position: 'bottom' },
                () =>
                  'Switch between different sections of your dashboard using these tabs. Each tab provides a different view of your data.',
              ),
              h(
                Tour.Step,
                {
                  target: '#complex-table',
                  title: 'Activity feed',
                  position: 'top',
                  spotlightPadding: 16,
                },
                () =>
                  'The activity table shows recent actions by your team members. Each row displays the user, their action, and the current status. This element is inside a scroll area – the tour scrolls it into view automatically.',
              ),
              h(
                Tour.Step,
                {
                  target: '#complex-preferences',
                  title: 'Preferences',
                  position: 'top',
                  spotlightPadding: 0,
                },
                () =>
                  'Scroll down to find your notification preferences. Customize which alerts you receive and how often. You are all set!',
              ),
            ],
          ),
        ])
    },
  }),
  code: complexCode,
}

export const stylesApi: MantineDemo = {
  type: 'code',
  component: guidedComponent(
    'styles',
    [
      {
        target: '#styles-target-1',
        targetLabel: 'First target',
        title: 'Step 1: Welcome',
        body: 'This tour demonstrates how to customize Tour styles with classNames.',
      },
      {
        target: '#styles-target-2',
        targetLabel: 'Second target',
        input: true,
        title: 'Step 2: Input',
        body: 'You can style every part of the tooltip independently.',
      },
      {
        target: '#styles-target-3',
        targetLabel: 'Third target',
        variant: 'outline',
        title: 'Step 3: Actions',
        body: 'The tooltip, navigation buttons, and counters are all customized.',
      },
    ],
    { props: { classNames: classes } },
  ),
  code: [
    { fileName: 'Demo.vue', language: 'html', code: stylesCode },
    {
      fileName: 'Demo.module.css',
      language: 'css',
      code: `.tooltip { background-color: var(--mantine-color-blue-6); border-color: var(--mantine-color-blue-8); }
.title, .body, .closeButton { color: var(--mantine-color-white); }
.stepCounter { color: var(--mantine-color-blue-2); }
.navigationButton { color: var(--mantine-color-white); border-color: var(--mantine-color-blue-4); background-color: var(--mantine-color-blue-7); }`,
    },
  ],
}

export const compound: MantineDemo = {
  type: 'code',
  component: defineComponent({
    setup() {
      const active = ref(false)
      const step = ref(0)
      const targetElement = ref<HTMLElement | null>(null)
      const targetRect = ref<DOMRect | null>(null)
      const steps = [
        {
          selector: '#compound-1',
          title: 'Welcome',
          body: 'Click here to get started with the app.',
          position: 'bottom',
        },
        {
          selector: '#compound-2',
          title: 'Settings',
          body: 'Configure your preferences here.',
          position: 'bottom',
        },
      ]
      const current = computed(() => steps[step.value])
      const updateRect = () => {
        targetRect.value = targetElement.value?.getBoundingClientRect() ?? null
      }
      watch([active, step], async () => {
        await nextTick()
        targetElement.value = active.value ? document.querySelector(current.value.selector) : null
        updateRect()
      })
      onMounted(() => {
        window.addEventListener('scroll', updateRect, true)
        window.addEventListener('resize', updateRect)
      })
      onBeforeUnmount(() => {
        window.removeEventListener('scroll', updateRect, true)
        window.removeEventListener('resize', updateRect)
      })
      return () =>
        h('div', [
          h(Group, null, () => [
            h(
              Button,
              {
                id: 'compound-1',
                onClick: () => {
                  step.value = 0
                  active.value = true
                },
              },
              () => 'Start tour',
            ),
            h(Button, { id: 'compound-2', variant: 'light' }, () => 'Settings'),
          ]),
          h(
            Tour.Root,
            {
              active: active.value,
              step: step.value,
              stepsCount: steps.length,
              'onUpdate:step': (v: number) => (step.value = v),
              onClose: () => (active.value = false),
            },
            () => [
              h(Tour.Overlay, { targetRect: targetRect.value }),
              h(
                Tour.Tooltip,
                {
                  targetElement: targetElement.value,
                  position: current.value.position as any,
                  mounted: active.value,
                },
                () => [
                  h(Tour.CloseButton),
                  h(Tour.Title, null, () => current.value.title),
                  h(Tour.Body, null, () => current.value.body),
                  h(Tour.Navigation),
                ],
              ),
            ],
          ),
        ])
    },
  }),
  code: compoundCode,
}

export const TourDemos = {
  usage,
  complex,
  beacon,
  controlled,
  overlay,
  centered,
  compound,
  position,
  labels,
  stylesApi,
}
