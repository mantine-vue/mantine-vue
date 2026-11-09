import type { MantineVueMcpDataClient } from './data-client'

export const TOOL_DEFINITIONS = [
  {
    name: 'search_docs',
    description: 'Search Mantine Vue components, composables, guides, APIs, and examples.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        kind: { enum: ['component', 'hook', 'guide'] },
        package: { type: 'string' },
        limit: { type: 'number' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_item_doc',
    description: 'Get a Mantine Vue page outline, one section, or the full documentation page.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        kind: { enum: ['component', 'hook', 'guide'] },
        section: { type: 'string' },
        full: { type: 'boolean' },
      },
      required: ['name'],
    },
  },
  {
    name: 'get_item_api',
    description: 'Get generated Vue props, slots, emits, and source information for an item.',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string' }, kind: { enum: ['component', 'hook', 'guide'] } },
      required: ['name'],
    },
  },
  {
    name: 'list_items',
    description: 'List Mantine Vue docs by kind, group, category, package, or text query.',
    inputSchema: {
      type: 'object',
      properties: {
        kind: { enum: ['component', 'hook', 'guide'] },
        group: { type: 'string' },
        category: { type: 'string' },
        package: { type: 'string' },
        query: { type: 'string' },
        limit: { type: 'number' },
      },
    },
  },
  {
    name: 'get_api',
    description: 'Resolve a Mantine Vue component or composable symbol to its generated API.',
    inputSchema: {
      type: 'object',
      properties: { symbol: { type: 'string' } },
      required: ['symbol'],
    },
  },
] as const

function text(payload: unknown) {
  return {
    content: [
      {
        type: 'text' as const,
        text: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2),
      },
    ],
  }
}

function error(message: string) {
  return { isError: true, content: [{ type: 'text' as const, text: message }] }
}

export async function callTool(
  client: MantineVueMcpDataClient,
  name: string,
  args: Record<string, unknown>,
) {
  const result =
    name === 'search_docs'
      ? await client.search(args as never)
      : name === 'get_item_doc'
        ? await client.getItemDoc(args as never)
        : name === 'get_item_api'
          ? await client.getItemApi(args as never)
          : name === 'list_items'
            ? await client.listItems(args as never)
            : name === 'get_api'
              ? await client.getApi(String(args.symbol || ''))
              : undefined

  if (result === undefined) return error(`Unknown tool: ${name}`)
  if (result === null) {
    const requested = String(args.name || args.symbol || '')
    const suggestions = await client.suggestFor(requested)
    return error(
      suggestions.length > 0
        ? `No exact Mantine Vue match for "${requested}". Did you mean: ${suggestions.join(', ')}?`
        : `No Mantine Vue documentation found for "${requested}". Try search_docs first.`,
    )
  }

  return text(result)
}
