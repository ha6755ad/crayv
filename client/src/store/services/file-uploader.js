/* eslint-disable no-console,no-unused-vars */
import feathersClient, { makeServicePlugin, BaseModel } from '../../api/feathers-client';

class FileUploader extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'FileUploader';

  // Define default properties here
  // eslint-disable-next-line no-unused-vars
  static instanceDefaults (data) {
    return {
      name: '',
      file: '',
      originalName: '',
      user: {},
      fileId: '',
      storage: '',
      createdBy: {},
      updatedBy: {}
    };
  }
}

const servicePath = 'file-uploader';
const servicePlugin = makeServicePlugin({
  Model: FileUploader,
  service: feathersClient.service(servicePath)
});

const beforeHook = context => {
  // eslint-disable-next-line no-console
  console.log('file-uploader [before]:', context);
};

const afterHook = context => {
  // eslint-disable-next-line no-console
  console.log('file-uploader [after]:', context);
};

const errorHook = context => {
  // eslint-disable-next-line no-console
  console.log('file-uploader:', context.error);
};

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [
      beforeHook
    ],
    find: [],
    get: [],
    create: [
    ],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [
      // afterHook
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [errorHook],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
});

export default servicePlugin;
