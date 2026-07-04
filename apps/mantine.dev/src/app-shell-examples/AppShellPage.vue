<script setup lang="ts">
import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Affix,
  AppShell,
  Badge,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  NavLink,
  ScrollArea,
  Text,
  Title,
  UnstyledButton,
} from '@mantine-vue/core'
import { PhArrowLeft, PhCode, PhList, PhSquaresFour } from '@phosphor-icons/vue'

interface AppShellExample {
  id: string
  name: string
  description: string
  code: string
}

const examples: AppShellExample[] = [
  {
    id: 'BasicAppShell',
    name: 'Basic app shell',
    description: 'App shell with Header and Navbar',
    code:
      `<script setup lang="ts">
import { ref } from 'vue'
import { AppShell, Burger, Group, Text } from '@mantine-vue/core'

const opened = ref(false)
</` +
      `script>

<template>
  <AppShell
    :header="{ height: 60 }"
    :navbar="{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }"
    padding="md"
  >
    <AppShell.Header>
      <Group h="100%" px="md">
        <Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />
        Header has a burger icon below sm breakpoint
      </Group>
    </AppShell.Header>
    <AppShell.Navbar p="md">
      Navbar is collapsed on mobile at sm breakpoint.
    </AppShell.Navbar>
    <AppShell.Main>
      <Text>This is the main section, your app content here.</Text>
      <Text>Layout used in most cases - Navbar and Header with fixed position</Text>
    </AppShell.Main>
  </AppShell>
</template>`,
  },
  {
    id: 'ResponsiveSizes',
    name: 'Responsive width and height',
    description: 'App shell with responsive navbar width and header height',
    code:
      `<script setup lang="ts">
import { ref } from 'vue'
import { AppShell, Burger, Group, Text } from '@mantine-vue/core'

const opened = ref(false)
</` +
      `script>

<template>
  <AppShell
    padding="md"
    :header="{ height: { base: 60, md: 70, lg: 80 } }"
    :navbar="{
      width: { base: 200, md: 300, lg: 400 },
      breakpoint: 'sm',
      collapsed: { mobile: !opened },
    }"
  >
    <AppShell.Header>
      <Group h="100%" px="md">
        <Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />
        Header
      </Group>
    </AppShell.Header>
    <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
    <AppShell.Main>
      <Text>This is the main section, your app content here.</Text>
      <Text>Header height and navbar width can be responsive.</Text>
    </AppShell.Main>
  </AppShell>
</template>`,
  },
  {
    id: 'MobileNavbar',
    name: 'Mobile only navbar',
    description: 'Navbar visible only on mobile',
    code:
      `<script setup lang="ts">
import { ref } from 'vue'
import { AppShell, Burger, Group, UnstyledButton } from '@mantine-vue/core'

const opened = ref(false)
</` +
      `script>

<template>
  <AppShell
    :header="{ height: 60 }"
    :navbar="{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }"
    padding="md"
  >
    <AppShell.Header>
      <Group h="100%" px="md">
        <Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />
        <Group justify="space-between" style="flex: 1">
          Header
          <Group ml="xl" :gap="0" visible-from="sm">
            <UnstyledButton class="mobile-navbar-control">Home</UnstyledButton>
            <UnstyledButton class="mobile-navbar-control">Blog</UnstyledButton>
            <UnstyledButton class="mobile-navbar-control">Contacts</UnstyledButton>
            <UnstyledButton class="mobile-navbar-control">Support</UnstyledButton>
          </Group>
        </Group>
      </Group>
    </AppShell.Header>
    <AppShell.Navbar py="md" :px="4">
      <UnstyledButton class="mobile-navbar-control">Home</UnstyledButton>
      <UnstyledButton class="mobile-navbar-control">Blog</UnstyledButton>
      <UnstyledButton class="mobile-navbar-control">Contacts</UnstyledButton>
      <UnstyledButton class="mobile-navbar-control">Support</UnstyledButton>
    </AppShell.Navbar>
    <AppShell.Main>Navbar is only visible on mobile.</AppShell.Main>
  </AppShell>
</template>`,
  },
  {
    id: 'CollapseDesktop',
    name: 'Collapsible navbar',
    description: 'Collapsible navbar both on desktop and mobile',
    code:
      `<script setup lang="ts">
import { ref } from 'vue'
import { AppShell, Burger, Group, Text } from '@mantine-vue/core'

const mobileOpened = ref(false)
const desktopOpened = ref(true)
</` +
      `script>

<template>
  <AppShell
    padding="md"
    :header="{ height: 60 }"
    :navbar="{
      width: 300,
      breakpoint: 'sm',
      collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
    }"
  >
    <AppShell.Header>
      <Group h="100%" px="md">
        <Burger :opened="mobileOpened" @click="mobileOpened = !mobileOpened" hidden-from="sm" size="sm" />
        <Burger :opened="desktopOpened" @click="desktopOpened = !desktopOpened" visible-from="sm" size="sm" />
        The burger icon is always visible
      </Group>
    </AppShell.Header>
    <AppShell.Navbar p="md">You can collapse the Navbar both on desktop and mobile.</AppShell.Navbar>
    <AppShell.Main>
      <Text>This is the main section, your app content here.</Text>
      <Text>The navbar is collapsible both on mobile and desktop. Nice!</Text>
      <Text>Mobile and desktop opened state can be managed separately.</Text>
    </AppShell.Main>
  </AppShell>
</template>`,
  },
  {
    id: 'FullLayout',
    name: 'AppShell with all elements',
    description: 'Navbar, header, aside and footer used together',
    code:
      `<script setup lang="ts">
import { ref } from 'vue'
import { AppShell, Burger, Group, Text } from '@mantine-vue/core'

const opened = ref(false)
</` +
      `script>

<template>
  <AppShell
    :header="{ height: 60 }"
    :footer="{ height: 60 }"
    :navbar="{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }"
    :aside="{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }"
    padding="md"
  >
    <AppShell.Header><Group h="100%" px="md"><Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />Header</Group></AppShell.Header>
    <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
    <AppShell.Main><Text>AppShell example with all elements.</Text></AppShell.Main>
    <AppShell.Aside p="md">Aside</AppShell.Aside>
    <AppShell.Footer p="md">Footer</AppShell.Footer>
  </AppShell>
</template>`,
  },
  {
    id: 'AltLayout',
    name: 'Alt layout',
    description: 'Navbar and Aside are rendered on top of Header and Footer',
    code:
      `<script setup lang="ts">
import { ref } from 'vue'
import { AppShell, Burger, Group, Text } from '@mantine-vue/core'

const opened = ref(false)
</` +
      `script>

<template>
  <AppShell
    layout="alt"
    :header="{ height: 60 }"
    :footer="{ height: 60 }"
    :navbar="{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }"
    :aside="{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }"
    padding="md"
  >
    <AppShell.Header><Group h="100%" px="md"><Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />Header</Group></AppShell.Header>
    <AppShell.Navbar p="md"><Group><Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" /><Text>Navbar</Text></Group></AppShell.Navbar>
    <AppShell.Main><Text>Alt layout demo - navbar and aside go all the way from top to bottom.</Text></AppShell.Main>
    <AppShell.Aside p="md">Aside</AppShell.Aside>
    <AppShell.Footer p="md">Footer</AppShell.Footer>
  </AppShell>
</template>`,
  },
  {
    id: 'NoTransitions',
    name: 'Without transitions',
    description: 'Disable all collapse/expand animations',
    code:
      `<script setup lang="ts">
import { ref } from 'vue'
import { AppShell, Burger, Group, Text } from '@mantine-vue/core'

const opened = ref(false)
</` +
      `script>

<template>
  <AppShell
    :header="{ height: 60 }"
    :navbar="{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }"
    :transition-duration="0"
    padding="md"
  >
    <AppShell.Header><Group h="100%" px="md"><Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />Header</Group></AppShell.Header>
    <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
    <AppShell.Main><Text>All AppShell animations are disabled.</Text></AppShell.Main>
  </AppShell>
</template>`,
  },
  {
    id: 'Disabled',
    name: 'Disabled app shell',
    description: 'Hide all app shell elements with disabled prop',
    code:
      `<script setup lang="ts">
import { ref } from 'vue'
import { AppShell, Burger, Button, Group, Text } from '@mantine-vue/core'

const opened = ref(false)
const disabled = ref(false)
</` +
      `script>

<template>
  <AppShell
    :header="{ height: 60 }"
    :navbar="{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }"
    padding="md"
    :disabled="disabled"
  >
    <AppShell.Header><Group h="100%" px="md"><Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />Header is hidden when disabled</Group></AppShell.Header>
    <AppShell.Navbar p="md">Navbar is hidden when disabled</AppShell.Navbar>
    <AppShell.Main>
      <Text>When disabled is set, all elements except AppShell.Main are hidden.</Text>
      <Button mt="md" @click="disabled = !disabled">Toggle disabled</Button>
    </AppShell.Main>
  </AppShell>
</template>`,
  },
  {
    id: 'Headroom',
    name: 'Usage with use-headroom',
    description: 'Hide header on scroll down and show on scroll up',
    code:
      `<script setup lang="ts">
import { computed } from 'vue'
import { AppShell, Text } from '@mantine-vue/core'
import { useHeadroom } from '@mantine-vue/hooks'

const { pinned } = useHeadroom({ fixedAt: 120 })
const header = computed(() => ({ height: 60, collapsed: !pinned.value, offset: false }))
</` +
      `script>

<template>
  <AppShell :header="header" padding="md">
    <AppShell.Header p="md">Header is hidden when scrolled down, visible when scrolling up</AppShell.Header>
    <AppShell.Main pt="var(--app-shell-header-height)">
      <Text v-for="index in 40" :key="index" size="lg" my="md" :maw="600" mx="auto">
        Long content paragraph
      </Text>
    </AppShell.Main>
  </AppShell>
</template>`,
  },
  {
    id: 'NavbarSection',
    name: 'Navbar with sections',
    description: 'AppShell.Section component usage',
    code:
      `<script setup lang="ts">
import { ref } from 'vue'
import { AppShell, Burger, Group, NavLink, ScrollArea, Text } from '@mantine-vue/core'

const opened = ref(false)
</` +
      `script>

<template>
  <AppShell :header="{ height: 60 }" :navbar="{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }" padding="md">
    <AppShell.Header><Group h="100%" px="md"><Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />Header</Group></AppShell.Header>
    <AppShell.Navbar>
      <AppShell.Section p="md">Navbar header</AppShell.Section>
      <AppShell.Section grow my="md" :component="ScrollArea" px="md">
        <Text mb="sm">60 links in a scrollable section:</Text>
        <NavLink v-for="index in 60" :key="index" href="#" label="Navbar link" @click.prevent />
      </AppShell.Section>
      <AppShell.Section p="md">Navbar footer - always at the bottom</AppShell.Section>
    </AppShell.Navbar>
    <AppShell.Main>Main</AppShell.Main>
  </AppShell>
</template>`,
  },
  {
    id: 'StaticMode',
    name: 'Static mode',
    description: 'AppShell rendered in normal document flow using CSS Grid',
    code:
      `<script setup lang="ts">
import { ref } from 'vue'
import { AppShell, Burger, Group, Text } from '@mantine-vue/core'

const opened = ref(false)
</` +
      `script>

<template>
  <AppShell mode="static" :header="{ height: 60 }" :navbar="{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }" padding="md">
    <AppShell.Header><Group h="100%" px="md"><Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />Header in static mode</Group></AppShell.Header>
    <AppShell.Navbar p="md">Navbar in static mode.</AppShell.Navbar>
    <AppShell.Main>
      <Text fw="500" mb="md">Static Mode Example</Text>
      <Text v-for="index in 30" :key="index" mb="sm">Paragraph {{ index }}: Static mode uses CSS Grid.</Text>
    </AppShell.Main>
  </AppShell>
</template>`,
  },
  {
    id: 'NestedAppShell',
    name: 'Nested AppShell',
    description: 'Static AppShell nested inside fixed AppShell',
    code:
      `<script setup lang="ts">
import { AppShell, Badge, Group, Text } from '@mantine-vue/core'
</` +
      `script>

<template>
  <AppShell mode="fixed" :header="{ height: 60 }" padding="md">
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Text>Outer AppShell (Fixed Mode)</Text>
        <Badge color="blue">Fixed</Badge>
      </Group>
    </AppShell.Header>
    <AppShell.Main>
      <Text fw="500" mb="md">Nested AppShell Example</Text>
      <AppShell mode="static" :header="{ height: 50 }" :navbar="{ width: 250, breakpoint: 'sm' }" padding="md" with-border>
        <AppShell.Header><Group h="100%" px="md" justify="space-between"><Text size="sm">Inner AppShell (Static Mode)</Text><Badge color="green" size="sm">Static</Badge></Group></AppShell.Header>
        <AppShell.Navbar p="md"><Text size="sm" mb="sm" fw="500">Inner Navbar</Text></AppShell.Navbar>
        <AppShell.Main><Text v-for="index in 20" :key="index" size="sm" mb="xs">Inner paragraph {{ index }}</Text></AppShell.Main>
      </AppShell>
    </AppShell.Main>
  </AppShell>
</template>`,
  },
]

