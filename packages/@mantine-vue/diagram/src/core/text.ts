import type { DiagramRichText, DiagramTextRun } from './types'

export interface TextFont {
  size: number
  family?: string
  weight?: number | string
  style?: string
}

export type MeasureText = (text: string, font: TextFont) => number

let context: CanvasRenderingContext2D | null | undefined

/** Whether Canvas 2D can be used. jsdom has no canvas and reports every attempt to use one. */
export function canUseCanvas() {
  return (
    typeof document !== 'undefined' &&
    !(typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent))
  )
}

/**
 * Measures text with a canvas when one is available. Server rendering and test environments
 * without canvas support fall back to an average glyph width, which keeps output stable.
 */
/** Estimate used on the server and before hydration, so both render the same line breaks. */
export const estimateText: MeasureText = (text, font) => text.length * font.size * 0.55

export const measureText: MeasureText = (text, font) => {
  if (context === undefined) {
    context = null

    try {
      if (canUseCanvas()) {
        context = document.createElement('canvas').getContext('2d')
      }
    } catch {
      context = null
    }
  }

  if (!context) {
    return estimateText(text, font)
  }

  context.font = `${font.style ?? 'normal'} ${font.weight ?? 'normal'} ${font.size}px ${font.family ?? 'sans-serif'}`

  return context.measureText(text).width
}

export interface TextLine {
  runs: (DiagramTextRun & { width: number })[]
  width: number
  /** Largest font size of the line */
  size: number
}

/**
 * Breaks rich text into lines that fit `maxWidth`. Words longer than a line are split by
 * characters. Explicit paragraphs always start a new line.
 */
export function wrapRichText(
  paragraphs: DiagramRichText,
  maxWidth: number,
  font: TextFont,
  measure: MeasureText = measureText,
): TextLine[] {
  const lines: TextLine[] = []

  for (const paragraph of paragraphs) {
    let line: TextLine = { runs: [], width: 0, size: font.size }
    const push = () => {
      lines.push(line)
      line = { runs: [], width: 0, size: font.size }
    }
    const tokens = paragraph.flatMap((run) =>
      run.text
        .split(/(\s+)/)
        .filter(Boolean)
        .map((text) => ({ ...run, text })),
    )

    if (tokens.length === 0) {
      push()
      continue
    }

    for (const token of tokens) {
      const runFont = {
        ...font,
        size: token.fontSize ?? font.size,
        weight: token.bold ? 'bold' : font.weight,
        style: token.italic ? 'italic' : font.style,
      }
      const isSpace = /^\s+$/.test(token.text)
      let width = measure(token.text, runFont)

      if (isSpace && line.runs.length === 0) {
        continue
      }

      if (line.width + width > maxWidth && line.runs.length > 0 && !isSpace) {
        trimTrailingSpace(line, measure, font)
        push()
      }

      if (isSpace && line.width + width > maxWidth) {
        continue
      }

      // A single word wider than the line is broken by characters.
      let text = token.text

      while (width > maxWidth && text.length > 1) {
        let cut = text.length - 1

        while (cut > 1 && line.width + measure(text.slice(0, cut), runFont) > maxWidth) {
          cut -= 1
        }

        const head = text.slice(0, cut)
        appendRun(line, { ...token, text: head }, measure(head, runFont), runFont.size)
        push()
        text = text.slice(cut)
        width = measure(text, runFont)
      }

      appendRun(line, { ...token, text }, width, runFont.size)
    }

    trimTrailingSpace(line, measure, font)
    push()
  }

  return lines
}

function appendRun(line: TextLine, run: DiagramTextRun, width: number, size: number) {
  const last = line.runs[line.runs.length - 1]
  const sameStyle =
    last &&
    last.bold === run.bold &&
    last.italic === run.italic &&
    last.underline === run.underline &&
    last.color === run.color &&
    last.fontSize === run.fontSize

  if (sameStyle) {
    last.text += run.text
    last.width += width
  } else {
    line.runs.push({ ...run, width })
  }

  line.width += width
  line.size = Math.max(line.size, size)
}

function trimTrailingSpace(line: TextLine, measure: MeasureText, font: TextFont) {
  const last = line.runs[line.runs.length - 1]

  if (!last) {
    return
  }

  const trimmed = last.text.replace(/\s+$/, '')

  if (trimmed !== last.text) {
    const width = measure(trimmed, { ...font, size: last.fontSize ?? font.size })
    line.width -= last.width - width
    last.width = width
    last.text = trimmed
  }
}

/** Converts plain text to rich text, one paragraph per line. */
export function plainTextToRichText(text: string): DiagramRichText {
  return text.split('\n').map((line) => [{ text: line }])
}

export function richTextToPlainText(text: DiagramRichText): string {
  return text.map((paragraph) => paragraph.map((run) => run.text).join('')).join('\n')
}
