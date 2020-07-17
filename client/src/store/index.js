import Vue from 'vue';
import Vuex from 'vuex';
import {FeathersVuex} from 'feathers-vuex';

import auth from './store.auth';

// import example from './module-example'


Vue.use(Vuex);
Vue.use(FeathersVuex);

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
    modules: {
      // example
    },

    state: {},
    getters: {},
    mutations: {},
    actions: {},

    plugins: [...servicePlugins, auth],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  return Store;
}