const route = useRoute()
const router = useRouter()
const drawerOpened = ref(false)
const opened = ref(false)
const mobileOpened = ref(false)
const desktopOpened = ref(true)
const disabled = ref(false)
const pinned = ref(true)
let lastScrollY = 0

const currentState = computed(() => (route.query.s === 'code' ? 'code' : 'demo'))
const currentExample = computed(() => String(route.query.e || 'BasicAppShell'))
const active = computed(
  () => examples.find((example) => example.id === currentExample.value) ?? examples[0],
)
const isCode = computed(() => currentState.value === 'code')
const stateIcon = computed(() => (isCode.value ? PhSquaresFour : PhCode))
const headroomHeader = computed(() => ({ height: 60, collapsed: !pinned.value, offset: false }))

const lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos ullam, ex cum repellat alias ea nemo. Ducimus ex nesciunt hic ad saepe molestiae nobis necessitatibus laboriosam officia, reprehenderit, earum fugiat?'

watch(
  () => route.query.e,
  (value) => {
    if (!value || !examples.some((example) => example.id === value)) {
      router.replace({ path: '/app-shell', query: { e: 'BasicAppShell' } })
    }
  },
  { immediate: true },
)

watch(
  () => active.value.id,
  () => {
    opened.value = false
    mobileOpened.value = false
    desktopOpened.value = true
    disabled.value = false
    window.scrollTo({ top: 0 })
  },
)

