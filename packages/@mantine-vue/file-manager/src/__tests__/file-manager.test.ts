import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { FileManager } from '../components/FileManager'
import { useFileManager } from '../composables/use-file-manager'
import { useVirtualRows } from '../composables/use-virtual-rows'
import { collapseDividers } from '../actions'
import { resolveMenuItems } from '../FileManager.context'
import { BUILT_IN_ACTION_MAP } from '../FileManager.context'
import { mergeFileManagerLabels } from '../labels'
import type { FileSystemAdapter } from '../types'
import { createAdapter, flush, keydown, mountWithProvider, UNSAFE_URL } from './test-utils'

/** Queries the document, since dialogs and menus render in portals. */
const $ = <T extends Element = HTMLElement>(selector: string) =>
  document.body.querySelector<T>(selector)
const $$ = <T extends Element = HTMLElement>(selector: string) => [
  ...document.body.querySelectorAll<T>(selector),
]

const row = (name: string) => $(`[data-entry-id][aria-label="${name}"]`)!
const rowNames = () => $$('[data-entry-id]').map((item) => item.getAttribute('aria-label'))
const action = (id: string) => $<HTMLButtonElement>(`[data-action="${id}"]`)!

const click = (element: Element, init: MouseEventInit = {}) =>
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ...init }))

async function renderManager(props: Record<string, any> = {}, slots = {}) {
  const adapter = props.adapter ?? createAdapter()
  const wrapper = mountWithProvider(FileManager, { adapter, ...props }, slots)

  await flush()

  return { wrapper, adapter }
}

const fileManager = (wrapper: ReturnType<typeof mountWithProvider>) =>
  wrapper.findComponent(FileManager as any)

afterEach(() => {
  document.body.innerHTML = ''
})

describe('rendering', () => {
  it('needs an adapter or a controller', () => {
    expect(() => mountWithProvider(FileManager, {})).toThrow(/adapter/)
  })

  it('renders the details table by default', async () => {
    await renderManager()

    expect($('[role="grid"]')?.tagName).toBe('TABLE')
    expect(rowNames()).toEqual(['Documents', 'Photos', 'locked.txt', 'readme.md'])
    expect($('[role="region"]')?.getAttribute('aria-label')).toBe('File manager')
    expect($('[role="status"]')?.textContent).toContain('4 items')
  })

  it.each([
    ['grid', 'grid'],
    ['list', 'grid'],
    ['gallery', 'grid'],
    ['tree', 'treegrid'],
  ])('renders the %s layout', async (view, role) => {
    await renderManager({ defaultView: view })

    expect($(`[role="${role}"]`)?.tagName).toBe('DIV')
    expect($$('[data-entry-id]')).toHaveLength(4)
  })

  it('shows the error state with a retry', async () => {
    let failing = true
    const adapter = createAdapter({
      onRequest: () => {
        if (failing) {
          throw new Error('Offline')
        }
      },
    })

    await renderManager({ adapter })

    expect($('[role="alert"]')?.textContent).toContain('Offline')

    failing = false
    action('retry').click()
    await flush()

    expect(rowNames()).toHaveLength(4)
  })

  it('shows distinct empty states', async () => {
    const adapter = createAdapter({ files: [] })

    await renderManager({ adapter })

    expect(document.body.textContent).toContain('This folder is empty')
  })

  it('accepts custom empty, loading and item renderers', async () => {
    await renderManager(
      { adapter: createAdapter({ files: [] }) },
      { empty: () => h('p', { id: 'custom-empty' }, 'Nothing') },
    )

    expect($('#custom-empty')).not.toBeNull()

    document.body.innerHTML = ''

    await renderManager(
      { defaultView: 'list' },
      { item: ({ entry }: any) => h('b', { class: 'custom-item' }, entry.name) },
    )

    expect($$('.custom-item').map((item) => item.textContent)).toContain('readme.md')
  })

  it('hides sections on request', async () => {
    await renderManager({
      sections: { sidebar: false, statusBar: false, breadcrumbs: false, search: false },
    })

    expect($('[role="status"]')).toBeNull()
    expect($('[role="navigation"]')).toBeNull()
    expect($('nav')).toBeNull()
    expect($('[data-fm-search]')).toBeNull()
  })

  it('keeps interface text replaceable', async () => {
    await renderManager({
      labels: { root: 'Dateien', itemsCount: (count: number) => `${count} Stk` },
    })

    expect($('[role="region"]')?.getAttribute('aria-label')).toBe('Dateien')
    expect($('[role="status"]')?.textContent).toContain('4 Stk')
  })

  it('applies the theme props as tokens, without touching behavior', async () => {
    await renderManager({ color: 'grape', folderColor: 'teal', radius: 'lg', itemSize: 'lg' })

    const root = $('[role="region"]')!

    expect(root.style.getPropertyValue('--fm-accent')).toContain('grape')
    expect(root.style.getPropertyValue('--fm-folder-color')).toContain('teal')
    expect(root.style.getPropertyValue('--fm-row-height')).toBe('52px')
    expect(rowNames()).toHaveLength(4)
  })
})

