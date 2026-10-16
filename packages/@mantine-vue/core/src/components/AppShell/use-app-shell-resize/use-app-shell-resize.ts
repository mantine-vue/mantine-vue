import { computed, reactive, ref, shallowReactive, toValue, type MaybeRefOrGetter } from 'vue'
import type {
  AppShellResizeController,
  AppShellResizeSection,
  AppShellResizeSectionController,
  AppShellResizeSizes,
  UseAppShellResizeInput,
} from '../AppShell.types'
import { RESIZE_SECTION_NAMES } from './resize-section-config'

export type UseAppShellResizeOptions = {
  [Key in keyof UseAppShellResizeInput]?: MaybeRefOrGetter<UseAppShellResizeInput[Key]>
}

export function useAppShellResize(input: UseAppShellResizeOptions = {}): AppShellResizeController {
  const sizes = reactive<AppShellResizeSizes>({})
  const touched = reactive<Partial<Record<AppShellResizeSection, boolean>>>({})
  const activeSection = ref<AppShellResizeSection | null>(null)
  const collapsed: Partial<Record<AppShellResizeSection, boolean>> = {}
  const getInput = <K extends keyof UseAppShellResizeInput>(key: K) =>
    toValue(input[key]) as UseAppShellResizeInput[K]

  const resolvedSizes = computed(() => {
    const result: AppShellResizeSizes = {}
    const initial = getInput('initialSizes')
    RESIZE_SECTION_NAMES.forEach((section) => {
      if (sizes[section] !== undefined) result[section] = sizes[section]
      else if (!touched[section] && initial?.[section] !== undefined)
        result[section] = initial[section]
    })
    return result
  })

  const commitSize = (section: AppShellResizeSection, size: number) => {
    touched[section] = true
    sizes[section] = size
  }
  const clearSize = (section: AppShellResizeSection) => {
    touched[section] = true
    delete sizes[section]
  }
  const sectionController = (section: AppShellResizeSection): AppShellResizeSectionController =>
    reactive({
      enabled: computed(() => getInput(section) !== undefined),
      size: computed(() => resolvedSizes.value[section]),
      active: computed(() => activeSection.value === section),
      setSize: (size: number) => commitSize(section, size),
      reset: () => clearSize(section),
    }) as unknown as AppShellResizeSectionController

  const controller = shallowReactive({
    navbar: sectionController('navbar'),
    aside: sectionController('aside'),
    header: sectionController('header'),
    footer: sectionController('footer'),
    sizes: computed(() => resolvedSizes.value),
    resetAll: () => {
      RESIZE_SECTION_NAMES.forEach((section) => {
        touched[section] = true
        delete sizes[section]
      })
    },
    options: computed(() => ({
      navbar: getInput('navbar'),
      aside: getInput('aside'),
      header: getInput('header'),
      footer: getInput('footer'),
    })),
    activeSection,
    startResize: (section: AppShellResizeSection) => {
      activeSection.value = section
    },
    previewResize: (section: AppShellResizeSection, size: number) => {
      getInput('onResize')?.({ ...resolvedSizes.value, [section]: size })
    },
    endResize: (section: AppShellResizeSection, size: number | null) => {
      activeSection.value = null
      delete collapsed[section]
      if (size === null) return
      commitSize(section, size)
      getInput('onResizeEnd')?.({ ...resolvedSizes.value, [section]: size })
    },
    initCollapse: (section: AppShellResizeSection, value: boolean) => {
      collapsed[section] = value
    },
    reportCollapse: (section: AppShellResizeSection, value: boolean) => {
      if (collapsed[section] === value) return
      collapsed[section] = value
      getInput('onCollapseChange')?.(section, value)
    },
  })

  return controller as unknown as AppShellResizeController
}
