<script setup lang="ts">
import { computed, ref } from 'vue'
import { BarChart } from '@mantine-vue/charts'
import {
  ActionIcon,
  Anchor,
  Badge,
  Breadcrumbs,
  Button,
  Checkbox,
  CloseButton,
  EmptyState,
  Group,
  Menu,
  Modal,
  NavLink,
  NumberInput,
  Paper,
  PasswordInput,
  Progress,
  Radio,
  Select,
  Slider,
  Switch,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  UnstyledButton,
} from '@mantine-vue/core'
import { MonthPickerInput } from '@mantine-vue/dates'
import { notifications } from '@mantine-vue/notifications'
import { QRCode } from '@mantine-vue/qr-code'
import {
  PhArrowClockwise,
  PhArrowRight,
  PhArrowsLeftRight,
  PhArrowUp,
  PhBank,
  PhBell,
  PhBookOpen,
  PhCalendarBlank,
  PhCaretDown,
  PhCaretRight,
  PhChartBar,
  PhChartLineUp,
  PhChatCircleDots,
  PhClockCountdown,
  PhCreditCard,
  PhEnvelopeSimple,
  PhFileText,
  PhGauge,
  PhLifebuoy,
  PhLockSimple,
  PhMagnifyingGlass,
  PhPaintBrush,
  PhPiggyBank,
  PhPlus,
  PhRepeat,
  PhShieldCheck,
  PhTarget,
  PhUser,
  PhUsersThree,
  PhWallet,
  PhWifiHigh,
} from '@phosphor-icons/vue'
import { primaryColor } from '@/theme'

const plan = ref('monthly')
const remember = ref(true)
const autopay = ref(true)
const alertOpened = ref(false)

const goalName = ref('')
const targetAmount = ref<number | string>(15000)
const targetDate = ref<string | null>('2026-12-01')

const currency = ref<string | null>('usd')
const payoutAmount = ref(2500)
const payoutNotes = ref('')

const chatMessage = ref(
  "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around.",
)

const activeOverview = ref('Analytics')
const activeAccount = ref('Billing')

const contributions = [
  { month: 'May', amount: 1800 },
  { month: 'Jun', amount: 3100 },
  { month: 'Jul', amount: 2400 },
  { month: 'Aug', amount: 3400 },
  { month: 'Sep', amount: 2050 },
]

const contributionSeries = computed(() => [
  { name: 'amount', label: 'Contribution', color: `${primaryColor.value}.6` },
])

function contributionColor(value: number) {
  if (value >= 3300) return `${primaryColor.value}.8`
  if (value >= 2900) return `${primaryColor.value}.6`
  if (value >= 2300) return `${primaryColor.value}.4`
  return `${primaryColor.value}.2`
}

const planningLinks = [
  { label: 'Documents', icon: PhFileText },
  { label: 'Budget', icon: PhWallet },
  { label: 'Reports', icon: PhChartBar },
  { label: 'Goals', icon: PhTarget },
  { label: 'Calendar', icon: PhCalendarBlank },
]

const supportLinks = [
  { label: 'Help Center', icon: PhLifebuoy },
  { label: 'Docs', icon: PhBookOpen },
  { label: 'Contact Us', icon: PhEnvelopeSimple },
  { label: 'Status', icon: PhWifiHigh },
  { label: 'Community', icon: PhUsersThree },
]

const overviewLinks = [
  { label: 'Analytics', icon: PhChartLineUp },
  { label: 'Transactions', icon: PhArrowsLeftRight },
  { label: 'Investments', icon: PhPiggyBank },
  { label: 'Accounts', icon: PhBank },
  { label: 'Spending', icon: PhCreditCard },
]

const accountLinks = [
  { label: 'Profile', icon: PhUser },
  { label: 'Billing', icon: PhWallet },
  { label: 'Notifications', icon: PhBell },
  { label: 'Security', icon: PhShieldCheck },
  { label: 'Appearance', icon: PhPaintBrush },
]

