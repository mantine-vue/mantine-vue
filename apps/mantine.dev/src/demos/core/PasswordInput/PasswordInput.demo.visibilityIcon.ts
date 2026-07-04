import { defineComponent, h } from 'vue'
import { PhEye, PhEyeSlash } from '@phosphor-icons/vue'
import { PasswordInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhEye, PhEyeSlash } from '@phosphor-icons/vue'
import { PasswordInput } from '@mantine-vue/core'

const VisibilityToggleIcon = defineComponent({
  props: { reveal: { type: Boolean, default: false } },
  setup: (props) => () =>
    props.reveal
      ? h(PhEyeSlash, { style: { width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)' } })
      : h(PhEye, { style: { width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)' } }),
})
</script>

<template>
  <PasswordInput
    maw="320"
    mx="auto"
    label="Change visibility toggle icon"
    placeholder="Change visibility toggle icon"
    defaultValue="secret"
    :visibilityToggleIcon="VisibilityToggleIcon"
  />
</template>
`

const VisibilityToggleIcon = defineComponent({
  name: 'VisibilityToggleIcon',
  props: { reveal: { type: Boolean, default: false } },
  setup: (props) => () =>
    props.reveal
      ? h(PhEyeSlash, { style: { width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)' } })
      : h(PhEye, { style: { width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)' } }),
})

const Demo = defineComponent({
  name: 'PasswordInputVisibilityIconDemo',
  setup: () => () =>
    h(PasswordInput, {
      maw: 320,
      mx: 'auto',
      label: 'Change visibility toggle icon',
      placeholder: 'Change visibility toggle icon',
      defaultValue: 'secret',
      visibilityToggleIcon: VisibilityToggleIcon,
    }),
})

export const visibilityIcon: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