describe('capabilities in the interface', () => {
  const readOnly = (): FileSystemAdapter => ({
    list: async ({ folderId }) => ({
      folder: { id: folderId ?? 'root', name: 'Root', kind: 'folder', parentId: null },
      ancestors: [],
      items: [{ id: 'a', name: 'a.txt', kind: 'file', parentId: 'root' }],
    }),
  })

  it('removes every control the backend cannot honor', async () => {
    await renderManager({ adapter: readOnly() })

    for (const id of [
      'newFolder',
      'upload',
      'cut',
      'copy',
      'paste',
      'rename',
      'delete',
      'download',
    ]) {
      expect($(`[data-action="${id}"]`)).toBeNull()
    }

    expect($('[data-location="trash"]')).toBeNull()
    expect($('[data-location="favorites"]')).toBeNull()

    row('a.txt').dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    await flush()

    const items = $$('[role="menuitem"]').map((item) => item.textContent?.trim())

    expect(items).not.toContain('Rename')
    expect(items).not.toContain('Move to trash')
    expect(items).toContain('Properties')
  })

  it('offers an action turned off by the adapter nowhere', async () => {
    await renderManager({
      adapter: createAdapter({ capabilities: { rename: false, trash: false } }),
    })

    expect($('[data-action="rename"]')).toBeNull()
    expect($('[data-location="trash"]')).toBeNull()
  })

  it('disables what the permissions of the selection forbid', async () => {
    await renderManager()

    click(row('locked.txt'))
    await flush()

    expect(action('rename').disabled).toBe(true)
    expect(action('delete').disabled).toBe(true)
    expect(action('cut').disabled).toBe(true)
    expect(action('copy').disabled).toBe(false)
  })

  it('keeps upload controls away from read-only folders', async () => {
    const adapter = createAdapter({
      files: [{ id: 'ro', name: 'ro', permissions: { write: false }, children: [] }],
    })

    await renderManager({ adapter, defaultFolderId: 'ro' })

    expect(action('newFolder').disabled).toBe(true)
    expect(action('upload').disabled).toBe(true)
  })
})

