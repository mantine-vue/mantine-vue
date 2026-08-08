import { reactive } from 'vue'

export interface UseDrawersStackReturnType<T extends string> {
  /** Open state of every drawer of the stack, keyed by id. */
  state: Record<T, boolean>

  /** Opens the drawer with the given id. */
  open: (id: T) => void

  /** Closes the drawer with the given id. */
  close: (id: T) => void

  /** Toggles the drawer with the given id. */
  toggle: (id: T) => void

  /** Closes every drawer of the stack. */
  closeAll: () => void

  /** Returns the props to spread onto the drawer with the given id. */
  register: (id: T) => { opened: boolean; onClose: () => void; stackId: T }
}

/**
 * Manages a set of drawers that are opened on top of each other.
 *
 * The ids are fixed up front so the returned `state` can be a plain reactive record,
 * which keeps `register` a pure lookup.
 */
export function useDrawersStack<const T extends string>(
  drawers: T[],
): UseDrawersStackReturnType<T> {
  const state = reactive(
    drawers.reduce((acc, id) => ({ ...acc, [id]: false }), {} as Record<T, boolean>),
  ) as Record<T, boolean>

  function open(id: T) {
    state[id] = true
  }

  function close(id: T) {
    state[id] = false
  }

  function toggle(id: T) {
    state[id] = !state[id]
  }

  function closeAll() {
    drawers.forEach((id) => {
      state[id] = false
    })
  }

  function register(id: T) {
    return {
      opened: state[id],
      onClose: () => close(id),
      stackId: id,
    }
  }

  return { state, open, close, toggle, closeAll, register }
}
