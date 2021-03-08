import feathersClient, { makeServicePlugin, BaseModel } from '../../api/feathers-client';
// import encryption from '../../encryption/encryption'

class IrBankStripeAccount extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'IrBankStripeAccount';

  // Define default properties here
  static instanceDefaults () {
    return {
    };
  }
}

const servicePath = 'ir-bank-stripe-account';
const servicePlugin = makeServicePlugin({
  Model: IrBankStripeAccount,
  service: feathersClient.service(servicePath),
  servicePath,
  idField: 'id',
});

// const encryptData = (context) => {
//   context.data = encryption.encrypt(context.data)
// }

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      // encryptData
    ],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [
      // encryption.decrypt
    ],
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
