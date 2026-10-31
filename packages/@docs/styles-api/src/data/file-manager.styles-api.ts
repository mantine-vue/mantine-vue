import type { StylesApiData } from '../types'

const FILE_MANAGER_VARS = {
  '--fm-accent': 'Controls color of selection, focus and active items',
  '--fm-accent-light': 'Controls background of selected items',
  '--fm-folder-color': 'Controls color of folder icons',
  '--fm-radius': 'Controls `border-radius` of items and panels',
  '--fm-row-height': 'Controls height of table header and rows',
}

export const FileManagerStylesApi: StylesApiData<
  | 'root'
  | 'portal'
  | 'dropzone'
  | 'dropOverlay'
  | 'toolbar'
  | 'toolbarStart'
  | 'toolbarActions'
  | 'toolbarEnd'
  | 'search'
  | 'breadcrumbs'
  | 'body'
  | 'sidebar'
  | 'sidebarSection'
  | 'sidebarLabel'
  | 'quickLink'
  | 'treeNode'
  | 'main'
  | 'scroller'
  | 'row'
  | 'item'
  | 'itemIcon'
  | 'itemName'
  | 'itemMeta'
  | 'itemControl'
  | 'table'
  | 'detailsPanel'
  | 'selectionBar'
  | 'statusBar'
  | 'pagination'
  | 'uploadPanel'
  | 'uploadItem'
  | 'notices'
  | 'previewBody'
  | 'previewText'
  | 'state'
> = {
  selectors: {
    root: 'Root element',
    portal: 'Dialogs and drawers, which render outside of the root',
    dropzone: 'Wrapper of the parts that accepts dropped files',
    dropOverlay: 'Hint shown while files are dragged over the manager',
    toolbar: 'Toolbar with the breadcrumbs below it',
    toolbarStart: 'Row of toolbar controls',
    toolbarActions: 'Action buttons, which collapse into a menu as space runs out',
    toolbarEnd: 'Search, filters, sort and layout controls',
    search: 'Search input',
    breadcrumbs: 'Location breadcrumbs',
    body: 'Row of panes',
    sidebar: 'Navigation pane',
    sidebarSection: 'Section of the navigation pane',
    sidebarLabel: 'Heading of a section of the navigation pane',
    quickLink: 'Link to home, favorites, recent or the trash',
    treeNode: 'Folder of the folder tree',
    main: 'Content area, including pagination',
    scroller: 'Scrolling element of the content area',
    row: 'Row of the grid, gallery, list and tree layouts',
    item: 'Entry of the grid, gallery, list and tree layouts',
    itemIcon: 'Icon or thumbnail of an entry',
    itemName: 'Name of an entry',
    itemMeta: 'Secondary text of an entry',
    itemControl: 'Checkbox, menu button or expander of an entry',
    table: 'Table of the details layout',
    detailsPanel: 'Details pane',
    selectionBar: 'Action bar of the compact layout',
    statusBar: 'Summary below the content',
    pagination: 'Pager of the `pages` pagination',
    uploadPanel: 'Floating upload queue',
    uploadItem: 'File of the upload queue',
    notices: 'Stack of feedback messages',
    previewBody: 'Content of the preview',
    previewText: 'Text of a text or code preview',
    state: 'Empty, loading and error states',
  },
  vars: {
    root: FILE_MANAGER_VARS,
    portal: FILE_MANAGER_VARS,
  },
  modifiers: [
    { modifier: 'data-compact', selector: 'root', condition: 'The compact layout is active' },
    { modifier: 'data-entry-id', selector: 'item', condition: 'Always, holds the id of the entry' },
    { modifier: 'data-kind', selector: 'item', condition: 'Always, `file` or `folder`' },
    { modifier: 'data-category', selector: 'item', condition: 'Always, the category of the entry' },
    { modifier: 'data-view', selector: 'item', condition: 'Always, the name of the active layout' },
    { modifier: 'data-card', selector: 'item', condition: 'The layout draws cards' },
    { modifier: 'data-selected', selector: 'item', condition: 'The entry is selected' },
    { modifier: 'data-cut', selector: 'item', condition: 'The entry waits on the clipboard' },
    { modifier: 'data-drop-target', selector: 'item', condition: 'A drag is hovering the entry' },
    { modifier: 'data-category', selector: 'itemIcon', condition: 'Always, the category' },
    { modifier: 'data-thumbnail', selector: 'itemIcon', condition: 'A thumbnail is shown' },
    { modifier: 'data-active', selector: 'quickLink', condition: 'The location is open' },
    { modifier: 'data-location', selector: 'quickLink', condition: 'Always, the location type' },
    { modifier: 'data-status', selector: 'uploadItem', condition: 'Always, the upload status' },
    { modifier: 'data-view', selector: 'scroller', condition: 'Always, the name of the layout' },
    { modifier: 'data-visible', selector: 'itemControl', condition: 'The checkbox stays visible' },
    { modifier: 'data-expanded', selector: 'itemControl', condition: 'The folder is expanded' },
  ],
}
