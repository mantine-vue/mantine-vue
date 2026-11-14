/* oxlint-disable no-console */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MDX_DATA } from '../../apps/mantine.dev/src/mdx/mdx-data'
import type { Frontmatter } from '../../apps/mantine.dev/src/types'

interface DocgenEntry {
  props: Record<
    string,
    {
      name: string
      type: { name: string }
      required: boolean
      description: string
      defaultValue: string | null
    }
  >
  slots?: Record<
    string,
    { name: string; type: { name: string }; required: boolean; description: string }
  >
  emits?: Record<string, { name: string; type: { name: string }; description: string }>
}

interface Section {
  slug: string
  heading: string
  content: string
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const pagesRoot = join(root, 'apps/mantine.dev/src/pages')
const demosRoot = join(root, 'apps/mantine.dev/src/demos')
const publicRoot = join(root, 'apps/mantine.dev/public')
const llmsRoot = join(publicRoot, 'llms')
const mcpRoot = join(publicRoot, 'mcp')
const siteUrl = (process.env.LLM_DOCS_SITE_URL || 'https://mantine-vue.dev').replace(/\/$/, '')

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`'".()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function pageId(slug: string) {
  return slug.replace(/^\//, '').replaceAll('/', '--') || 'home'
}

function stripReactExamples(markdown: string) {
  return markdown.replace(/```([\w-]*)\r?\n([\s\S]*?)```/g, (_block, language, code: string) => {
    const isReact =
      /(?:from ['"]react['"]|@mantine\/|React\.|useState\s*\(|className=|onClick=\{)/.test(code)
    if (isReact) {
      return '> This legacy React-oriented source example is intentionally omitted from the AI documentation. Use the Vue example and API data on this page.'
    }

    return `\`\`\`${language === 'tsx' ? 'ts' : language}\n${code.trim()}\n\`\`\``
  })
}

export function compileMdx(
  markdown: string,
  url: string,
  resolveDemo?: (collection: string, name: string) => string | null,
) {
  const codeBlocks: string[] = []
  const demos: { collection?: string; name?: string }[] = []
  let output = stripReactExamples(markdown).replace(/```[\s\S]*?```/g, (block) => {
    const index = codeBlocks.push(block) - 1
    return `MANTINE_VUE_CODE_BLOCK_${index}`
  })

  output = output
    .replace(
      /<Demo\s+data=\{([A-Za-z0-9_]+)\.([A-Za-z0-9_]+)\}[\s\S]*?\/>/g,
      (_match, collection: string, name: string) => {
        const index = demos.push({ collection, name }) - 1
        return `MANTINE_VUE_DEMO_${index}`
      },
    )
    .replace(/<Demo\b[\s\S]*?\/>/g, () => {
      const index = demos.push({}) - 1
      return `MANTINE_VUE_DEMO_${index}`
    })
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export default\s+.*$/gm, '')
    .replace(/<([A-Z][\w.]*)\b[^>]*\/>/g, '')
    .replace(/<([A-Z][\w.]*)\b[^>]*>([\s\S]*?)<\/\1>/g, '$2')
    .replace(/^\s{0,3}<\/?[A-Z][^>]*>\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  output = output.replace(/MANTINE_VUE_DEMO_(\d+)/g, (_match, rawIndex: string) => {
    const demo = demos[Number(rawIndex)]
    const code =
      demo.collection && demo.name ? resolveDemo?.(demo.collection, demo.name) : undefined
    const source = code
      ? `\`\`\`${code.includes('<template') || code.includes('<script') ? 'vue' : 'ts'}\n${code}\n\`\`\`\n\n`
      : ''
    return `${source}[Open the interactive Vue example](${url})`
  })

  return output.replace(
    /MANTINE_VUE_CODE_BLOCK_(\d+)/g,
    (_match, rawIndex: string) => codeBlocks[Number(rawIndex)],
  )
}

