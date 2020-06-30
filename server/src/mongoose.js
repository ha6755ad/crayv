const mongoose = require('mongoose');
const tunnel = require('tunnel-ssh');
const logger = require('./hooks/logger');


module.exports = function (app) {
  var systemConfig = app.get('mongo');
  mongoose.set('debug', process.env.DEBUG);

  const TUNNEL = JSON.parse(String(process.env.TUNNEL_MONGO || false).toLowerCase());

  const MONGO_DB_URI = `mongodb://${process.env.MONGO_DB_USERNAME || systemConfig.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD || systemConfig.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST || systemConfig.sshTunnelConfig.localHost}:${process.env.MONGO_DB_PORT || systemConfig.sshTunnelConfig.localPort}/${process.env.MONGO_DB_DATABASE || systemConfig.MONGO_DB_DATABASE}`;
  let mongoStartOptions = {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true};
  if (process.env.MONGO_DB_KEEPALIVE || systemConfig.MONGO_DB_KEEPALIVE) {
    const KEEPALIVE = {keepAlive: process.env.MONGO_DB_KEEPALIVE || systemConfig.MONGO_DB_KEEPALIVE};
    mongoStartOptions = {...mongoStartOptions, ...KEEPALIVE};
    if (process.env.MONGO_DB_KEEPALIVE_DELAY || systemConfig.MONGO_DB_KEEPALIVE_DELAY) {
      const KEEPALIVEDELAY = {keepAliveInitialDelay: process.env.MONGO_DB_KEEPALIVE_DELAY || systemConfig.MONGO_DB_KEEPALIVE_DELAY};
      mongoStartOptions = {...mongoStartOptions, ...KEEPALIVEDELAY};
    }
  }

  function db(app, logger, process, config) {
    if (String(config.mongodb) !== 'MONGO_DB_URI') {
      mongoose.connect(
        config.mongodb,
        mongoStartOptions
      ).then(() =>
        // eslint-disable-next-line no-console
        console.log('MongoDB connection successfully established'))
        .catch(err => {
          if (logger.error) {
            logger.error('MongoDB connection error:', err.message);
          } else {
            // eslint-disable-next-line no-console
            console.log('MongoDB connection error:', err.message);
          }
          process.exit(1);
        });
    } else {
      mongoose.connect(
        MONGO_DB_URI,
        mongoStartOptions
      ).then(() =>
        // eslint-disable-next-line no-console
        console.log('MongoDB connection successfully established via SSH tunnel'))
        .catch(err => {
          if (logger.error) {
            logger.error('MongoDB connection error:', err.message);
          } else {
            // eslint-disable-next-line no-console
            console.log('MongoDB connection error:', err.message);
          }
          process.exit(1);
        });
    }
  }

  if (TUNNEL) {
    const sshTunnelConfig = {
      agent: process.env.SSH_AUTH_SOCK, // Start ssh-agent to set the environment variable $SSH_AUTH_SOCK on your jumpbox / VPS host access - IMPORTANT! you should either user agent or passphrase but you don't need both
      username: process.env.SSH_USERNAME || systemConfig.sshTunnelConfig.username, // username used for ssh access to jumpbox / VPS host
      privateKey: require('fs').readFileSync(process.env.SSH_PRIVATE_KEY || systemConfig.sshTunnelConfig.privateKey || `${process.env.HOME}/.ssh/.id_rsa`, 'utf8'), // local path to the ssh private key file that will be used for ssh access to jumpbox / VPS host
      passphrase: process.env.SSH_KEY_PASSPHRASE || systemConfig.sshTunnelConfig.passphrase, // SSH private key password - IMPORTANT! you should either user agent or passphrase but you don't need both
      host: process.env.SSH_HOST || systemConfig.sshTunnelConfig.host, // IP address of host you will use as a tunnel jumpbox / VPS - server that has access to the remote network that the mongo service is running in
      port: process.env.SSH_PORT || systemConfig.sshTunnelConfig.port || 22, // the port used to ssh into the remote jumpbox / VPS - server that has access to the remote network that the mongo service is running in
      dstHost: process.env.SSH_DST_HOST || systemConfig.sshTunnelConfig.dstHost, // the remote server actually running the mongo service
      dstPort: process.env.SSH_DST_PORT || systemConfig.sshTunnelConfig.dstPort || 27017, // mongo service port or anything that has been setup by the server admin
      localHost: process.env.MONGO_DB_HOST || systemConfig.sshTunnelConfig.localHost || '127.0.0.1', // you will usually use localhost or 127.0.0.1 or your actual ip address
      localPort: process.env.MONGO_DB_PORT || systemConfig.sshTunnelConfig.localPort || 50001 // local port used as a place holder for the mongo service - anything (unused) that you want
    };

    // eslint-disable-next-line no-unused-vars
    tunnel(sshTunnelConfig, (error, server) => {
      if (error) {
        if (logger.error) {
          logger.error('SSH tunnel connection error to %s:', sshTunnelConfig.host, error);
        } else {
          // eslint-disable-next-line no-console
          console.log('SSH tunnel connection error to %s:', sshTunnelConfig.host, error);
        }
        process.exit(1);
      } else {
        // eslint-disable-next-line no-console
        console.log('Tunneling MongoDB connection via SSH host %s', sshTunnelConfig.host);
        // eslint-disable-next-line no-console
        console.log('server:', server);
        db(app, logger, process, systemConfig);
      }
    });
  } else {
    db(app, logger, process, systemConfig);
  }

  mongoose.Promise = global.Promise;

  app.set('mongooseClient', mongoose);

};
