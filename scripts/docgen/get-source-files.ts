import fs from 'node:fs'
import path from 'node:path'

const IGNORED_DIRECTORIES = new Set([
  'node_modules',
  'lib',
  'esm',
  'cjs',
  'dist',
  '__tests__',
  '__snapshots__',
])

const IGNORED_SUFFIXES = [
  '.test.ts',
  '.test.tsx',
  '.story.ts',
  '.story.tsx',
  '.demo.ts',
  '.d.ts',
  '.pure.story.ts',
]

/** Recursively collects every `.ts` source file under the given roots. */
export function getSourceFiles(roots: string[]): string[] {
  const files: string[] = []

  const walk = (directory: string) => {
    if (!fs.existsSync(directory)) {
      return
    }

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.posix.join(directory, entry.name)

      if (entry.isDirectory()) {
        if (!IGNORED_DIRECTORIES.has(entry.name)) {
          walk(entryPath)
        }
        continue
      }

      if (!entry.name.endsWith('.ts') && !entry.name.endsWith('.tsx')) {
        continue
      }

      if (IGNORED_SUFFIXES.some((suffix) => entry.name.endsWith(suffix))) {
        continue
      }

      files.push(entryPath)
    }
  }

  roots.forEach(walk)

  return files.sort()
}