describe('selection and keyboard', () => {
  const list = () => $<HTMLElement>('[data-sticky-offset]')!

  it('selects with the pointer', async () => {
    const { wrapper } = await renderManager()

    click(row('Photos'))
    await flush(1)
    click(row('readme.md'), { ctrlKey: true })
    await flush(1)

    expect($$('[data-entry-id][data-selected]')).toHaveLength(2)
    expect($('[role="status"]')?.textContent).toContain('2 selected')
    expect(row('Photos').getAttribute('aria-selected')).toBe('true')

    click(row('Documents'), { shiftKey: true })
    await flush(1)

    expect(fileManager(wrapper).emitted('update:selectedIds')?.at(-1)?.[0]).toEqual(
      expect.arrayContaining(['docs', 'photos']),
    )
  })

  it('moves the roving tab stop with the arrow keys', async () => {
    await renderManager()

    expect(row('Documents').tabIndex).toBe(0)
    expect(row('Photos').tabIndex).toBe(-1)

    row('Documents').focus()
    keydown(row('Documents'), 'ArrowDown')
    await flush(2)

    expect(row('Photos').getAttribute('aria-selected')).toBe('true')
    expect(row('Photos').tabIndex).toBe(0)
    expect(document.activeElement).toBe(row('Photos'))

    keydown(row('Photos'), 'ArrowDown', { shiftKey: true })
    await flush(2)

    expect($$('[data-entry-id][data-selected]')).toHaveLength(2)

    keydown(row('locked.txt'), 'End')
    await flush(2)

    expect(document.activeElement).toBe(row('readme.md'))

    keydown(row('readme.md'), 'Home')
    await flush(2)

    expect(document.activeElement).toBe(row('Documents'))
  })

  it('opens with Enter and goes up with Backspace', async () => {
    await renderManager()

    row('Documents').focus()
    keydown(row('Documents'), 'Enter')
    await flush()

    expect(rowNames()).toContain('report.pdf')

    keydown(list(), 'Backspace')
    await flush()

    expect(rowNames()).toContain('readme.md')
  })

  it('toggles with Space and clears with Escape', async () => {
    await renderManager()

    keydown(row('Documents'), ' ')
    await flush(1)
    expect($$('[data-selected][data-entry-id]')).toHaveLength(1)

    keydown(row('Documents'), 'Escape')
    await flush(1)
    expect($$('[data-selected][data-entry-id]')).toHaveLength(0)
  })

  it('finds entries by typing', async () => {
    await renderManager()

    keydown(row('Documents'), 'r')
    await flush(2)

    expect(document.activeElement).toBe(row('readme.md'))
  })

  it('moves in two dimensions in the grid layout', async () => {
    const original = HTMLElement.prototype.getBoundingClientRect

    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(private callback: ResizeObserverCallback) {}

        observe(target: Element) {
          this.callback([{ target, contentRect: { width: 1000, height: 400 } } as any], this as any)
        }

        disconnect() {}
        unobserve() {}
      },
    )

    await renderManager({ defaultView: 'grid' })
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await flush(2)

    expect($('[role="grid"]')?.getAttribute('aria-colcount')).toBe('7')

    keydown(row('Documents'), 'ArrowRight')
    await flush(2)

    expect(document.activeElement).toBe(row('Photos'))

    vi.unstubAllGlobals()
    HTMLElement.prototype.getBoundingClientRect = original
  })

  it('runs shortcuts from anywhere in the manager, but not while typing', async () => {
    await renderManager()

    click(row('readme.md'))
    row('readme.md').focus()
    await flush(1)

    keydown(row('readme.md'), 'a', { ctrlKey: true, code: 'KeyA' } as any)
    await flush(1)

    expect($$('[data-selected][data-entry-id]')).toHaveLength(4)

    const search = $<HTMLInputElement>('input[data-fm-search]')!

    click(row('Documents'))
    await flush(1)
    keydown(search, 'a', { ctrlKey: true, code: 'KeyA' } as any)
    await flush(1)

    expect($$('[data-selected][data-entry-id]')).toHaveLength(1)
  })

  it('turns shortcuts off', async () => {
    await renderManager({ shortcuts: false })

    click(row('readme.md'))
    await flush(1)
    keydown(row('readme.md'), 'Delete')
    await flush(2)

    expect($('[data-fm-submit]')).toBeNull()
  })

  it('expands folders with the tree layout keys', async () => {
    await renderManager({ defaultView: 'tree' })

    row('Documents').focus()
    keydown(row('Documents'), 'ArrowRight')
    await flush()

    expect(rowNames()).toContain('report.pdf')
    expect($$('[aria-level="2"]').length).toBeGreaterThan(0)
    expect(row('Documents').closest('[role="row"]')?.getAttribute('aria-expanded')).toBe('true')

    keydown(row('Documents'), 'ArrowLeft')
    await flush()

    expect(rowNames()).not.toContain('report.pdf')
  })
})

