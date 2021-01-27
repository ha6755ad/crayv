import Vue from 'vue';
import VueRouter from 'vue-router';
import {Notify} from 'quasar';

import Routes from './routes';
import profileUtils from '../plugins/profile-utils';
import defaults from '../plugins/defaults';
import validators from '../plugins/validators';
import recurrenceHandlers from '../plugins/recurrence';
import isAllowed from '../plugins/isAllowed';
import uuid from '../plugins/uuid';
import fingerprint from '../plugins/fingerprint';
import sanitize from 'src/plugins/sanitize';
import productUtils from 'src/plugins/product-utils';
import stripeUtils from '../plugins/stripe-utils';
import iconPlugin from '@quasar/quasar-ui-qiconpicker';
import VueGeolocation from 'vue-browser-geolocation';
import dateUtils from '../plugins/dateUtils';
import qNotify from '../plugins/qNotify';
import VueTelInput from 'vue-tel-input';
import geoUtils from '../plugins/geo-utils';



Vue.use(VueRouter);
Vue.use(VueGeolocation);
Vue.use(defaults);
Vue.use(validators);
Vue.use(profileUtils);
Vue.use(recurrenceHandlers);
Vue.use(isAllowed);
Vue.use(uuid);
Vue.use(fingerprint);
Vue.use(sanitize);
Vue.use(productUtils);
Vue.use(stripeUtils);
Vue.use(iconPlugin);
Vue.use(dateUtils);
Vue.use(qNotify);
Vue.use(VueTelInput);
Vue.use(geoUtils);




/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({store, ssrContext}) {
  const routes = Routes({store, ssrContext});

  const Router = new VueRouter({
    scrollBehavior: () => ({x: 0, y: 0}),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  Router.beforeEach((to, from, next) => {
    store.dispatch('auth/authenticate')
      .then(() => {
        // console.log('authenticated');
        if (to.meta.requiresAuth) {
          if (store.state.auth.user) {
            // console.log('pass');
            next();
          } else {
            // console.log('not pass', store.state.auth.user);
            Notify.create({
              type: 'negative',
              message: 'Page is restricted',
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  }
                }
              ]
            });
            next('/login');
          }
        } else {
          next();
        }
      })
      .catch(() => {
        // console.log('not authenticated');
        if (to.meta.requiresAuth) {
          if (store.state.auth.user) {
            next();
          } else {
            Notify.create({
              type: 'negative',
              message: 'Page is restricted. Please login or register.',
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  }
                }
              ]
            });
            next('/login');
          }
        } else {
          next();
        }
      });
  });

  return Router;
}
