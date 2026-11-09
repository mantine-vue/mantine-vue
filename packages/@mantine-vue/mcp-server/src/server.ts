import { createInterface } from 'node:readline'
import { MantineVueMcpDataClient } from './data-client'
import { callTool, TOOL_DEFINITIONS } from './tools'

interface JsonRpcRequest {
  jsonrpc: '2.0'
  id?: string | number
  method: string
  params?: Record<string, any>
}

function write(payload: unknown) {
  process.stdout.write(`${JSON.stringify(payload)}\n`)
}

export async function handleRequest(request: JsonRpcRequest, client: MantineVueMcpDataClient) {
  if (request.method === 'initialize') {
    return {
      protocolVersion: request.params?.protocolVersion || '2024-11-05',
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: '@mantine-vue/mcp-server', version: '3' },
      instructions:
        'Use search_docs before writing Mantine Vue code. Prefer Vue 3 Composition API, <script setup>, refs/computed, Vue events, and @mantine-vue/* imports.',
    }
  }

  if (request.method === 'ping') return {}
  if (request.method === 'tools/list') return { tools: TOOL_DEFINITIONS }
  if (request.method === 'tools/call') {
    return callTool(client, String(request.params?.name || ''), request.params?.arguments || {})
  }

  throw Object.assign(new Error(`Method not found: ${request.method}`), { code: -32601 })
}

export function startServer() {
  const client = new MantineVueMcpDataClient()
  const input = createInterface({ input: process.stdin, terminal: false })

  input.on('line', async (line) => {
    if (!line.trim()) return

    let request: JsonRpcRequest
    try {
      request = JSON.parse(line) as JsonRpcRequest
    } catch {
      write({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } })
      return
    }

    if (request.id === undefined) return

    try {
      write({ jsonrpc: '2.0', id: request.id, result: await handleRequest(request, client) })
    } catch (cause) {
      const error = cause as Error & { code?: number }
      write({
        jsonrpc: '2.0',
        id: request.id,
        error: { code: error.code || -32603, message: error.message || 'Internal error' },
      })
    }
  })
}
