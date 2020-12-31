import feathersClient, { makeServicePlugin, BaseModel } from '../../api/feathers-client';
// const common = require('../schemas/common')

class CrayvCartLines extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'CrayvCartLines';

  // Define default properties here
  static instanceDefaults () {
    return {
      cart: null,
      deleted: false,
      group_order: null,
      product: null,
    };
  }
}

const servicePath = 'crayv-cart-lines';
const servicePlugin = makeServicePlugin({
  Model: CrayvCartLines,
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
