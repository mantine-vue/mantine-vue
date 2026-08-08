import { getPath } from '../utils/get-path'
import {
  DOCGEN_EXCLUDE_COMPONENTS,
  DOCGEN_EXCLUDE_FILES,
  DOCGEN_EXCLUDE_PROPS,
  DOCGEN_INCLUDE_PATHS,
  DOCGEN_SOURCE_PATHS,
  DOCGEN_TYPES_REPLACEMENT,
} from './docgen-paths'
import { generateDeclarations } from './generate-declarations'

const args = process.argv.slice(2)

function getFlag(name: string) {
  const flag = args.find((argument) => argument.startsWith(`--${name}=`))
  return flag?.split('=').slice(1).join('=')
}

// `yarn docgen core charts` regenerates only the listed packages and keeps the
// rest of docgen.json intact.
const packages = args.filter((argument) => !argument.startsWith('--'))

// `yarn docgen --only=Button,ButtonGroup` narrows the run to specific components.
const components = getFlag('only')?.split(',').filter(Boolean)

// `yarn docgen --chunk-size=5`.
const chunkSizeFlag = getFlag('chunk-size')
const chunkSize = chunkSizeFlag ? Number(chunkSizeFlag) : undefined

generateDeclarations({
  tsConfigPath: getPath('tsconfig.json'),
  outputPath: getPath('apps/mantine.dev/src/.docgen'),
  sourcePaths: DOCGEN_SOURCE_PATHS,
  includePaths: DOCGEN_INCLUDE_PATHS,
  excludeProps: DOCGEN_EXCLUDE_PROPS,
  excludeComponents: DOCGEN_EXCLUDE_COMPONENTS,
  excludeFiles: DOCGEN_EXCLUDE_FILES,
  typesReplacement: DOCGEN_TYPES_REPLACEMENT,
  packages,
  components,
  chunkSize,
})
