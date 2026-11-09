import type { IndexItem, SectionRecord } from './types'

const STOPWORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'of',
  'to',
  'in',
  'on',
  'for',
  'with',
  'how',
  'do',
  'is',
  'it',
  'use',
  'using',
  'vue',
])

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function tokens(value: string) {
  const all = normalize(value)
    .split(/[^a-z0-9.-]+/)
    .filter(Boolean)
  const useful = all.filter((token) => token.length > 2 && !STOPWORDS.has(token))
  return useful.length > 0 ? useful : all
}

function coverage(value: string, query: string) {
  const haystack = normalize(value)
  const queryTokens = tokens(query)
  return queryTokens.filter((token) => haystack.includes(token)).length / queryTokens.length
}

export function scoreItem(item: IndexItem, query: string) {
  const requested = normalize(query)
  const name = normalize(item.name)
  let score = coverage(item.searchText, query) * 60

  if (name === requested) score += 100
  else if (name.startsWith(requested)) score += 60
  else if (name.includes(requested)) score += 35

  return score
}

export function scoreSection(section: SectionRecord, query: string) {
  const requested = normalize(query)
  const heading = normalize(section.heading)
  let score = coverage(`${section.heading} ${section.snippet}`, query) * 65

  if (heading === requested) score += 60
  else if (heading.includes(requested)) score += 30

  return score
}

function editDistance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index)

  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      const current = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1))
      previous = current
    }
  }

  return row[b.length]
}

export function suggestNames(index: IndexItem[], query: string, limit = 3) {
  const requested = normalize(query)
  const threshold = Math.max(2, Math.floor(requested.length / 3))

  return index
    .map((item) => ({ name: item.name, distance: editDistance(requested, normalize(item.name)) }))
    .filter((entry) => entry.distance <= threshold)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map((entry) => entry.name)
}
