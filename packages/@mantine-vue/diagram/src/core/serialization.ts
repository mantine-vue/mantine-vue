import { isFiniteNumber } from './geometry'
import { DIAGRAM_SCHEMA_VERSION } from './store'
import type { DiagramDocument, DiagramEdgeEndpoint } from './types'

export interface DiagramValidationIssue {
  /** JSON path of the problem, e.g. `nodes[3].width` */
  path: string
  message: string
  severity: 'error' | 'warning'
}

/** Upgrades a raw document from `version` to `version + 1`. */
export interface DiagramMigration {
  version: number
  migrate: (document: Record<string, any>) => Record<string, any>
}

export interface ParseDiagramOptions {
  /** Migrations for documents saved with older schema versions */
  migrations?: readonly DiagramMigration[]
  /** Treat warnings as errors */
  strict?: boolean
}

export type ParseDiagramResult =
  | { ok: true; document: DiagramDocument; issues: DiagramValidationIssue[] }
  | { ok: false; document: null; issues: DiagramValidationIssue[] }

const isObject = (value: unknown): value is Record<string, any> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Validates the structure of a document: types of required fields, unique ids and references
 * between edges, groups and layers. Unknown fields are allowed.
 */
export function validateDiagram(value: unknown): DiagramValidationIssue[] {
  const issues: DiagramValidationIssue[] = []
  const error = (path: string, message: string) => issues.push({ path, message, severity: 'error' })
  const warning = (path: string, message: string) =>
    issues.push({ path, message, severity: 'warning' })

  if (!isObject(value)) {
    error('', 'Document must be an object')
    return issues
  }

  if (!isFiniteNumber(value.version)) {
    error('version', 'Version must be a number')
  } else if (value.version > DIAGRAM_SCHEMA_VERSION) {
    error(
      'version',
      `Version ${value.version} is newer than the supported ${DIAGRAM_SCHEMA_VERSION}`,
    )
  }

  if (!Array.isArray(value.nodes)) {
    error('nodes', 'Nodes must be an array')
  }

  if (!Array.isArray(value.edges)) {
    error('edges', 'Edges must be an array')
  }

  const ids = new Set<string>()
  const nodeIds = new Set<string>()
  const layerIds = new Set<string>()

  if (value.layers !== undefined) {
    if (!Array.isArray(value.layers)) {
      error('layers', 'Layers must be an array')
    } else {
      value.layers.forEach((layer: unknown, index: number) => {
        const path = `layers[${index}]`

        if (!isObject(layer) || typeof layer.id !== 'string' || !layer.id) {
          error(path, 'Layer needs a string id')
          return
        }

        if (layerIds.has(layer.id)) {
          error(`${path}.id`, `Duplicate layer id "${layer.id}"`)
        }

        layerIds.add(layer.id)

        if (typeof layer.name !== 'string') {
          warning(`${path}.name`, 'Layer name should be a string')
        }
      })
    }
  }

  const checkLayer = (path: string, layerId: unknown) => {
    if (layerId !== undefined && (typeof layerId !== 'string' || !layerIds.has(layerId))) {
      warning(`${path}.layerId`, `Unknown layer "${String(layerId)}", the first layer is used`)
    }
  }

  if (Array.isArray(value.nodes)) {
    value.nodes.forEach((node: unknown, index: number) => {
      const path = `nodes[${index}]`

      if (!isObject(node)) {
        error(path, 'Node must be an object')
        return
      }

      if (typeof node.id !== 'string' || !node.id) {
        error(`${path}.id`, 'Node needs a string id')
      } else if (ids.has(node.id)) {
        error(`${path}.id`, `Duplicate id "${node.id}"`)
      } else {
        ids.add(node.id)
        nodeIds.add(node.id)
      }

      if (typeof node.type !== 'string' || !node.type) {
        error(`${path}.type`, 'Node needs a type')
      }

      for (const field of ['x', 'y', 'width', 'height'] as const) {
        if (!isFiniteNumber(node[field])) {
          error(`${path}.${field}`, `${field} must be a finite number`)
        }
      }

      if (isFiniteNumber(node.width) && node.width < 0) {
        error(`${path}.width`, 'Width cannot be negative')
      }

      if (isFiniteNumber(node.height) && node.height < 0) {
        error(`${path}.height`, 'Height cannot be negative')
      }

      if (node.rotation !== undefined && !isFiniteNumber(node.rotation)) {
        error(`${path}.rotation`, 'Rotation must be a finite number')
      }

      if (node.ports !== undefined) {
        if (!Array.isArray(node.ports)) {
          error(`${path}.ports`, 'Ports must be an array')
        } else {
          node.ports.forEach((port: unknown, portIndex: number) => {
            if (
              !isObject(port) ||
              typeof port.id !== 'string' ||
              !isFiniteNumber(port.x) ||
              !isFiniteNumber(port.y)
            ) {
              error(`${path}.ports[${portIndex}]`, 'Port needs an id and numeric x and y')
            }
          })
        }
      }

      checkLayer(path, node.layerId)
    })

    value.nodes.forEach((node: any, index: number) => {
      if (isObject(node) && node.parentId !== undefined && !nodeIds.has(node.parentId)) {
        warning(`nodes[${index}].parentId`, `Unknown parent "${String(node.parentId)}"`)
      }
    })

    // Group cycles would make every traversal loop forever.
    const parents = new Map<string, string>()
    value.nodes.forEach((node: any) => {
      if (isObject(node) && typeof node.id === 'string' && typeof node.parentId === 'string') {
        parents.set(node.id, node.parentId)
      }
    })

    for (const start of parents.keys()) {
      const seen = new Set([start])
      let current = parents.get(start)

      while (current) {
        if (seen.has(current)) {
          error('nodes', `Group cycle through "${start}"`)
          break
        }

        seen.add(current)
        current = parents.get(current)
      }
    }
  }

  if (Array.isArray(value.edges)) {
    value.edges.forEach((edge: unknown, index: number) => {
      const path = `edges[${index}]`

      if (!isObject(edge)) {
        error(path, 'Edge must be an object')
        return
      }

      if (typeof edge.id !== 'string' || !edge.id) {
        error(`${path}.id`, 'Edge needs a string id')
      } else if (ids.has(edge.id)) {
        error(`${path}.id`, `Duplicate id "${edge.id}"`)
      } else {
        ids.add(edge.id)
      }

      for (const end of ['source', 'target'] as const) {
        const endpoint = edge[end] as DiagramEdgeEndpoint | undefined

        if (!isObject(endpoint)) {
          error(`${path}.${end}`, `${end} must be an object`)
          continue
        }

        if (endpoint.nodeId !== undefined) {
          if (!nodeIds.has(endpoint.nodeId)) {
            error(`${path}.${end}.nodeId`, `Unknown node "${String(endpoint.nodeId)}"`)
          }
        } else if (
          !isObject(endpoint.point) ||
          !isFiniteNumber(endpoint.point.x) ||
          !isFiniteNumber(endpoint.point.y)
        ) {
          error(`${path}.${end}`, 'Endpoint needs a nodeId or a point')
        }
      }

      if (edge.waypoints !== undefined) {
        const valid =
          Array.isArray(edge.waypoints) &&
          edge.waypoints.every(
            (p: any) => isObject(p) && isFiniteNumber(p.x) && isFiniteNumber(p.y),
          )

        if (!valid) {
          error(`${path}.waypoints`, 'Waypoints must be an array of points')
        }
      }

      checkLayer(path, edge.layerId)
    })
  }

  return issues
}

