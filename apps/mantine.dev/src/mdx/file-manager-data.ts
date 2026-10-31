import type { Frontmatter } from '@/types'

const PACKAGE = '@mantine-vue/file-manager'

export const FILE_MANAGER_MDX_DATA: Record<string, Frontmatter> = {
  FileManagerGettingStarted: {
    title: 'Getting started with the Vue file manager',
    package: PACKAGE,
    slug: '/file-manager/getting-started',
    description:
      'Install the Mantine Vue file manager, render a Vue 3 file browser and connect an adapter for a REST API or custom backend.',
    docs: 'file-manager/getting-started.mdx',
    searchTags:
      'vue file manager, vue 3 file manager, file browser component, file explorer, installation, getting started',
  },
  FileManager: {
    title: 'FileManager component',
    package: PACKAGE,
    slug: '/file-manager/file-manager',
    props: ['FileManager'],
    styles: ['FileManager'],
    description:
      'Build a Vue 3 file manager with controlled state, five views, pagination, virtualization, events and a headless controller.',
    source: '@mantine-vue/file-manager/src/components/FileManager/FileManager.ts',
    docs: 'file-manager/file-manager.mdx',
    searchTags:
      'vue file manager component, file explorer, folders, tree view, grid, gallery, thumbnails, breadcrumbs, drag and drop',
  },
  FileManagerAdapters: {
    title: 'File manager backend adapters',
    package: PACKAGE,
    slug: '/file-manager/adapters',
    description:
      'Connect the Vue file manager to a REST API, cloud storage or custom backend with a typed adapter and capability detection.',
    docs: 'file-manager/adapters.mdx',
    searchTags:
      'file manager backend, file system adapter, rest api, capabilities, permissions, amazon s3, cloud storage',
  },
  FileManagerCustomization: {
    title: 'Customize the file manager',
    package: PACKAGE,
    slug: '/file-manager/customization',
    description:
      'Customize the Mantine Vue file manager with themes, Styles API selectors, slots, sections, icons and custom views.',
    docs: 'file-manager/customization.mdx',
    searchTags: 'theme, colors, fonts, dark mode, layouts, icons, custom view, slots, labels',
  },
  FileManagerActions: {
    title: 'File manager actions and menus',
    package: PACKAGE,
    slug: '/file-manager/actions',
    description:
      'Add custom file manager actions and configure toolbar items, context menus, selection controls and keyboard shortcuts.',
    docs: 'file-manager/actions.mdx',
    searchTags: 'toolbar, context menu, right click, shortcuts, keyboard, custom action, hotkeys',
  },
  FileManagerPreviews: {
    title: 'File previews',
    package: PACKAGE,
    slug: '/file-manager/previews',
    description:
      'Preview images, PDFs, text, code, audio and video in the Vue file manager, or provide secure custom preview renderers.',
    docs: 'file-manager/previews.mdx',
    searchTags: 'preview, viewer, pdf, image, video, audio, code, renderer',
  },
  FileManagerUploads: {
    title: 'File uploads',
    package: PACKAGE,
    slug: '/file-manager/uploads',
    description:
      'Configure file uploads with validation, progress, concurrency, name-conflict handling, folder paths and retryable chunks.',
    docs: 'file-manager/uploads.mdx',
    searchTags: 'upload, dropzone, queue, progress, chunked, resumable, retry, conflict',
  },
  FileManagerMobile: {
    title: 'Mobile file manager and accessibility',
    package: PACKAGE,
    slug: '/file-manager/mobile',
    description:
      'Build an accessible mobile file manager with a responsive compact layout, touch selection, keyboard navigation and ARIA semantics.',
    docs: 'file-manager/mobile.mdx',
    searchTags: 'mobile, responsive, touch, accessibility, keyboard, aria, screen reader, wcag',
  },
  FileManagerFeatures: {
    title: 'File manager features and limitations',
    package: PACKAGE,
    slug: '/file-manager/features',
    description:
      'Review built-in file manager features, adapter requirements and known limitations before integrating a production backend.',
    docs: 'file-manager/features.mdx',
    searchTags:
      'vue file manager features, capabilities, adapter requirements, browser support, limitations, production checklist',
  },
}
