<script setup lang="ts">
import { computed } from 'vue'
import { Anchor } from '@mantine-vue/core'
import { RouterLink } from 'vue-router'
import HeaderItem from '../HeaderItem/HeaderItem.vue'

const props = defineProps<{ label: string; link: string }>()
const isInternal = computed(() => props.link.startsWith('/'))
</script>

<template>
  <HeaderItem :label="label">
    <div class="wrapper">
      <RouterLink v-if="isInternal" v-slot="{ href, navigate }" :to="link" custom>
        <Anchor class="link" :href="href" fz="sm" @click="navigate">
          <span class="icon"><slot name="icon" /></span>
          <slot />
        </Anchor>
      </RouterLink>

      <Anchor v-else class="link" :href="link" fz="sm" target="_blank" rel="noreferrer">
        <span class="icon"><slot name="icon" /></span>
        <slot />
      </Anchor>
    </div>
  </HeaderItem>
</template>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
}

.link {
  display: flex;
  align-items: center;
  line-height: 1;
  color: light-dark(var(--mantine-color-gray-9), var(--mantine-color-dark-0));
}

.icon {
  margin-inline-end: 12px;
  display: flex;
  align-items: center;
}
</style>
