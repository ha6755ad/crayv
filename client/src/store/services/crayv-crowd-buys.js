import feathersClient, { makeServicePlugin, BaseModel } from '../../api/feathers-client';
// const common = require('../schemas/common')

class CrayvCrowdBuys extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'CrayvCrowdBuys';

  // Define default properties here
  static instanceDefaults () {
    return {
      name: undefined,
      description: undefined,
      vendorSettings: null,
      start: new Date(),
      end: undefined,
      selling: undefined,
      sellingModel: undefined,
      mimimum: 1,
      maximum: undefined,
      discounts: [],
      settings: undefined,
      orders: []
    };
  }
}

const servicePath = 'crayv-crowd-buys';
const servicePlugin = makeServicePlugin({
  Model: CrayvCrowdBuys,
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
