import feathersClient, { makeServicePlugin, BaseModel } from '../../api/feathers-client';
// const common = require('../schemas/common')

class CrayvSalesTax extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'CrayvSalesTax';

  // Define default properties here
  static instanceDefaults () {
    return {
      country: null,
      city: null,
      postal_code: null,
      total_tax: 0,
      rates: [],
      expires: null,
    };
  };
}

const servicePath = 'crayv-sales-tax';
const servicePlugin = makeServicePlugin({
  Model: CrayvSalesTax,
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
