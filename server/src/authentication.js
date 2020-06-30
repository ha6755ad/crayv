const {AuthenticationService, JWTStrategy, AuthenticationBaseStrategy} = require('@feathersjs/authentication');
const {LocalStrategy} = require('@feathersjs/authentication-local');
const {expressOauth} = require('@feathersjs/authentication-oauth');
const session = require('express-session');
const winston = require('winston');

const redisConnect = require('./redis');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});

// eslint-disable-next-line no-unused-vars
class AnonymousStrategy extends AuthenticationBaseStrategy {
  // eslint-disable-next-line no-unused-vars
  async authenticate(authentication, params) {
    return {
      anonymous: true
    };
  }
}

// eslint-disable-next-line no-unused-vars
const {NotAuthenticated} = require('@feathersjs/errors');
// const axios = require('axios');


module.exports = app => {

  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());

  app.use('/authentication', authentication);

  app.configure(redisConnect);


  app.configure(expressOauth({
    expressSession: session({
      store: redisConnect.sessionStore,
      secret: app.get('authentication').secret,
      resave: false,
      saveUninitialized: false
    })
  }));

  const beforeHook = context => {
    if (process.env.DEBUG) {
      logger.info('authentication.js => beforeHook => context.params:' + JSON.stringify(context.params));
      logger.info('authentication.js => beforeHook => context.arguments:' + JSON.stringify(context.arguments));
      logger.info('authentication.js => beforeHook => context.data:' + JSON.stringify(context.data));
    }
  };

  const afterHook = context => {
    if (process.env.DEBUG) {
      logger.info('authentication.js => afterHook => context.params:' + JSON.stringify(context.params));
      logger.info('authentication.js => afterHook => context.arguments:' + JSON.stringify(context.arguments));
      logger.info('authentication.js => afterHook => context.data:' + JSON.stringify(context.data));
    }
  };


  const errorHook = context => {
    logger.error('FATAL: authentication.js => errorHook => context.error:' + JSON.stringify(context.error));
  };


  app.service('authentication').hooks({
    before: {
      create: [
        beforeHook
      ]
    },
    after: {
      create: [
        afterHook
      ]
    },
    error: {
      create: [
        errorHook
      ]
    }
  });
};


