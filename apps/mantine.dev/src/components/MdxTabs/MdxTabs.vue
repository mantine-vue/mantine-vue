<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tabs } from '@mantine-vue/core'
import { PhCode, PhFileText, PhSlidersHorizontal } from '@phosphor-icons/vue'
import type { Frontmatter } from '@/types'
import { DOCS_BASE } from '@/links'
import MdxSiblings from '../MdxSiblings/MdxSiblings.vue'
import PropsTablesList from '../PropsTable/PropsTablesList.vue'
import StylesApiTablesList from '../StylesApiTable/StylesApiTablesList.vue'
import TableOfContents from '../TableOfContents/TableOfContents.vue'

const props = defineProps<{ meta: Frontmatter }>()

const route = useRoute()
const router = useRouter()

const hasProps = computed(() => Array.isArray(props.meta.props))
const hasStyles = computed(() => Array.isArray(props.meta.styles))
const editPageLink = computed(() => `${DOCS_BASE}/${props.meta.docs}`)

const activeTab = ref<string | null>('docs')

const tabFromQuery = () => {
  const value = route.query.t
  const tab = Array.isArray(value) ? value[0] : value
  return tab ? String(tab) : 'docs'
}

watch(
  () => route.query.t,
  () => {
    activeTab.value = tabFromQuery()
  },
  { immediate: true },
)

function setActiveTab(value: string | null) {
  const next = value ?? 'docs'
  activeTab.value = next

  router.replace({
    path: route.path,
    query: next === 'docs' ? {} : { t: next },
  })
}
</script>

<template>
  <div class="content">
    <Tabs
      :model-value="activeTab"
      @change="setActiveTab"
      :keep-mounted="false"
      :class-names="{ list: 'mdxTabsList', tab: 'mdxTab', tabSection: 'mdxTabSection' }"
      variant="pills"
      radius="md"
    >
      <div class="tabsWrapper">
        <Tabs.List>
          <Tabs.Tab value="docs">
            <div class="tabInner">
              <PhFileText :size="20" class="tabIcon" />
              Documentation
            </div>
          </Tabs.Tab>
          <Tabs.Tab v-if="hasProps" value="props">
            <div class="tabInner">
              <PhCode :size="20" class="tabIcon" />
              Props
            </div>
          </Tabs.Tab>
          <Tabs.Tab v-if="hasStyles" value="styles-api">
            <div class="tabInner">
              <PhSlidersHorizontal :size="20" class="tabIcon" />
              Styles API
            </div>
          </Tabs.Tab>
        </Tabs.List>
      </div>

      <Tabs.Panel value="docs">
        <div class="contentWrapper">
          <article id="mdx" class="main" :data-with-toc="!meta.hideTableOfContents || undefined">
            <slot />
            <MdxSiblings :meta="meta" />
          </article>

          <div v-if="!meta.hideTableOfContents" class="tableOfContents">
            <TableOfContents with-tabs :edit-page-link="editPageLink" />
          </div>
        </div>
      </Tabs.Panel>

      <Tabs.Panel v-if="hasProps" value="props">
        <div class="tabContent">
          <PropsTablesList :components="meta.props!" :component-prefix="meta.componentPrefix" />
        </div>
      </Tabs.Panel>

      <Tabs.Panel v-if="hasStyles" value="styles-api">
        <div class="tabContent">
          <StylesApiTablesList
            :components="meta.styles!"
            :component-prefix="meta.componentPrefix"
          />
        </div>
      </Tabs.Panel>
    </Tabs>
  </div>
</template>

<style scoped>
.content {
  min-height: calc(100vh - 150px);
  position: relative;
  z-index: 1;
  padding-bottom: 80px;
  background-color: var(--mantine-color-body);
  border-bottom: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4));
  display: flex;
  flex-direction: column;
}

.tabsWrapper {
  padding-inline: var(--docs-inline-spacing);
  border-bottom: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4));
  padding-bottom: var(--mantine-spacing-md);
}

.tabInner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--mantine-spacing-xs);
}

.tabIcon {
  color: light-dark(var(--mantine-color-gray-6), var(--mantine-color-dark-1));

  @mixin smaller-than $mantineBreakpointXs {
    display: none;
  }
}

.main {
  padding-inline: var(--docs-inline-spacing);
  width: 100%;
  padding-inline-end: 0;
  max-width: 994px;

  @mixin smaller-than 1750px {
    max-width: 914px;
  }

  @mixin smaller-than 1450px {
    max-width: calc(100vw - var(--docs-navbar-width) - 48px);
  }

  @media (hover: none) and (max-width: 750px) {
    max-width: calc(100vw - var(--docs-navbar-width) - 28px);
  }
}

.main[data-with-toc] {
  padding-inline-end: var(--docs-inline-spacing);

  @mixin smaller-than 1450px {
    max-width: calc(100vw - var(--docs-table-of-contents-width) - var(--docs-navbar-width) - 48px);
  }

  @mixin smaller-than $docsTocBreakpoint {
    padding-inline-end: 0;
  }
}

.tableOfContents {
  flex: 0 0 var(--docs-table-of-contents-width);
  margin-top: var(--mantine-spacing-xl);
}

.tabContent {
  margin-top: 39px;
  width: 100%;
  padding-inline-start: var(--docs-inline-spacing);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: 100%;

  @mixin smaller-than 1450px {
    max-width: calc(100vw - var(--docs-navbar-width) - 48px);
  }

  @media (hover: none) and (max-width: 750px) {
    max-width: calc(100vw - var(--docs-navbar-width) - 33px);
  }
}

.contentWrapper {
  display: flex;
  position: relative;
  justify-content: space-between;
  max-width: 100%;
}
</style>

<style>
/* Passed to Tabs through `classNames`, so these cannot be scoped. */
.mdxTab {
  font-size: var(--mantine-font-size-md);
  font-weight: 600;
  height: 42px;
  padding-inline-start: var(--mantine-spacing-sm);
  padding-inline-end: var(--mantine-spacing-lg);
  border: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4));
  color: var(--mantine-color-bright);
  background-color: light-dark(var(--mantine-color-white), var(--mantine-color-dark-6));
}

.mdxTab:hover {
  background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-5));
}

.mdxTab[data-active] {
  border-color: transparent;
  color: light-dark(var(--mantine-color-white), var(--mantine-color-black));
  background-color: light-dark(var(--mantine-color-gray-9), var(--mantine-color-gray-1));
}

.mdxTab[data-active] .tabIcon {
  color: inherit;
}

@media (max-width: 36em) {
  .mdxTab {
    font-size: var(--mantine-font-size-sm);
    padding-left: var(--mantine-spacing-md);
    padding-right: var(--mantine-spacing-md);
    flex: 1;
  }
}
</style>
