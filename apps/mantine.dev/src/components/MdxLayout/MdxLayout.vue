<script setup lang="ts">
import { computed } from 'vue'
import type { Frontmatter } from '@/types'
import { DOCS_BASE } from '@/links'
import PageHead from '../PageHead/PageHead.vue'
import MdxPageHeader from '../MdxPageHeader/MdxPageHeader.vue'
import MdxSiblings from '../MdxSiblings/MdxSiblings.vue'
import TableOfContents from '../TableOfContents/TableOfContents.vue'

const props = defineProps<{ meta: Frontmatter }>()

const editPageLink = computed(() => `${DOCS_BASE}${props.meta.slug}.mdx`)
</script>

<template>
  <PageHead :title="meta.title" :description="meta.description" />
  <MdxPageHeader :meta="meta" />
  <div class="wrapper">
    <article class="container" id="mdx">
      <slot />
      <MdxSiblings :meta="meta" />
    </article>

    <div class="tableOfContents">
      <TableOfContents :with-tabs="false" :edit-page-link="editPageLink" />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  z-index: 1;
  display: flex;
  position: relative;
  justify-content: space-between;
  background-color: var(--mantine-color-body);
  width: 100%;
  flex: 1;
  min-width: 0;

  @mixin smaller-than 1450px {
    width: 100%;
  }

  @mixin smaller-than 550px {
    max-width: 100%;
  }
}

.container {
  padding-inline: var(--docs-inline-spacing);
  padding-block: var(--mantine-spacing-xl);
  max-width: 994px;
  min-width: 0;
  overflow-x: hidden;
  flex: 1;

  @mixin smaller-than 1750px {
    max-width: 914px;
  }

  @mixin smaller-than 1450px {
    max-width: calc(100vw - var(--docs-table-of-contents-width) - var(--docs-navbar-width) - 48px);
  }

  @media (hover: none) and (max-width: 750px) {
    max-width: calc(100vw - var(--docs-table-of-contents-width) - var(--docs-navbar-width) - 28px);
  }

  @mixin smaller-than $docsTocBreakpoint {
    padding-inline-end: 0;
  }

  @mixin smaller-than $docsMdxBreakpoint {
    padding-block: var(--mantine-spacing-md);
  }
}

.tableOfContents {
  flex: 0 0 var(--docs-table-of-contents-width);
}
</style>
