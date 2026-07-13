<script setup lang="ts">
import { h, ref } from 'vue'
import {
  Badge,
  Box,
  Button,
  CloseButton,
  FloatingIndicator,
  FloatingWindow,
  FocusTrap,
  Group,
  Marquee,
  OverflowList,
  Portal,
  Scroller,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
  VisuallyHidden,
} from '@mantine-vue/core'
import { NavigationProgress, nprogress } from '@mantine-vue/nprogress'
import DemoCard from '../components/DemoCard.vue'

const trapActive = ref(false)
const windowVisible = ref(false)

const fruits = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
  'Honeydew',
  'Kiwi',
  'Lemon',
  'Mango',
  'Nectarine',
  'Orange',
  'Papaya',
]

const frameworks = ['Vue', 'React', 'Angular', 'Svelte']
const rootRef = ref<HTMLElement | null>(null)
const controlRefs = ref<Record<number, HTMLElement | null>>({})
const activeControl = ref(0)
const setRootRef = (el: any) => (rootRef.value = el?.$el ?? el)
const setControlRef = (index: number) => (el: any) => {
  controlRefs.value[index] = el?.$el ?? el
}

function runProgress() {
  nprogress.reset()
  nprogress.start()
  setTimeout(() => nprogress.complete(), 2000)
}
</script>

<template>
  <Stack gap="lg">
    <NavigationProgress />

    <DemoCard name="Marquee" description="Continuously scrolling row of content.">
      <Marquee gap="md" pauseOnHover>
        <Badge
          v-for="c in ['blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange', 'red']"
          :key="c"
          :color="c"
          size="xl"
          radius="sm"
        >
          {{ c }}
        </Badge>
      </Marquee>
    </DemoCard>

    <DemoCard name="Scroller" description="Horizontal scroll region with control buttons.">
      <Scroller>
        <Group gap="xs" wrap="nowrap">
          <Badge v-for="n in 20" :key="n" variant="light" size="lg" miw="fit-content"
            >Badge {{ n }}</Badge
          >
        </Group>
      </Scroller>
    </DemoCard>

    <DemoCard name="OverflowList" description="Shows as many items as fit, collapses the rest.">
      <div
        style="resize: horizontal; overflow: auto; max-width: 100%; min-width: 220px; padding: 4px"
      >
        <OverflowList
          :data="fruits"
          :gap="4"
          :renderItem="
            (item: string, index: number) =>
              h(Badge, { key: index, variant: 'light' }, { default: () => item })
          "
          :renderOverflow="
            (items: unknown[]) =>
              h(Badge, { color: 'gray' }, { default: () => `+${items.length} more` })
          "
        />
      </div>
      <Text size="xs" c="dimmed" mt="xs"
        >Drag the bottom-right corner to resize and watch items collapse.</Text
      >
    </DemoCard>

    <DemoCard
      name="FloatingIndicator"
      description="Animated indicator that follows the active control."
    >
      <div
        :ref="setRootRef"
        style="
          position: relative;
          display: inline-flex;
          gap: 4px;
          padding: 4px;
          border-radius: 8px;
          background: var(--mantine-color-gray-light);
        "
      >
        <UnstyledButton
          v-for="(item, index) in frameworks"
          :key="item"
          :ref="setControlRef(index)"
          style="position: relative; z-index: 1; padding: 6px 16px; font-size: 14px"
          @click="activeControl = index"
        >
          {{ item }}
        </UnstyledButton>
        <FloatingIndicator
          :target="controlRefs[activeControl]"
          :parent="rootRef"
          style="
            background: var(--mantine-color-body);
            border-radius: 6px;
            box-shadow: var(--mantine-shadow-sm);
          "
        />
      </div>
    </DemoCard>

    <DemoCard name="FocusTrap" description="Keeps keyboard focus inside a region while active.">
      <Box :maw="360">
        <Button variant="light" @click="trapActive = !trapActive">
          {{ trapActive ? 'Deactivate' : 'Activate' }} focus trap
        </Button>
        <FocusTrap :active="trapActive">
          <div>
            <TextInput mt="sm" label="First input" placeholder="First input" />
            <TextInput mt="sm" label="Second input" placeholder="Second input" />
          </div>
        </FocusTrap>
      </Box>
    </DemoCard>

    <DemoCard name="FloatingWindow" description="Draggable, floating window surface.">
      <Button variant="default" @click="windowVisible = !windowVisible">
        {{ windowVisible ? 'Hide' : 'Show' }} floating window
      </Button>
      <FloatingWindow
        v-if="windowVisible"
        :w="280"
        p="md"
        with-border
        exclude-drag-handle-selector="button"
        :initial-position="{ top: 320, left: 40 }"
        :style="{ cursor: 'move' }"
      >
        <Group justify="space-between" mb="sm">
          <Text :fw="500">Draggable window</Text>
          <CloseButton @click="windowVisible = false" />
        </Group>
        <Text size="sm">Grab anywhere and drag me around the screen.</Text>
      </FloatingWindow>
    </DemoCard>

    <DemoCard
      name="Portal"
      description="Renders children into a different DOM node (document.body)."
    >
      <Portal>
        <VisuallyHidden>This text was rendered through a Portal into document.body.</VisuallyHidden>
      </Portal>
      <Text size="sm" c="dimmed">
        A Portal wraps this card's hidden helper text and mounts it at the end of
        <code>&lt;body&gt;</code>, outside the normal component tree.
      </Text>
    </DemoCard>

    <DemoCard
      name="VisuallyHidden"
      description="Hides content visually while keeping it for screen readers."
    >
      <Button>
        <span aria-hidden="true">♥</span>
        <VisuallyHidden>Add to favourites</VisuallyHidden>
      </Button>
    </DemoCard>

    <DemoCard
      name="NavigationProgress"
      description="Top-of-page progress bar controlled imperatively."
      pkg="nprogress"
    >
      <Button variant="light" @click="runProgress">Run progress bar</Button>
    </DemoCard>
  </Stack>
</template>
