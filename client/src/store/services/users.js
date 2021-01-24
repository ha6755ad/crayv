import feathersClient, {makeServicePlugin, BaseModel} from '../../api/feathers-client';

import {diff} from 'deep-object-diff';

class Users extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Users';

  static diffOnPatch(data) {
    console.log('diffOnPatch data', data);
    if (data['_id']) {
      const originalObject = Users.store.state['users'].keyedById[data['_id']];
      return diff(originalObject, data);
    } else {
      return data;
    }
  }

  // Define default properties here
  static instanceDefaults() {
    return {
      // name: null,
      email: null,
      addresses: [],
      avatar: undefined,
      // auth0Id: null,
      // googleId: null,
      // roles: [],
      // createdBy: null,
      // updatedBy: null,
      // updates: [],
      theme: {
        '--q-color-primary': undefined,
        '--q-color-secondary': undefined,
        '--q-color-accent': undefined,
        '--q-color-dark': undefined,

        '--q-color-positive': undefined,
        '--q-color-negative': undefined,
        '--q-color-info': undefined,
        '--q-color-warning': undefined,
      },
    };
  }
}

const servicePath = 'users';
const servicePlugin = makeServicePlugin({
  Model: Users,
  service: feathersClient.service(servicePath),
  servicePath,
  state: {},
  getters: {},
  mutations: {},
  actions: {}
});

// const beforeHook = context => {
//   // eslint-disable-next-line no-console
//   console.log('------------->>>> beforeHook - context.method:', context.method);
//   console.log('------------->>>> beforeHook - context.params:', context.params);
//   console.log('------------->>>> beforeHook - context.data:', context.data);
// };

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [/*beforeHook*/],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
});

export default servicePlugin;
