<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { ScrollArea } from '@mantine-vue/core'
import { useMediaQuery } from '@mantine-vue/hooks'
import { MDX_NAV_DATA } from '@/mdx'
import { useShellContext } from './Shell.context'
import CategoriesList from './CategoriesList.vue'

const ctx = useShellContext()
const isMobile = useMediaQuery('(max-width: 67.5em)') // $docsMdxBreakpoint

onMounted(() => {
  if (isMobile.value) {
    document.body.style.overflow = 'hidden'
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <nav class="mobileNavbar">
    <ScrollArea h="calc(100vh - var(--docs-header-height))" type="never">
      <div class="mobileNavbarInner">
        <CategoriesList
          v-for="category in MDX_NAV_DATA"
          :key="category.category"
          :groups="category.groups"
          @navigate="ctx.closeNavbar"
        />
      </div>
    </ScrollArea>
  </nav>
</template>

<style scoped>
.mobileNavbar {
  position: fixed;
  z-index: 100;
  inset: 0;
  top: var(--docs-header-height);
  background-color: var(--mantine-color-body);

  @mixin larger-than 67.5em {
    display: none;
  }
}

.mobileNavbarInner {
  padding-inline: var(--mantine-spacing-md);
}
</style>
