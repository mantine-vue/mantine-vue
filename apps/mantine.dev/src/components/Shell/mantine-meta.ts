// Inlined here for the Shell's version menu / header links. Historical
// version links point at the real mantine.dev version sites.
export const majorVersions = [
  { v: '8', name: '8.3.18', link: 'https://v8.mantine.dev/' },
  { v: '7', name: '7.17.8', link: 'https://v7.mantine.dev/' },
  { v: '6', name: '6.0.21', link: 'https://v6.mantine.dev/' },
  { v: '5', name: '5.10.5', link: 'https://v5.mantine.dev/' },
  { v: '4', name: '4.2.12', link: 'https://v4.mantine.dev/' },
  { v: '3', name: '3.6.14', link: 'https://v3.mantine.dev/' },
  { v: '2', name: '2.5.1', link: 'https://v2.mantine.dev/' },
  { v: '1', name: '1.3.1', link: 'https://v1.mantine.dev/' },
]

export const meta = {
  docsLink: 'https://mantine.dev',
  uiLink: 'https://ui.mantine.dev/',
  helpCenterLink: 'https://help.mantine.dev',

  discordLink: 'https://discord.gg/wbH82zuWMN',
  twitterLink: 'https://x.com/mantinedev',

  npmLink: 'https://www.npmjs.com/org/mantine',

  discordColor: '#5865f2',
  twitterColor: '#1C8CD8',

  gitHubLinks: {
    mantine: 'https://github.com/mantinedev/mantine',
    mantineUi: 'https://github.com/mantinedev/ui.mantine.dev',
    discussions: 'https://github.com/mantinedev/mantine/discussions',
    organization: 'https://github.com/mantinedev',
    releases: 'https://github.com/mantinedev/mantine/releases',
  },
}

// mantine-vue is currently unreleased (workspace version 0.0.0 everywhere),
// so there's no meaningful "current version" semver to show - this is the
// label the version control button displays instead of `v${version}`.
export const currentVersionLabel = 'vue-preview'
