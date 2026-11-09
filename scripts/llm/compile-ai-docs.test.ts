import { describe, expect, it } from 'vitest'
import { compileMdx } from './compile-ai-docs'

describe('AI documentation compiler', () => {
  it('removes MDX runtime imports and resolves demos to live Vue pages', () => {
    const output = compileMdx(
      "import { Demo } from '@/demo'\n\n## Usage\n\n<Demo data={Demos.usage} />",
      'https://mantine-vue.dev/core/button',
      () => '<template>\n  <Button>Save</Button>\n</template>',
    )
    expect(output).not.toContain('import { Demo }')
    expect(output).toContain('```vue')
    expect(output).toContain('<Button>Save</Button>')
    expect(output).toContain('[Open the interactive Vue example]')
  })

  it('does not publish React examples into Mantine Vue AI docs', () => {
    const output = compileMdx(
      "```tsx\nimport { useState } from 'react'\nfunction Demo() {}\n```",
      'https://mantine-vue.dev/core/button',
    )
    expect(output).not.toContain("from 'react'")
    expect(output).toContain('intentionally omitted')
  })
})
