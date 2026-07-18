<script setup lang="ts">
import {
  Affix,
  Avatar,
  Box,
  Button,
  Dialog,
  Drawer,
  Group,
  HoverCard,
  Menu,
  Menubar,
  Modal,
  Overlay,
  Popover,
  Stack,
  Text,
  TextInput,
  Tooltip,
  Transition as MantineTransition,
} from '@mantine-vue/core'
import { modals } from '@mantine-vue/modals'
import { notifications } from '@mantine-vue/notifications'
import type { SpotlightActionData } from '@mantine-vue/spotlight'
import { Spotlight, spotlight } from '@mantine-vue/spotlight'
import {
  PhArrowUp,
  PhChatCircle,
  PhFileText,
  PhGauge,
  PhGear,
  PhHouse,
  PhImage,
  PhMagnifyingGlass,
  PhTrash,
} from '@phosphor-icons/vue'
import { h, ref } from 'vue'
import DemoCard from '../components/DemoCard.vue'

const modalOpened = ref(false)
const drawerOpened = ref(false)
const dialogOpened = ref(false)
const overlayCard = ref(false)
const showAffix = ref(false)

function showNotification() {
  notifications.show({
    title: 'Changes saved',
    message: 'Your settings have been updated successfully. 🎉',
    color: 'teal',
  })
}

function openConfirm() {
  modals.openConfirmModal({
    title: 'Delete this project?',
    children: h(
      Text,
      { size: 'sm' },
      () =>
        'This action is irreversible. All data associated with the project will be permanently removed.',
    ),
    labels: { confirm: 'Delete project', cancel: 'Keep it' },
    confirmProps: { color: 'red' },
    onConfirm: () =>
      notifications.show({ color: 'red', title: 'Deleted', message: 'The project was deleted.' }),
  })
}

const spotlightActions: SpotlightActionData[] = [
  {
    id: 'home',
    label: 'Home',
    description: 'Go to the home page',
    leftSection: h(PhHouse, { size: 22 }),
    onClick: () => {},
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'View system status',
    leftSection: h(PhGauge, { size: 22 }),
    onClick: () => {},
  },
  {
    id: 'docs',
    label: 'Documentation',
    description: 'Learn about the components',
    leftSection: h(PhFileText, { size: 22 }),
    onClick: () => {},
  },
]
</script>

