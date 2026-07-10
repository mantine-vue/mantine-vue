import { readonly, ref, type Ref } from 'vue'

export interface UseQueueOptions<T> {
  /** Initial values to be added to the queue */
  initialValues?: T[]

  /** Maximum number of items in the state */
  limit: number
}

export interface UseQueueReturnValue<T> {
  /** Array of items in the queue */
  queue: Readonly<Ref<T[]>>

  /** Array of items in the state */
  state: Readonly<Ref<T[]>>

  /** Function to add items to state or queue */
  add: (...items: T[]) => void

  /** Function to apply updates to current items */
  update: (fn: (state: T[]) => T[]) => void

  /** Function to clear the queue */
  cleanQueue: () => void
}

export function useQueue<T>({
  initialValues = [],
  limit,
}: UseQueueOptions<T>): UseQueueReturnValue<T> {
  const stateRef = ref<T[]>(initialValues.slice(0, limit)) as Ref<T[]>
  const queueRef = ref<T[]>(initialValues.slice(limit)) as Ref<T[]>

  const add = (...items: T[]) => {
    const results = [...stateRef.value, ...queueRef.value, ...items]
    stateRef.value = results.slice(0, limit)
    queueRef.value = results.slice(limit)
  }

  const update = (fn: (state: T[]) => T[]) => {
    const results = fn([...stateRef.value, ...queueRef.value])
    stateRef.value = results.slice(0, limit)
    queueRef.value = results.slice(limit)
  }

  const cleanQueue = () => {
    queueRef.value = []
  }

  return {
    state: readonly(stateRef) as Readonly<Ref<T[]>>,
    queue: readonly(queueRef) as Readonly<Ref<T[]>>,
    add,
    update,
    cleanQueue,
  }
}