function goToExample(id: string) {
  drawerOpened.value = false
  router.push({ path: '/app-shell', query: { e: id } })
}

function toggleState() {
  router.push({
    path: '/app-shell',
    query: { e: active.value.id, s: isCode.value ? 'demo' : 'code' },
  })
}

function handleHeadroom() {
  const current = window.scrollY
  pinned.value = current < 120 || current < lastScrollY
  lastScrollY = current
}

onMounted(() => {
  document.title = 'AppShell examples | Mantine Vue'
  lastScrollY = window.scrollY
  window.addEventListener('scroll', handleHeadroom, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleHeadroom)
})
</script>

<template>
  <div class="app-shell-page">
    <pre v-if="isCode" class="code"><code>{{ active.code }}</code></pre>

    <template v-else>
      <AppShell
        v-if="active.id === 'BasicAppShell'"
        :header="{ height: 60 }"
        :navbar="{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }"
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />
            Header has a burger icon below sm breakpoint
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          Navbar is collapsed on mobile at sm breakpoint. At that point it is no longer offset by
          padding in the main element and it takes the full width of the screen when opened.
        </AppShell.Navbar>
        <AppShell.Main>
          <Text>This is the main section, your app content here.</Text>
          <Text>Layout used in most cases - Navbar and Header with fixed position</Text>
        </AppShell.Main>
      </AppShell>

      <AppShell
        v-else-if="active.id === 'ResponsiveSizes'"
        padding="md"
        :header="{ height: { base: 60, md: 70, lg: 80 } }"
        :navbar="{
          width: { base: 200, md: 300, lg: 400 },
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />
            Header
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
        <AppShell.Main>
          <Text>This is the main section, your app content here.</Text>
          <Text>
            Header/footer height and navbar/aside width can be responsive. Try resizing the screen
            to see sizes changes.
          </Text>
        </AppShell.Main>
      </AppShell>

      <AppShell
        v-else-if="active.id === 'MobileNavbar'"
        :header="{ height: 60 }"
        :navbar="{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }"
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />
            <Group justify="space-between" style="flex: 1">
              Header
              <Group ml="xl" :gap="0" visible-from="sm">
                <UnstyledButton class="mobile-control">Home</UnstyledButton>
                <UnstyledButton class="mobile-control">Blog</UnstyledButton>
                <UnstyledButton class="mobile-control">Contacts</UnstyledButton>
                <UnstyledButton class="mobile-control">Support</UnstyledButton>
              </Group>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar py="md" :px="4">
          <UnstyledButton class="mobile-control">Home</UnstyledButton>
          <UnstyledButton class="mobile-control">Blog</UnstyledButton>
          <UnstyledButton class="mobile-control">Contacts</UnstyledButton>
          <UnstyledButton class="mobile-control">Support</UnstyledButton>
        </AppShell.Navbar>
        <AppShell.Main>
          Navbar is only visible on mobile, links that are rendered in the header on desktop are
          hidden on mobile in header and rendered in navbar instead.
        </AppShell.Main>
      </AppShell>

      <AppShell
        v-else-if="active.id === 'CollapseDesktop'"
        padding="md"
        :header="{ height: 60 }"
        :navbar="{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              :opened="mobileOpened"
              @click="mobileOpened = !mobileOpened"
              hidden-from="sm"
              size="sm"
            />
            <Burger
              :opened="desktopOpened"
              @click="desktopOpened = !desktopOpened"
              visible-from="sm"
              size="sm"
            />
            The burger icon is always visible
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          You can collapse the Navbar both on desktop and mobile. After sm breakpoint, the navbar is
          no longer offset by padding in the main element and it takes the full width of the screen
          when opened.
        </AppShell.Navbar>
        <AppShell.Main>
          <Text>This is the main section, your app content here.</Text>
          <Text>The navbar is collapsible both on mobile and desktop. Nice!</Text>
          <Text>Mobile and desktop opened state can be managed separately.</Text>
        </AppShell.Main>
      </AppShell>

      <AppShell
        v-else-if="active.id === 'FullLayout'"
        :header="{ height: 60 }"
        :footer="{ height: 60 }"
        :navbar="{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }"
        :aside="{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }"
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />
            Header
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
        <AppShell.Main>
          <Text>This is the main section, your app content here.</Text>
          <Text>AppShell example with all elements: Navbar, Header, Aside, Footer.</Text>
          <Text>All elements except AppShell.Main have fixed position.</Text>
          <Text>Aside is hidden on md breakpoint and cannot be opened when it is collapsed</Text>
        </AppShell.Main>
        <AppShell.Aside p="md">Aside</AppShell.Aside>
        <AppShell.Footer p="md">Footer</AppShell.Footer>
      </AppShell>

      <AppShell
        v-else-if="active.id === 'AltLayout'"
        layout="alt"
        :header="{ height: 60 }"
        :footer="{ height: 60 }"
        :navbar="{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }"
        :aside="{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }"
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />
            Header
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Group>
            <Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />
            <Text>Navbar</Text>
          </Group>
        </AppShell.Navbar>
        <AppShell.Main>
          <Text>This is the main section, your app content here.</Text>
          <Text>Alt layout demo - navbar and aside go all the way from top to bottom.</Text>
        </AppShell.Main>
        <AppShell.Aside p="md">Aside</AppShell.Aside>
        <AppShell.Footer p="md">Footer</AppShell.Footer>
      </AppShell>

      <AppShell
        v-else-if="active.id === 'NoTransitions'"
        :header="{ height: 60 }"
        :navbar="{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }"
        :transition-duration="0"
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />
            Header
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
        <AppShell.Main>
          <Text>This is the main section, your app content here.</Text>
          <Text
            >All AppShell animations are disabled, everything is instant. Try it on a small
            screen.</Text
          >
        </AppShell.Main>
      </AppShell>

      <AppShell
        v-else-if="active.id === 'Disabled'"
        :header="{ height: 60 }"
        :navbar="{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }"
        padding="md"
        :disabled="disabled"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />
            Header is hidden when disabled
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">Navbar is hidden when disabled</AppShell.Navbar>
        <AppShell.Main>
          <Text>This is the main section, your app content here.</Text>
          <Text>
            When you set disabled prop on AppShell, all elements except AppShell.Main are hidden.
            Try it out:
          </Text>
          <Button mt="md" @click="disabled = !disabled">Toggle disabled</Button>
        </AppShell.Main>
      </AppShell>

      <AppShell v-else-if="active.id === 'Headroom'" :header="headroomHeader" padding="md">
        <AppShell.Header p="md">
          Header is hidden when scrolled down, visible when scrolling up
        </AppShell.Header>
        <AppShell.Main pt="var(--app-shell-header-height)">
          <Text v-for="index in 40" :key="index" size="lg" my="md" :maw="600" mx="auto">
            {{ lorem }}
          </Text>
        </AppShell.Main>
      </AppShell>

      <AppShell
        v-else-if="active.id === 'NavbarSection'"
        :header="{ height: 60 }"
        :navbar="{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }"
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />
            Header
          </Group>
        </AppShell.Header>
        <AppShell.Navbar>
          <AppShell.Section p="md">Navbar header</AppShell.Section>
          <AppShell.Section grow my="md" :component="ScrollArea" px="md">
            <Text mb="sm">60 links in a scrollable section:</Text>
            <NavLink v-for="index in 60" :key="index" href="#" label="Navbar link" @click.prevent />
          </AppShell.Section>
          <AppShell.Section p="md">Navbar footer - always at the bottom</AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main>Main</AppShell.Main>
      </AppShell>

      <AppShell
        v-else-if="active.id === 'StaticMode'"
        mode="static"
        :header="{ height: 60 }"
        :navbar="{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }"
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger :opened="opened" @click="opened = !opened" hidden-from="sm" size="sm" />
            Header in static mode
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          Navbar in static mode. Sections are rendered as part of the normal document flow using CSS
          Grid layout.
        </AppShell.Navbar>
        <AppShell.Main>
          <Text fw="500" mb="md">Static Mode Example</Text>
          <Text mb="md">
            In static mode, AppShell renders all sections as part of the normal document flow using
            CSS Grid instead of fixed positioning.
          </Text>
          <Text v-for="index in 30" :key="index" mb="sm">
            Paragraph {{ index }}: This content demonstrates how static mode arranges sections in a
            CSS Grid layout that stays within the normal document flow.
          </Text>
        </AppShell.Main>
      </AppShell>

      <AppShell v-else mode="fixed" :header="{ height: 60 }" padding="md">
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Text>Outer AppShell (Fixed Mode)</Text>
            <Badge color="blue">Fixed</Badge>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Text fw="500" mb="md">Nested AppShell Example</Text>
          <Text mb="md">
            This example demonstrates a static mode AppShell nested inside a fixed mode AppShell.
            The outer shell uses fixed positioning, while the inner shell renders its sections as
            part of the normal document flow using CSS Grid.
          </Text>

          <AppShell
            mode="static"
            :header="{ height: 50 }"
            :navbar="{ width: 250, breakpoint: 'sm' }"
            padding="md"
            with-border
          >
            <AppShell.Header>
              <Group h="100%" px="md" justify="space-between">
                <Text size="sm">Inner AppShell (Static Mode)</Text>
                <Badge color="green" size="sm">Static</Badge>
              </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
              <Text size="sm" mb="sm" fw="500">Inner Navbar</Text>
              <Text size="sm">
                This navbar is rendered as part of the inner AppShell's CSS Grid layout, within the
                normal document flow.
              </Text>
            </AppShell.Navbar>
            <AppShell.Main>
              <Text size="sm" mb="md">Inner Main Content</Text>
              <Text v-for="index in 20" :key="index" size="sm" mb="xs">
                Inner paragraph {{ index }}: This demonstrates how static mode works within a nested
                context.
              </Text>
            </AppShell.Main>
          </AppShell>

          <Text mt="xl" mb="md">Content after the nested AppShell</Text>
          <Text v-for="index in 10" :key="index" mb="sm">
            Outer paragraph {{ index }}: This content is part of the outer AppShell's main area.
          </Text>
        </AppShell.Main>
      </AppShell>
    </template>

    <Affix :z-index="1000">
      <Group p="xl">
        <Button
          variant="default"
          size="md"
          radius="xl"
          :left-section="h(PhArrowLeft, { size: 20 })"
          class="floating-button"
          @click="router.push('/core/app-shell')"
        >
          Back to documentation
        </Button>

        <Button
          variant="default"
          size="md"
          radius="xl"
          :w="160"
          :left-section="h(stateIcon, { size: 20 })"
          class="floating-button"
          @click="toggleState"
        >
          View {{ isCode ? 'demo' : 'code' }}
        </Button>

        <Button
          size="md"
          radius="xl"
          :left-section="h(PhList, { size: 20 })"
          :w="'var(--button-height)'"
          class="floating-button menu-button"
          aria-label="Other examples"
          @click="drawerOpened = true"
        />
      </Group>
    </Affix>

    <Drawer
      :opened="drawerOpened"
      :on-close="() => (drawerOpened = false)"
      :z-index="2000"
      position="right"
      :with-close-button="false"
      :padding="0"
    >
      <ScrollArea h="100dvh" type="hover" p="md">
        <Title :order="3" fz="lg" :fw="500" pl="lg" pt="md"> AppShell component examples </Title>

        <Divider my="sm" />

        <UnstyledButton
          v-for="example in examples"
          :key="example.id"
          class="control"
          :data-active="active.id === example.id || undefined"
          @click="goToExample(example.id)"
        >
          <Text span class="name">{{ example.name }}</Text>
          <Text span class="description">{{ example.description }}</Text>
        </UnstyledButton>
      </ScrollArea>
    </Drawer>
  </div>