const savingsTargets = [
  { label: 'Retirement', target: '$420,000', saved: '$273,000', value: 65 },
  { label: 'Real estate', target: '$85,000', saved: '$27,200', value: 32 },
]

const holdings = [
  { name: 'Vanguard', shares: '450 shares', bars: [40, 55, 48, 72] },
  { name: 'S&P 500 VOO', shares: '112 shares', bars: [35, 50, 62, 80] },
  { name: 'Apple AAPL', shares: '85 shares', bars: [60, 45, 70, 58] },
  { name: 'Realty Income', shares: '320 shares', bars: [30, 42, 38, 52] },
]

const paymentActions = [
  {
    title: 'Change transfer limit',
    description: 'Adjust how much you can send from your balance.',
    icon: PhGauge,
  },
  {
    title: 'Scheduled transfers',
    description: 'Set up a transfer to send at a later date.',
    icon: PhClockCountdown,
  },
  {
    title: 'Recurring card payments',
    description: 'Manage your repeated card transactions.',
    icon: PhRepeat,
  },
]

const payoutLabel = computed(() =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency.value ?? 'usd').toUpperCase(),
    maximumFractionDigits: 0,
  }).format(payoutAmount.value),
)

function notify(title: string, message: string) {
  notifications.show({ title, message, color: primaryColor.value })
}

function createGoal() {
  notify('Goal created', `${goalName.value || 'New goal'} has been added to your milestones.`)
  goalName.value = ''
}

function sendChat() {
  if (!chatMessage.value.trim()) return
  notify('Message sent', 'Your conversation has started.')
  chatMessage.value = ''
}
</script>

