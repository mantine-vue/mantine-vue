import { computed } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import type { EmojiPickerData } from '../types'
import { searchEmojis } from '../utils'

interface UseEmojiSearchInput {
  data: () => EmojiPickerData
  searchValue: () => string | undefined
  onSearchChange?: (value: string) => void
}

/** Search state of `EmojiPicker`, supports controlled and uncontrolled search value */
export function useEmojiSearch({ data, searchValue, onSearchChange }: UseEmojiSearchInput) {
  const [query, setQuery] = useUncontrolled<string>({
    value: searchValue,
    defaultValue: '',
    finalValue: '',
    onChange: onSearchChange,
  })

  const results = computed(() => searchEmojis(data(), query.value))
  const isSearching = computed(() => query.value.trim().length > 0)

  return { query, setQuery, results, isSearching }
}
