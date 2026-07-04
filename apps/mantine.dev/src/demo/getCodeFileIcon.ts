import { h, type VNodeChild } from 'vue'
import { PhBracketsCurly, PhPalette } from '@phosphor-icons/vue'

export function getCodeFileIcon(fileName: string): VNodeChild {
  if (fileName.endsWith('.ts') || fileName.endsWith('.tsx') || fileName.endsWith('.vue')) {
    return h(PhBracketsCurly, { size: 14 })
  }

  if (fileName.endsWith('.css') || fileName.endsWith('.scss')) {
    return h(PhPalette, { size: 14 })
  }

  return null
}