describe('layout switching', () => {
  it('keeps selection, filters and location', async () => {
    const { wrapper } = await renderManager({ defaultFilters: { categories: ['text', 'code'] } })

    expect(rowNames()).toEqual(['locked.txt', 'readme.md'])

    click(row('readme.md'))
    await flush(1)

    const { controller } = (fileManager(wrapper).vm as any).$.exposed

    for (const view of ['grid', 'gallery', 'list', 'tree', 'details']) {
      controller.view.value = view
      await flush(2)

      expect(row('readme.md').getAttribute('aria-selected')).toBe('true')
      expect(rowNames()).toEqual(['locked.txt', 'readme.md'])
    }

    expect(fileManager(wrapper).emitted('update:view')).toHaveLength(5)
  })

  it('renders custom views over the same entries', async () => {
    const Card = defineComponent({
      props: ['entry', 'selected', 'active', 'cut', 'depth'],
      setup: (props) => () => h('i', { class: 'card' }, props.entry.name),
    })

    await renderManager({
      defaultView: 'cards',
      views: [{ name: 'cards', layout: 'grid', rowHeight: 80, minItemWidth: 200, component: Card }],
    })

    expect($$('.card')).toHaveLength(4)

    click($('.card')!)
    await flush(1)

    expect($('[role="status"]')?.textContent).toContain('1 selected')
  })
})

describe('v-model', () => {
  it('follows controlled props and reports changes', async () => {
    const { wrapper } = await renderManager()

    click(row('readme.md'))
    await flush(1)

    expect(fileManager(wrapper).emitted('update:selectedIds')?.at(-1)).toEqual([['readme']])

    row('Documents').dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    await flush()

    expect(fileManager(wrapper).emitted('update:folderId')?.at(-1)).toEqual(['docs'])
    expect(fileManager(wrapper).emitted('locationChange')).toHaveLength(1)
  })

  it('accepts an external controller', async () => {
    const controller = useFileManager({ adapter: createAdapter() })
    const wrapper = mountWithProvider(FileManager, { controller })

    await flush()

    controller.selectAll()
    await nextTick()

    expect($('[role="status"]')?.textContent).toContain('4 selected')
    wrapper.unmount()
  })
})

