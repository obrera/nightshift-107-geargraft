import { createBrowserRouter } from 'react-router'

import type { ShellNotFoundProps } from '@/shell/data-access/shell-not-found-props'

import { ShellFeature, ShellUiLoader } from '@/shell/feature'

export const appRouter = createBrowserRouter(
  [
    {
      children: [
        {
          index: true,
          lazy: () => import('@/geargraft/feature/geargraft-feature-workbench'),
        },
        {
          lazy: () => import('@/about/feature/about-feature'),
          path: 'about',
        },
        {
          lazy: () => import('@/wallet/feature/wallet-feature'),
          path: 'wallet',
        },
        {
          lazy: () => import('@/shell/feature/shell-not-found-feature'),
          loader: (): ShellNotFoundProps => ({
            links: [
              {
                description: 'Open the GearGraft forge workbench for recipe crafting and MPL Core minting.',
                title: 'GearGraft',
                to: '/',
              },
              {
                description: 'Open the wallet screen if you were looking for connection and signing tools.',
                title: 'Wallet',
                to: '/wallet',
              },
            ],
          }),
          path: '*',
        },
      ],
      element: (
        <ShellFeature
          links={[
            { label: 'Workbench', to: '/' },
            { label: 'Wallet', to: '/wallet' },
            { label: 'About', to: '/about' },
          ]}
        />
      ),
      hydrateFallbackElement: <ShellUiLoader fullScreen />,
    },
  ],
  {
    // Set the base URL for router links and redirects, removing trailing slashes if present, independent of the base
    basename: import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL.replace(/\/$/, ''),
  },
)
