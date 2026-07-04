import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

export interface DeclarationPackage {
  name: string
  path: string
  private?: boolean
}

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const require = createRequire(import.meta.url)

function getPackages(): DeclarationPackage[] {
  const packagePaths = [
    'utils',
    'hooks',
    'store',
    'core',
    'code-highlight',
    'dates',
    'form',
    'notifications',
    'nprogress',
    'schedule',
    'spotlight',
    'tiptap',
  ].map((name) => join(repositoryRoot, 'packages', '@mantine-vue', name))

  return packagePaths.map((path) => {
    const manifest = JSON.parse(readFileSync(join(path, 'package.json'), 'utf8'))
    return { name: manifest.name, path, private: manifest.private }
  })
}

export function generateDeclarations(packages: DeclarationPackage[] = getPackages()) {
  const outputRoot = mkdtempSync(join(tmpdir(), 'mantine-vue-types-'))
  const vueTsc = require.resolve('vue-tsc/bin/vue-tsc.js')

  try {
    const result = spawnSync(
      process.execPath,
      [
        vueTsc,
        '--project',
        'tsconfig.json',
        '--emitDeclarationOnly',
        '--declarationMap',
        'false',
        '--outDir',
        outputRoot,
      ],
      { cwd: repositoryRoot, encoding: 'utf8', stdio: 'pipe' },
    )

    if (result.status !== 0) {
      process.stderr.write(result.stdout)
      process.stderr.write(result.stderr)
      throw new Error('Declaration generation failed')
    }

    for (const pkg of packages.filter((item) => !item.private)) {
      const packageFolder = pkg.name.replace('@mantine-vue/', '')
      const emittedSource = join(outputRoot, 'packages', '@mantine-vue', packageFolder, 'src')
      const declarationDir = join(pkg.path, 'lib')

      if (!existsSync(join(emittedSource, 'index.d.ts'))) {
        throw new Error(`No declarations were emitted for ${pkg.name}`)
      }

      rmSync(declarationDir, { recursive: true, force: true })
      cpSync(emittedSource, declarationDir, { recursive: true })

      writeFileSync(
        join(declarationDir, 'index.d.mts'),
        readFileSync(join(declarationDir, 'index.d.ts')),
      )

      console.log(`Generated declarations for ${pkg.name}`)
    }
  } finally {
    rmSync(outputRoot, { recursive: true, force: true })
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateDeclarations()
}
