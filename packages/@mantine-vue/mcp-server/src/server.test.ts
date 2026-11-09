import { describe, expect, it } from 'vitest'
import { MantineVueMcpDataClient } from './data-client'
import { handleRequest } from './server'

describe('MCP protocol', () => {
  const client = new MantineVueMcpDataClient('C:/unused')

  it('advertises tools during initialization', async () => {
    const result = await handleRequest(
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26' } },
      client,
    )
    expect(result.protocolVersion).toBe('2025-03-26')
    expect(result.capabilities).toEqual({ tools: { listChanged: false } })
  })

  it('lists the documentation tools', async () => {
    const result = await handleRequest({ jsonrpc: '2.0', id: 2, method: 'tools/list' }, client)
    expect(result.tools.map((tool) => tool.name)).toEqual([
      'search_docs',
      'get_item_doc',
      'get_item_api',
      'list_items',
      'get_api',
    ])
  })
})
