<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { AreaChart } from '@mantine-vue/charts'
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Group,
  Menu,
  Modal,
  Paper,
  Progress,
  RingProgress,
  SegmentedControl,
  Select,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import {
  PhArrowRight,
  PhBell,
  PhChartLineUp,
  PhCheck,
  PhCheckCircle,
  PhCode,
  PhCommand,
  PhCube,
  PhDotsThree,
  PhEnvelopeSimple,
  PhGearSix,
  PhLightning,
  PhMagnifyingGlass,
  PhPalette,
  PhPaperPlaneTilt,
  PhPlus,
  PhRocketLaunch,
  PhRows,
  PhShieldCheck,
  PhSparkle,
  PhUsers,
} from '@phosphor-icons/vue'
import PageHead from '@/components/PageHead/PageHead.vue'
import HomeInboxShowcase from '@/components/HomeShowcase/HomeInboxShowcase.vue'
import HomeLabExplore from '@/components/HomeShowcase/HomeLabExplore.vue'
import HomeOperationsShowcase from '@/components/HomeShowcase/HomeOperationsShowcase.vue'
import HomeScheduleShowcase from '@/components/HomeShowcase/HomeScheduleShowcase.vue'
import Logo from '@/components/Logo/Logo.vue'
import { primaryColor } from '@/theme'

type ColorScheme = 'light' | 'dark'

const { setColorScheme } = useMantineColorScheme()
const computedColorScheme = useComputedColorScheme('light')
const activeWorkbench = ref('form')
const period = ref('30d')
const modalOpened = ref(false)
const tableFilter = ref('')
const workspaceName = ref('Northstar Studio')
const workspaceEmail = ref('hello@northstar.dev')
const workspacePlan = ref<string | null>('Growth')
const workspaceNotes = ref('Launch the new client portal before the next product review.')
const weeklyDigest = ref(true)

const colorOptions = [
  { label: 'Ocean blue', value: 'blue', swatch: '#228be6' },
  { label: 'Grape', value: 'grape', swatch: '#ae3ec9' },
  { label: 'Violet', value: 'violet', swatch: '#7950f2' },
  { label: 'Teal', value: 'teal', swatch: '#12b886' },
  { label: 'Orange', value: 'orange', swatch: '#fd7e14' },
]

const chartData = [
  { name: 'Mon', ThisWeek: 32, LastWeek: 23 },
  { name: 'Tue', ThisWeek: 41, LastWeek: 31 },
  { name: 'Wed', ThisWeek: 38, LastWeek: 29 },
  { name: 'Thu', ThisWeek: 55, LastWeek: 38 },
  { name: 'Fri', ThisWeek: 49, LastWeek: 41 },
  { name: 'Sat', ThisWeek: 67, LastWeek: 45 },
  { name: 'Sun', ThisWeek: 74, LastWeek: 52 },
]

const chartSeries = computed(() => [
  { name: 'ThisWeek', label: 'This week', color: `${primaryColor.value}.6` },
  { name: 'LastWeek', label: 'Last week', color: 'gray.5' },
])

const tasks = ref([
  { id: 1, title: 'Review onboarding flow', owner: 'Maya Chen', initials: 'MC', done: true },
  { id: 2, title: 'Prepare launch metrics', owner: 'Noah Lee', initials: 'NL', done: true },
  { id: 3, title: 'Polish billing settings', owner: 'Lina Park', initials: 'LP', done: false },
  { id: 4, title: 'Publish release notes', owner: 'Omar Reed', initials: 'OR', done: false },
])

const visibleTasks = computed(() => {
  const query = tableFilter.value.trim().toLowerCase()
  if (!query) return tasks.value
  return tasks.value.filter(
    (task) => task.title.toLowerCase().includes(query) || task.owner.toLowerCase().includes(query),
  )
})

const completion = computed(() => {
  const completed = tasks.value.filter((task) => task.done).length
  return Math.round((completed / tasks.value.length) * 100)
})

const selectedScheme = computed({
  get: () => computedColorScheme.value,
  set: (value: ColorScheme) => setColorScheme(value),
})

function selectPrimaryColor(color: string) {
  primaryColor.value = color
}

function showSavedNotification() {
  notifications.show({
    title: 'Workspace saved',
    message: 'Your changes are ready for the team.',
    color: primaryColor.value,
    icon: h(PhCheck, { size: 16 }),
  })
}

