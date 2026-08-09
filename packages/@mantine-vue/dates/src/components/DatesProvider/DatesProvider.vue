<script setup lang="ts">
import { provide, reactive, watchEffect } from 'vue'
import type { DatesProviderProps } from '../../types'
import { DATES_PROVIDER_DEFAULT_SETTINGS, DatesContextKey } from './DatesProvider.context'

defineOptions({ name: 'DatesProvider' })

const props = withDefaults(defineProps<DatesProviderProps>(), {
  settings: () => ({}),
})

const settings = reactive({ ...DATES_PROVIDER_DEFAULT_SETTINGS })

watchEffect(() => {
  Object.assign(settings, DATES_PROVIDER_DEFAULT_SETTINGS, props.settings)
})

provide(DatesContextKey, settings)
</script>

<template>
  <slot />
</template>
