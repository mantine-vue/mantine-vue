<script setup lang="ts">
import { h, ref } from 'vue'
import {
  Accordion,
  AspectRatio,
  Avatar,
  BackgroundImage,
  Badge,
  Card,
  Center,
  ColorSwatch,
  Group,
  Image,
  Indicator,
  Kbd,
  List,
  NumberFormatter,
  Paper,
  RollingNumber,
  Spoiler,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Timeline,
  Title,
} from '@mantine-vue/core'
import {
  PhCheckCircle,
  PhChatCircleDots,
  PhGitBranch,
  PhGitCommit,
  PhGitPullRequest,
  PhHeartbeat,
  PhStar,
} from '@phosphor-icons/vue'
import DemoCard from '../components/DemoCard.vue'

const demoImage =
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'

const faq = [
  {
    value: 'refund',
    emoji: '💸',
    question: 'How do refunds work?',
    answer: 'Refunds are processed within 5 business days to your original payment method.',
  },
  {
    value: 'plan',
    emoji: '🚀',
    question: 'Can I change my plan later?',
    answer: 'Yes — upgrade or downgrade any time from the billing settings page.',
  },
  {
    value: 'support',
    emoji: '💬',
    question: 'How do I contact support?',
    answer: 'Reach us 24/7 through the in-app chat or by emailing support@example.com.',
  },
]

const elements = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
]

const counter = ref(1287)
</script>

