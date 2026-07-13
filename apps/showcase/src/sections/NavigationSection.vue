<script setup lang="ts">
import { h, ref } from 'vue'
import {
  Anchor,
  Breadcrumbs,
  Burger,
  Button,
  Group,
  NavLink,
  Pagination,
  type RenderTreeNodePayload,
  Stack,
  Stepper,
  TableOfContents,
  Tabs,
  Text,
  Tree,
} from '@mantine-vue/core'
import {
  PhCaretRight,
  PhChatCircle,
  PhFileText,
  PhFolderOpen,
  PhFolderSimple,
  PhGauge,
  PhGear,
  PhHouse,
  PhImage,
} from '@phosphor-icons/vue'
import DemoCard from '../components/DemoCard.vue'

const crumbs = [
  { title: 'Home', href: '#' },
  { title: 'Components', href: '#' },
  { title: 'Navigation', href: '#' },
]

const burgerOpened = ref(false)
const activePage = ref(3)

const activeStep = ref(1)
const nextStep = () => {
  if (activeStep.value < 3) activeStep.value += 1
}
const prevStep = () => {
  if (activeStep.value > 0) activeStep.value -= 1
}

const treeData = [
  {
    value: 'src',
    label: 'src',
    children: [
      {
        value: 'components',
        label: 'components',
        children: [
          { value: 'button.vue', label: 'Button.vue' },
          { value: 'card.vue', label: 'Card.vue' },
        ],
      },
      { value: 'main.ts', label: 'main.ts' },
    ],
  },
  { value: 'package.json', label: 'package.json' },
]

const renderNode = ({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload) =>
  h(
    Group,
    { gap: 6, ...elementProps },
    {
      default: () => [
        hasChildren
          ? h(expanded ? PhFolderOpen : PhFolderSimple, { size: 15, style: { opacity: 0.75 } })
          : h(PhFileText, { size: 15, style: { opacity: 0.75 } }),
        h('span', {}, node.label as string),
      ],
    },
  )
</script>

<template>
  <Stack gap="lg">
    <DemoCard name="Tabs" description="Switch between panels of related content.">
      <Tabs defaultValue="gallery">
        <Tabs.List>
          <Tabs.Tab value="gallery" :left-section="h(PhImage, { size: 14 })">Gallery</Tabs.Tab>
          <Tabs.Tab value="messages" :left-section="h(PhChatCircle, { size: 14 })"
            >Messages</Tabs.Tab
          >
          <Tabs.Tab value="settings" :left-section="h(PhGear, { size: 14 })">Settings</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="gallery" pt="sm"
          ><Text size="sm">Your gallery content lives here.</Text></Tabs.Panel
        >
        <Tabs.Panel value="messages" pt="sm"
          ><Text size="sm">Read and reply to messages.</Text></Tabs.Panel
        >
        <Tabs.Panel value="settings" pt="sm"
          ><Text size="sm">Adjust your preferences.</Text></Tabs.Panel
        >
      </Tabs>
    </DemoCard>

    <DemoCard name="Stepper" description="Guide users through a multi-step flow.">
      <Stepper :active="activeStep" @step-click="activeStep = $event">
        <Stepper.Step label="Account" description="Create account"
          >Step 1 — create your account.</Stepper.Step
        >
        <Stepper.Step label="Verify" description="Verify email"
          >Step 2 — verify your email.</Stepper.Step
        >
        <Stepper.Step label="Finish" description="Get access"
          >Step 3 — you're all set!</Stepper.Step
        >
        <Stepper.Completed>Completed — click Back to revisit a step.</Stepper.Completed>
      </Stepper>
      <Group justify="center" mt="lg">
        <Button variant="default" @click="prevStep">Back</Button>
        <Button @click="nextStep">Next step</Button>
      </Group>
    </DemoCard>

    <DemoCard name="NavLink" description="Navigation item with icon, description and nesting.">
      <div style="max-width: 340px">
        <NavLink href="#" label="Dashboard" active>
          <template #leftSection><PhGauge :size="16" /></template>
        </NavLink>
        <NavLink href="#" label="Home" description="Return to start">
          <template #leftSection><PhHouse :size="16" /></template>
          <template #rightSection><PhCaretRight :size="12" /></template>
        </NavLink>
        <NavLink label="Settings" childrenOffset="28">
          <template #leftSection><PhGear :size="16" /></template>
          <NavLink href="#" label="Profile" />
          <NavLink href="#" label="Security" />
        </NavLink>
      </div>
    </DemoCard>

    <DemoCard name="Breadcrumbs" description="Show the path to the current page.">
      <Breadcrumbs>
        <Anchor v-for="(item, index) in crumbs" :key="index" :href="item.href">{{
          item.title
        }}</Anchor>
      </Breadcrumbs>
    </DemoCard>

    <DemoCard name="Pagination" description="Navigate between pages of results.">
      <Pagination :value="activePage" :total="10" withEdges @change="activePage = $event" />
    </DemoCard>

    <DemoCard name="Burger" description="Open/close indicator for navigation menus.">
      <Group>
        <Burger
          :opened="burgerOpened"
          aria-label="Toggle navigation"
          @click="burgerOpened = !burgerOpened"
        />
        <Text size="sm" c="dimmed">{{ burgerOpened ? 'Opened' : 'Closed' }}</Text>
      </Group>
    </DemoCard>

    <DemoCard name="Tree" description="Render hierarchical data with expand/collapse.">
      <Tree :data="treeData" withLines :render-node="renderNode" />
    </DemoCard>

    <DemoCard name="TableOfContents" description="Auto-generated, scroll-aware list of headings.">
      <div id="showcase-toc-demo">
        <TableOfContents
          variant="filled"
          :scroll-spy-options="{
            selector: '#showcase-toc-demo [data-heading]',
            getDepth: (element) => Number(element.getAttribute('data-order')),
            getValue: (element) => element.getAttribute('data-heading') || '',
          }"
          :get-control-props="
            ({ data }) => ({
              onClick: () => data.getNode().scrollIntoView({ behavior: 'smooth' }),
              children: data.value,
            })
          "
        />
        <div style="display: none">
          <h2 data-order="1" data-heading="Getting started">Getting started</h2>
          <h3 data-order="2" data-heading="Installation">Installation</h3>
          <h3 data-order="2" data-heading="Usage">Usage</h3>
          <h2 data-order="1" data-heading="API reference">API reference</h2>
        </div>
      </div>
    </DemoCard>
  </Stack>
</template>
