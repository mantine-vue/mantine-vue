import { useModalBaseContext } from './ModalBase.context'
export function useModalTransition(override?: Record<string, any>) {
  const ctx = useModalBaseContext()
  return {
    duration: 200,
    timingFunction: 'ease',
    transition: 'fade',
    ...ctx.transitionProps,
    ...override,
  }
}
