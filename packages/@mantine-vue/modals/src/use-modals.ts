import { inject } from 'vue'
import { ModalsContextKey, type ModalsContextProps } from './context'

export function useModals(): ModalsContextProps {
  const ctx = inject(ModalsContextKey, null)

  if (!ctx) {
    throw new Error(
      '[@mantine-vue/modals] useModals composable was called outside of context, wrap your app with the ModalsProvider component',
    )
  }

  return ctx
}
