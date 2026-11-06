/** Minimal typed event emitter, the core must not depend on Vue reactivity. */
export class Emitter<Events extends Record<string, any>> {
  private listeners = new Map<keyof Events, Set<(payload: any) => void>>()

  on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): () => void {
    let set = this.listeners.get(event)

    if (!set) {
      set = new Set()
      this.listeners.set(event, set)
    }

    set.add(listener)

    return () => this.off(event, listener)
  }

  off<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void) {
    this.listeners.get(event)?.delete(listener)
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    const set = this.listeners.get(event)

    if (!set) {
      return
    }

    // A copy, listeners may unsubscribe while the event is dispatched.
    for (const listener of Array.from(set)) {
      listener(payload)
    }
  }

  clear() {
    this.listeners.clear()
  }
}