describe('dialogs', () => {
  const nameInput = () => $<HTMLInputElement>('input[data-fm-name-input]')!
  const typeName = async (value: string) => {
    const input = nameInput()

    input.value = value
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await flush(2)
  }

  it('creates a folder through the dialog', async () => {
    await renderManager()

    action('newFolder').click()
    await flush()
    await typeName('Invoices')
    $('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await flush()

    expect(rowNames()).toContain('Invoices')
    expect(row('Invoices').getAttribute('aria-selected')).toBe('true')
  })

  it('validates names before anything reaches the backend', async () => {
    const onRequest = vi.fn()

    await renderManager({ adapter: createAdapter({ onRequest }) })

    action('newFolder').click()
    await flush()
    onRequest.mockClear()

    await typeName('a/b')
    $('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await flush(2)

    expect(document.body.textContent).toContain('characters that are not allowed')

    await typeName('photos')
    $('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await flush(2)

    expect(document.body.textContent).toContain('already exists')
    expect(onRequest).not.toHaveBeenCalled()
  })

  it('renames through the dialog with F2', async () => {
    await renderManager()

    click(row('readme.md'))
    row('readme.md').focus()
    await flush(1)
    keydown(row('readme.md'), 'F2')
    await flush()

    expect(nameInput().value).toBe('readme.md')

    await typeName('guide.md')
    $('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await flush()

    expect(rowNames()).toContain('guide.md')
  })

  it('asks before trashing and can be declined', async () => {
    await renderManager()

    click(row('readme.md'))
    row('readme.md').focus()
    await flush(1)
    action('delete').click()
    await flush()

    expect(document.body.textContent).toContain('Move 1 item to trash?')

    $$('[data-fm-submit]')
      .find((button) => button.textContent?.includes('Move to trash'))!
      .click()
    await flush()

    expect(rowNames()).not.toContain('readme.md')

    expect($('[data-status="success"]')?.textContent).toContain('1 item')
  })

  it('shows the conflict prompt during a paste', async () => {
    const { wrapper } = await renderManager({
      adapter: createAdapter({
        files: [
          { id: 'a', name: 'same.txt', content: 'x' },
          { id: 'f', name: 'folder', children: [{ id: 'b', name: 'same.txt', content: 'y' }] },
        ],
      }),
    })
    const { controller } = (fileManager(wrapper).vm as any).$.exposed

    click(row('same.txt'))
    await flush(1)
    action('cut').click()
    await flush(1)
    void controller.openFolder('f')
    await flush()

    action('paste').click()
    await flush()

    expect(document.body.textContent).toContain('folder already contains an item named same.txt')

    $('[data-fm-conflict="rename"]')!.click()
    await flush()

    expect(rowNames()).toEqual(expect.arrayContaining(['same.txt', 'same (2).txt']))
  })
})

describe('context menu', () => {
  const openMenu = async (element: Element) => {
    element.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    await flush()
  }

  const items = () =>
    $$('[role="menuitem"]').map((item) =>
      item.querySelector('[class*="itemLabel"]')?.textContent?.trim(),
    )

  it('offers entry actions on an entry and folder actions on the background', async () => {
    await renderManager()

    await openMenu(row('readme.md'))

    expect(items()).toEqual(expect.arrayContaining(['Open', 'Rename', 'Properties']))
    expect(row('readme.md').getAttribute('aria-selected')).toBe('true')

    keydown(document.body, 'Escape')
    await flush()
  })

  it('opens from the keyboard', async () => {
    await renderManager()

    row('readme.md').focus()
    keydown(row('readme.md'), 'ContextMenu')
    await flush()

    expect(items()).toContain('Rename')
  })

  it('runs custom actions and respects their predicates', async () => {
    const run = vi.fn()

    await renderManager({
      actions: [
        { id: 'share', label: 'Share', run, visible: ({ entries }: any) => entries.length === 1 },
      ],
      itemMenu: ['open', 'share'],
    })

    await openMenu(row('readme.md'))

    expect(items()).toEqual(['Open', 'Share'])

    $('[data-action="share"][role="menuitem"]')!.click()
    await flush()

    expect(run.mock.calls[0][0].entries[0].name).toBe('readme.md')
  })

  it('lets a built-in action be replaced', async () => {
    const run = vi.fn()

    await renderManager({ actions: [{ id: 'refresh', label: 'Sync', run }] })

    action('refresh').click()
    await flush(1)

    expect(run).toHaveBeenCalledTimes(1)
  })

  it('collapses dividers around hidden actions', () => {
    expect(
      collapseDividers(
        ['divider', 'a', 'divider', 'divider', 'b', 'divider'],
        (item) => item === 'divider',
      ),
    ).toEqual(['a', 'divider', 'b'])
  })

  it('resolves menus against the context', () => {
    const controller = useFileManager({ adapter: createAdapter({ capabilities: { copy: false } }) })
    const context: any = {
      controller,
      labels: mergeFileManagerLabels(undefined),
      ui: {},
      entries: [],
      scope: 'toolbar',
    }

    const resolved = resolveMenuItems(['copy', 'cut', 'unknown'], context, {
      actions: BUILT_IN_ACTION_MAP,
    })

    expect(resolved.map((item) => item.key)).toEqual(['cut'])
    expect(resolved[0].enabled).toBe(false)
  })
})

describe('sort and filter controls', () => {
  it('sorts from the table headers and exposes the state', async () => {
    await renderManager()

    const header = $('[data-sort="name"]')!

    expect(header.closest('th')?.getAttribute('aria-sort')).toBe('ascending')

    click(header)
    await flush(1)

    expect(header.closest('th')?.getAttribute('aria-sort')).toBe('descending')
    expect(rowNames()[0]).toBe('Photos')
  })

  it('opens the filters and applies them', async () => {
    await renderManager()

    action('filters').click()
    await flush()

    $<HTMLInputElement>('input[data-category="code"]')!.click()
    await flush(2)

    expect(rowNames()).toEqual([])
    expect(document.body.textContent).toContain('Nothing matches the filters')

    $('[data-action="clearFilters"]')!.click()
    await flush(2)

    expect(rowNames()).toHaveLength(4)
  })

  it('sorts from the menu', async () => {
    await renderManager()

    action('sort').click()
    await flush()
    $('[data-sort-field="size"]')!.click()
    await flush(2)

    expect($('[data-sort="size"]')?.closest('th')?.getAttribute('aria-sort')).toBe('ascending')
  })

  it('switches layouts from the menu', async () => {
    await renderManager()

    action('view').click()
    await flush()
    $('[role="menuitemradio"][data-view="gallery"]')!.click()
    await flush(2)

    expect($('[data-entry-id][data-view="gallery"]')).not.toBeNull()
  })

  it('searches after a short pause', async () => {
    await renderManager()

    const input = $<HTMLInputElement>('input[data-fm-search]')!

    input.value = 'old'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 300))
    await flush()

    expect(rowNames()).toEqual(['old.txt'])
  })
})

describe('preview', () => {
  const open = async (name: string) => {
    row(name).dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    await flush()
  }

  beforeEach(() => {
    let count = 0

    URL.createObjectURL = vi.fn(() => `blob:http://localhost/${(count += 1)}`)
    URL.revokeObjectURL = vi.fn()
  })

  it('renders text as text, never as markup', async () => {
    await renderManager({
      adapter: createAdapter({
        files: [{ name: 'page.html', content: '<img src=x onerror="alert(1)">' }],
      }),
    })

    await open('page.html')

    const preview = $('pre')!

    expect(preview.textContent).toContain('<img src=x')
    expect(preview.querySelector('img')).toBeNull()
  })

  it('forces the type of PDFs and revokes object urls', async () => {
    const { wrapper } = await renderManager({
      adapter: createAdapter({
        files: [{ name: 'a.pdf', content: new Blob(['<html></html>'], { type: 'text/html' }) }],
      }),
    })

    await open('a.pdf')

    expect($('object')?.getAttribute('type')).toBe('application/pdf')
    expect((URL.createObjectURL as any).mock.calls[0][0].type).toBe('application/pdf')

    const { controller } = (fileManager(wrapper).vm as any).$.exposed

    controller.closePreview()
    await flush()

    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1)
  })

  it('closes when the location changes', async () => {
    const { wrapper } = await renderManager()

    await open('readme.md')

    const { controller } = (fileManager(wrapper).vm as any).$.exposed

    await controller.openFolder('docs')
    await flush()

    expect(controller.previewEntry.value).toBeNull()
  })

  it('refuses unsafe urls', async () => {
    await renderManager({
      adapter: createAdapter({
        files: [{ name: 'a.png', url: UNSAFE_URL }],
      }),
    })

    await open('a.png')

    expect($('[data-fm-dialog] img, img[src^="javascript"]')).toBeNull()
    expect(document.body.textContent).toContain('The preview could not be loaded')
  })

  it('falls back for what it cannot render, without fetching it', async () => {
    const onRequest = vi.fn()

    await renderManager({
      adapter: createAdapter({ onRequest, files: [{ name: 'a.bin', content: 'x' }] }),
    })

    await open('a.bin')

    expect(document.body.textContent).toContain('No preview available')
    expect(onRequest.mock.calls.map(([operation]) => operation)).not.toContain('getPreview')
  })

  it('uses custom renderers first', async () => {
    const Csv = defineComponent({
      props: ['entry', 'source', 'url'],
      setup: (props) => () => h('table', { id: 'csv' }, props.source?.text),
    })

    await renderManager({
      adapter: createAdapter({ files: [{ name: 'a.csv', content: 'x,y' }] }),
      previewRenderers: [{ test: (entry: any) => entry.name.endsWith('.csv'), component: Csv }],
    })

    await open('a.csv')

    expect($('#csv')?.textContent).toBe('x,y')
  })

  it('steps through files', async () => {
    await renderManager()

    await open('readme.md')

    expect(document.body.textContent).toContain('2 of 2')

    action('previousFile').click()
    await flush()

    expect(document.body.textContent).toContain('1 of 2')
  })
})

describe('responsive layout', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('moves panes to drawers and shows a selection bar', async () => {
    await renderManager({ layout: 'compact' })

    expect($('[data-compact]')).not.toBeNull()
    expect($$('[role="navigation"]')).toHaveLength(0)

    click(row('readme.md'))
    await flush(2)

    expect(document.body.textContent).toContain('1 selected')
    expect($('[class*="selectionBar"]')).not.toBeNull()
    expect($('[class*="selectionBar"] [data-action="download"]')).not.toBeNull()

    action('toggleSidebar').click()
    await flush()

    expect($('[role="navigation"]')).not.toBeNull()
  })

  it('measures the component in auto mode', async () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(private callback: ResizeObserverCallback) {}

        observe(target: Element) {
          this.callback([{ target, contentRect: { width: 400, height: 600 } } as any], this as any)
        }

        disconnect() {}
        unobserve() {}
      },
    )

    await renderManager()
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await flush()

    expect($('[data-compact]')).not.toBeNull()
  })

  it('opens entries with a tap and selects with a long press', async () => {
    await renderManager({ layout: 'compact', defaultView: 'list' })

    const touch = (type: string, element: Element) => {
      const event = new Event(type, { bubbles: true, cancelable: true })

      Object.assign(event, { touches: [{ clientX: 0, clientY: 0 }], changedTouches: [] })
      element.dispatchEvent(event)
    }

    touch('touchstart', row('Photos'))
    await new Promise((resolve) => setTimeout(resolve, 500))
    touch('touchend', row('Photos'))
    await flush(2)

    expect(row('Photos').getAttribute('aria-selected')).toBe('true')

    // The tap that belongs to the long press does not act, the next one toggles.
    click(row('Photos'))
    await flush(2)
    click(row('readme.md'))
    await flush(2)

    expect($$('[data-entry-id][data-selected]')).toHaveLength(2)

    click($('[class*="selectionBar"] button')!)
    await flush(2)

    const target = row('Documents')

    target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }))
    click(target)
    await flush()

    expect(rowNames()).toContain('report.pdf')
  })

  it('keeps every action reachable in the overflow menu', async () => {
    await renderManager({ layout: 'compact' })

    action('more').click()
    await flush()

    const items = $$('[role="menuitem"]').map((item) => item.textContent?.trim())

    expect(items).toEqual(expect.arrayContaining(['New folder', 'Upload', 'Refresh', 'Select all']))
  })
})

