<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useFileManagerContext } from '../../FileManager.context'
import FileManagerIcon from '../../icons/FileManagerIcon.vue'
import type { FileManagerIconName } from '../../icons/icon-paths'

defineOptions({ name: 'FileManagerActionIconGlyph' })

const props = withDefaults(
  defineProps<{
    /** Name of a built-in icon, or a component. */
    icon?: FileManagerIconName | Component

    /** Any valid CSS length. Numbers are treated as pixels. */
    size?: string | number
  }>(),
  { icon: undefined, size: 18 },
)

const ctx = useFileManagerContext()

const override = computed(() =>
  typeof props.icon === 'string' ? ctx.config.value.icons[props.icon] : props.icon,
)
</script>

<template>
  <component :is="override" v-if="override" :size="props.size" />
  <FileManagerIcon
    v-else-if="typeof props.icon === 'string'"
    :name="props.icon"
    :size="props.size"
  />
</template>
