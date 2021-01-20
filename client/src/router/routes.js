// eslint-disable-next-line no-unused-vars
export default function ({store, ssrContext}) {
  const routes = [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('pages/Index.vue')
        },
        {
          path: '/catalog',
          name: 'catalog',
          component: () => import('pages/Catalog/Catalog.vue')
        },
        {
          path: '/lineups',
          name: 'lineups',
          component: () => import('../components/lineups/pages/ProductLineups')
        },
        {
          path: '/subscriptions',
          name: 'subscriptions',
          component: () => import('pages/Subscriptions/Subscriptions.vue')
        },
        {
          path: '/schedule',
          name: 'schedule',
          component: () => import('pages/Schedule/Schedule.vue')
        },
        {
          path: '/account',
          name: 'vendor-account',
          component: () => import('../components/vendor/pages/VendorSettings')
        },
        {
          path: '/marketplaces',
          name: 'marketplaces',
          component: () => import('components/marketplace/pages/Marketplaces')
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('pages/Profile')
        },
        {
          path: '/profile/:nav',
          name: 'profile-page',
          component: () => import('pages/Profile'),
        }
      ]
    },
    {
      path: '/shop/:marketplace',
      name: 'marketplace',
      component: () => import('../layouts/MarketplaceLayout'),
      children: [
        {
          path: '',
          name: 'marketplace-home',
          component: () => import('../components/marketplace/pages/Marketplace')
        }
      ]
    }
  ];

  // Always leave this as last one
  if (process.env.MODE !== 'ssr') {
    routes.push({
      path: '*',
      component: () => import('pages/Error404.vue')
    });
  }

  return routes;
}

