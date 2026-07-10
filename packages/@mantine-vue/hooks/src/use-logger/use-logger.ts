/* eslint-disable no-console */
import { onBeforeUnmount, onMounted, toValue, type MaybeRefOrGetter } from 'vue'
import { useDidUpdate } from '../use-did-update/use-did-update'

export function useLogger(componentName: string, props: MaybeRefOrGetter<unknown>[]): null {
  onMounted(() => {
    console.log(`${componentName} mounted`, ...props.map((prop) => toValue(prop)))
  })

  onBeforeUnmount(() => {
    console.log(`${componentName} unmounted`)
  })

  useDidUpdate(() => {
    console.log(`${componentName} updated`, ...props.map((prop) => toValue(prop)))
  }, props)

  return null
}
