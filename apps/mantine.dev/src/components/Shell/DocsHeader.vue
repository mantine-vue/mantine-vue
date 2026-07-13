<script setup lang="ts">
import { searchHandlers } from '@/components/Search'
import { MDX_NAV_DATA } from '@/mdx'
import { Burger, Container, Group, Menu, Text, UnstyledButton } from '@mantine-vue/core'
import {
  ColorSchemeControl,
  HeaderControls,
  SearchMobileControl,
} from '@mantine-vue/mantine-header'
import { PhArrowSquareOut, PhCaretDown } from '@phosphor-icons/vue'
import { computed, h } from 'vue'
import { useRoute } from 'vue-router'
import Logo from '../Logo/Logo.vue'
import { getActiveCategory } from './get-active-category'
import { currentVersionLabel, majorVersions, meta } from './mantine-meta'
import { useShellContext } from './Shell.context'

withDefaults(defineProps<{ withNav?: boolean }>(), { withNav: true })

const route = useRoute()
const ctx = useShellContext()

const activeCategory = computed(() => getActiveCategory(route.path))

const mainLinksData = [
  // { link: 'https://ui.mantine.dev', label: 'Mantine UI' },
  // { link: 'https://help.mantine.dev', label: 'FAQ' },
  { link: '/colors-generator', label: 'Colors generator', reload: false },
  // `reload: true` forces a full page navigation because the showcase is a
  // separate SPA served at /showcase, not a route inside the docs router.
  { link: '/showcase', label: 'Showcase', reload: true },
]

const navigationLinksData = computed(() =>
  MDX_NAV_DATA.map((category) => ({
    category: category.category,
    label: category.category,
    link: category.groups[0]?.pages[0]?.link ?? '/',
  })),
)

function isExternal(link: string) {
  return link.startsWith('http')
}
</script>

<template>
  <header class="header" :data-without-nav="!withNav || undefined">
    <Container :size="1440">
      <div class="headerMain">
        <div class="headerMainWrapper">
          <Burger
            :opened="ctx.navbarOpened"
            :size="20"
            :line-size="2"
            class="burger"
            @click="ctx.toggleNavbar"
          />

          <div class="headerMainSection">
            <RouterLink to="/" class="logoLink" aria-label="Mantine home page">
              <Logo />
            </RouterLink>
            <div class="mainLinks">
              <component
                :is="link.reload || isExternal(link.link) ? 'a' : 'RouterLink'"
                v-for="link in mainLinksData"
                :key="link.label"
                v-bind="
                  link.reload
                    ? { href: link.link }
                    : isExternal(link.link)
                      ? { href: link.link, target: '_blank', rel: 'noreferrer' }
                      : { to: link.link }
                "
                class="mainLink"
              >
                {{ link.label }}
              </component>
            </div>
          </div>
        </div>

        <div class="desktopHeaderControls">
          <Menu
            v-if="majorVersions.length > 0"
            :width="180"
            :within-portal="false"
            radius="md"
            position="bottom-start"
            :transition-props="{ transition: 'pop', duration: 100 }"
          >
            <Menu.Target>
              <UnstyledButton class="versionControl">
                <span>{{ currentVersionLabel }}</span>
                <PhCaretDown :size="16" class="versionChevron" />
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                v-for="item in majorVersions"
                :key="item.name"
                component="a"
                c="bright"
                :href="item.link"
                target="_blank"
                :right-section="h(PhArrowSquareOut, { size: 16, class: 'versionExternalIcon' })"
              >
                <b>{{ item.v }}.x</b>
                <Text span c="dimmed" fz="xs"> (v{{ item.name }})</Text>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <HeaderControls
            class="controls"
            :withSupport="false"
            :withDiscord="false"
            :on-search="searchHandlers.open"
            :github-link="meta.gitHubLinks.mantine"
            :discord-link="meta.discordLink"
          />
        </div>

        <Group :gap="5" class="mobileHeaderControls">
          <SearchMobileControl :on-search="searchHandlers.open" />
          <ColorSchemeControl />
        </Group>
      </div>

      <nav v-if="withNav" class="headerNavigation">
        <RouterLink
          v-for="link in navigationLinksData"
          :key="link.label"
          :to="link.link"
          class="navigationLink"
          :data-active="activeCategory === link.category || undefined"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </Container>
  </header>
</template>

<style scoped>
.header {
  height: var(--docs-header-height);
  border-bottom: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-5));
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: alpha(var(--mantine-color-body), 0.85);
  backdrop-filter: blur(5px);

  --nav-section-height: calc(var(--docs-header-height) - var(--docs-main-header-section-height));
}

.header[data-without-nav] {
  height: var(--docs-main-header-section-height);
}

.headerMain {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--docs-main-header-section-height);
}

.headerMainWrapper {
  display: flex;
  gap: var(--mantine-spacing-lg);
}

.headerMainSection {
  display: flex;
  align-items: flex-end;
}

.mainLinks {
  display: flex;
  gap: 7px;
  margin-inline-start: 40px;

  @mixin smaller-than $docsMdxBreakpoint {
    display: none;
  }
}

.mainLink {
  color: light-dark(var(--mantine-text-color));
  text-decoration: none;
  display: block;
  line-height: 1;
  padding: 7px 10px;
  font-size: var(--mantine-font-size-sm);
  border-radius: var(--mantine-radius-md);
  font-weight: 600;

  @mixin hover {
    background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6));
    color: var(--mantine-color-bright);
  }
}

.headerNavigation {
  height: var(--nav-section-height);
  display: flex;
  align-items: flex-end;
  gap: var(--mantine-spacing-lg);

  @mixin smaller-than $docsMdxBreakpoint {
    display: none;
  }
}

.navigationLink {
  text-decoration: none;
  display: block;
  height: 100%;
  line-height: var(--nav-section-height);
  font-size: var(--mantine-font-size-sm);
  font-weight: 600;
  border-bottom: 2px solid transparent;
  color: light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-0));

  @mixin hover {
    color: var(--mantine-color-bright);
  }
}

.navigationLink[data-active] {
  border-bottom-color: light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-5));
  color: var(--mantine-color-bright);
}

.logoLink {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--mantine-color-bright);
}

.desktopHeaderControls {
  display: flex;
  align-items: center;
  gap: var(--mantine-spacing-md);

  @mixin smaller-than $docsMdxBreakpoint {
    display: none;
  }
}

.burger {
  @mixin larger-than 67.5em {
    display: none;
  }
}

.mobileHeaderControls {
  @mixin larger-than 67.5em {
    display: none;
  }
}

.versionControl {
  display: flex;
  align-items: center;
  height: 34px;
  gap: 7px;
  border-radius: var(--mantine-radius-md);
  border: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4));
  background-color: light-dark(var(--mantine-color-white), var(--mantine-color-dark-6));
  padding-inline-start: 12px;
  padding-inline-end: 7px;
  font-family: var(--mantine-font-family-monospace);
  font-size: 13px;
  font-weight: 700;
  color: var(--mantine-color-bright);
}

.versionExternalIcon,
.versionChevron {
  color: var(--mantine-color-dimmed);
}
</style>