function inviteTeammate() {
  modalOpened.value = false
  notifications.show({
    title: 'Invitation sent',
    message: 'We sent a secure invite to your teammate.',
    color: primaryColor.value,
    icon: h(PhPaperPlaneTilt, { size: 16 }),
  })
}
</script>

<template>
  <PageHead
    :title="undefined"
    description="Build accessible, production-ready Vue 3 applications with a cohesive library of customizable components, charts, forms, and composables."
  />

  <main class="home">
    <section class="heroSection">
      <div class="heroGlow heroGlowOne" />
      <div class="heroGlow heroGlowTwo" />
      <div class="homeContainer heroGrid">
        <div class="heroCopy">
          <h1 class="heroTitle">
            Build interfaces that<br />
            <span>feel inevitable.</span>
          </h1>

          <p class="heroDescription">
            A complete Vue component library for teams that care about craft. Accessible by default,
            deeply customizable, and ready for real products.
          </p>

          <div class="heroActions">
            <Button :component="RouterLink" to="/getting-started" size="lg" radius="md">
              Start building
              <template #rightSection><PhArrowRight :size="17" weight="bold" /></template>
            </Button>
            <Button
              component="a"
              href="https://github.com/mantine-vue/mantine-vue"
              target="_blank"
              rel="noreferrer"
              variant="default"
              size="lg"
              radius="md"
            >
              <template #leftSection><PhCode :size="18" /></template>
              View on GitHub
            </Button>
          </div>

          <div class="heroProof">
            <span><PhCheckCircle :size="17" weight="fill" /> 100+ components</span>
            <span><PhCheckCircle :size="17" weight="fill" /> TypeScript native</span>
            <span><PhCheckCircle :size="17" weight="fill" /> MIT licensed</span>
          </div>
        </div>

        <div class="showcaseWrap">
          <Paper class="themeToolbar" radius="xl" shadow="md">
            <div class="themeControlGroup">
              <PhPalette :size="17" />
              <span>Primary</span>
              <div class="colorSwatches" role="radiogroup" aria-label="Primary color">
                <Tooltip
                  v-for="color in colorOptions"
                  :key="color.value"
                  :label="color.label"
                  position="top"
                >
                  <button
                    class="colorSwatch"
                    :class="{ active: primaryColor === color.value }"
                    :style="{ '--swatch-color': color.swatch }"
                    type="button"
                    role="radio"
                    :aria-checked="primaryColor === color.value"
                    :aria-label="color.label"
                    @click="selectPrimaryColor(color.value)"
                  >
                    <PhCheck v-if="primaryColor === color.value" :size="11" weight="bold" />
                  </button>
                </Tooltip>
              </div>
            </div>
            <Divider orientation="vertical" class="toolbarDivider" />
            <SegmentedControl
              v-model="selectedScheme"
              :data="[
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ]"
              size="xs"
              radius="xl"
              aria-label="Color scheme"
            />
          </Paper>

          <div class="appWindow">
            <aside class="appRail" aria-label="Demo navigation">
              <div class="railMark"><PhCube :size="20" weight="fill" /></div>
              <nav>
                <Tooltip label="Overview" position="right">
                  <ActionIcon variant="light" size="lg" radius="md" aria-label="Overview">
                    <PhChartLineUp :size="19" />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Projects" position="right">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="lg"
                    radius="md"
                    aria-label="Projects"
                  >
                    <PhRows :size="19" />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Team" position="right">
                  <ActionIcon variant="subtle" color="gray" size="lg" radius="md" aria-label="Team">
                    <PhUsers :size="19" />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Settings" position="right">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="lg"
                    radius="md"
                    aria-label="Settings"
                  >
                    <PhGearSix :size="19" />
                  </ActionIcon>
                </Tooltip>
              </nav>
              <Avatar size="sm" radius="xl" color="gray">AK</Avatar>
            </aside>

            <div class="appContent">
              <header class="appTopbar">
                <div>
                  <Text fw="700" size="lg">Good morning, Alex</Text>
                  <Text c="dimmed" size="xs">Here’s what changed overnight.</Text>
                </div>
                <Group :gap="8">
                  <ActionIcon variant="default" size="lg" radius="md" aria-label="Notifications">
                    <PhBell :size="17" />
                  </ActionIcon>
                  <Button size="xs" radius="md" @click="modalOpened = true">
                    <template #leftSection><PhPlus :size="14" /></template>
                    Invite
                  </Button>
                </Group>
              </header>

              <div class="metricsGrid">
                <Paper class="metricCard" radius="md">
                  <Text c="dimmed" size="xs" fw="600">Total revenue</Text>
                  <div class="metricValue">$84.2k</div>
                  <Badge color="teal" variant="light" size="xs">+12.4%</Badge>
                </Paper>
                <Paper class="metricCard" radius="md">
                  <Text c="dimmed" size="xs" fw="600">Active users</Text>
                  <div class="metricValue">12,804</div>
                  <Badge variant="light" size="xs">+8.1%</Badge>
                </Paper>
                <Paper class="metricCard" radius="md">
                  <Text c="dimmed" size="xs" fw="600">Conversion</Text>
                  <div class="metricValue">4.82%</div>
                  <Badge color="teal" variant="light" size="xs">+0.6%</Badge>
                </Paper>
              </div>

              <Paper class="chartCard" radius="md">
                <Group justify="space-between" mb="xs">
                  <div>
                    <Text fw="700" size="sm">Revenue overview</Text>
                    <Text c="dimmed" size="xs">Weekly performance</Text>
                  </div>
                  <SegmentedControl
                    v-model="period"
                    :data="[
                      { label: '7D', value: '7d' },
                      { label: '30D', value: '30d' },
                      { label: '90D', value: '90d' },
                    ]"
                    size="xs"
                    radius="md"
                  />
                </Group>
                <AreaChart
                  :key="primaryColor"
                  v-bind="{ dataKey: 'name' }"
                  :data="chartData"
                  :series="chartSeries"
                  :height="190"
                  :with-legend="false"
                  :with-gradient="true"
                  :curve-type="'natural'"
                />
              </Paper>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="principlesSection">
      <div class="homeContainer principlesGrid">
        <div class="principle">
          <ThemeIcon variant="light" size="lg" radius="md"><PhShieldCheck :size="20" /></ThemeIcon>
          <div>
            <strong>Accessible by default</strong><span>Keyboard and screen-reader ready.</span>
          </div>
        </div>
        <div class="principle">
          <ThemeIcon variant="light" size="lg" radius="md"><PhPalette :size="20" /></ThemeIcon>
          <div>
            <strong>Your design language</strong><span>Theme every detail from one place.</span>
          </div>
        </div>
        <div class="principle">
          <ThemeIcon variant="light" size="lg" radius="md"><PhLightning :size="20" /></ThemeIcon>
          <div>
            <strong>Built for velocity</strong><span>Excellent defaults, flexible APIs.</span>
          </div>
        </div>
      </div>
    </section>

    <section class="workbenchSection">
      <div class="homeContainer">
        <div class="sectionHeading">
          <h2>One system. Every workflow.</h2>
          <p>
            Explore real components in context. Edit a form, manage a table, or trigger polished
            feedback without leaving the page.
          </p>
        </div>

        <Paper class="workbench" radius="lg">
          <Tabs v-model="activeWorkbench" variant="pills" radius="md">
            <div class="workbenchNav">
              <div>
                <Text fw="700">Component lab</Text>
                <Text c="dimmed" size="xs">Everything below is live.</Text>
              </div>
              <Tabs.List>
                <Tabs.Tab value="form">
                  <template #leftSection><PhCommand :size="15" /></template>
                  Forms
                </Tabs.Tab>
                <Tabs.Tab value="data">
                  <template #leftSection><PhRows :size="15" /></template>
                  Data
                </Tabs.Tab>
                <Tabs.Tab value="feedback">
                  <template #leftSection><PhSparkle :size="15" /></template>
                  Feedback
                </Tabs.Tab>
                <Tabs.Tab value="explore">
                  <template #leftSection><PhCube :size="15" /></template>
                  Explore
                </Tabs.Tab>
              </Tabs.List>
            </div>

            <Divider />

            <Tabs.Panel value="form" class="workbenchPanel">
              <div class="panelIntro">
                <Badge variant="dot" size="sm">Form system</Badge>
                <h3>Configure your workspace</h3>
                <p>
                  Inputs, selects, validation states, and layout primitives share the same visual
                  rhythm automatically.
                </p>
                <div class="miniCode">
                  <span class="codeKeyword">&lt;TextInput</span>
                  <span> label=</span><span class="codeString">&quot;Workspace name&quot;</span>
                  <span> /&gt;</span>
                </div>
              </div>

              <Card with-border radius="lg" padding="lg" class="formCard">
                <form @submit.prevent="showSavedNotification">
                  <div class="formGrid">
                    <TextInput
                      v-model="workspaceName"
                      label="Workspace name"
                      placeholder="Acme Studio"
                    />
                    <TextInput
                      v-model="workspaceEmail"
                      label="Contact email"
                      placeholder="team@company.com"
                      type="email"
                    />
                  </div>
                  <Select
                    v-model="workspacePlan"
                    mt="md"
                    label="Plan"
                    :data="['Starter', 'Growth', 'Enterprise']"
                  />
                  <Textarea
                    v-model="workspaceNotes"
                    mt="md"
                    label="Team note"
                    :autosize="true"
                    :min-rows="2"
                  />
                  <Group justify="space-between" mt="lg" class="formFooter">
                    <Switch v-model="weeklyDigest" label="Weekly digest" />
                    <Button type="submit">Save workspace</Button>
                  </Group>
                </form>
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="data" class="workbenchPanel dataPanel">
              <div class="panelIntro">
                <Badge variant="dot" size="sm">Data display</Badge>
                <h3>A table that feels at home</h3>
                <p>
                  Compose filters, selection, status, avatars, and menus into productive data
                  experiences.
                </p>
                <Progress :value="completion" size="sm" radius="xl" mt="xl" />
                <Text c="dimmed" size="xs" mt="xs">{{ completion }}% of launch tasks complete</Text>
              </div>

              <Card with-border radius="lg" padding="0" class="tableCard">
                <div class="tableToolbar">
                  <TextInput
                    v-model="tableFilter"
                    placeholder="Filter tasks..."
                    size="sm"
                    class="tableSearch"
                  >
                    <template #leftSection><PhMagnifyingGlass :size="15" /></template>
                  </TextInput>
                  <Button size="sm" variant="light">
                    <template #leftSection><PhPlus :size="14" /></template>
                    Add task
                  </Button>
                </div>
                <div class="tableScroll">
                  <Table vertical-spacing="sm" horizontal-spacing="md" highlight-on-hover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Task</Table.Th>
                        <Table.Th>Owner</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th><span class="srOnly">Actions</span></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr v-for="task in visibleTasks" :key="task.id">
                        <Table.Td>
                          <Group :gap="10" wrap="nowrap">
                            <Checkbox v-model="task.done" :aria-label="`Complete ${task.title}`" />
                            <Text size="sm" fw="600" :td="task.done ? 'line-through' : undefined">
                              {{ task.title }}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group :gap="8" wrap="nowrap">
                            <Avatar size="sm" radius="xl" color="gray">{{ task.initials }}</Avatar>
                            <Text size="sm">{{ task.owner }}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Badge :color="task.done ? 'teal' : 'gray'" variant="light">
                            {{ task.done ? 'Done' : 'In progress' }}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Menu position="bottom-end" within-portal>
                            <Menu.Target>
                              <ActionIcon variant="subtle" color="gray" aria-label="Task actions">
                                <PhDotsThree :size="18" weight="bold" />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item @click="notifications.show({ message: 'Task opened' })">
                                Open task
                              </Menu.Item>
                              <Menu.Item
                                @click="notifications.show({ message: 'Task duplicated' })"
                              >
                                Duplicate
                              </Menu.Item>
                              <Menu.Divider />
                              <Menu.Item color="red">Archive</Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </div>
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="feedback" class="workbenchPanel feedbackPanel">
              <div class="panelIntro">
                <Badge variant="dot" size="sm">Feedback & overlays</Badge>
                <h3>Every interaction, resolved</h3>
                <p>
                  Menus, modals, notifications, and progress states make complex moments feel calm
                  and predictable.
                </p>
                <Group mt="xl">
                  <Button @click="modalOpened = true">Open modal</Button>
                  <Button variant="default" @click="showSavedNotification"
                    >Show notification</Button
                  >
                </Group>
              </div>

              <Card with-border radius="lg" padding="xl" class="feedbackCard">
                <div class="feedbackTopline">
                  <ThemeIcon size="xl" radius="xl" variant="light">
                    <PhRocketLaunch :size="24" />
                  </ThemeIcon>
                  <Badge color="teal" variant="light">On track</Badge>
                </div>
                <Text fw="700" size="xl" mt="lg">Launch readiness</Text>
                <Text c="dimmed" size="sm" mt="4">
                  Your workspace is almost ready to share with the team.
                </Text>
                <div class="readinessRow">
                  <RingProgress
                    :size="104"
                    :thickness="9"
                    :sections="[{ value: 82, color: primaryColor }]"
                    :label="h(Text, { ta: 'center', fw: 700, size: 'lg' }, () => '82%')"
                  />
                  <div class="checkList">
                    <span><PhCheck :size="14" /> Brand theme</span>
                    <span><PhCheck :size="14" /> Team members</span>
                    <span class="pending"><PhSparkle :size="14" /> Publish workspace</span>
                  </div>
                </div>
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="explore" class="labExplorePanel">
              <div class="exploreIntro">
                <div>
                  <Badge variant="dot" size="sm">Core + extensions</Badge>
                  <h3>Compose beyond the basics</h3>
                </div>
                <Text c="dimmed" size="sm">
                  Expand content, swipe through product stories, and launch a searchable command
                  palette—all with consistent theme and interaction primitives.
                </Text>
              </div>
              <HomeLabExplore />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </div>
    </section>

    <section class="showcaseSection inboxShowcaseSection">
      <div class="homeContainer">
        <div class="sectionHeading">
          <Badge color="teal" variant="light" radius="xl">WhatsApp-style inbox</Badge>
          <h2>Conversations built for real support teams.</h2>
          <p>
            Search conversations, switch customers, review context, and send messages in a
            responsive three-pane inbox composition.
          </p>
        </div>
        <HomeInboxShowcase />
      </div>
    </section>

    <section class="showcaseSection scheduleShowcaseSection">
      <div class="homeContainer">
        <div class="sectionHeading">
          <Badge variant="light" radius="xl">Dates + scheduling</Badge>
          <h2>A calendar that works like a workspace.</h2>
          <p>
            Combine date selection, navigation, team context, menus, and responsive scheduling into
            one focused planning experience.
          </p>
        </div>
        <HomeScheduleShowcase />
      </div>
    </section>

    <section class="showcaseSection operationsShowcaseSection">
      <div class="homeContainer">
        <div class="sectionHeading">
          <Badge color="violet" variant="light" radius="xl">Production compositions</Badge>
          <h2>Files, feedback, and activity—together.</h2>
          <p>
            A practical operations surface combining file management, selectable rows,
            notifications, progress, menus, and a live activity timeline.
          </p>
        </div>
        <HomeOperationsShowcase />
      </div>
    </section>

    <section class="ctaSection">
      <div class="homeContainer">
        <Paper class="ctaCard" radius="lg">
          <div>
            <Badge variant="light" radius="xl">Production ready</Badge>
            <h2>From first idea to shipped product.</h2>
            <p>Bring your own brand. Mantine Vue brings the foundation.</p>
          </div>
          <Group class="ctaActions">
            <Button :component="RouterLink" to="/getting-started" size="lg" variant="white">
              Read the docs
              <template #rightSection><PhArrowRight :size="17" /></template>
            </Button>
            <Button
              :component="RouterLink"
              to="/core/button"
              size="lg"
              variant="transparent"
              color="white"
            >
              Browse components
            </Button>
          </Group>
        </Paper>
      </div>
    </section>

    <footer class="homeFooter">
      <div class="homeContainer footerInner">
        <Logo class="footerBrand" />
        <Text c="dimmed" size="sm">Build with confidence. Ship with character.</Text>
        <Text c="dimmed" size="sm">MIT licensed · Vue 3</Text>
      </div>
    </footer>
  </main>

  <Modal
    :opened="modalOpened"
    title="Invite a teammate"
    centered
    radius="lg"
    @close="modalOpened = false"
  >
    <Text c="dimmed" size="sm" mb="lg">
      They’ll receive a secure invitation to collaborate in Northstar Studio.
    </Text>
    <TextInput label="Email address" placeholder="teammate@company.com" type="email">
      <template #leftSection><PhEnvelopeSimple :size="16" /></template>
    </TextInput>
    <Select mt="md" label="Role" :data="['Admin', 'Editor', 'Viewer']" default-value="Editor" />
    <Group justify="flex-end" mt="xl">
      <Button variant="default" @click="modalOpened = false">Cancel</Button>
      <Button @click="inviteTeammate">Send invitation</Button>
    </Group>
  </Modal>
