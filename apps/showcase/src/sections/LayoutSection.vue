<script setup lang="ts">
import { ref } from 'vue'
import {
  Box,
  Button,
  Center,
  Collapse,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Space,
  Splitter,
  Stack,
  Text,
} from '@mantine-vue/core'
import DemoCard from '../components/DemoCard.vue'

const collapseOpen = ref(false)

const box = () => ({
  padding: '12px',
  borderRadius: '8px',
  background: 'var(--mantine-color-blue-light)',
  color: 'var(--mantine-color-blue-light-color)',
  textAlign: 'center' as const,
  fontSize: '14px',
})
</script>

<template>
  <Stack gap="lg">
    <DemoCard
      name="AppShell"
      description="Responsive header/navbar/main layout — it frames this entire page."
    >
      <Paper withBorder radius="md" style="overflow: hidden">
        <Box
          p="xs"
          style="background: var(--mantine-color-blue-light); font-size: 13px; font-weight: 600"
        >
          Header
        </Box>
        <Flex :mih="120">
          <Box
            p="xs"
            style="width: 120px; background: var(--mantine-color-gray-light); font-size: 13px"
          >
            Navbar
          </Box>
          <Box p="md" style="flex: 1; font-size: 13px">Main content area</Box>
        </Flex>
      </Paper>
      <Text size="xs" c="dimmed" mt="xs">
        The sidebar, header and content region of this showcase are built with AppShell.
      </Text>
    </DemoCard>

    <DemoCard name="Group" description="Horizontal flex row with consistent spacing.">
      <Group>
        <Box :style="box()">Item 1</Box>
        <Box :style="box()">Item 2</Box>
        <Box :style="box()">Item 3</Box>
      </Group>
    </DemoCard>

    <DemoCard name="Stack" description="Vertical flex column with consistent spacing.">
      <Stack gap="xs" style="max-width: 200px">
        <Box :style="box()">First</Box>
        <Box :style="box()">Second</Box>
        <Box :style="box()">Third</Box>
      </Stack>
    </DemoCard>

    <DemoCard name="Flex" description="Flexbox with responsive gap, align and justify props.">
      <Flex gap="md" justify="center" align="center" wrap="wrap">
        <Box :style="box()">Auto</Box>
        <Box :style="box()">Wrapping</Box>
        <Box :style="box()">Flex</Box>
        <Box :style="box()">Row</Box>
      </Flex>
    </DemoCard>

    <DemoCard name="SimpleGrid" description="Responsive grid with equal-width columns.">
      <SimpleGrid :cols="{ base: 1, sm: 3 }" spacing="md">
        <Box :style="box()">1</Box>
        <Box :style="box()">2</Box>
        <Box :style="box()">3</Box>
      </SimpleGrid>
    </DemoCard>

    <DemoCard name="Grid" description="12-column grid with spans and offsets.">
      <Grid>
        <Grid.Col :span="8"><Box :style="box()">span 8</Box></Grid.Col>
        <Grid.Col :span="4"><Box :style="box()">span 4</Box></Grid.Col>
        <Grid.Col :span="{ base: 12, sm: 6 }"><Box :style="box()">responsive</Box></Grid.Col>
        <Grid.Col :span="{ base: 12, sm: 6 }"><Box :style="box()">responsive</Box></Grid.Col>
      </Grid>
    </DemoCard>

    <DemoCard name="Container" description="Centers content with a max width.">
      <Container
        size="xs"
        style="background: var(--mantine-color-gray-light); border-radius: 8px"
        py="md"
      >
        <Text ta="center" size="sm">Centered container (size xs)</Text>
      </Container>
    </DemoCard>

    <DemoCard
      name="Paper & Box"
      description="Surface with shadow/border, and the base Box primitive."
    >
      <Group>
        <Paper shadow="xs" p="md" radius="md" withBorder>Paper · xs shadow</Paper>
        <Paper shadow="md" p="md" radius="md">Paper · md shadow</Paper>
        <Box p="md" style="border: 1px solid var(--mantine-color-gray-4); border-radius: 8px"
          >Box</Box
        >
      </Group>
    </DemoCard>

    <DemoCard name="Divider & Space" description="Separator line and empty spacing element.">
      <div>
        <Text size="sm">Section one</Text>
        <Divider my="sm" />
        <Text size="sm">Section two</Text>
        <Divider my="sm" label="Labelled divider" labelPosition="center" />
        <Text size="sm">Section three</Text>
        <Space h="md" />
        <Text size="xs" c="dimmed">A Space of "md" separates this line from the one above.</Text>
      </div>
    </DemoCard>

    <DemoCard name="ScrollArea" description="Custom scrollbars for overflowing content.">
      <ScrollArea :h="140" type="always" style="max-width: 320px">
        <Text v-for="n in 12" :key="n" size="sm" :py="4">
          Line {{ n }} — scroll to reveal more content in this custom scroll area.
        </Text>
      </ScrollArea>
    </DemoCard>

    <DemoCard name="Collapse" description="Animate showing and hiding of content.">
      <Stack align="flex-start" gap="sm">
        <Button variant="light" @click="collapseOpen = !collapseOpen">
          {{ collapseOpen ? 'Hide' : 'Show' }} details
        </Button>
        <Collapse :expanded="collapseOpen">
          <Paper withBorder p="md" radius="md" style="max-width: 360px">
            <Text size="sm">
              This content is revealed with a smooth height animation whenever the button above is
              toggled.
            </Text>
          </Paper>
        </Collapse>
      </Stack>
    </DemoCard>

    <DemoCard name="Splitter" description="Resizable, collapsible panes.">
      <Splitter :h="160">
        <Splitter.Pane :defaultSize="35" :min="20" collapsible>
          <Center h="100%"><Text size="sm" c="dimmed">Sidebar</Text></Center>
        </Splitter.Pane>
        <Splitter.Pane :defaultSize="65" :min="30">
          <Center h="100%"><Text size="sm" c="dimmed">Drag the divider</Text></Center>
        </Splitter.Pane>
      </Splitter>
    </DemoCard>

    <DemoCard name="Center" description="Centers a single child horizontally and vertically.">
      <Center :h="100" style="border: 1px dashed var(--mantine-color-gray-4); border-radius: 8px">
        <Text size="sm">Perfectly centered</Text>
      </Center>
    </DemoCard>
  </Stack>
</template>
