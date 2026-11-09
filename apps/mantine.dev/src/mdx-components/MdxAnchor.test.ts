import { describe, expect, it } from 'vitest'
import { getMdxAnchorTarget } from './MdxAnchor'

describe('getMdxAnchorTarget', () => {
  it.each(['/llms.txt', '/llms-full.txt', '/llms/core/button.md', '/mcp/index.json'])(
    'uses native navigation for static resource %s',
    (href) => {
      expect(getMdxAnchorTarget(href)).toEqual({ href, useRouter: false })
    },
  )

  it('uses Vue Router for documentation routes', () => {
    expect(getMdxAnchorTarget('/guides/ai-tools#agent-skills')).toEqual({
      href: '/guides/ai-tools#agent-skills',
      useRouter: true,
    })
  })

  it('normalizes static links to the production site for local development', () => {
    expect(getMdxAnchorTarget('https://mantine-vue.dev/llms.txt')).toEqual({
      href: '/llms.txt',
      useRouter: false,
    })
  })

  it('leaves external links and URI schemes outside Vue Router', () => {
    expect(getMdxAnchorTarget('https://example.com/docs')).toEqual({
      href: 'https://example.com/docs',
      useRouter: false,
    })
    expect(getMdxAnchorTarget('mailto:hello@example.com').useRouter).toBe(false)
  })
})