</template>

<style scoped>
.home {
  --home-border: light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5));
  --home-subtle: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8));
  overflow: hidden;
  background: var(--mantine-color-body);
  color: var(--mantine-color-text);
}

.homeContainer {
  width: min(1180px, calc(100% - 40px));
  margin-inline: auto;
}

.heroSection {
  position: relative;
  padding: 92px 0 76px;
  isolation: isolate;
}

.heroSection::before {
  position: absolute;
  z-index: -2;
  inset: 0;
  content: '';
  background-image: radial-gradient(
    circle at 1px 1px,
    alpha(var(--mantine-color-gray-5), 0.16) 1px,
    transparent 0
  );
  background-size: 24px 24px;
  mask-image: linear-gradient(to bottom, black, transparent 76%);
}

.heroGlow {
  position: absolute;
  z-index: -1;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: alpha(var(--mantine-primary-color-filled), 0.13);
  filter: blur(90px);
  pointer-events: none;
}

.heroGlowOne {
  top: 6%;
  right: 2%;
}

.heroGlowTwo {
  bottom: -15%;
  left: -15%;
  width: 320px;
  height: 320px;
  opacity: 0.55;
}

.heroGrid {
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(540px, 1.12fr);
  align-items: center;
  gap: 72px;
}

.eyebrow {
  text-transform: none;
  letter-spacing: 0;
}

