import Vue from 'vue';
import Vuex from 'vuex';
import {FeathersVuex} from 'feathers-vuex';
import { LocalStorage, SessionStorage } from 'quasar';

import auth from './store.auth';

// import example from './module-example'


Vue.use(Vuex);
Vue.use(FeathersVuex);

import currency from './modules/currency';

const requireModule = require.context(
  // The path where the service modules live
  './services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/
);
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default);


/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      vendorContext: null,
      marketplaceContext: null,
    },
    getters: {
      vendorContext(state){
        return state.vendorContext;
      },
      marketplaceContext(state){
        return state.marketplaceContext;
      }
    },
    mutations: {
      SET_MARKETPLACE_CONTEXT(state, payload){
        state.marketplaceContext = payload;
        try {
          LocalStorage.set('marketplaceId', payload._id);
        } catch(e) {
          console.log('error setting local storage vendorId', e);
        }
        try {
          SessionStorage.set('marketplaceId', payload._id);
        } catch(e) {
          console.log('error setting session storage vendor', e);
        }
      },
      SET_VENDOR_CONTEXT(state, payload){
        state.vendorContext = payload;
        try {
          LocalStorage.set('vendorId', payload._id);
        } catch(e) {
          console.log('error setting local storage vendorId', e);
        }
        try {
          SessionStorage.set('vendorId', payload._id);
        } catch(e) {
          console.log('error setting session storage vendor', e);
        }
      },
    },
    actions: {
      setVendorContext(context, payload){
        context.commit('SET_VENDOR_CONTEXT', payload);
      },
      setMarketplaceContext(context, payload){
        context.commit('SET_MARKETPLACE_CONTEXT', payload);
      }
    },

    modules: {
      currency
    },
    plugins: [...servicePlugins, auth],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  return Store;
}
