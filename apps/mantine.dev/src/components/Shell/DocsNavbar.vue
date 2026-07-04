<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ScrollArea } from '@mantine-vue/core'
import { MDX_NAV_DATA } from '@/mdx'
import { getActiveCategory } from './get-active-category'
import { useShellContext } from './Shell.context'
import CategoriesList from './CategoriesList.vue'

const route = useRoute()
const ctx = useShellContext()
const activeCategory = computed(() => getActiveCategory(route.path))
const categories = computed(
  () => MDX_NAV_DATA.find((category) => category.category === activeCategory.value)?.groups ?? [],
)
const navRef = ref<HTMLElement | null>(null)

onMounted(() => {
  navRef.value?.querySelector('[data-active]')?.scrollIntoView({ block: 'nearest' })
})
</script>

<template>
  <nav v-if="activeCategory" ref="navRef" class="navbar">
    <ScrollArea h="calc(100vh - var(--docs-header-height))" type="auto">
      <CategoriesList :groups="categories" @navigate="ctx.closeNavbar" />
    </ScrollArea>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  z-index: 100;
  top: var(--docs-header-height);
  height: calc(100vh - var(--docs-header-height));
  flex: 0 0 var(--docs-navbar-width);
  border-inline-end: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-5));
  background-color: var(--mantine-color-body);

  @mixin smaller-than $docsMdxBreakpoint {
    display: none;
  }
}
</style>
