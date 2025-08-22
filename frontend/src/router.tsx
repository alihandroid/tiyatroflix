import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

export const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProvider.getContext(),
    // auth will be passed down from App component
    auth: undefined!,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultViewTransition: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