.eyebrow :deep(.mantine-Badge-label) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.eyebrowDot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 4px alpha(var(--mantine-primary-color-filled), 0.12);
}

.heroTitle {
  margin: 24px 0 22px;
  font-size: clamp(46px, 5.1vw, 72px);
  line-height: 1.01;
  letter-spacing: -0.055em;
  font-weight: 750;
  color: var(--mantine-color-bright);
}

.heroTitle span {
  color: var(--mantine-primary-color-filled);
}

.heroDescription {
  max-width: 580px;
  margin: 0;
  color: var(--mantine-color-dimmed);
  font-size: 18px;
  line-height: 1.72;
}

.heroActions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.heroProof {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  margin-top: 27px;
  color: var(--mantine-color-dimmed);
  font-size: 12px;
  font-weight: 600;
}

.heroProof span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.heroProof svg {
  color: var(--mantine-primary-color-filled);
}

.showcaseWrap {
  position: relative;
  padding-top: 24px;
}

.themeToolbar {
  position: absolute;
  z-index: 3;
  top: 0;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 8px 10px 8px 16px;
  border: 1px solid var(--home-border);
  background: alpha(var(--mantine-color-body), 0.92);
  transform: translateX(-50%);
  backdrop-filter: blur(14px);
  white-space: nowrap;
}

