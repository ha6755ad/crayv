import feathersClient, {makeServicePlugin, BaseModel} from '../../api/feathers-client';
// import moment from 'moment';

class FvVideoUploads extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'FvVideoUploads';

  // Define default properties here
  static instanceDefaults() {
    return {
      author: '',
      creator: null,
      uploadId: null,
      name: '',
      description: '',
      embed: '',
      file: '',
      uriRef: null,
      host: 'youtube',
      uri: null,
      status: null,
      thumbnails: [],
      views: []
    };
  }
}

const servicePath = 'fv-video-uploads';
const servicePlugin = makeServicePlugin({
  Model: FvVideoUploads,
  service: feathersClient.service(servicePath),
  servicePath,
  idField: 'id'
});

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    // find: [],
    // get: [],
    create: [],
    // update: [],
    // patch: [],
    // remove: []
  },
  after: {
    all: [],
    // find: [],
    // get: [],
    create: [],
    // update: [],
    // patch: [],
    // remove: []
  },
  error: {
    all: [],
    // find: [],
    // get: [],
    create: [],
    // update: [],
    // patch: [],
    // remove: []
  }
});

export default servicePlugin;
