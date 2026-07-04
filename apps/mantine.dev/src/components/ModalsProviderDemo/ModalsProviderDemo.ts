import { defineComponent, h, type PropType } from 'vue'
import { Button, Center, Loader, Stack, Text } from '@mantine-vue/core'
import { ModalsProvider, type ModalsContextProps } from '@mantine-vue/modals'
import { PhCheck } from '@phosphor-icons/vue'

// Registered under the `demonstration` key so any demo on the docs site can call
// `modals.openContextModal({ modal: 'demonstration', innerProps: { modalBody } })`.
const DemonstrationModal = defineComponent({
  name: 'DemonstrationModal',
  props: {
    context: { type: Object as PropType<ModalsContextProps>, required: true },
    id: { type: String, required: true },
    innerProps: { type: Object as PropType<{ modalBody: string }>, required: true },
  },
  setup(props) {
    return () => [
      h(Text, { size: 'sm' }, () => props.innerProps.modalBody),
      h(
        Button,
        { fullWidth: true, mt: 'md', onClick: () => props.context.closeModal(props.id) },
        () => 'Close modal',
      ),
    ]
  },
})

// Registered under the `asyncDemonstration` key, used by the "update context modal" demo
// to show a loading state that flips to a checkmark once `updateContextModal` runs.
const AsyncDemonstrationModal = defineComponent({
  name: 'AsyncDemonstrationModal',
  props: {
    context: { type: Object as PropType<ModalsContextProps>, required: true },
    id: { type: String, required: true },
    innerProps: {
      type: Object as PropType<{ modalBody: string; loading: boolean }>,
      required: true,
    },
  },
  setup(props) {
    return () => [
      h(Stack, null, () => [
        h(Text, { size: 'sm' }, () => props.innerProps.modalBody),
        h(Center, null, () =>
          props.innerProps.loading
            ? h(Loader, { size: 32 })
            : h(PhCheck, { size: 32, color: 'var(--mantine-color-teal-6)' }),
        ),
      ]),
      h(
        Button,
        {
          fullWidth: true,
          mt: 'md',
          disabled: props.innerProps.loading,
          onClick: () => props.context.closeModal(props.id),
        },
        () => 'Close modal',
      ),
    ]
  },
})

export const ModalsProviderDemo = defineComponent({
  name: 'ModalsProviderDemo',
  setup(_, { slots }) {
    return () =>
      h(
        ModalsProvider,
        {
          labels: { confirm: 'Confirm', cancel: 'Cancel' },
          modals: {
            demonstration: DemonstrationModal,
            asyncDemonstration: AsyncDemonstrationModal,
          },
        },
        slots,
      )
  },
})
