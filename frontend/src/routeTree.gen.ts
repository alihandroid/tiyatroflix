/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as PlaysRouteImport } from './routes/plays'
import { Route as IndexRouteImport } from './routes/index'
import { Route as PlaysIdRouteImport } from './routes/plays_.$id'

const PlaysRoute = PlaysRouteImport.update({
  id: '/plays',
  path: '/plays',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const PlaysIdRoute = PlaysIdRouteImport.update({
  id: '/plays_/$id',
  path: '/plays/$id',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/plays': typeof PlaysRoute
  '/plays/$id': typeof PlaysIdRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/plays': typeof PlaysRoute
  '/plays/$id': typeof PlaysIdRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/plays': typeof PlaysRoute
  '/plays_/$id': typeof PlaysIdRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/plays' | '/plays/$id'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/plays' | '/plays/$id'
  id: '__root__' | '/' | '/plays' | '/plays_/$id'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  PlaysRoute: typeof PlaysRoute
  PlaysIdRoute: typeof PlaysIdRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/plays': {
      id: '/plays'
      path: '/plays'
      fullPath: '/plays'
      preLoaderRoute: typeof PlaysRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/plays_/$id': {
      id: '/plays_/$id'
      path: '/plays/$id'
      fullPath: '/plays/$id'
      preLoaderRoute: typeof PlaysIdRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  PlaysRoute: PlaysRoute,
  PlaysIdRoute: PlaysIdRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