describe('virtualization', () => {
  const files = Array.from({ length: 5000 }, (_, index) => ({
    id: `f${index}`,
    name: `file ${index}.txt`,
    size: index,
  }))

  it('renders a bounded window of a large folder', async () => {
    await renderManager({ adapter: createAdapter({ files }) })

    expect($$('[data-entry-id]').length).toBeLessThanOrEqual(40)
    expect($('[role="grid"]')?.getAttribute('aria-rowcount')).toBe('5001')
    expect($('[role="status"]')?.textContent).toContain('5000 items')
  })

  it('can be turned off', async () => {
    await renderManager({
      adapter: createAdapter({ files: files.slice(0, 120) }),
      virtualize: false,
    })

    expect($$('[data-entry-id]')).toHaveLength(120)
  })

  it('computes the window from the scroll position', () => {
    const element = document.createElement('div')

    Object.defineProperty(element, 'clientHeight', { value: 100 })

    const host = defineComponent({
      setup() {
        const rows = useVirtualRows({
          container: { value: element } as any,
          count: () => 1000,
          rowHeight: () => 10,
          enabled: () => true,
          overscan: 2,
        })

        return () => h('div', JSON.stringify(rows.range.value))
      },
    })

    const wrapper = mountWithProvider(host)

    expect(wrapper.text()).toContain('"start":0')
  })
})

