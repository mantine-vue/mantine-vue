import { defineComponent, h, ref } from 'vue'
import { Button, MaskInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, MaskInput } from '@mantine-vue/core'

const phone = ref('')

function handleSubmit(event: Event) {
  event.preventDefault()
  console.log({ phone: phone.value })
}
</script>

<template>
  <form @submit="handleSubmit">
    <MaskInput
      mask="(999) 999-9999"
      placeholder="(___) ___-____"
      label="Phone"
      @changeRaw="(raw) => (phone = raw)"
    />

    <Button type="submit" mt="md">
      Submit
    </Button>
  </form>
</template>
`

const Demo = defineComponent({
  name: 'MaskInputWithUseFormDemo',
  setup() {
    const phone = ref('')
    const handleSubmit = (event: Event) => {
      event.preventDefault()
      console.log({ phone: phone.value })
    }
    return () =>
      h('form', { onSubmit: handleSubmit }, [
        h(MaskInput, {
          mask: '(999) 999-9999',
          placeholder: '(___) ___-____',
          label: 'Phone',
          onChangeRaw: (raw: string) => {
            phone.value = raw
          },
        }),
        h(Button, { type: 'submit', mt: 'md' }, { default: () => 'Submit' }),
      ])
  },
})

export const withUseForm: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
