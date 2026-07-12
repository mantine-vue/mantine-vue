<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { Notifications } from '@mantine-vue/notifications'
import { ModalsProviderDemo } from './components/ModalsProviderDemo/ModalsProviderDemo'
import { HotKeysHandler } from './components/HotKeysHandler'
import { Search } from './components/Search'
import Shell from './components/Shell/Shell.vue'

const route = useRoute()
const withoutShell = computed(() => route.path === '/app-shell')
</script>

<template>
  <Notifications />
  <HotKeysHandler />
  <Search />
  <ModalsProviderDemo>
    <RouterView v-if="withoutShell" />
    <Shell v-else>
      <RouterView />
    </Shell>
  </ModalsProviderDemo>
</template>
