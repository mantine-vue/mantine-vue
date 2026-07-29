import type { CascaderOption } from './Cascader'

export interface CascaderFlatPath {
  path: string[]
  options: CascaderOption[]
  leaf: boolean
  disabled: boolean
}

export function cascaderOptionHasChildren(option: CascaderOption): boolean {
  return Array.isArray(option.children) && option.children.length > 0
}

export function getCascaderColumns(
  data: CascaderOption[],
  activePath: string[],
): CascaderOption[][] {
  const columns = [data]
  let level = data

  for (let index = 0; index < activePath.length; index++) {
    const node = level.find((option) => option.value === activePath[index])
    if (!node) break
    if (cascaderOptionHasChildren(node) && index < activePath.length - 1) {
      columns.push(node.children!)
      level = node.children!
    } else break
  }

  return columns
}

export function getCascaderPathOptions(
  data: CascaderOption[],
  value: string[] | null | undefined,
): CascaderOption[] {
  if (!value?.length) return []
  const result: CascaderOption[] = []
  let level: CascaderOption[] | undefined = data
  for (const current of value) {
    const option: CascaderOption | undefined = level?.find((item) => item.value === current)
    if (!option) break
    result.push(option)
    level = option.children
  }
  return result
}

export function flattenCascaderPaths(data: CascaderOption[]): CascaderFlatPath[] {
  const result: CascaderFlatPath[] = []
  const walk = (
    nodes: CascaderOption[],
    parentPath: string[],
    parentOptions: CascaderOption[],
    parentDisabled: boolean,
  ) => {
    nodes.forEach((node) => {
      const path = [...parentPath, node.value]
      const options = [...parentOptions, node]
      const disabled = parentDisabled || !!node.disabled
      const leaf = !cascaderOptionHasChildren(node)
      result.push({ path, options, leaf, disabled })
      if (!leaf) walk(node.children!, path, options, disabled)
    })
  }
  walk(data, [], [], false)
  return result
}