<template>
  <div class="componentsGrid">
    <!-- Column 1 -->
    <div class="gridColumn">
      <Paper class="demoCard" radius="lg" p="lg">
        <Group :gap="8">
          <Button size="xs" radius="xl">
            Button
            <template #rightSection><PhArrowRight :size="13" weight="bold" /></template>
          </Button>
          <Button size="xs" radius="xl" variant="light">Secondary</Button>
          <Button size="xs" radius="xl" variant="default">Outline</Button>
        </Group>
        <TextInput mt="md" placeholder="Name" radius="md" aria-label="Name">
          <template #rightSection><PhMagnifyingGlass :size="14" /></template>
        </TextInput>
        <Textarea
          mt="sm"
          placeholder="Message"
          radius="md"
          :min-rows="3"
          autosize
          aria-label="Message"
        />
        <Group mt="md" :gap="8" class="controlsRow">
          <Badge size="sm" class="plainBadge">Badge</Badge>
          <Badge size="sm" variant="light" class="plainBadge">Secondary</Badge>
          <Radio
            size="xs"
            :model-value="plan === 'monthly'"
            aria-label="Monthly"
            @update:model-value="plan = 'monthly'"
          />
          <Radio
            size="xs"
            :model-value="plan === 'yearly'"
            aria-label="Yearly"
            @update:model-value="plan = 'yearly'"
          />
          <Checkbox v-model="remember" size="xs" aria-label="Remember me" />
          <Switch v-model="autopay" size="sm" aria-label="Autopay" />
        </Group>
        <Group mt="md" justify="space-between" :gap="8">
          <Button size="xs" variant="default" radius="md" @click="alertOpened = true">
            Alert Dialog
          </Button>
          <Button.Group>
            <Button size="xs" variant="default" radius="md">Button Group</Button>
            <Menu position="bottom-end" within-portal>
              <Menu.Target>
                <Button size="xs" variant="default" radius="md" px="6" aria-label="More options">
                  <PhCaretDown :size="13" />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>Duplicate</Menu.Item>
                <Menu.Item>Share</Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red">Delete</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Button.Group>
        </Group>
      </Paper>

      <div class="navPair">
        <Paper class="demoCard navCard" radius="lg">
          <Text class="navHeading">Planning</Text>
          <NavLink
            v-for="link in planningLinks"
            :key="link.label"
            :label="link.label"
            class="navItem"
          >
            <template #leftSection><component :is="link.icon" :size="15" /></template>
          </NavLink>
        </Paper>
        <Paper class="demoCard navCard" radius="lg">
          <Text class="navHeading">Support</Text>
          <NavLink
            v-for="link in supportLinks"
            :key="link.label"
            :label="link.label"
            class="navItem"
          >
            <template #leftSection><component :is="link.icon" :size="15" /></template>
          </NavLink>
        </Paper>
      </div>

      <div class="navPair">
        <Paper class="demoCard navCard" radius="lg">
          <Text class="navHeading">Overview</Text>
          <NavLink
            v-for="link in overviewLinks"
            :key="link.label"
            :label="link.label"
            :active="activeOverview === link.label"
            variant="light"
            class="navItem"
            @click="activeOverview = link.label"
          >
            <template #leftSection><component :is="link.icon" :size="15" /></template>
          </NavLink>
        </Paper>
        <Paper class="demoCard navCard" radius="lg">
          <Text class="navHeading">Account</Text>
          <NavLink
            v-for="link in accountLinks"
            :key="link.label"
            :label="link.label"
            :active="activeAccount === link.label"
            variant="light"
            class="navItem"
            @click="activeAccount = link.label"
          >
            <template #leftSection><component :is="link.icon" :size="15" /></template>
          </NavLink>
        </Paper>
      </div>

      <Paper class="demoCard" radius="lg" p="lg">
        <Text fw="600">Savings Targets</Text>
        <Text c="dimmed" size="sm" mt="4">
          Active milestones for 2026 across your portfolio. Monitor how close you are to each goal.
        </Text>
        <Paper v-for="target in savingsTargets" :key="target.label" class="insetCard" radius="md">
          <Text class="eyebrow">{{ target.label }}</Text>
          <div class="bigValue">{{ target.target }}</div>
          <Progress :value="target.value" size="sm" radius="xl" mt="sm" />
          <Group justify="space-between" mt="xs">
            <Text c="dimmed" size="xs">{{ target.value }}% achieved</Text>
            <Text size="xs" fw="600">{{ target.saved }}</Text>
          </Group>
        </Paper>
      </Paper>
    </div>

    <!-- Column 2 -->
    <div class="gridColumn">
      <Paper class="demoCard" radius="lg" p="lg">
        <Text fw="600">Contribution History</Text>
        <Text c="dimmed" size="sm">Last 5 months of activity</Text>
        <BarChart
          :key="primaryColor"
          v-bind="{ dataKey: 'month' }"
          class="contributionChart"
          :data="contributions"
          :series="contributionSeries"
          :height="170"
          :with-y-axis="false"
          grid-axis="none"
          tick-line="none"
          :max-bar-width="34"
          :get-bar-color="contributionColor"
          :value-formatter="(value: number) => `$${value.toLocaleString()}`"
        />
        <div class="statPair">
          <Paper class="insetCard" radius="md">
            <Text class="eyebrow">Upcoming</Text>
            <Text fw="700" mt="2">Nov 2026</Text>
            <Text c="dimmed" size="xs">Scheduled</Text>
          </Paper>
          <Paper class="insetCard" radius="md">
            <Text class="eyebrow">Savings plan</Text>
            <Text fw="700" mt="2">Accelerated</Text>
            <Text c="dimmed" size="xs">Recurring</Text>
          </Paper>
        </div>
        <Button full-width radius="md" mt="md" color="dark">View Full Report</Button>
      </Paper>

      <Paper class="demoCard" radius="lg" p="lg">
        <Text c="dimmed" size="sm">Claimable Balance</Text>
        <div class="heroValue">$1,211.29</div>
        <Badge variant="dot" color="yellow" size="sm" radius="sm">Pending setup</Badge>
        <Paper class="insetCard ledger" radius="md">
          <Group justify="space-between">
            <Text c="dimmed" size="sm">Net royalties</Text>
            <Text size="sm" fw="600">$1,248.75</Text>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed" size="sm">Processing fee</Text>
            <Text size="sm" fw="600">-$37.46</Text>
          </Group>
          <Group justify="space-between" class="ledgerTotal">
            <Text size="sm">Total ready to claim</Text>
            <Text size="sm" fw="700">$1,211.29 USD</Text>
          </Group>
        </Paper>
        <Text c="dimmed" size="sm" mt="md">
          Once your bank is connected, balances over $10.00 are automatically eligible for monthly
          distribution on the 15th of each month.
        </Text>
      </Paper>

      <Paper class="demoCard" radius="lg" p="lg">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <div>
            <Text fw="600">Q3 Dividend Income</Text>
            <Text c="dimmed" size="sm">Quarterly payouts across your holdings.</Text>
          </div>
          <CloseButton size="sm" aria-label="Dismiss" />
        </Group>
        <Paper
          v-for="holding in holdings"
          :key="holding.name"
          class="insetCard holdingRow"
          radius="md"
        >
          <div>
            <Text size="sm" fw="600">{{ holding.name }}</Text>
            <Text c="dimmed" size="xs">{{ holding.shares }}</Text>
          </div>
          <div class="miniBars" aria-hidden="true">
            <span
              v-for="(bar, index) in holding.bars"
              :key="index"
              :style="{ height: `${bar}%` }"
            />
          </div>
        </Paper>
      </Paper>
    </div>

    <!-- Column 3 -->
    <div class="gridColumn">
      <Paper class="demoCard" radius="lg" p="lg">
        <Text fw="600">Set a new milestone</Text>
        <Text c="dimmed" size="sm"
          >Define your financial target and we'll help you pace your savings.</Text
        >
        <form @submit.prevent="createGoal">
          <TextInput
            v-model="goalName"
            mt="md"
            label="Goal name"
            placeholder="e.g. New car, home downpayment"
            radius="md"
          />
          <div class="fieldPair">
            <NumberInput
              v-model="targetAmount"
              label="Target amount"
              prefix="$"
              thousand-separator=","
              :min="0"
              radius="md"
              hide-controls
            />
            <MonthPickerInput
              v-model="targetDate"
              label="Target date"
              value-format="MMM YYYY"
              radius="md"
            />
          </div>
          <Button type="submit" full-width radius="md" mt="lg">Create Goal</Button>
          <Button full-width radius="md" mt="xs" variant="default">Cancel</Button>
        </form>
      </Paper>

      <Paper class="demoCard" radius="lg" p="lg">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <div>
            <Text fw="600">Payout Threshold</Text>
            <Text c="dimmed" size="sm">Set the minimum balance required before a payout.</Text>
          </div>
          <CloseButton size="sm" aria-label="Close" />
        </Group>
        <Select
          v-model="currency"
          mt="md"
          label="Preferred currency"
          radius="md"
          :allow-deselect="false"
          :data="[
            { value: 'usd', label: 'USD — United States Dollar' },
            { value: 'eur', label: 'EUR — Euro' },
            { value: 'gbp', label: 'GBP — British Pound' },
          ]"
        />
        <Group justify="space-between" mt="lg" align="flex-end">
          <Text size="sm" fw="500">Minimum payout amount</Text>
          <Text class="payoutValue">{{ payoutLabel }}</Text>
        </Group>
        <Slider
          v-model="payoutAmount"
          mt="sm"
          :min="50"
          :max="10000"
          :step="50"
          :label="null"
          aria-label="Minimum payout amount"
        />
        <Group justify="space-between" mt="6">
          <Text c="dimmed" size="xs">$50 (min)</Text>
          <Text c="dimmed" size="xs">$10,000 (max)</Text>
        </Group>
        <Textarea
          v-model="payoutNotes"
          mt="md"
          label="Notes"
          placeholder="Add any notes for this payout configuration..."
          radius="md"
          :min-rows="3"
          autosize
        />
        <Button
          fullWidth
          radius="md"
          mt="md"
          color="dark"
          @click="notify('Threshold saved', `Payouts start at ${payoutLabel}.`)"
        >
          Save Threshold
        </Button>
      </Paper>

      <Paper class="demoCard" radius="lg" p="lg">
        <Text fw="600">Account Access</Text>
        <Text c="dimmed" size="sm">Update your credentials or re-authenticate.</Text>
        <TextInput mt="md" label="Email address" placeholder="alex@studio.dev" radius="md" />
        <Group justify="space-between" mt="sm" mb="4">
          <Text size="sm" fw="500" component="label" for="home-current-password">
            Current password
          </Text>
          <Anchor size="xs" c="dimmed" href="#" @click.prevent>Forgot?</Anchor>
        </Group>
        <PasswordInput id="home-current-password" placeholder="••••••••" radius="md" />
        <Button full-width radius="md" mt="md" disabled>
          <template #leftSection><PhLockSimple :size="15" /></template>
          Update Security
        </Button>
      </Paper>
    </div>

    <!-- Column 4 -->
    <div class="gridColumn">
      <Paper class="demoCard qrCard" radius="lg" p="xl">
        <Paper class="qrFrame" radius="md">
          <QRCode value="https://mantine-vue.dev" :size="140" color="dark" />
        </Paper>
        <Text fw="600" ta="center" mt="lg">Scan to connect your mobile device</Text>
        <Text c="dimmed" size="sm" ta="center" mt="4">
          Open the mobile app and scan this code to link your device.
        </Text>
      </Paper>

      <Paper class="demoCard chatCard" radius="lg">
        <Group justify="space-between" class="chatHeader">
          <div>
            <Text fw="600">New Chat</Text>
            <Text c="dimmed" size="sm">How can I help you today?</Text>
          </div>
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label="Reset chat"
            @click="chatMessage = ''"
          >
            <PhArrowClockwise :size="16" />
          </ActionIcon>
        </Group>
        <EmptyState
          class="chatEmpty"
          size="sm"
          title="Morning, Alex!"
          description="What are we working on today? Press send to start a new conversation."
        >
          <template #icon><PhChatCircleDots :size="22" /></template>
        </EmptyState>
        <form class="composer" @submit.prevent="sendChat">
          <Textarea
            v-model="chatMessage"
            variant="unstyled"
            placeholder="Send a message..."
            :min-rows="2"
            :max-rows="4"
            autosize
            aria-label="Message"
          />
          <Group justify="space-between">
            <ActionIcon variant="default" radius="xl" size="md" aria-label="Attach">
              <PhPlus :size="14" />
            </ActionIcon>
            <ActionIcon type="submit" radius="xl" size="md" aria-label="Send">
              <PhArrowUp :size="14" weight="bold" />
            </ActionIcon>
          </Group>
        </form>
      </Paper>

      <Paper class="demoCard" radius="lg" p="lg">
        <Breadcrumbs separator-margin="6" class="crumbs">
          <Anchor size="sm" c="dimmed" href="#" @click.prevent>Home</Anchor>
          <Text size="sm" c="dimmed">…</Text>
          <Text size="sm" fw="500">Payments</Text>
          <template #separator><PhCaretRight :size="12" /></template>
        </Breadcrumbs>
        <UnstyledButton
          v-for="action in paymentActions"
          :key="action.title"
          class="itemRow"
          @click="notify(action.title, 'Opening settings…')"
        >
          <ThemeIcon variant="light" color="gray" radius="md" size="md">
            <component :is="action.icon" :size="16" />
          </ThemeIcon>
          <div class="itemText">
            <Text size="sm" fw="600">{{ action.title }}</Text>
            <Text c="dimmed" size="xs">{{ action.description }}</Text>
          </div>
          <PhCaretRight :size="14" class="itemChevron" />
        </UnstyledButton>
      </Paper>
    </div>
  </div>

  <Modal
    :opened="alertOpened"
    title="Are you absolutely sure?"
    centered
    radius="lg"
    @close="alertOpened = false"
  >
    <Text c="dimmed" size="sm">
      This action cannot be undone. This will permanently delete your account and remove your data
      from our servers.
    </Text>
    <Group justify="flex-end" mt="xl">
      <Button variant="default" @click="alertOpened = false">Cancel</Button>
      <Button color="red" @click="alertOpened = false">Continue</Button>
    </Group>
  </Modal>
