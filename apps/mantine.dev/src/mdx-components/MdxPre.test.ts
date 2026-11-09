import { describe, expect, it } from 'vitest'
import { getMdxCodeLanguage } from './MdxPre'

describe('getMdxCodeLanguage', () => {
  it.each(['language-md', 'language-markdown'])(
    'normalizes the %s alias to the loaded Markdown grammar',
    (className) => {
      expect(getMdxCodeLanguage(className)).toBe('markdown')
    },
  )
})
