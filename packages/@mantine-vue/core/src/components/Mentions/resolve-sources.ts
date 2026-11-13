import { camelize, Comment, Fragment, normalizeClass, normalizeStyle, type VNode } from 'vue'
import { toMentionConfig } from './get-mentions'
import { Mention, type MentionProps } from './Mention'
import { makeTriggerRegex } from './utils/make-trigger-regex'
import type { MentionConfig } from './utils/types'

export interface ResolvedMentionSource {
  sourceIndex: number
  props: MentionProps
  config: MentionConfig
  regex: RegExp
}

const BOOLEAN_PROPS = new Set([
  'withTrigger',
  'appendSpaceOnAdd',
  'allowSpaceInQuery',
  'ignoreAccents',
])

function flattenVNodes(nodes: unknown): VNode[] {
  if (!Array.isArray(nodes)) {
    return []
  }

  return nodes.flatMap((node: any) => {
    if (!node || node.type === Comment) {
      return []
    }

    if (node.type === Fragment) {
      return flattenVNodes(node.children)
    }

    return [node]
  })
}

/** Reads props of a `Mentions.Mention` vnode, normalizing kebab-case keys and boolean attributes */
function getMentionProps(vnode: VNode): MentionProps {
  const raw = (vnode.props || {}) as Record<string, any>
  const props: Record<string, any> = {}

  for (const key of Object.keys(raw)) {
    const name = camelize(key)
    const value = raw[key]

    if (name === 'class') {
      props.className = normalizeClass([props.className, value]) || undefined
    } else if (name === 'style') {
      props.style = normalizeStyle(value) as any
    } else if (name === 'onAdd' || name === 'on-add') {
      props.onAdd = Array.isArray(value)
        ? (item: any) => value.forEach((handler: any) => handler?.(item))
        : value
    } else {
      props[name] = BOOLEAN_PROPS.has(name) && value === '' ? true : value
    }
  }

  const slots = vnode.children as Record<string, any> | null
  if (slots && typeof slots === 'object' && !Array.isArray(slots)) {
    if (typeof slots.suggestion === 'function' && !props.renderSuggestion) {
      props.renderSuggestion = (input: any) => slots.suggestion(input)
    }

    if (typeof slots.empty === 'function' && !props.renderEmpty) {
      props.renderEmpty = (query: string) => slots.empty({ query })
    }

    if (typeof slots.error === 'function' && !props.renderError) {
      props.renderError = (query: string, error: unknown) => slots.error({ query, error })
    }
  }

  return props as MentionProps
}

/** Resolves `Mentions.Mention` configuration nodes rendered in the default slot of `Mentions` */
export function resolveSources(nodes: unknown): ResolvedMentionSource[] {
  const sources: ResolvedMentionSource[] = []

  for (const vnode of flattenVNodes(nodes)) {
    if (vnode.type !== Mention) {
      continue
    }

    const props = getMentionProps(vnode)

    sources.push({
      sourceIndex: sources.length,
      props,
      config: toMentionConfig(props),
      regex: makeTriggerRegex(props.trigger ?? '@', { allowSpaceInQuery: props.allowSpaceInQuery }),
    })
  }

  return sources
}

/** Resolves sources from plain props objects, used when sources are passed as data instead of slot nodes */
export function resolveSourcesFromProps(list: MentionProps[]): ResolvedMentionSource[] {
  return list.map((props, sourceIndex) => ({
    sourceIndex,
    props,
    config: toMentionConfig(props),
    regex: makeTriggerRegex(props.trigger ?? '@', { allowSpaceInQuery: props.allowSpaceInQuery }),
  }))
}
