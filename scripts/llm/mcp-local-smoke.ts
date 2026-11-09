/* oxlint-disable no-console */
import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const child = spawn(process.execPath, ['packages/@mantine-vue/mcp-server/bin/mcp-server.cjs'], {
  cwd: root,
  env: {
    ...process.env,
    MANTINE_VUE_MCP_DATA_URL: resolve(root, 'apps/mantine.dev/public/mcp'),
  },
  stdio: ['pipe', 'pipe', 'inherit'],
})

const responses = new Map<number, any>()
let buffer = ''

child.stdout.setEncoding('utf8')
child.stdout.on('data', (chunk) => {
  buffer += chunk
  const lines = buffer.split('\n')
  buffer = lines.pop() || ''
  for (const line of lines.filter(Boolean)) {
    const response = JSON.parse(line)
    responses.set(response.id, response)
  }
})

function send(id: number, method: string, params: Record<string, unknown> = {}) {
  child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`)
}

async function waitFor(id: number) {
  const started = Date.now()
  while (!responses.has(id)) {
    if (Date.now() - started > 10000) throw new Error(`Timed out waiting for MCP response ${id}`)
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 20))
  }
  return responses.get(id)
}

try {
  send(1, 'initialize', { protocolVersion: '2025-03-26', capabilities: {} })
  const initialized = await waitFor(1)
  if (initialized.result?.serverInfo?.name !== '@mantine-vue/mcp-server') {
    throw new Error('MCP initialize returned unexpected server info')
  }

  send(2, 'tools/list')
  const tools = await waitFor(2)
  if (!tools.result?.tools?.some((tool: any) => tool.name === 'search_docs')) {
    throw new Error('MCP tools/list did not include search_docs')
  }

  send(3, 'tools/call', { name: 'search_docs', arguments: { query: 'Button loading' } })
  const search = await waitFor(3)
  if (!search.result?.content?.[0]?.text?.includes('Button')) {
    throw new Error('MCP search smoke test did not find Button')
  }

  console.log('Mantine Vue MCP local smoke test passed.')
} finally {
  child.stdin.end()
  child.kill()
}