<template>
  <Stack gap="lg">
    <DemoCard name="Tooltip" description="Contextual hint shown on hover or focus.">
      <Group>
        <Tooltip label="Tooltip on top" withArrow
          ><Button variant="default">Hover me</Button></Tooltip
        >
        <Tooltip label="Opened to the right" position="right" color="grape" withArrow>
          <Button variant="default">Right</Button>
        </Tooltip>
      </Group>
    </DemoCard>

    <DemoCard name="Menu" description="Dropdown list of actions and links.">
      <Menu shadow="md" :width="220">
        <Menu.Target><Button>Toggle menu</Button></Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Application</Menu.Label>
          <Menu.Item :left-section="h(PhGear, { size: 14 })">Settings</Menu.Item>
          <Menu.Item :left-section="h(PhChatCircle, { size: 14 })">Messages</Menu.Item>
          <Menu.Item :left-section="h(PhImage, { size: 14 })">Gallery</Menu.Item>
          <Menu.Divider />
          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item color="red" :left-section="h(PhTrash, { size: 14 })">Delete account</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </DemoCard>

    <DemoCard name="Popover" description="Floating panel anchored to a target.">
      <Popover :width="260" position="bottom" withArrow shadow="md">
        <Popover.Target><Button variant="default">Toggle popover</Button></Popover.Target>
        <Popover.Dropdown>
          <TextInput label="Name" placeholder="Your name" size="xs" />
          <Text size="xs" c="dimmed" mt="xs">This popover contains an interactive form.</Text>
        </Popover.Dropdown>
      </Popover>
    </DemoCard>

    <DemoCard name="HoverCard" description="Popover that opens on hover.">
      <HoverCard :width="280" shadow="md">
        <HoverCard.Target>
          <Group gap="xs">
            <Avatar color="blue" radius="xl">MV</Avatar>
            <Text size="sm" :fw="500">@mantine-vue</Text>
          </Group>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm"
            >Hover over the target to reveal this card with extra details about the user.</Text
          >
        </HoverCard.Dropdown>
      </HoverCard>
    </DemoCard>

    <DemoCard name="Modal" description="Centered dialog rendered over the page.">
      <Button @click="modalOpened = true">Open modal</Button>
      <Modal
        :opened="modalOpened"
        :on-close="() => (modalOpened = false)"
        title="Authentication required"
        centered
      >
        <Stack gap="sm">
          <TextInput label="Email" placeholder="you@example.com" />
          <TextInput label="Password" placeholder="Your password" type="password" />
          <Button mt="sm" @click="modalOpened = false">Sign in</Button>
        </Stack>
      </Modal>
    </DemoCard>

    <DemoCard name="Drawer" description="Panel that slides in from a screen edge.">
      <Button variant="light" @click="drawerOpened = true">Open drawer</Button>
      <Drawer
        :opened="drawerOpened"
        :on-close="() => (drawerOpened = false)"
        title="Navigation"
        position="left"
      >
        <Text size="sm"
          >Drawer content — often used for mobile navigation and settings panels.</Text
        >
      </Drawer>
    </DemoCard>

    <DemoCard name="Dialog" description="Compact, non-blocking prompt.">
      <Button variant="default" @click="dialogOpened = true">Open dialog</Button>
      <Dialog
        :opened="dialogOpened"
        withCloseButton
        size="lg"
        radius="md"
        :position="{ bottom: 20, right: 20 }"
        :on-close="() => (dialogOpened = false)"
      >
        <Text size="sm" mb="xs" :fw="500">Subscribe to updates</Text>
        <Group align="flex-end">
          <TextInput placeholder="you@example.com" style="flex: 1" />
          <Button @click="dialogOpened = false">Subscribe</Button>
        </Group>
      </Dialog>
    </DemoCard>

    <DemoCard name="Overlay" description="Dims content behind a surface.">
      <Box
        pos="relative"
        :h="140"
        style="border-radius: 8px; overflow: hidden; background: var(--mantine-color-blue-light)"
      >
        <Overlay v-if="overlayCard" color="#000" :backgroundOpacity="0.55" :blur="2" center>
          <Button color="white" variant="white" @click="overlayCard = false"
            >Dismiss overlay</Button
          >
        </Overlay>
        <Group h="140" justify="center" align="center">
          <Button variant="light" @click="overlayCard = true">Show overlay</Button>
        </Group>
      </Box>
    </DemoCard>

    <DemoCard name="Affix & Transition" description="Pins an element to a fixed viewport position.">
      <Button variant="default" @click="showAffix = !showAffix">
        {{ showAffix ? 'Hide' : 'Show' }} affix button
      </Button>
      <Affix v-if="showAffix" :position="{ bottom: 20, right: 20 }">
        <MantineTransition transition="slide-up" :mounted="showAffix">
          <template #default="transitionStyles">
            <Button
              :style="transitionStyles"
              :left-section="h(PhArrowUp, { size: 16 })"
              @click="showAffix = false"
            >
              Back to top
            </Button>
          </template>
        </MantineTransition>
      </Affix>
    </DemoCard>

    <DemoCard
      name="Notifications (system)"
      description="Imperative toast API from @mantine-vue/notifications."
      pkg="notifications"
    >
      <Button variant="light" @click="showNotification">Show notification</Button>
    </DemoCard>

    <DemoCard
      name="Modals manager"
      description="Imperative modal API from @mantine-vue/modals."
      pkg="modals"
    >
      <Button color="red" variant="light" @click="openConfirm">Open confirm modal</Button>
    </DemoCard>

    <DemoCard
      name="Spotlight"
      description="Command palette / global search overlay."
      pkg="spotlight"
    >
      <Button :left-section="h(PhMagnifyingGlass, { size: 16 })" @click="spotlight.open()"
        >Search everything</Button
      >
      <Spotlight
        :actions="spotlightActions"
        nothingFound="Nothing found…"
        highlightQuery
        :searchProps="{ leftSection: h(PhMagnifyingGlass, { size: 20 }), placeholder: 'Search…' }"
      />
    </DemoCard>

    <DemoCard
      name="Menubar"
      description="Desktop-application style menu bar — one open menu at a time, arrow-key navigation."
    >
      <Menubar>
        <Menubar.Menu :width="200">
          <Menubar.Target>File</Menubar.Target>
          <Menubar.Dropdown>
            <Menu.Item>New file</Menu.Item>
            <Menu.Item>New window</Menu.Item>
            <Menu.Divider />
            <Menu.Item>Save</Menu.Item>
          </Menubar.Dropdown>
        </Menubar.Menu>

        <Menubar.Menu :width="200">
          <Menubar.Target>Edit</Menubar.Target>
          <Menubar.Dropdown>
            <Menu.Item>Undo</Menu.Item>
            <Menu.Item>Redo</Menu.Item>
            <Menu.Divider />
            <Menu.Item>Cut</Menu.Item>
            <Menu.Item>Copy</Menu.Item>
            <Menu.Item>Paste</Menu.Item>
          </Menubar.Dropdown>
        </Menubar.Menu>

        <Menubar.Menu :width="200">
          <Menubar.Target>View</Menubar.Target>
          <Menubar.Dropdown>
            <Menu.CheckboxItem defaultChecked>Show sidebar</Menu.CheckboxItem>
            <Menu.CheckboxItem>Show status bar</Menu.CheckboxItem>
          </Menubar.Dropdown>
        </Menubar.Menu>
      </Menubar>
    </DemoCard>
  </Stack>
</template>
