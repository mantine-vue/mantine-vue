import { onBeforeUnmount, onMounted, readonly, ref, type Ref } from 'vue'

/** Returns the browser language and updates it when the user changes it. */
export function useBrowserLanguage(): Readonly<Ref<string | undefined>> {
  const language = ref<string | undefined>(undefined)
  const update = () => {
    language.value = window.navigator.language
  }

  onMounted(() => {
    update()
    window.addEventListener('languagechange', update)
  })

  onBeforeUnmount(() => window.removeEventListener('languagechange', update))

  return readonly(language)
}

/** Returns the list of the user preferred languages and updates it when the user changes it. */
export function usePreferredLanguages(): Readonly<Ref<readonly string[]>> {
  const languages = ref<readonly string[]>([]) as Ref<readonly string[]>
  const update = () => {
    languages.value = window.navigator.languages
  }

  onMounted(() => {
    update()
    window.addEventListener('languagechange', update)
  })

  onBeforeUnmount(() => window.removeEventListener('languagechange', update))

  return readonly(languages) as Readonly<Ref<readonly string[]>>
}
