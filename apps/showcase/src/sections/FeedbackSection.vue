<script setup lang="ts">
import { h, ref } from 'vue'
import {
  Alert,
  Box,
  Button,
  Group,
  Loader,
  LoadingOverlay,
  Notification,
  Progress,
  RingProgress,
  SemiCircleProgress,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine-vue/core'
import { PhCheck, PhInfo, PhWarning } from '@phosphor-icons/vue'
import DemoCard from '../components/DemoCard.vue'

const overlayVisible = ref(false)
function flashOverlay() {
  overlayVisible.value = true
  setTimeout(() => (overlayVisible.value = false), 1500)
}
</script>

<template>
  <Stack gap="lg">
    <DemoCard name="Alert" description="Highlights important contextual messages.">
      <Stack gap="sm">
        <Alert variant="light" color="blue" title="Heads up" :icon="h(PhInfo, { size: 18 })">
          A new software update is available. See what's new in version 2.0.
        </Alert>
        <Alert
          variant="light"
          color="red"
          title="Payment failed"
          :icon="h(PhWarning, { size: 18 })"
          withCloseButton
        >
          We couldn't process your last payment. Please update your billing details.
        </Alert>
      </Stack>
    </DemoCard>

    <DemoCard name="Notification" description="Toast-style status message.">
      <Stack gap="sm" style="max-width: 420px">
        <Notification title="Deploy successful" color="teal" :icon="h(PhCheck, { size: 18 })">
          Your changes are now live in production.
        </Notification>
        <Notification title="Uploading" loading :withCloseButton="false">
          Please wait while we upload your files.
        </Notification>
      </Stack>
    </DemoCard>

    <DemoCard name="Progress" description="Linear progress bar, incl. compound sections.">
      <Stack gap="md">
        <Progress :value="65" />
        <Progress :value="40" color="teal" striped animated radius="xl" size="lg" />
        <Progress.Root :size="20">
          <Progress.Section :value="35" color="cyan"
            ><Progress.Label>Docs</Progress.Label></Progress.Section
          >
          <Progress.Section :value="28" color="pink"
            ><Progress.Label>Apps</Progress.Label></Progress.Section
          >
          <Progress.Section :value="15" color="orange"
            ><Progress.Label>Core</Progress.Label></Progress.Section
          >
        </Progress.Root>
      </Stack>
    </DemoCard>

    <DemoCard name="RingProgress" description="Circular progress with labelled sections.">
      <Group>
        <RingProgress
          :size="120"
          :thickness="12"
          :sections="[
            { value: 40, color: 'cyan' },
            { value: 25, color: 'orange' },
            { value: 15, color: 'grape' },
          ]"
          :label="h(Text, { size: 'xs', ta: 'center' }, () => '80% used')"
        />
        <RingProgress
          :size="120"
          :thickness="12"
          :roundCaps="true"
          :sections="[{ value: 72, color: 'teal' }]"
          :label="
            h(ThemeIcon, { color: 'teal', variant: 'light', radius: 'xl', size: 'xl' }, () =>
              h(PhCheck, { size: 22 }),
            )
          "
        />
      </Group>
    </DemoCard>

    <DemoCard name="SemiCircleProgress" description="Half-circle gauge for a single value.">
      <SemiCircleProgress :value="72" :size="200" filledSegmentColor="blue" label="72% complete" />
    </DemoCard>

    <DemoCard name="Loader" description="Indeterminate loading indicators.">
      <Group align="center">
        <Loader />
        <Loader color="teal" type="bars" />
        <Loader color="grape" type="dots" size="lg" />
      </Group>
    </DemoCard>

    <DemoCard name="LoadingOverlay" description="Covers a container while content loads.">
      <Stack gap="sm">
        <Box
          pos="relative"
          p="xl"
          style="border: 1px dashed var(--mantine-color-gray-4); border-radius: 8px"
        >
          <LoadingOverlay
            :visible="overlayVisible"
            :zIndex="10"
            :overlayProps="{ radius: 'sm', blur: 2 }"
          />
          <Text size="sm">This panel's content sits under a loading overlay.</Text>
          <Text size="sm" c="dimmed">Trigger it to see the spinner.</Text>
        </Box>
        <Button variant="light" style="align-self: flex-start" @click="flashOverlay"
          >Show overlay</Button
        >
      </Stack>
    </DemoCard>

    <DemoCard name="Skeleton" description="Placeholder shown while data loads.">
      <Group wrap="nowrap" align="flex-start">
        <Skeleton :height="48" circle />
        <Stack gap="xs" style="flex: 1">
          <Skeleton :height="12" radius="xl" />
          <Skeleton :height="12" width="70%" radius="xl" />
          <Skeleton :height="12" width="45%" radius="xl" />
        </Stack>
      </Group>
    </DemoCard>
  </Stack>
</template>
