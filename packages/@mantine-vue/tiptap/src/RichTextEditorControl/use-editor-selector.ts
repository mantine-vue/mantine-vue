import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { Editor } from '@tiptap/vue-3'

export function isSafeEditor(editor: Editor | null): editor is Editor {
  return !!editor && !editor.isDestroyed
}

export function useEditorSelector<T>(
  editor: () => Editor | null,
  selector: (editor: Editor | null) => T,
) {
  const tick = ref(0)
  const update = () => {
    tick.value += 1
  }
  const listen = (current: Editor | null | undefined) => {
    current?.on('transaction', update)
    current?.on('selectionUpdate', update)
    current?.on('update', update)
  }
  const unlisten = (current: Editor | null | undefined) => {
    current?.off('transaction', update)
    current?.off('selectionUpdate', update)
    current?.off('update', update)
  }

  const stop = watch(
    editor,
    (current, previous) => {
      unlisten(previous)
      listen(current)
      update()
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    stop()
    unlisten(editor())
  })

  return computed(() => {
    void tick.value
    return selector(editor())
  })
}