.themeControlGroup {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  font-weight: 700;
}

.colorSwatches {
  display: flex;
  gap: 5px;
}

.colorSwatch {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 50%;
  background: var(--swatch-color);
  color: white;
  cursor: pointer;
  transition:
    transform 140ms ease,
    box-shadow 140ms ease;
}

.colorSwatch:hover {
  transform: translateY(-1px);
}

.colorSwatch.active {
  box-shadow:
    0 0 0 2px var(--mantine-color-body),
    0 0 0 4px var(--swatch-color);
}

.toolbarDivider {
  height: 24px;
}

.appWindow {
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr);
  min-height: 540px;
  overflow: hidden;
  border: 1px solid var(--home-border);
  border-radius: 18px;
  background: light-dark(var(--mantine-color-white), var(--mantine-color-dark-7));
  box-shadow:
    0 32px 80px alpha(var(--mantine-color-black), 0.12),
    0 4px 18px alpha(var(--mantine-color-black), 0.07);
}

.appRail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 18px 10px;
  border-right: 1px solid var(--home-border);
  background: var(--home-subtle);
}

.appRail nav {
  display: grid;
  gap: 7px;
}

.railMark {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--mantine-primary-color-filled);
  color: white;
  box-shadow: 0 7px 20px alpha(var(--mantine-primary-color-filled), 0.3);
}

