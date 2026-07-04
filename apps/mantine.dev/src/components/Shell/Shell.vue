<script setup lang="ts">
import { computed } from 'vue'
import { Container } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import DocsHeader from './DocsHeader.vue'
import DocsMobileNavbar from './DocsMobileNavbar.vue'
import DocsNavbar from './DocsNavbar.vue'
import { provideShellContext } from './Shell.context'

const props = withDefaults(
  defineProps<{
    fluid?: boolean
    withNav?: boolean
    withNavbar?: boolean
    withMobileNavbar?: boolean
    navbarOpened?: boolean
  }>(),
  {
    fluid: false,
    withNav: true,
    withNavbar: true,
    withMobileNavbar: true,
    navbarOpened: undefined,
  },
)

const emit = defineEmits<{ navbarOpenedChange: [opened: boolean] }>()

const [mobileNavbarOpened, mobileNavbarHandlers] = useDisclosure(false, {
  onClose: () => emit('navbarOpenedChange', false),
  onOpen: () => emit('navbarOpenedChange', true),
})

provideShellContext({
  get navbarOpened() {
    return typeof props.navbarOpened === 'boolean' ? props.navbarOpened : mobileNavbarOpened.value
  },
  toggleNavbar: mobileNavbarHandlers.toggle,
  closeNavbar: mobileNavbarHandlers.close,
})

const showMobileNavbar = computed(() => props.withMobileNavbar && mobileNavbarOpened.value)
</script>

<template>
  <div>
    <DocsHeader :with-nav="withNav" />
    <DocsMobileNavbar v-if="showMobileNavbar" />

    <Container v-if="withNavbar" :size="1440" :fluid="fluid" :px="fluid ? 0 : undefined">
      <div class="inner">
        <DocsNavbar />
        <main class="content">
          <slot />
        </main>
      </div>
    </Container>
    <main v-else>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.inner {
  display: flex;
}

.content {
  flex: 1;
}
</style>
