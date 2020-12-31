import feathersClient, { makeServicePlugin, BaseModel } from '../../api/feathers-client';
// const common = require('../schemas/common')

class CrayvOrders extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'CrayvOrders';

  // Define default properties here
  static instanceDefaults () {
    return {
      person: null,
      group: null,
      confirmation: {},
      status: 'pending',
      charge: 0,
      deleted: false,
      subtotal: 0,
      tax: 0,
      group_order: null,
      location: {},
      device: {},
      products: [],
      reference: {},
    };
  }
}

const servicePath = 'crayv-orders';
const servicePlugin = makeServicePlugin({
  Model: CrayvOrders,
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