.appContent {
  min-width: 0;
  padding: 25px;
  background: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8));
}

.appTopbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 21px;
}

.metricsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 11px;
}

.metricCard,
.chartCard {
  border: 1px solid var(--home-border);
  background: light-dark(var(--mantine-color-white), var(--mantine-color-dark-7));
}

.metricCard {
  padding: 14px;
}

.metricValue {
  margin: 6px 0 8px;
  font-size: 21px;
  font-weight: 750;
  color: var(--mantine-color-bright);
  letter-spacing: -0.035em;
}

.chartCard {
  margin-top: 11px;
  padding: 17px 17px 8px;
}

.principlesSection {
  border-block: 1px solid var(--home-border);
  background: var(--home-subtle);
}

.principlesGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.principle {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 28px 30px;
}

.principle + .principle {
  border-left: 1px solid var(--home-border);
}

.principle strong,
.principle span {
  display: block;
}

.principle strong {
  color: var(--mantine-color-bright);
  font-size: 14px;
}

.principle span {
  margin-top: 3px;
  color: var(--mantine-color-dimmed);
  font-size: 12px;
}

.workbenchSection {
  padding: 112px 0;
}

.sectionHeading {
  max-width: 690px;
  margin: 0 auto 50px;
  text-align: center;
}

.sectionHeading h2,
.ctaCard h2 {
  margin: 17px 0 14px;
  color: var(--mantine-color-bright);
  font-size: clamp(34px, 4vw, 50px);
  line-height: 1.08;
  letter-spacing: -0.045em;
}

