import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import { getCanonicalUrl, getPageTitle, getStructuredData, SITE_NAME } from '../src/seo'
import type { SeoPage } from '../src/seo'
import { SEO_PAGES } from './seo-pages'

const seoBlock = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/

function escapeHtml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&#39;',
      '"': '&quot;',
    }

    return entities[character]
  })
}

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    }

    return entities[character]
  })
}

function renderSitemap() {
  const urls = SEO_PAGES.map(
    (page) => `  <url>\n    <loc>${escapeXml(getCanonicalUrl(page.path))}</loc>\n  </url>`,
  ).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

function renderSeoHead(page: SeoPage) {
  const title = getPageTitle(page.title)
  const canonicalUrl = getCanonicalUrl(page.path)
  const structuredData = JSON.stringify(getStructuredData(page)).replace(/</g, '\\u003c')

  return `<!-- seo:start -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <script id="seo-structured-data" type="application/ld+json">${structuredData}</script>
    <!-- seo:end -->`
}

/**
 * Generates lightweight HTML entry points with route-specific metadata. The
 * Vue application still hydrates in the browser, while crawlers and link
 * unfurlers receive the correct head content before JavaScript runs.
 */
export function seoSnapshotsPlugin(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'mantine-vue-seo-snapshots',
    apply: 'build',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: renderSitemap() })
    },
    async closeBundle() {
      const outputDirectory = resolve(config.root, config.build.outDir)
      const indexPath = resolve(outputDirectory, 'index.html')
      const indexHtml = await readFile(indexPath, 'utf8')

      if (!seoBlock.test(indexHtml)) {
        throw new Error('Could not find the SEO marker block in the built index.html')
      }

      await Promise.all(
        SEO_PAGES.map(async (page) => {
          const outputPath = resolve(outputDirectory, `.${page.path}.html`)
          await mkdir(dirname(outputPath), { recursive: true })
          await writeFile(outputPath, indexHtml.replace(seoBlock, renderSeoHead(page)), 'utf8')
        }),
      )
    },
  }
}
