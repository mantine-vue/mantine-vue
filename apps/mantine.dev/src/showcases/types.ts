import type { RouteRecordRaw } from 'vue-router'

/** Metadata + routes contributed by one showcase to the documentation site. */
export interface ShowcaseDefinition {
  /** Folder name and stable identifier, e.g. `restaurant-qr-menu`. */
  id: string
  /** Entry route of the showcase. */
  path: string
  title: string
  description: string
  tags: string[]
  /** Cover image shown on the showcases index page. */
  cover: string
  /**
   * Route records registered in the docs router. Routes with `meta.standalone`
   * render without the docs shell so the showcase can provide its own providers.
   */
  routes: RouteRecordRaw[]
}

declare module 'vue-router' {
  interface RouteMeta {
    /** Render the route outside of the docs providers / shell. */
    standalone?: boolean
  }
}