</template>

<style scoped>
.app-shell-page {
  min-height: 100dvh;
}

.code {
  min-height: 100dvh;
  margin: 0;
  padding: 96px 24px 32px;
  overflow-x: auto;
  background: var(--mantine-color-body);
  color: var(--mantine-color-text);
  font-family: var(--mantine-font-family-monospace);
  font-size: 13px;
  line-height: 1.55;
}

.floating-button {
  box-shadow: var(--mantine-shadow-sm);
}

.menu-button {
  padding-inline-end: 5px;
}

.control {
  display: block;
  width: 100%;
  padding: var(--mantine-spacing-sm) var(--mantine-spacing-lg);
  border-radius: var(--mantine-radius-md);
}

.control:hover:not([data-active]) {
  background-color: var(--mantine-color-default-hover);
}

.control[data-active] {
  color: var(--mantine-color-white);
  background-color: var(--mantine-color-blue-filled);
}

.name {
  display: block;
  font-weight: 600;
  color: inherit;
}

.description {
  display: block;
  opacity: 0.6;
  font-size: var(--mantine-font-size-sm);
  color: inherit;
}

.mobile-control {
  display: block;
  padding: var(--mantine-spacing-xs) var(--mantine-spacing-md);
  border-radius: var(--mantine-radius-md);
  font-weight: 600;
}

.mobile-control:hover {
  background-color: var(--mantine-color-default-hover);
}

@media (max-width: 640px) {
  .floating-button {
    max-width: 44px;
    padding-inline: 0;
    overflow: hidden;
  }
}
</style>
