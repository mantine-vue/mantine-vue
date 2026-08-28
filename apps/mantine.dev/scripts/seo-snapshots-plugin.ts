import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import {
  getCanonicalUrl,
  getPageTitle,
  getStructuredData,
  SITE_NAME,
  SOCIAL_IMAGE_URL,
} from '../src/seo'
import type { SeoPage } from '../src/seo'
import { SEO_PAGES } from './seo-pages'

const seoElements =
  /<(title|script)\b[^>]*data-seo="true"[^>]*>[\s\S]*?<\/\1>|<(?:meta|link)\b[^>]*data-seo="true"[^>]*\/?>/gi

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

  return `<title data-seo="true">${escapeHtml(title)}</title>
    <meta data-seo="true" name="description" content="${escapeHtml(page.description)}" />
    <meta data-seo="true" name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link data-seo="true" rel="canonical" href="${canonicalUrl}" />
    <meta data-seo="true" property="og:site_name" content="${SITE_NAME}" />
    <meta data-seo="true" property="og:type" content="article" />
    <meta data-seo="true" property="og:title" content="${escapeHtml(title)}" />
    <meta data-seo="true" property="og:description" content="${escapeHtml(page.description)}" />
    <meta data-seo="true" property="og:url" content="${canonicalUrl}" />
    <meta data-seo="true" property="og:image" content="${SOCIAL_IMAGE_URL}" />
    <meta data-seo="true" property="og:image:width" content="1200" />
    <meta data-seo="true" property="og:image:height" content="630" />
    <meta data-seo="true" property="og:image:alt" content="Mantine Vue — Build interfaces that feel inevitable." />
    <meta data-seo="true" name="twitter:card" content="summary_large_image" />
    <meta data-seo="true" name="twitter:title" content="${escapeHtml(title)}" />
    <meta data-seo="true" name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta data-seo="true" name="twitter:image" content="${SOCIAL_IMAGE_URL}" />
    <script data-seo="true" id="seo-structured-data" type="application/ld+json">${structuredData}</script>`
}

function replaceSeoHead(indexHtml: string, page: SeoPage) {
  const withoutDefaultSeo = indexHtml.replace(seoElements, '')

  if (withoutDefaultSeo === indexHtml) {
    throw new Error('Could not find data-seo elements in the built index.html')
  }

  if (!withoutDefaultSeo.includes('</head>')) {
    throw new Error('Could not find the closing head tag in the built index.html')
  }

  return withoutDefaultSeo.replace('</head>', `  ${renderSeoHead(page)}\n  </head>`)
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

      await Promise.all(
        SEO_PAGES.filter((page) => page.path !== '/').map(async (page) => {
          const outputPath = resolve(outputDirectory, `.${page.path}.html`)
          await mkdir(dirname(outputPath), { recursive: true })
          await writeFile(outputPath, replaceSeoHead(indexHtml, page), 'utf8')
        }),
      )
    },
  }
}
