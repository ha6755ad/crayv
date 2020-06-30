// eslint-disable-next-line no-unused-vars
export default function ({store, ssrContext}) {
  const routes = [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        {path: '', component: () => import('pages/Index.vue')},


        {
          path: 'logout',
          name: 'logout',
          beforeEnter(to, from, next) {
            store.dispatch('auth/logout')
              .then(result => {
                console.log('logout:', result);
                next('/');
              })
              .catch(error => {
                console.log('error logout:', error);
                next();
              });
          },
        },
      ]

    }
  ]

  // Always leave this as last one
  if (process.env.MODE !== 'ssr') {
    routes.push({
      path: '*',
      component: () => import('pages/Error404.vue')
    });
  }

  return routes;
}

