const { authenticate } = require('@feathersjs/authentication');
const { relateOtm, removeOtm, relateOto, removeOto } = require('../../hooks/relate');
const { populate } = require('feathers-graph-populate');
const {fastJoin} = require('feathers-hooks-common');
const lset = require('lodash.set');
const lget = require('lodash.get');

const userResolvers = {
  joins: {
    // eslint-disable-next-line no-unused-vars
    setUser: $select => async (offer, context) => {
      let user_id = lget(offer, 'createdBy');
      if (user_id) {
        let user = await context.app.service('users').get(user_id) || user_id;
        lset(offer, '_fastjoin.user', user);
      }
    }
  }
};

const populates = {
  comments: {
    service: 'ir-comments',
    nameAs: 'commentsList',
    keyHere: 'comments',
    keyThere: '_id',
    asArray: true,
    params: {}
  },
  subject: {
    service: 'crayv-classifieds',
    nameAs: 'fullSubject',
    keyHere: 'subject',
    keyThere: '_id',
    asArray: false,
    params: {}
  }
};

const namedQueries = {
  withComments: {
    comments: {},
  },
  withSubject: {
    subject: {}
  }
};

const relateAccepted = async context => {
  let config = {
    herePath: 'subject',
    therePath: 'accepted',
    thereService: context.result.subjectModel
  };
  //TODO: add signature workflow
  if(context.result.accepted){
    if(context.method === 'remove') return await removeOto(config)(context)
      .then(() => {
        context.app.service('crayv-offers').Model.updateMany(
          {
            subject: context.result.subject,
            _id: { $ne: context.result._id }
          },
          {
            accepted: undefined
          }
        );
      });
    else return await relateOto(config)(context);
  }
};

const removeAccepted = async context => {
  if(context.result.accepted){
    context.app.service(context.result.subjectModel).patch(context.result.subject, {
      accepted: undefined
    });
  }
};

const relateSubject = async context => {
  let config = {
    herePath: 'subject',
    therePath: 'offers',
    thereService: context.result.subjectModel
  };
  if(context.method === 'remove') return await removeOtm(config)(context);
  else return await relateOtm(config)(context);
};


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt')],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [fastJoin(userResolvers), populate({populates, namedQueries})],
    find: [],
    get: [],
    create: [relateSubject],
    update: [relateSubject, relateAccepted],
    patch: [relateSubject, relateAccepted],
    remove: [relateSubject, relateAccepted, removeAccepted]
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
