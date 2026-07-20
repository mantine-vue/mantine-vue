/* oxlint-disable no-console */
import { spawnSync } from 'node:child_process'
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import type { PackageInfo } from './read-packages'

const require = createRequire(import.meta.url)

function resolveViteBin() {
  const packageJsonPath = require.resolve('vite/package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  const binField = packageJson.bin

  const relativeBinPath = typeof binField === 'string' ? binField : binField?.vite

  if (!relativeBinPath) {
    throw new Error('Could not determine vite CLI entry point from its package.json "bin" field')
  }

  return join(dirname(packageJsonPath), relativeBinPath)
}

/**
 * Produces the actual publishable JS output (esm/index.mjs + cjs/index.cjs) for a package,
 * using Vite's library build mode.
 */
export async function bundlePackage(pkg: PackageInfo) {
  if (pkg.private) {
    return
  }

  const entry = join(pkg.path, 'src', 'index.ts')

  if (!existsSync(entry)) {
    console.warn(`Skipping bundle for ${pkg.name}: no src/index.ts entry found`)
    return
  }

  const viteBin = resolveViteBin()

  for (const format of ['es', 'cjs'] as const) {
    const outDir = join(pkg.path, format === 'es' ? 'esm' : 'cjs')
    const fileName = format === 'es' ? 'index.mjs' : 'index.cjs'
    const configDir = writeTempConfig({ pkgPath: pkg.path, entry, outDir, format, fileName })
    const configPath = join(configDir, 'vite.config.mjs')

    try {
      const result = spawnSync(process.execPath, [viteBin, 'build', '--config', configPath], {
        cwd: pkg.path,
        stdio: 'inherit',
      })

      if (result.status !== 0) {
        throw new Error(`Vite build failed for ${pkg.name} (${format})`)
      }
    } finally {
      rmSync(configDir, { recursive: true, force: true })
    }

    normalizeGeneratedCss(pkg, outDir)
  }

  await bundleLocaleEntries(pkg, viteBin)
}

/** Builds optional package locale entry points used by `./locales/*` exports. */
async function bundleLocaleEntries(pkg: PackageInfo, viteBin: string) {
  const localesDir = join(pkg.path, 'src', 'locales')

  if (!existsSync(localesDir)) {
    return
  }

  const entries = Object.fromEntries(
    readdirSync(localesDir)
      .filter((file) => file.endsWith('.ts'))
      .map((file) => [file.slice(0, -3), join(localesDir, file)]),
  )

  for (const format of ['es', 'cjs'] as const) {
    const outDir = join(pkg.path, 'locales')
    const extension = format === 'es' ? 'mjs' : 'cjs'
    const configDir = mkdtempSync(join(process.cwd(), '.mantine-vue-vite-config-'))
    const configPath = join(configDir, 'vite.config.mjs')
    const contents = `
import { defineConfig } from 'vite'

export default defineConfig({
  root: ${JSON.stringify(pkg.path)},
  configFile: false,
  logLevel: 'warn',
  build: {
    outDir: ${JSON.stringify(outDir)},
    emptyOutDir: ${format === 'es'},
    minify: false,
    lib: {
      entry: ${JSON.stringify(entries)},
      formats: [${JSON.stringify(format)}],
      fileName: (_format, entryName) => \`\${entryName}.${extension}\`,
    },
    rollupOptions: {
      external: (id) => !id.startsWith('.') && !id.startsWith('/'),
    },
  },
})
`

    writeFileSync(configPath, contents)

    try {
      const result = spawnSync(process.execPath, [viteBin, 'build', '--config', configPath], {
        cwd: pkg.path,
        stdio: 'inherit',
      })

      if (result.status !== 0) {
        throw new Error(`Vite locale build failed for ${pkg.name} (${format})`)
      }
    } finally {
      rmSync(configDir, { recursive: true, force: true })
    }
  }
}

function writeTempConfig(options: {
  pkgPath: string
  entry: string
  outDir: string
  format: 'es' | 'cjs'
  fileName: string
}) {
  const { pkgPath, entry, outDir, format, fileName } = options
  const configDir = mkdtempSync(join(process.cwd(), '.mantine-vue-vite-config-'))
  const configPath = join(configDir, 'vite.config.mjs')

  const contents = `
import { defineConfig } from 'vite'
import { isAbsolute } from 'node:path'

export default defineConfig({
  root: ${JSON.stringify(pkgPath)},
  configFile: false,
  logLevel: 'warn',
  build: {
    outDir: ${JSON.stringify(outDir)},
    emptyOutDir: true,
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    lib: {
      entry: ${JSON.stringify(entry)},
      formats: [${JSON.stringify(format)}],
      fileName: () => ${JSON.stringify(fileName)},
    },
    rollupOptions: {
      external: (id) =>
        id !== '@mantine-vue/utils' &&
        !id.startsWith('@mantine-vue/utils/') &&
        !id.startsWith('.') &&
        !isAbsolute(id),
      output: {
        preserveModules: false,
      },
    },
  },
})
`

  writeFileSync(configPath, contents)
  return configDir
}

/**
 * Vite emits a single css asset per lib build (e.g. `style.css`) when cssCodeSplit is disabled.
 * Mantine's package `exports` map expects that stylesheet at the package root as `styles.css`
 * (plus a `@layer`-wrapped `styles.layer.css` twin), not inside esm/ or cjs/.
 *
 * The package root `styles.css`/`styles.layer.css` are build artifacts, never hand-authored:
 * every stylesheet that ships is reachable from `src/index.ts` (component `*.module.css`
 * imports, plus the baseline/global/token sheets imported by MantineProvider). They are always
 * rewritten from the fresh bundle so that styles for newly added components are picked up.
 */
function normalizeGeneratedCss(pkg: PackageInfo, outDir: string) {
  if (!existsSync(outDir)) {
    return
  }

  const cssFile = readdirSync(outDir).find((file) => file.endsWith('.css'))

  if (!cssFile) {
    return
  }

  const generatedPath = join(outDir, cssFile)
  const stylesPath = join(pkg.path, 'styles.css')

  rmSync(stylesPath, { force: true })
  renameSync(generatedPath, stylesPath)

  const layerPath = join(pkg.path, 'styles.layer.css')
  const css = readFileSync(stylesPath, 'utf8')
  writeFileSync(layerPath, `@layer mantine {\n${css}\n}\n`)
}
