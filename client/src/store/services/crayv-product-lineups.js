import feathersClient, { makeServicePlugin, BaseModel } from '../../api/feathers-client';
const common = require('../schemas/common');

class CrayvProductLineups extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'CrayvProductLineups';

  // Define default properties here
  static instanceDefaults () {
    return {
      name: '',
      description: '',
      deleted: false,
      active: true,
      vendorSettings: null,
      recommended: [],
      settings: common.ProductSettings,
      shipping: {},
      events: [],
      products: [],
      productGroups: []
    };
  }
}

const servicePath = 'crayv-product-lineups';
const servicePlugin = makeServicePlugin({
  Model: CrayvProductLineups,
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
