const lset = require('lodash.set');

const addLogs = context => {
  let log = {
    queue: context.result._id,
    context: {
      data: context.data,
      result: context.result,
      params: context.params,
      path: context.path,
      method: context.method,
      type: context.type,
      id: context.id,
      error: context.error,
      statusCode: context.statusCode
    }
  };
  context.app.service('iy-queue-logs').create(log);
};

const runCreate = ({ service, value } = {}) => {
  return async context => {
    if(service){
      await context.app.service(service).create(value)
        .then(async () => {
          return await context.app.service('iy-queue').patch(context.id, {status: 'complete'});
        })
        .catch(err => {
          throw new Error(err);
        });
    }
  };
};

const runUpdate = ({ service, action, id, path, operator, value } = {}) => {
  return async context => {
    if (service) {
      let operateObj = {};
      operateObj[operator] = value;
      let patchObj = {};
      lset(patchObj, path, operateObj);
      await context.app.service(service)[action](id, patchObj)
        .then(async () => {
          return await context.app.service('iy-queue').patch(context.id, {status: 'complete'});
        })
        .catch(err => {
          throw new Error(err);
        });
    }
  };
};

const runChange = async context => {
  if(context.result.status === 'queue'){
    let service = context.result.service;
    let value = context.result.value;
    let action = context.result.action;
    if(action === 'create'){
      return runCreate(context)({service: service, value: value});
    } else {
      let id = context.result.id;
      let path = context.result.path;
      let operator = context.result.operator;
      return runUpdate(context)({service: service, value: value, id: id, path: path, operator: operator});
    }
  }
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
    find: [],
    get: [],
    create: [addLogs, runChange],
    update: [addLogs, runChange],
    patch: [addLogs, runChange],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [addLogs],
    update: [addLogs],
    patch: [addLogs],
    remove: []
  }
};
