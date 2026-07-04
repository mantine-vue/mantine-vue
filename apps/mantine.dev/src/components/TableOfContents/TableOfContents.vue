<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ScrollArea, Space, Text } from '@mantine-vue/core'
import { useScrollSpy } from '@mantine-vue/hooks'
import { PhPencilSimple } from '@phosphor-icons/vue'

// Reads the invisible `[data-heading]` marker divs that MdxTitle.ts renders
// next to every h2-h6 in MDX content (see mdx-components/MdxTitle.ts) to
// drive active-heading tracking while scrolling and indentation by heading
// depth.
const props = defineProps<{
  withTabs: boolean
  editPageLink?: string
}>()

const route = useRoute()
const router = useRouter()

const spy = useScrollSpy({
  selector: '#mdx [data-heading]',
  getDepth: (element) => Number(element.getAttribute('data-order')),
  getValue: (element) => element.getAttribute('data-heading') || '',
})

const filteredHeadings = computed(() => spy.data.value.filter((heading) => heading.depth > 1))

function goToHeading(id: string) {
  router.replace(`${route.path}#${id}`)
}
</script>

<template>
  <nav
    v-if="filteredHeadings.length > 0"
    class="tableOfContentsWrapper"
    :data-with-tabs="props.withTabs || undefined"
  >
    <div class="inner">
      <div>
        <Text class="title">Table of contents</Text>
        <ScrollArea.Autosize mah="calc(100vh - 172px)" type="never">
          <div class="items">
            <Text
              v-for="(heading, index) in filteredHeadings"
              :key="heading.id"
              component="a"
              class="link"
              :mod="{ active: spy.active.value === index }"
              :href="`#${heading.id}`"
              :style="{ '--toc-link-offset': `${heading.depth - 1}` }"
              @click.prevent="goToHeading(heading.id)"
            >
              {{ heading.value }}
            </Text>
          </div>

          <Text
            v-if="editPageLink"
            component="a"
            class="editPage"
            :href="editPageLink"
            target="_blank"
          >
            <PhPencilSimple class="editPageIcon" :size="18" />
            <span>Edit this page</span>
          </Text>
          <Space h="xl" />
        </ScrollArea.Autosize>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.tableOfContentsWrapper {
  position: sticky;
  top: var(--docs-header-height);
  padding-top: var(--mantine-spacing-xl);
  flex: 0 0 var(--docs-table-of-contents-width);
}

@media (max-width: 78em) {
  .tableOfContentsWrapper {
    display: none;
  }
}

.tableOfContentsWrapper[data-with-tabs] {
  padding-top: 0;
  top: calc(var(--docs-header-height) + var(--mantine-spacing-md));
}

.inner {
  padding-bottom: var(--mantine-spacing-xl);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.link {
  display: block;
  border-left: 1px solid transparent;
  padding: 6px var(--mantine-spacing-md);
  margin-left: -1px;
  padding-left: calc(var(--toc-link-offset) * var(--mantine-spacing-lg));
  font-size: 13px;
  font-weight: 600;
  color: light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-1));
  border-top-right-radius: var(--mantine-radius-sm);
  border-bottom-right-radius: var(--mantine-radius-sm);
  text-decoration: none;
}

.link[data-active] {
  border-color: var(--mantine-color-blue-5);
  color: light-dark(var(--mantine-color-blue-8), var(--mantine-color-blue-2));
  background-color: light-dark(
    var(--mantine-color-blue-0),
    alpha(var(--mantine-color-blue-6), 0.17)
  );
}

.title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: var(--mantine-spacing-md);
  color: var(--mantine-color-bright);
}

.items {
  border-inline-start: 1px solid
    light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-5));
}

.editPage {
  color: var(--mantine-color-bright);
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: var(--mantine-font-size-sm);
  margin-top: var(--mantine-spacing-md);
  padding-top: var(--mantine-spacing-md);
  border-top: 1px solid light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6));

  @mixin hover {
    text-decoration: underline;
  }
}

.editPageIcon {
  color: var(--mantine-color-dimmed);
}
</style>