/** Upgrades a raw document to the current schema version. */
export function migrateDiagram(
  value: Record<string, any>,
  migrations: readonly DiagramMigration[] = [],
): Record<string, any> {
  let document = value
  let version = isFiniteNumber(document.version) ? document.version : 0

  while (version < DIAGRAM_SCHEMA_VERSION) {
    const migration = migrations.find((item) => item.version === version)

    if (migration) {
      document = migration.migrate(document)
    } else if (version !== 0) {
      throw new Error(`[@mantine-vue/diagram] No migration from schema version ${version}`)
    }

    version += 1
    document = { ...document, version }
  }

  return document
}

/** Parses, migrates and validates a document from JSON text or a plain object. */
export function parseDiagram(
  input: string | unknown,
  options: ParseDiagramOptions = {},
): ParseDiagramResult {
  let raw: unknown = input

  if (typeof input === 'string') {
    try {
      raw = JSON.parse(input)
    } catch (error) {
      return {
        ok: false,
        document: null,
        issues: [
          { path: '', message: `Invalid JSON: ${(error as Error).message}`, severity: 'error' },
        ],
      }
    }
  }

  if (!isObject(raw)) {
    return {
      ok: false,
      document: null,
      issues: [{ path: '', message: 'Document must be an object', severity: 'error' }],
    }
  }

  let migrated: Record<string, any>

  try {
    migrated = migrateDiagram(
      { nodes: [], edges: [], ...raw, version: raw.version ?? 0 },
      options.migrations,
    )
  } catch (error) {
    return {
      ok: false,
      document: null,
      issues: [{ path: 'version', message: (error as Error).message, severity: 'error' }],
    }
  }

  const issues = validateDiagram(migrated)
  const failed = issues.some(
    (issue) => issue.severity === 'error' || (options.strict && issue.severity === 'warning'),
  )

  return failed
    ? { ok: false, document: null, issues }
    : { ok: true, document: migrated as DiagramDocument, issues }
}

/** Serializes a document to JSON. `undefined` fields are dropped. */
export function serializeDiagram(document: DiagramDocument, space?: number) {
  return JSON.stringify({ ...document, version: DIAGRAM_SCHEMA_VERSION }, null, space)
}
