<script setup lang="ts">
import { ActionIcon, Menu, Tooltip } from '@mantine-vue/core'
import { computed, useAttrs } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import MVT_ShowHideColumnsMenu from '../menus/MVT_ShowHideColumnsMenu.vue'

defineOptions({ name: 'MVTShowHideColumnsButton', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

const attrs = useAttrs()

const title = computed(
  () => (attrs.title as string | undefined) ?? props.table.options.localization.showHideColumns,
)

const actionIconProps = computed<any>(() => ({
  'aria-label': title.value,
  color: 'gray',
  size: 'lg',
  variant: 'subtle',
  ...attrs,
}))
</script>

<template>
  <Menu :closeOnItemClick="false" :withinPortal="true">
    <Tooltip :label="title" :withinPortal="true">
      <Menu.Target>
        <ActionIcon v-bind="actionIconProps">
          <component :is="table.options.icons.IconColumns" />
        </ActionIcon>
      </Menu.Target>
    </Tooltip>
    <MVT_ShowHideColumnsMenu :table="table" />
  </Menu>
</template>
