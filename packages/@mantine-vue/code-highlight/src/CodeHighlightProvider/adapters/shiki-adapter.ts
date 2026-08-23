import type { CodeHighlightAdapter } from '../CodeHighlightProvider'
import { dark, light } from './shiki-themes'

function stripElement(openTag: string, data: string) {
  const openIndex = data.indexOf(`<${openTag}`)
  let closeIndex = openIndex + openTag.length

  for (let i = openIndex; i < data.length; i += 1) {
    if (data[i] === '>') {
      closeIndex = i
      break
    }
  }

  const striped = data.slice(0, openIndex) + data.slice(closeIndex + 1)
  return striped.replace(`</${openTag}>`, '')
}

export function stripShikiCodeBlocks(data: string) {
  return stripElement('code', stripElement('pre', data))
}

interface CreateShikiAdapterOptions {
  forceColorScheme?: 'dark' | 'light' | (string & {})
  resolveLanguage?: (language: string) => any
}

const specialLanguages = ['text', 'plaintext', 'txt', 'plain', 'ansi']

function isLanguageAvailable(ctx: any, language: string | undefined) {
  return (
    !language ||
    specialLanguages.includes(language) ||
    typeof ctx.getLoadedLanguages !== 'function' ||
    ctx.getLoadedLanguages().includes(language)
  )
}

export const createShikiAdapter = (
  loadShiki: () => Promise<any>,
  { forceColorScheme, resolveLanguage }: CreateShikiAdapterOptions = {},
): CodeHighlightAdapter => {
  const warnedLanguages = new Set<string>()
  const warnUnavailable = (language: string, reason: string) => {
    if (warnedLanguages.has(language)) return
    warnedLanguages.add(language)
    // oxlint-disable-next-line no-console
    console.warn(
      `[@mantine-vue/code-highlight] Language \`${language}\` ${reason}, code is rendered as plain text.`,
    )
  }

  return {
    loadContext: loadShiki,
    loadLanguage: resolveLanguage
      ? (ctx, language) => {
          if (isLanguageAvailable(ctx, language)) return undefined
          const onLoadError = (error: unknown) => {
            warnUnavailable(language, 'could not be loaded')
            throw error
          }
          try {
            const grammar = resolveLanguage(language)
            if (!grammar) {
              warnUnavailable(language, 'was not resolved by `resolveLanguage`')
              return undefined
            }
            return Promise.resolve(ctx.loadLanguage(grammar)).catch(onLoadError)
          } catch (error) {
            return Promise.reject(error).catch(onLoadError)
          }
        }
      : undefined,
    getHighlighter: (ctx) => {
      if (!ctx) {
        return ({ code }) => ({ highlightedCode: code, isHighlighted: false })
      }

      return ({ code, language, colorScheme }) => {
        if (!isLanguageAvailable(ctx, language)) {
          if (!resolveLanguage && language) warnUnavailable(language, 'is not loaded')
          return { highlightedCode: code, isHighlighted: false }
        }
        let _colorScheme: any = colorScheme

        if (colorScheme === 'light') {
          _colorScheme = light
        } else if (colorScheme === 'dark') {
          _colorScheme = dark
        }

        return {
          isHighlighted: true,
          highlightedCode: stripShikiCodeBlocks(
            ctx.codeToHtml(code, {
              lang: language,
              theme: forceColorScheme || _colorScheme,
            }),
          ),
        }
      }
    },
  }
}