.sectionHeading p,
.ctaCard p {
  margin: 0;
  color: var(--mantine-color-dimmed);
  font-size: 17px;
  line-height: 1.65;
}

.workbench {
  overflow: hidden;
  border: 1px solid var(--home-border);
  background: light-dark(var(--mantine-color-white), var(--mantine-color-dark-7));
  box-shadow: 0 24px 70px alpha(var(--mantine-color-black), 0.08);
}

.workbenchNav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 20px;
}

.workbenchPanel {
  display: grid;
  grid-template-columns: minmax(230px, 0.7fr) minmax(500px, 1.3fr);
  align-items: center;
  gap: 60px;
  min-height: 500px;
  padding: 48px 58px;
  background:
    radial-gradient(
      circle at 90% 0%,
      alpha(var(--mantine-primary-color-filled), 0.08),
      transparent 34%
    ),
    var(--home-subtle);
}

.labExplorePanel {
  min-height: 500px;
  padding: 38px;
  background:
    radial-gradient(
      circle at 90% 0%,
      alpha(var(--mantine-primary-color-filled), 0.08),
      transparent 34%
    ),
    var(--home-subtle);
}

.exploreIntro {
  display: grid;
  grid-template-columns: minmax(240px, 0.75fr) minmax(320px, 1.25fr);
  align-items: end;
  gap: 50px;
  margin-bottom: 28px;
}

.exploreIntro h3 {
  margin: 13px 0 0;
  color: var(--mantine-color-bright);
  font-size: 28px;
  line-height: 1.12;
  letter-spacing: -0.035em;
}

.showcaseSection {
  padding: 112px 0;
}

.scheduleShowcaseSection,
.operationsShowcaseSection {
  border-block: 1px solid var(--home-border);
  background: var(--home-subtle);
}

.inboxShowcaseSection {
  background: var(--mantine-color-body);
}

.panelIntro h3 {
  margin: 15px 0 12px;
  color: var(--mantine-color-bright);
  font-size: 30px;
  line-height: 1.12;
  letter-spacing: -0.035em;
}

.panelIntro p {
  margin: 0;
  color: var(--mantine-color-dimmed);
  line-height: 1.65;
}

.miniCode {
  margin-top: 25px;
  padding: 13px 15px;
  overflow-x: auto;
  border: 1px solid var(--home-border);
  border-radius: var(--mantine-radius-md);
  background: light-dark(var(--mantine-color-white), var(--mantine-color-dark-8));
  color: var(--mantine-color-dimmed);
  font-family: var(--mantine-font-family-monospace);
  font-size: 11px;
  white-space: nowrap;
}

.codeKeyword {
  color: var(--mantine-primary-color-filled);
}

.codeString {
  color: light-dark(var(--mantine-color-teal-7), var(--mantine-color-teal-4));
}

.formCard,
.tableCard,
.feedbackCard {
  background: light-dark(var(--mantine-color-white), var(--mantine-color-dark-7));
  box-shadow: 0 18px 50px alpha(var(--mantine-color-black), 0.08);
}

.formGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.tableCard {
  min-width: 0;
  overflow: hidden;
}

.tableToolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 15px;
  border-bottom: 1px solid var(--home-border);
}

.tableSearch {
  width: 230px;
}

.tableScroll {
  overflow-x: auto;
}

.tableScroll :deep(table) {
  min-width: 620px;
}

.feedbackCard {
  max-width: 420px;
  width: 100%;
  justify-self: center;
}