</template>

<style scoped>
.componentsGrid {
  --grid-border: light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5));
  --grid-inset: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6));
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: start;
  gap: 16px;
  max-height: 1240px;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, black 82%, transparent);
}

.gridColumn {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.demoCard {
  min-width: 0;
  border: 1px solid var(--grid-border);
  background: light-dark(var(--mantine-color-white), var(--mantine-color-dark-7));
  box-shadow: 0 1px 2px alpha(var(--mantine-color-black), 0.04);
}

.plainBadge {
  text-transform: none;
  letter-spacing: 0;
}

.insetCard {
  margin-top: 12px;
  padding: 12px 14px;
  border: 1px solid var(--grid-border);
  background: var(--grid-inset);
}

.eyebrow {
  color: var(--mantine-color-dimmed);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.bigValue {
  margin-top: 4px;
  color: var(--mantine-color-bright);
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.heroValue {
  margin: 4px 0 8px;
  color: var(--mantine-color-bright);
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.04em;
}

.navPair,
.statPair,
.fieldPair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.navPair {
  gap: 16px;
}

.fieldPair {
  margin-top: 12px;
}

.statPair .insetCard {
  margin-top: 0;
}

.navCard {
  padding: 10px 6px;
}

.navHeading {
  padding: 4px 8px 6px;
  color: var(--mantine-color-dimmed);
  font-size: 11px;
  font-weight: 600;
}

.navCard .navItem {
  padding: 6px 8px;
  border-radius: var(--mantine-radius-md);
}

.navItem :deep(.mantine-NavLink-label) {
  overflow: hidden;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.navItem :deep(.mantine-NavLink-section[data-position='left']) {
  margin-inline-end: 8px;
}

.contributionChart {
  margin: 8px -8px 12px;
}

.ledger {
  display: grid;
  gap: 8px;
}

.ledgerTotal {
  padding-top: 8px;
  border-top: 1px dashed var(--grid-border);
}

.holdingRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.miniBars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 26px;
}

.miniBars span {
  width: 9px;
  border-radius: 2px;
  background: alpha(var(--mantine-primary-color-filled), 0.35);
}

.miniBars span:last-child {
  background: var(--mantine-primary-color-filled);
}

.payoutValue {
  color: var(--mantine-color-bright);
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
}

.qrCard {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrFrame {
  padding: 12px;
  border: 1px solid var(--grid-border);
  background: var(--mantine-color-white);
}

.chatCard {
  display: flex;
  flex-direction: column;
  min-height: 420px;
}

.chatHeader {
  padding: 16px 18px;
  border-bottom: 1px solid var(--grid-border);
}

.chatEmpty {
  flex: 1;
  justify-content: center;
  padding: 24px 18px;
}

.composer {
  margin: 0 12px 12px;
  padding: 10px 10px 8px 12px;
  border: 1px solid var(--grid-border);
  border-radius: var(--mantine-radius-lg);
  background: var(--grid-inset);
}

.composer :deep(textarea) {
  font-size: 13px;
}

.crumbs {
  margin-bottom: 8px;
  color: var(--mantine-color-dimmed);
}

.itemRow {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  border: 1px solid var(--grid-border);
  border-radius: var(--mantine-radius-md);
  transition: background-color 120ms ease;
}

.itemRow:hover {
  background: var(--grid-inset);
}

.itemText {
  flex: 1;
  min-width: 0;
}

.itemChevron {
  flex-shrink: 0;
  color: var(--mantine-color-dimmed);
}

@media (max-width: 1180px) {
  .componentsGrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-height: 2300px;
  }
}

@media (max-width: 680px) {
  .componentsGrid {
    grid-template-columns: minmax(0, 1fr);
    max-height: 1500px;
  }

  .gridColumn:nth-child(n + 3) {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .itemRow {
    transition: none;
  }
}
</style>
