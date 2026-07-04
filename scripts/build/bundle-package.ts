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
import { dirname, isAbsolute, join } from 'node:path'
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
      external: (id) => !id.startsWith('.') && !isAbsolute(id),
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

  if (!existsSync(stylesPath)) {
    renameSync(generatedPath, stylesPath)

    const layerPath = join(pkg.path, 'styles.layer.css')
    const css = readFileSync(stylesPath, 'utf8')
    writeFileSync(layerPath, `@layer mantine {\n${css}\n}\n`)
  } else {
    // A hand-authored styles.css already ships with this package (e.g. core's design tokens);
    // keep it, and discard the per-build-only artifact instead of overwriting curated output.
    rmSync(generatedPath, { force: true })
  }
}
