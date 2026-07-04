import { existsSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { isAbsolute, join } from 'node:path'
import type { PackageInfo } from './read-packages'

/**
 * Produces the actual publishable JS output (esm/index.mjs + cjs/index.cjs) for a package,
 * using Vite's library build mode.
 */
export async function bundlePackage(pkg: PackageInfo) {
  if (pkg.private) {
    return
  }

  const { build } = await import('vite')
  const entry = join(pkg.path, 'src', 'index.ts')

  if (!existsSync(entry)) {
    console.warn(`Skipping bundle for ${pkg.name}: no src/index.ts entry found`)
    return
  }

  const external = (id: string) => !id.startsWith('.') && !isAbsolute(id)

  for (const format of ['es', 'cjs'] as const) {
    const outDir = join(pkg.path, format === 'es' ? 'esm' : 'cjs')

    // eslint-disable-next-line no-await-in-loop
    await build({
      root: pkg.path,
      configFile: false,
      logLevel: 'warn',
      build: {
        outDir,
        emptyOutDir: true,
        cssCodeSplit: false,
        sourcemap: true,
        minify: false,
        lib: {
          entry,
          formats: [format],
          fileName: () => (format === 'es' ? 'index.mjs' : 'index.cjs'),
        },
        rollupOptions: {
          external,
          output: {
            preserveModules: false,
          },
        },
      },
    })

    normalizeGeneratedCss(pkg, outDir)
  }
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