describe('drag and drop', () => {
  const drag = (type: string, element: Element, init: EventInit & { ctrlKey?: boolean } = {}) => {
    const event = new Event(type, { bubbles: true, cancelable: true })

    Object.assign(event, {
      ctrlKey: !!init.ctrlKey,
      dataTransfer: { types: [], setData() {}, effectAllowed: '', dropEffect: '' },
    })
    element.dispatchEvent(event)

    return event
  }

  const treeNode = (name: string) =>
    $$('[role="tree"] [data-label]').find((node) => node.textContent === name)!

  it('moves entries onto a folder row', async () => {
    const { adapter } = await renderManager()

    drag('dragstart', row('readme.md'))
    await flush(1)

    const over = drag('dragover', row('Photos'))

    await flush(1)

    expect(over.defaultPrevented).toBe(true)
    expect(row('Photos').hasAttribute('data-drop-target')).toBe(true)

    drag('drop', row('Photos'))
    await flush()

    expect(adapter.findByPath('/Photos/readme.md')).toBeDefined()
    expect(rowNames()).not.toContain('readme.md')
  })

  it('copies onto the folder tree while Ctrl is held', async () => {
    const { adapter } = await renderManager()

    drag('dragstart', row('readme.md'))
    await flush(1)
    drag('dragover', treeNode('Photos'), { ctrlKey: true })
    await flush(1)
    drag('drop', treeNode('Photos'), { ctrlKey: true })
    await flush()

    expect(adapter.findByPath('/Photos/readme.md')).toBeDefined()
    expect(rowNames()).toContain('readme.md')
  })

  it('moves onto a breadcrumb', async () => {
    const { adapter, wrapper } = await renderManager()
    const { controller } = (fileManager(wrapper).vm as any).$.exposed

    await controller.openFolder('docs')
    await flush()

    const home = $$('nav button').find((button) => button.textContent?.includes('Home'))!

    drag('dragstart', row('notes.txt'))
    await flush(1)
    drag('dragover', home)
    drag('drop', home)
    await flush()

    expect(adapter.findByPath('/notes.txt')).toBeDefined()
  })

  it('refuses to drop a folder onto itself and read-only folders', async () => {
    const onRequest = vi.fn()

    await renderManager({
      adapter: createAdapter({
        onRequest,
        files: [
          { id: 'a', name: 'a', children: [] },
          { id: 'ro', name: 'ro', permissions: { write: false }, children: [] },
        ],
      }),
    })

    drag('dragstart', row('a'))
    await flush(1)

    for (const target of ['a', 'ro']) {
      drag('dragover', row(target))
      await flush(1)

      expect(row(target).hasAttribute('data-drop-target')).toBe(false)

      drag('drop', row(target))
      await flush(2)

      expect(rowNames()).toContain('a')
    }

    expect(onRequest.mock.calls.map(([operation]) => operation)).not.toContain('move')
  })

  it('does not start a drag in the trash or the compact layout', async () => {
    await renderManager({ layout: 'compact' })

    expect(row('readme.md').getAttribute('draggable')).toBe('false')
  })
})

