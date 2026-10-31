const CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
  let value = index

  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  }

  return value >>> 0
})

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff

  for (const byte of bytes) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }

  return (crc ^ 0xffffffff) >>> 0
}

function toDosDateTime(date: Date) {
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1),
    day: ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  }
}

export interface ZipEntry {
  /** Path inside the archive. Folders end with `/`. */
  path: string
  content: Uint8Array
  modifiedAt?: Date
}

const UTF8_FLAG = 0x0800

/**
 * Builds an uncompressed zip archive.
 *
 * It backs `downloadMany` of the in-memory adapter, which keeps the demos working without a
 * server. Real backends should produce archives on the server instead.
 */
export function createZipArchive(entries: ZipEntry[]) {
  const encoder = new TextEncoder()
  const localParts: Uint8Array[] = []
  const centralParts: Uint8Array[] = []
  let offset = 0

  for (const entry of entries) {
    const name = encoder.encode(entry.path)
    const crc = crc32(entry.content)
    const { time, day } = toDosDateTime(entry.modifiedAt ?? new Date())

    const local = new DataView(new ArrayBuffer(30))
    local.setUint32(0, 0x04034b50, true)
    local.setUint16(4, 20, true)
    local.setUint16(6, UTF8_FLAG, true)
    local.setUint16(10, time, true)
    local.setUint16(12, day, true)
    local.setUint32(14, crc, true)
    local.setUint32(18, entry.content.length, true)
    local.setUint32(22, entry.content.length, true)
    local.setUint16(26, name.length, true)

    const central = new DataView(new ArrayBuffer(46))
    central.setUint32(0, 0x02014b50, true)
    central.setUint16(4, 20, true)
    central.setUint16(6, 20, true)
    central.setUint16(8, UTF8_FLAG, true)
    central.setUint16(12, time, true)
    central.setUint16(14, day, true)
    central.setUint32(16, crc, true)
    central.setUint32(20, entry.content.length, true)
    central.setUint32(24, entry.content.length, true)
    central.setUint16(28, name.length, true)
    central.setUint32(42, offset, true)

    localParts.push(new Uint8Array(local.buffer), name, entry.content)
    centralParts.push(new Uint8Array(central.buffer), name)
    offset += 30 + name.length + entry.content.length
  }

  const centralSize = centralParts.reduce((size, part) => size + part.length, 0)
  const end = new DataView(new ArrayBuffer(22))
  end.setUint32(0, 0x06054b50, true)
  end.setUint16(8, entries.length, true)
  end.setUint16(10, entries.length, true)
  end.setUint32(12, centralSize, true)
  end.setUint32(16, offset, true)

  return new Blob([...localParts, ...centralParts, new Uint8Array(end.buffer)] as BlobPart[], {
    type: 'application/zip',
  })
}