function createDemoResolver() {
  const registrySource = readFileSync(join(demosRoot, 'index.ts'), 'utf8')
  const collections = new Map<string, string>()
  const members = new Map<string, Map<string, string>>()

  for (const match of registrySource.matchAll(
    /export\s+\{\s*([A-Za-z0-9_]+)\s*\}\s+from\s+['"](.+?)['"]/g,
  )) {
    collections.set(match[1], match[2])
  }

  return (collection: string, name: string) => {
    const collectionPath = collections.get(collection)
    if (!collectionPath) return null

    const collectionTarget = join(demosRoot, collectionPath.replace(/^\.\//, ''))
    const collectionIndex = existsSync(`${collectionTarget}.ts`)
      ? `${collectionTarget}.ts`
      : join(collectionTarget, 'index.ts')

    let collectionMembers = members.get(collection)
    if (!collectionMembers) {
      collectionMembers = new Map()
      const source = readFileSync(collectionIndex, 'utf8')
      for (const match of source.matchAll(
        /import\s+\{\s*([A-Za-z0-9_]+)\s*\}\s+from\s+['"](.+?)['"]/g,
      )) {
        collectionMembers.set(match[1], match[2])
      }
      // Single-file component demos: `import usageCode from './Demo.vue?raw'`
      for (const match of source.matchAll(
        /import\s+([A-Za-z0-9_]+)Code\s+from\s+['"](.+?)\?raw['"]/g,
      )) {
        collectionMembers.set(match[1], `${match[2]}?raw`)
      }
      members.set(collection, collectionMembers)
    }

    const demoPath = collectionMembers.get(name)
    if (!demoPath) return null
    if (demoPath.endsWith('?raw')) {
      const rawFile = join(dirname(collectionIndex), demoPath.replace(/\?raw$/, ''))
      return existsSync(rawFile)
        ? readFileSync(rawFile, 'utf8').replaceAll('@mantine/', '@mantine-vue/').trim() || null
        : null
    }
    const demoTarget = join(dirname(collectionIndex), demoPath.replace(/^\.\//, ''))
    const demoFile = [`${demoTarget}.ts`, `${demoTarget}.tsx`, join(demoTarget, 'index.ts')].find(
      existsSync,
    )
    if (!demoFile) return null
    const source = readFileSync(demoFile, 'utf8')
    const code = source.match(/(?:const\s+code\s*=|code:)\s*`((?:\\`|[^`])*)`/)?.[1]
    return (
      code
        ?.replaceAll('\\`', '`')
        .replaceAll('{{props}}', '')
        .replaceAll('@mantine/', '@mantine-vue/')
        .trim() || null
    )
  }
}

function getKind(key: string, meta: Frontmatter) {
  if (meta.slug.startsWith('/hooks/') || key.startsWith('use')) return 'hook' as const
  if (meta.props?.length) return 'component' as const
  return 'guide' as const
}

function getGroup(meta: Frontmatter) {
  const segment = meta.slug.split('/').filter(Boolean)[0] || 'getting-started'
  if (segment === 'core') return 'components'
  if (segment === 'hooks') return 'hooks'
  if (segment === 'styles' || segment === 'theming') return 'theming'
  if (segment === 'guides') return 'guides'
  return segment
}

function renderProps(meta: Frontmatter, docgen: Record<string, DocgenEntry>) {
  const components = meta.props || []
  if (components.length === 0) return ''

  const output = components.flatMap((component) => {
    const data = docgen[component]
    if (!data) return []
    const props = Object.values(data.props)
    const rows = props.map((prop) => {
      const description = prop.description.replaceAll('|', '\\|').replaceAll('\n', ' ')
      const type = prop.type.name.replaceAll('|', '\\|')
      return `| \`${prop.name}\` | \`${type}\` | ${prop.required ? 'yes' : 'no'} | ${prop.defaultValue ? `\`${prop.defaultValue}\`` : '–'} | ${description} |`
    })
    const slots = Object.values(data.slots || {})
    const emits = Object.values(data.emits || {})
    const sections = [
      `### ${component} props\n\n| Prop | Type | Required | Default | Description |\n| --- | --- | --- | --- | --- |\n${rows.join('\n')}`,
    ]

    if (slots.length > 0) {
      sections.push(
        `### ${component} slots\n\n${slots.map((slot) => `- \`${slot.name}\` – \`${slot.type.name}\`${slot.description ? `: ${slot.description}` : ''}`).join('\n')}`,
      )
    }
    if (emits.length > 0) {
      sections.push(
        `### ${component} events\n\n${emits.map((emit) => `- \`${emit.name}\` – \`${emit.type.name}\`${emit.description ? `: ${emit.description}` : ''}`).join('\n')}`,
      )
    }

    return sections
  })

  return output.length > 0 ? `\n\n## Generated Vue API\n\n${output.join('\n\n')}` : ''
}

function parseSections(markdown: string): Section[] {
  const matches = [...markdown.matchAll(/^##\s+(.+)$/gm)]
  if (matches.length === 0) return [{ slug: 'overview', heading: 'Overview', content: markdown }]

  const overview = markdown.slice(0, matches[0].index).trim()
  const sections: Section[] = overview
    ? [{ slug: 'overview', heading: 'Overview', content: overview }]
    : []

  matches.forEach((match, index) => {
    const start = match.index! + match[0].length
    const end = matches[index + 1]?.index ?? markdown.length
    const heading = match[1].trim()
    sections.push({ slug: slugify(heading), heading, content: markdown.slice(start, end).trim() })
  })
  return sections
}

function writeJson(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

function docgenApi(meta: Frontmatter, docgen: Record<string, DocgenEntry>) {
  return Object.fromEntries(
    (meta.props || []).flatMap((component) => {
      const data = docgen[component]
      if (!data) return []
      return [
        [
          component,
          Object.values(data.props).map((prop) => ({
            name: prop.name,
            type: prop.type.name,
            required: prop.required,
            description: prop.description,
            defaultValue: prop.defaultValue,
          })),
        ],
      ]
    }),
  )
}

function slotApi(meta: Frontmatter, docgen: Record<string, DocgenEntry>) {
  return Object.fromEntries(
    (meta.props || []).flatMap((component) => {
      const slots = docgen[component]?.slots
      return slots
        ? [
            [
              component,
              Object.values(slots).map((slot) => ({
                name: slot.name,
                type: slot.type.name,
                required: slot.required,
                description: slot.description,
              })),
            ],
          ]
        : []
    }),
  )
}

function emitApi(meta: Frontmatter, docgen: Record<string, DocgenEntry>) {
  return Object.fromEntries(
    (meta.props || []).flatMap((component) => {
      const emits = docgen[component]?.emits
      return emits
        ? [
            [
              component,
              Object.values(emits).map((emit) => ({
                name: emit.name,
                type: emit.type.name,
                description: emit.description,
              })),
            ],
          ]
        : []
    }),
  )
}

export function compileAiDocs() {
  const docgenPath = join(root, 'apps/mantine.dev/src/.docgen/docgen.json')
  const docgen = JSON.parse(readFileSync(docgenPath, 'utf8')) as Record<string, DocgenEntry>
  const index: any[] = []
  const sectionIndex: any[] = []
  const fullDocs: string[] = []
  const resolveDemo = createDemoResolver()

  rmSync(llmsRoot, { recursive: true, force: true })
  rmSync(mcpRoot, { recursive: true, force: true })

  for (const [key, meta] of Object.entries(MDX_DATA)) {
    if (!meta.docs || meta.hideInSearch) continue
    const sourcePath = join(pagesRoot, meta.docs)
    const url = `${siteUrl}${meta.slug}`
    const title = meta.title || key
    const source = readFileSync(sourcePath, 'utf8')
    const body = compileMdx(source, url, resolveDemo)
    const markdown = `# ${title}\n\n${meta.description || ''}\n\n> Mantine Vue 3 documentation. Use Composition API and \`<script setup>\`; import from \`${meta.package || '@mantine-vue/core'}\`. In templates, use Vue directives such as \`@click\` and \`v-model\`; event-prop names apply only to render functions.\n\n${body}${renderProps(meta, docgen)}\n`
    const outputPath = join(llmsRoot, `${meta.slug.replace(/^\//, '')}.md`)
    mkdirSync(dirname(outputPath), { recursive: true })
    writeFileSync(outputPath, markdown)
    fullDocs.push(markdown)

    const id = pageId(meta.slug)
    const kind = getKind(key, meta)
    const sections = parseSections(markdown)
    const props = docgenApi(meta, docgen)
    const item = {
      id,
      name: key,
      kind,
      group: getGroup(meta),
      category: meta.slug.split('/').filter(Boolean)[0] || 'overview',
      package: meta.package,
      description: meta.description || '',
      url,
      source: meta.source,
      searchText:
        `${key} ${title} ${meta.description || ''} ${meta.search || ''} ${meta.searchTags || ''} ${Object.keys(props).join(' ')}`.toLowerCase(),
      propsCount: Object.values(props).reduce((total, value) => total + value.length, 0),
      sectionCount: sections.length,
    }
    index.push(item)
    sectionIndex.push(
      ...sections.map((section) => ({
        id,
        slug: section.slug,
        heading: section.heading,
        snippet: section.content.replace(/[`#>*_[\]]/g, '').slice(0, 500),
      })),
    )
    writeJson(join(mcpRoot, 'docs', `${id}.json`), {
      id,
      name: key,
      description: meta.description || '',
      url,
      package: meta.package,
      source: meta.source,
      props,
      slots: slotApi(meta, docgen),
      emits: emitApi(meta, docgen),
      sections,
    })
  }

  index.sort((a, b) => a.name.localeCompare(b.name))
  writeJson(join(mcpRoot, 'index.json'), index)
  writeJson(join(mcpRoot, 'sections.json'), sectionIndex)
  writeFileSync(join(publicRoot, 'llms-full.txt'), fullDocs.join('\n\n---\n\n'))
  writeFileSync(
    join(publicRoot, 'llms.txt'),
    [
      '# Mantine Vue',
      '',
      '> Vue 3 component library documentation for AI coding assistants.',
      '',
      'Use Vue 3 Composition API, `<script setup>`, Vue refs/computed/events, and `@mantine-vue/*` imports. Do not use React hooks, JSX-only examples, or `@mantine/*` imports.',
      '',
      '## Documentation',
      '',
      ...index.map(
        (item) =>
          `- [${item.name}](${siteUrl}/llms/${item.id.replaceAll('--', '/')}.md): ${item.description}`,
      ),
      '',
      `- [Complete documentation](${siteUrl}/llms-full.txt)`,
      '',
    ].join('\n'),
  )

  console.log(
    `Generated ${index.length} AI documents, ${sectionIndex.length} sections, and MCP data.`,
  )
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  compileAiDocs()
}
