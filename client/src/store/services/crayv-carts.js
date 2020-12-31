import feathersClient, { makeServicePlugin, BaseModel } from '../../api/feathers-client';
// const common = require('../schemas/common')

class CrayvCarts extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'CrayvCarts';

  // Define default properties here
  static instanceDefaults () {
    return {
      active: true,
      deleted: false,
      person: null,
      group: null,
      currency: 'usd'
    };
  }
}

const servicePath = 'crayv-carts';
const servicePlugin = makeServicePlugin({
  Model: CrayvCarts,
  service: feathersClient.service(servicePath),
  servicePath
});

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
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
