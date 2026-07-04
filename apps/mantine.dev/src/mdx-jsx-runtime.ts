import { Fragment, h } from 'vue'

function isComponent(type: unknown) {
  return typeof type === 'object' || typeof type === 'function'
}

function createElement(type: any, props: Record<string, any> = {}, key?: string) {
  const { children, ...rest } = props

  if (key !== undefined) {
    rest.key = key
  }

  if (
    children === undefined ||
    typeof type === 'string' ||
    type === Fragment ||
    !isComponent(type)
  ) {
    return h(type, rest, children)
  }

  return h(type, rest, { default: () => children })
}

export const jsx = createElement
export const jsxs = createElement
export const jsxDEV = createElement
export { Fragment }
