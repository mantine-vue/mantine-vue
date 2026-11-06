let counter = 0

/** Creates a short identifier that is unique within the page and very likely across sessions. */
export function createDiagramId(prefix = 'id') {
  counter = (counter + 1) % 1_679_616
  const random = Math.floor(Math.random() * 2_176_782_336)
    .toString(36)
    .padStart(6, '0')

  return `${prefix}_${random}${counter.toString(36).padStart(4, '0')}`
}