<template>
  <Stack gap="lg">
    <DemoCard name="Card & Card.Section" description="Container for grouping related content.">
      <Card shadow="sm" padding="lg" radius="md" withBorder style="max-width: 340px">
        <Card.Section>
          <Image :src="demoImage" :height="160" alt="Fjord" />
        </Card.Section>
        <Group justify="space-between" mt="md" mb="xs">
          <Text :fw="600">Norway Fjord Adventures</Text>
          <Badge color="pink">On sale</Badge>
        </Group>
        <Text size="sm" c="dimmed">
          Explore the magical fjord landscapes with guided tours around the fjords of Norway.
        </Text>
      </Card>
    </DemoCard>

    <DemoCard name="Accordion" description="Collapsible sections, great for FAQs.">
      <Accordion defaultValue="refund" variant="separated">
        <Accordion.Item v-for="item in faq" :key="item.value" :value="item.value">
          <Accordion.Control :icon="item.emoji">{{ item.question }}</Accordion.Control>
          <Accordion.Panel>{{ item.answer }}</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </DemoCard>

    <DemoCard name="Table" description="Styled data table with compound sub-components.">
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>Element</Table.Th>
            <Table.Th>Symbol</Table.Th>
            <Table.Th>Mass</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-for="el in elements" :key="el.name">
            <Table.Td>{{ el.position }}</Table.Td>
            <Table.Td>{{ el.name }}</Table.Td>
            <Table.Td>{{ el.symbol }}</Table.Td>
            <Table.Td>{{ el.mass }}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </DemoCard>

    <DemoCard name="Avatar & Avatar.Group" description="User images with letters and grouping.">
      <Group>
        <Avatar :src="demoImage" alt="User" radius="xl" />
        <Avatar color="cyan" radius="xl">MK</Avatar>
        <Avatar color="blue" radius="xl"><PhStar :size="20" /></Avatar>
        <Avatar.Group>
          <Avatar color="red" radius="xl">AB</Avatar>
          <Avatar color="green" radius="xl">CD</Avatar>
          <Avatar color="grape" radius="xl">EF</Avatar>
          <Avatar radius="xl">+5</Avatar>
        </Avatar.Group>
      </Group>
    </DemoCard>

    <DemoCard name="Badge" description="Small status and label descriptors.">
      <Group>
        <Badge>Default</Badge>
        <Badge variant="light" color="teal">Active</Badge>
        <Badge variant="outline" color="red">Overdue</Badge>
        <Badge variant="gradient" :gradient="{ from: 'grape', to: 'pink' }">Pro</Badge>
        <Badge :left-section="h(PhHeartbeat, { size: 12 })">Live</Badge>
      </Group>
    </DemoCard>

    <DemoCard name="ThemeIcon & Indicator" description="Colored icon container and status dot.">
      <Group gap="xl">
        <Group>
          <ThemeIcon variant="light"><PhHeartbeat :size="18" /></ThemeIcon>
          <ThemeIcon color="teal" size="lg" radius="xl"><PhCheckCircle :size="20" /></ThemeIcon>
          <ThemeIcon variant="gradient" :gradient="{ from: 'blue', to: 'cyan' }" size="xl">
            <PhStar :size="22" />
          </ThemeIcon>
        </Group>
        <Indicator
          :inline="true"
          :size="16"
          :offset="4"
          position="bottom-end"
          color="red"
          label="9"
        >
          <Avatar :src="demoImage" radius="xl" />
        </Indicator>
        <Indicator :inline="true" processing color="green">
          <Avatar color="blue" radius="xl">ON</Avatar>
        </Indicator>
      </Group>
    </DemoCard>

    <DemoCard name="Timeline" description="Show a sequence of events over time.">
      <Timeline :active="1" :bulletSize="24" :lineWidth="2">
        <Timeline.Item :bullet="h(PhGitBranch, { size: 12 })" title="New branch">
          <Text c="dimmed" size="sm">You created branch fix-notifications from master.</Text>
          <Text size="xs" :mt="4">2 hours ago</Text>
        </Timeline.Item>
        <Timeline.Item :bullet="h(PhGitCommit, { size: 12 })" title="Commits">
          <Text c="dimmed" size="sm">You pushed 23 commits.</Text>
          <Text size="xs" :mt="4">52 minutes ago</Text>
        </Timeline.Item>
        <Timeline.Item
          :bullet="h(PhGitPullRequest, { size: 12 })"
          title="Pull request"
          lineVariant="dashed"
        >
          <Text c="dimmed" size="sm">You submitted a pull request.</Text>
          <Text size="xs" :mt="4">34 minutes ago</Text>
        </Timeline.Item>
        <Timeline.Item :bullet="h(PhChatCircleDots, { size: 12 })" title="Code review">
          <Text c="dimmed" size="sm">Robert left a code review.</Text>
          <Text size="xs" :mt="4">12 minutes ago</Text>
        </Timeline.Item>
      </Timeline>
    </DemoCard>

    <DemoCard name="List" description="Ordered and unordered lists with icons.">
      <List spacing="xs" size="sm" center>
        <template #icon>
          <ThemeIcon color="teal" :size="20" radius="xl"><PhCheckCircle :size="14" /></ThemeIcon>
        </template>
        <List.Item>Clone the repository</List.Item>
        <List.Item>Install dependencies with your package manager</List.Item>
        <List.Item>Run the development server</List.Item>
      </List>
    </DemoCard>

    <DemoCard name="Kbd" description="Displays keyboard keys and shortcuts.">
      <Group gap="xs">
        <Kbd>⌘</Kbd>
        <Text size="sm">+</Text>
        <Kbd>K</Kbd>
        <Text size="sm" c="dimmed" ml="md">to open the search palette</Text>
      </Group>
    </DemoCard>

    <DemoCard name="ColorSwatch" description="Renders a single color square.">
      <Group>
        <ColorSwatch color="#4c6ef5" />
        <ColorSwatch color="#12b886" />
        <ColorSwatch color="#fa5252" />
        <ColorSwatch color="#fab005" :withShadow="false" />
      </Group>
    </DemoCard>

    <DemoCard name="Image & AspectRatio" description="Responsive image with a fixed ratio.">
      <AspectRatio :ratio="16 / 9" style="max-width: 340px">
        <Image :src="demoImage" alt="Landscape" radius="md" />
      </AspectRatio>
    </DemoCard>

    <DemoCard name="BackgroundImage" description="Places content over a background image.">
      <BackgroundImage :src="demoImage" radius="md" style="max-width: 340px">
        <Center :p="40">
          <Title :order="4" c="white">Overlay content</Title>
        </Center>
      </BackgroundImage>
    </DemoCard>

    <DemoCard name="Spoiler" description="Collapse long content behind a toggle.">
      <Spoiler :maxHeight="48" showLabel="Read more" hideLabel="Show less" style="max-width: 420px">
        <Text size="sm">
          Mantine Vue is a full-featured components library. This block of text is intentionally
          long so that the Spoiler collapses it after a fixed height, revealing a control to expand
          and read the rest of the content on demand.
        </Text>
      </Spoiler>
    </DemoCard>

    <DemoCard
      name="NumberFormatter & RollingNumber"
      description="Format and animate numeric values."
    >
      <Stack gap="sm">
        <Text :fw="600" :fz="28">
          <NumberFormatter prefix="$ " :value="1024.5" thousandSeparator />
        </Text>
        <Group>
          <Paper withBorder p="md" radius="md">
            <Text size="xs" c="dimmed">Active users</Text>
            <Text :fz="28" :fw="700"><RollingNumber :value="counter" /></Text>
          </Paper>
          <button
            type="button"
            style="align-self: center"
            @click="counter += Math.floor(Math.random() * 200)"
          >
            Increase
          </button>
        </Group>
      </Stack>
    </DemoCard>
  </Stack>
</template>