.feedbackTopline {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.readinessRow {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-top: 26px;
}

.checkList {
  display: grid;
  gap: 12px;
  font-size: 13px;
  font-weight: 600;
}

.checkList span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkList svg {
  color: var(--mantine-primary-color-filled);
}

.checkList .pending {
  color: var(--mantine-color-dimmed);
}

.ctaSection {
  padding: 90px 0 90px;
}

.ctaCard {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  overflow: hidden;
  padding: 56px 60px;
  background: var(--mantine-primary-color-filled);
  color: white;
}

.ctaCard::after {
  position: absolute;
  top: -180px;
  right: -100px;
  width: 380px;
  height: 380px;
  border: 1px solid alpha(var(--mantine-color-white), 0.3);
  border-radius: 50%;
  content: '';
  box-shadow:
    0 0 0 55px alpha(var(--mantine-color-white), 0.06),
    0 0 0 110px alpha(var(--mantine-color-white), 0.04);
}

.ctaCard > * {
  position: relative;
  z-index: 1;
}

.ctaCard h2,
.ctaCard p {
  color: white;
}

.ctaCard h2 {
  max-width: 600px;
  font-size: clamp(31px, 4vw, 46px);
}

.ctaCard p {
  opacity: 0.78;
}

.ctaCard :deep(.mantine-Badge-root) {
  color: white;
  background: alpha(var(--mantine-color-white), 0.16);
}

.ctaActions {
  flex-shrink: 0;
}

.homeFooter {
  padding: 27px 0;
  border-top: 1px solid var(--home-border);
}

.footerInner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.footerBrand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--mantine-color-bright);
  font-weight: 750;
}

.footerBrand svg {
  color: var(--mantine-primary-color-filled);
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1080px) {
  .heroGrid {
    grid-template-columns: 1fr;
    gap: 64px;
  }

  .heroCopy {
    max-width: 760px;
    margin-inline: auto;
    text-align: center;
  }

  .heroDescription {
    margin-inline: auto;
  }

  .heroActions,
  .heroProof {
    justify-content: center;
  }

  .showcaseWrap {
    max-width: 720px;
    width: 100%;
    margin-inline: auto;
  }

  .workbenchPanel {
    gap: 36px;
    padding: 42px 36px;
  }

  .exploreIntro {
    gap: 28px;
  }

  .ctaCard {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 760px) {
  .homeContainer {
    width: min(100% - 28px, 1180px);
  }

  .heroSection {
    padding: 65px 0 54px;
  }

  .heroTitle {
    font-size: clamp(40px, 12vw, 56px);
  }

  .heroTitle br {
    display: none;
  }

  .heroDescription {
    font-size: 16px;
  }

  .themeToolbar {
    width: max-content;
    max-width: calc(100vw - 28px);
    overflow-x: auto;
  }

  .appWindow {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .appRail {
    display: none;
  }

  .appContent {
    padding: 18px;
  }

  .metricsGrid {
    grid-template-columns: 1fr 1fr;
  }

  .metricCard:last-child {
    display: none;
  }

  .principlesGrid {
    grid-template-columns: 1fr;
  }

  .principle {
    padding: 20px 8px;
  }

  .principle + .principle {
    border-top: 1px solid var(--home-border);
    border-left: 0;
  }

  .workbenchSection {
    padding: 78px 0;
  }

  .workbenchNav {
    align-items: flex-start;
    flex-direction: column;
  }

  .workbenchNav :deep(.mantine-Tabs-list) {
    width: 100%;
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .workbenchPanel {
    grid-template-columns: 1fr;
    min-height: auto;
    gap: 32px;
    padding: 32px 20px;
  }

  .labExplorePanel {
    padding: 30px 20px;
  }

  .exploreIntro {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .showcaseSection {
    padding: 78px 0;
  }

  .formGrid {
    grid-template-columns: 1fr;
  }

  .formFooter {
    align-items: flex-start;
    flex-direction: column;
  }

  .dataPanel .panelIntro,
  .feedbackPanel .panelIntro {
    max-width: none;
  }

  .tableToolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .tableSearch {
    width: 100%;
  }

  .ctaSection {
    padding-bottom: 60px;
  }

  .ctaCard {
    gap: 34px;
    padding: 40px 26px;
  }

  .ctaActions {
    align-items: stretch;
    flex-direction: column;
    width: 100%;
  }

  .footerInner {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .heroActions {
    flex-direction: column;
  }

  .heroActions :deep(.mantine-Button-root) {
    width: 100%;
  }

  .heroProof {
    align-items: center;
    flex-direction: column;
  }

  .themeControlGroup > span {
    display: none;
  }

  .toolbarDivider {
    display: none;
  }

  .themeToolbar {
    gap: 8px;
    padding-inline: 10px;
  }

  .appTopbar > div:first-child :deep(.mantine-Text-root:last-child) {
    display: none;
  }

  .metricsGrid {
    grid-template-columns: 1fr;
  }

  .metricCard:nth-child(2),
  .metricCard:last-child {
    display: none;
  }

  .chartCard {
    padding-inline: 10px;
  }

  .chartCard :deep(.mantine-SegmentedControl-root) {
    display: none;
  }

  .readinessRow {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .colorSwatch {
    transition: none;
  }
}
</style>
