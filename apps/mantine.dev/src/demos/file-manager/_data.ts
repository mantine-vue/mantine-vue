import type { MemoryFileSeed } from '@mantine-vue/file-manager'

const DAY = 24 * 60 * 60 * 1000
const daysAgo = (days: number) => new Date(Date.now() - days * DAY).toISOString()

/** Hand-drawn picture, so the demos have real image content without any network request. */
function picture(from: string, to: string, shape: string) {
  return new Blob(
    [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
        <defs><linearGradient id="g" x2="1" y2="1">
          <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
        </linearGradient></defs>
        <rect width="640" height="400" fill="url(#g)"/>${shape}</svg>`,
    ],
    { type: 'image/svg+xml' },
  )
}

/** Smallest PDF the viewers of current browsers open. */
const pdf = () =>
  new Blob(
    [
      `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 400 200]/Resources<</Font<</F1 5 0 R>>>>/Contents 4 0 R>>endobj
4 0 obj<</Length 56>>stream
BT /F1 18 Tf 40 100 Td (Quarterly report) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Root 1 0 R>>
%%EOF`,
    ],
    { type: 'application/pdf' },
  )

/** One second of a sine wave. */
function tone() {
  const rate = 8000
  const samples = rate
  const view = new DataView(new ArrayBuffer(44 + samples))
  const writeText = (offset: number, text: string) =>
    [...text].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)))

  writeText(0, 'RIFF')
  view.setUint32(4, 36 + samples, true)
  writeText(8, 'WAVEfmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, rate, true)
  view.setUint32(28, rate, true)
  view.setUint16(32, 1, true)
  view.setUint16(34, 8, true)
  writeText(36, 'data')
  view.setUint32(40, samples, true)

  for (let index = 0; index < samples; index += 1) {
    view.setUint8(44 + index, 128 + 60 * Math.sin((2 * Math.PI * 440 * index) / rate))
  }

  return new Blob([view.buffer], { type: 'audio/wav' })
}

const README = `# Mantine Vue

This text file is previewed as plain text, so markup such as <script>alert(1)</script> stays inert.
`

const COMPONENT = `<script setup lang="ts">
import { FileManager, createMemoryAdapter } from '@mantine-vue/file-manager'

const adapter = createMemoryAdapter()
</script>

<template>
  <FileManager :adapter="adapter" style="height: 480px" />
</template>
`

/** Sample tree shown by the demos. */
export function createDemoFiles(): MemoryFileSeed[] {
  return [
    {
      name: 'Documents',
      modifiedAt: daysAgo(2),
      children: [
        {
          name: 'Reports',
          modifiedAt: daysAgo(3),
          children: [
            { name: 'Q1 report.pdf', content: pdf(), modifiedAt: daysAgo(90), starred: true },
            { name: 'Q2 report.pdf', content: pdf(), modifiedAt: daysAgo(40) },
            { name: 'Q3 report.pdf', content: pdf(), modifiedAt: daysAgo(3) },
          ],
        },
        {
          name: 'Contracts',
          modifiedAt: daysAgo(20),
          children: [
            {
              name: 'Master agreement.docx',
              size: 248_320,
              modifiedAt: daysAgo(120),
              owner: 'Legal',
              permissions: { rename: false, delete: false, move: false },
            },
          ],
        },
        { name: 'Budget 2026.xlsx', size: 88_320, modifiedAt: daysAgo(6) },
        { name: 'Roadmap.pptx', size: 4_882_000, modifiedAt: daysAgo(11) },
        { name: 'Notes.txt', content: 'Remember to water the plants.\n', modifiedAt: daysAgo(1) },
      ],
    },
    {
      name: 'Photos',
      modifiedAt: daysAgo(4),
      children: [
        {
          name: 'Mountains.svg',
          content: picture(
            '#74c0fc',
            '#1864ab',
            '<path d="M0 400 200 120l140 180 100-120 200 220z" fill="#fff" opacity=".85"/>',
          ),
          modifiedAt: daysAgo(4),
          starred: true,
        },
        {
          name: 'Sunset.svg',
          content: picture(
            '#ffd43b',
            '#e8590c',
            '<circle cx="320" cy="260" r="110" fill="#fff" opacity=".7"/>',
          ),
          modifiedAt: daysAgo(14),
        },
        {
          name: 'Forest.svg',
          content: picture(
            '#b2f2bb',
            '#2b8a3e',
            '<path d="M140 340 220 120l80 220zM340 340l80-260 80 260z" fill="#fff" opacity=".6"/>',
          ),
          modifiedAt: daysAgo(30),
        },
        {
          name: 'Ocean.svg',
          content: picture(
            '#a5d8ff',
            '#0b7285',
            '<path d="M0 280q160-80 320 0t320 0v120H0z" fill="#fff" opacity=".6"/>',
          ),
          modifiedAt: daysAgo(44),
        },
      ],
    },
    {
      name: 'Music',
      modifiedAt: daysAgo(12),
      children: [{ name: 'Tuning fork.wav', content: tone(), modifiedAt: daysAgo(12) }],
    },
    {
      name: 'Source',
      modifiedAt: daysAgo(1),
      children: [
        { name: 'App.vue', content: COMPONENT, modifiedAt: daysAgo(1) },
        {
          name: 'theme.css',
          content: ':root {\n  color-scheme: light dark;\n}\n',
          modifiedAt: daysAgo(8),
        },
      ],
    },
    { name: 'Read me.md', content: README, modifiedAt: daysAgo(1) },
    { name: 'Launch video.mp4', size: 48_203_776, modifiedAt: daysAgo(7) },
    { name: 'Archive.zip', size: 12_800_000, modifiedAt: daysAgo(60) },
    {
      name: 'Shared policy.pdf',
      content: pdf(),
      modifiedAt: daysAgo(70),
      owner: 'Compliance',
      permissions: { rename: false, delete: false, move: false, write: false },
    },
  ]
}

/** A folder with many files, for the pagination and virtualization demos. */
export function createLargeFolder(count: number): MemoryFileSeed[] {
  const extensions = ['txt', 'pdf', 'png', 'xlsx', 'mp3', 'zip', 'ts']

  return [
    {
      name: `${count.toLocaleString('en-US')} files`,
      children: Array.from({ length: count }, (_, index) => ({
        name: `File ${index + 1}.${extensions[index % extensions.length]}`,
        size: 1000 + index * 37,
        modifiedAt: daysAgo(index % 365),
      })),
    },
  ]
}
