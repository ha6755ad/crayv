// eslint-disable-next-line no-unused-vars

const successHook = context => {
  context.result.data = context.result.addresses;
  context.result.total = 0;
  context.result.limit = 400;
  context.result.skip = 0;
};

module.exports = {
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
    find: [
      successHook
    ],
    get: [],
    create: [successHook],
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
};
