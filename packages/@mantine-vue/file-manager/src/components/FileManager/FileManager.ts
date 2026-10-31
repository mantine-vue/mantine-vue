import { factory } from '@mantine-vue/core'
import FileManagerComponent from './FileManager.vue'
import type { FileManagerFactory } from './FileManager.types'
import classes from './FileManager.module.css'

export const FileManager = factory<FileManagerFactory>(FileManagerComponent, { classes })

export type {
  FileManagerCssVariables,
  FileManagerEmits,
  FileManagerExposed,
  FileManagerFactory,
  FileManagerLayout,
  FileManagerOwnProps,
  FileManagerProps,
  FileManagerSlots,
  FileManagerStylesNames,
} from './FileManager.types'