describe('uploads in the interface', () => {
  const drop = (file: File) => {
    const event = new Event('drop', { bubbles: true, cancelable: true })

    Object.defineProperty(event, 'dataTransfer', {
      value: { files: [file], types: ['Files'], items: [] },
    })
    $('[class*="dropzone"]')!.dispatchEvent(event)
  }

  it('refuses drops into a read-only folder with an explanation', async () => {
    const onRequest = vi.fn()

    await renderManager({
      defaultFolderId: 'ro',
      adapter: createAdapter({
        onRequest,
        files: [{ id: 'ro', name: 'ro', permissions: { write: false }, children: [] }],
      }),
    })

    drop(new File(['x'], 'a.txt'))
    await new Promise((resolve) => setTimeout(resolve, 50))
    await flush()

    expect(onRequest.mock.calls.map(([operation]) => operation)).not.toContain('upload')
    expect($('[data-status="error"]')?.textContent).toContain('permission')
  })

  it('uploads through a drop and shows the queue', async () => {
    await renderManager()

    const zone = $('[class*="dropzone"]')!
    const file = new File(['hello'], 'dropped.txt', { type: 'text/plain' })
    const drop = new Event('drop', { bubbles: true, cancelable: true })

    Object.defineProperty(drop, 'dataTransfer', {
      value: { files: [file], types: ['Files'], items: [] },
    })
    zone.dispatchEvent(drop)

    await vi.waitFor(() => expect(rowNames()).toContain('dropped.txt'), { timeout: 5000 })

    expect($('[role="region"][aria-label="Uploads"]')?.textContent).toContain('dropped.txt')
  })

  it('cancels and removes items from the panel', async () => {
    const { wrapper } = await renderManager({ adapter: createAdapter({ latency: 30 }) })
    const { controller } = (fileManager(wrapper).vm as any).$.exposed

    await vi.waitFor(() => expect(rowNames()).toHaveLength(4), { timeout: 5000 })

    controller.upload([new File(['x'], 'a.txt')])
    await flush(2)

    action('cancelUpload').click()

    await vi.waitFor(() => expect($('[data-status="canceled"]')).not.toBeNull(), { timeout: 5000 })

    action('removeUpload').click()
    await flush()

    expect($('[data-status="canceled"]')).toBeNull()
  })
})
