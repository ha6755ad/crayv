// eslint-disable-next-line no-unused-vars
export default function ({store, ssrContext}) {
  const routes = [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('pages/Index.vue') },
        { path: '/catalog', component: () => import('pages/Catalog/Catalog.vue') },
        { path: '/lineups', component: () => import('pages/Lineups/Lineups.vue') },
        { path: '/subscriptions', component: () => import('pages/Subscriptions/Subscriptions.vue') },
        { path: '/schedule', component: () => import('pages/Schedule/Schedule.vue') },
        { path: '/account', component: () => import('pages/Account/Account.vue') },
        { path: '/profile', component: () => import('pages/Profile') },
        { path: '/profile/:nav', name: 'profile-page', component: () => import('pages/Profile'), }
      ]
    },
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

