# @mantine-vue/mcp-server

Model Context Protocol server for Mantine Vue documentation, generated component props, slots,
emits, composables, guides, and examples.

```json
{
  "mcpServers": {
    "mantine-vue": {
      "command": "npx",
      "args": ["-y", "@mantine-vue/mcp-server"]
    }
  }
}
```

The server fetches versioned static data from `https://mantine-vue.dev/mcp`. Set
`MANTINE_VUE_MCP_DATA_URL` to another HTTP URL, a `file:` URL, or an absolute directory to use a
preview deployment or local generated data.
