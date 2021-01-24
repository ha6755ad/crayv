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
          path: 'profile',
          name: 'profile',
          component: () => import('../components/family-pod/personal/ExtendFcProfile')
        },
        {
          path: '/profile/:nav',
          name: 'profile-page',
          component: () => import('components/family-pod/pages/Profile'),
        },
        {
          path: 'admin',
          name: 'vendor-admin',
          component: () => import('../pages/CrayvAdmin'),
          meta: { requiredAuth: true },
          children: [
            {
              path: '',
              name: 'vendor-account',
              component: () => import('../components/vendor/pages/VendorSettings'),
            },
            {
              path: 'catalog',
              name: 'catalog',
              component: () => import('pages/Catalog/Catalog.vue')
            },
            {
              path: 'lineups',
              name: 'lineups',
              component: () => import('../components/lineups/pages/ProductLineups')
            },
            {
              path: 'subscriptions',
              name: 'subscriptions',
              component: () => import('pages/Subscriptions/Subscriptions.vue')
            },
            {
              path: 'schedule',
              name: 'schedule',
              component: () => import('pages/Schedule/Schedule.vue')
            },
            {
              path: 'marketplaces',
              name: 'marketplaces',
              component: () => import('components/marketplace/pages/Marketplaces')
            },
          ]
        },
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
        },
        {
          path: 'product-store',
          name: 'product-store',
          component: () => import('../components/products/pages/ShopProducts')
        },
        {
          path: 'classifieds',
          name: 'classifieds',
          component: () => import('../components/classifieds/pages/CrayvClassifieds')
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

