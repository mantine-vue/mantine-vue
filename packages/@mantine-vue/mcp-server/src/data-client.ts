import { readFile } from 'node:fs/promises'
import { isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { scoreItem, scoreSection, suggestNames } from './search'
import type {
  DocData,
  GetItemArgs,
  IndexItem,
  ListItemsArgs,
  SearchDocsArgs,
  SectionRecord,
} from './types'

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function compact(value: string) {
  return normalize(value).replace(/[^a-z0-9]/g, '')
}

function clamp(limit: number | undefined, fallback: number, maximum: number) {
  return typeof limit === 'number' && Number.isFinite(limit)
    ? Math.max(1, Math.min(maximum, Math.floor(limit)))
    : fallback
}

export class MantineVueMcpDataClient {
  private readonly baseUrl: string
  private readonly timeoutMs: number
  private index: IndexItem[] | null = null
  private sections: SectionRecord[] | null = null
  private readonly docs = new Map<string, DocData>()

  constructor(
    baseUrl = process.env.MANTINE_VUE_MCP_DATA_URL || 'https://mantine-vue.dev/mcp',
    timeoutMs = Number(process.env.MANTINE_VUE_MCP_TIMEOUT_MS || 10000),
  ) {
    this.baseUrl = baseUrl.replace(/[/\\]+$/, '')
    this.timeoutMs = timeoutMs
  }

  private async readJson<T>(relativePath: string): Promise<T> {
    if (this.baseUrl.startsWith('file:') || isAbsolute(this.baseUrl)) {
      const root = this.baseUrl.startsWith('file:') ? fileURLToPath(this.baseUrl) : this.baseUrl
      return JSON.parse(await readFile(join(root, relativePath), 'utf8')) as T
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeoutMs)

    try {
      const response = await fetch(`${this.baseUrl}/${relativePath.replace(/^\/+/, '')}`, {
        signal: controller.signal,
      })
      if (!response.ok) throw new Error(`Mantine Vue MCP data request failed: ${response.status}`)
      return (await response.json()) as T
    } finally {
      clearTimeout(timer)
    }
  }

  async getIndex() {
    return (this.index ??= await this.readJson<IndexItem[]>('index.json'))
  }

  async getSections() {
    return (this.sections ??= await this.readJson<SectionRecord[]>('sections.json'))
  }

  private async getDoc(id: string) {
    const cached = this.docs.get(id)
    if (cached) return cached
    const data = await this.readJson<DocData>(`docs/${id}.json`)
    this.docs.set(id, data)
    return data
  }

  async findItem(args: GetItemArgs) {
    const requested = compact(args.name)
    const candidates = (await this.getIndex()).filter(
      (item) => !args.kind || item.kind === args.kind,
    )
    return (
      candidates.find((item) => compact(item.id) === requested) ??
      candidates.find((item) => compact(item.name) === requested) ??
      candidates.find((item) => compact(item.name).startsWith(requested)) ??
      null
    )
  }

  async suggestFor(name: string) {
    return suggestNames(await this.getIndex(), name)
  }

  async listItems(args: ListItemsArgs = {}) {
    const query = normalize(args.query || '')
    return (await this.getIndex())
      .filter((item) => !args.kind || item.kind === args.kind)
      .filter((item) => !args.group || normalize(item.group) === normalize(args.group))
      .filter((item) => !args.category || normalize(item.category) === normalize(args.category))
      .filter((item) => !args.package || normalize(item.package || '') === normalize(args.package))
      .filter((item) => !query || item.searchText.includes(query))
      .slice(0, clamp(args.limit, 30, 500))
  }

  async search(args: SearchDocsArgs) {
    const query = args.query.trim()
    if (!query) return []

    const allowed = (await this.getIndex())
      .filter((item) => !args.kind || item.kind === args.kind)
      .filter((item) => !args.package || normalize(item.package || '') === normalize(args.package))
    const byId = new Map(allowed.map((item) => [item.id, item]))
    const pageHits = allowed.map((item) => ({ item, score: scoreItem(item, query) }))
    const sectionHits = (await this.getSections())
      .filter((section) => byId.has(section.id))
      .map((section) => ({
        item: byId.get(section.id)!,
        section,
        score: scoreSection(section, query),
      }))

    return [...pageHits, ...sectionHits]
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, clamp(args.limit, 20, 100))
      .map(({ item, score, ...entry }) => ({ ...item, ...entry, score: Math.round(score) }))
  }

  async getItemDoc(args: GetItemArgs) {
    const item = await this.findItem(args)
    if (!item) return null
    const data = await this.getDoc(item.id)

    if (args.full) return data
    if (args.section) {
      const section = data.sections.find((entry) => compact(entry.slug) === compact(args.section!))
      return section ? { item, section } : null
    }

    return {
      item,
      description: data.description,
      sections: data.sections.map(({ slug, heading }) => ({ slug, heading })),
      components: Object.keys(data.props),
      slots: Object.keys(data.slots),
      emits: Object.keys(data.emits),
    }
  }

  async getItemApi(args: GetItemArgs) {
    const item = await this.findItem(args)
    if (!item) return null
    const data = await this.getDoc(item.id)
    return { item, props: data.props, slots: data.slots, emits: data.emits, source: data.source }
  }

  async getApi(symbol: string) {
    const requested = compact(symbol)
    const item = (await this.getIndex()).find(
      (entry) => compact(entry.name) === requested || compact(entry.id) === requested,
    )
    return item ? this.getItemApi({ name: item.id }) : null
  }
}
