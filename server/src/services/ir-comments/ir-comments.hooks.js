const { authenticate } = require('@feathersjs/authentication').hooks;
const { relateOtm, removeOtm } = require('../../hooks/relate');
const { getVoteScore } = require('../../hooks/utils');

const {fastJoin} = require('feathers-hooks-common');
const lset = require('lodash.set');
const lget = require('lodash.get');

const { populate } = require('feathers-graph-populate');


const populates = {
  videos: {
    service: 'fv-video-uploads',
    nameAs: 'videosList',
    keyHere: 'videos',
    keyThere: '_id',
    asArray: true,
    params: {}
  }
};

const namedQueries = {
  withVideos: {
    videos: {}
  }
};

const userResolvers = {
  joins: {
    // eslint-disable-next-line no-unused-vars
    setUser: $select => async (comment, context) => {
      let user_id = lget(comment, 'createdBy');
      if (user_id) {
        let user = await context.app.service('users').get(user_id) || user_id;
        lset(comment, '_fastjoin.user', user);
      }
    }
  }
};

const relateParent = async context => {
  let parentModel = lget(context, 'result.parentModel');
  let config = {
    herePath: 'parent',
    therePath: 'comments',
    thereService: parentModel
  };
  return await relateOtm(config)(context)
    .then(res => {
      console.log('related comment to parent', res);
    });
};

const removeParent = async context => {
  let parentModel = lget(context, 'result.parentModel');
  let config = {
    herePath: 'parent',
    therePath: 'comments',
    thereService: parentModel
  };
  return await removeOtm(config)(context);
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt'), getVoteScore],
    update: [authenticate('jwt'), getVoteScore],
    patch: [authenticate('jwt'), getVoteScore],
    remove: [authenticate('jwt'), getVoteScore]
  },

  after: {
    all: [fastJoin(userResolvers), populate({populates, namedQueries})],
    find: [],
    get: [],
    create: [relateParent],
    update: [relateParent],
    patch: [relateParent],
    remove: [removeParent]
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
