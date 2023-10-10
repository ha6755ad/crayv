const mongoose = require('mongoose');
const tunnel = require('tunnel-ssh');
const winston = require('winston');
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});
logger.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

module.exports = function (app) {
  const mongoConfig = app.get('mongo');
  mongoose.set('debug', true);

  const TUNNEL = JSON.parse(String(process.env.TUNNEL_MONGO || false).toLowerCase());

  if (mongoConfig.MONGO_DNS_CONSTRUCTED_SEED_LIST) {
    mongoConfig.mongodb = process.env.MONGO_DB_URI || `mongodb+srv://${mongoConfig.MONGO_DB_USERNAME}:${mongoConfig.MONGO_DB_PASSWORD}@${mongoConfig.sshTunnelConfig.localHost}/${mongoConfig.MONGO_DB_DATABASE}`;
  } else {
    mongoConfig.mongodb = process.env.MONGO_DB_URI || `mongodb://${mongoConfig.MONGO_DB_USERNAME}:${mongoConfig.MONGO_DB_PASSWORD}@${mongoConfig.sshTunnelConfig.localHost}:${mongoConfig.sshTunnelConfig.localPort}/${mongoConfig.MONGO_DB_DATABASE}`;
  }
  let mongoStartOptions = {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true};
  if (mongoConfig.MONGO_DB_KEEPALIVE) {
    const KEEPALIVE = {keepAlive: mongoConfig.MONGO_DB_KEEPALIVE};
    mongoStartOptions = {...mongoStartOptions, ...KEEPALIVE};
    if (mongoConfig.MONGO_DB_KEEPALIVE_DELAY) {
      const KEEPALIVEDELAY = {keepAliveInitialDelay: mongoConfig.MONGO_DB_KEEPALIVE_DELAY};
      mongoStartOptions = {...mongoStartOptions, ...KEEPALIVEDELAY};
    }
  }

  logger.info('TUNNEL (MONGO) - ' + TUNNEL);

  if (TUNNEL) {
    const sshTunnelConfig = {
      agent: mongoConfig.agent,
      username: mongoConfig.sshTunnelConfig.username,
      privateKey: require('fs').readFileSync(mongoConfig.sshTunnelConfig.privateKey),
      passphrase: mongoConfig.sshTunnelConfig.passphrase,
      host: mongoConfig.sshTunnelConfig.host,
      port: mongoConfig.sshTunnelConfig.port,
      dstHost: mongoConfig.sshTunnelConfig.dstHost,
      dstPort: mongoConfig.sshTunnelConfig.dstPort,
      localHost: mongoConfig.sshTunnelConfig.localHost,
      localPort: mongoConfig.sshTunnelConfig.localPort
    };
    mongoConfig.host = sshTunnelConfig.localHost;
    mongoConfig.port = sshTunnelConfig.localPort;

    // eslint-disable-next-line no-unused-vars
    tunnel(sshTunnelConfig, (error, server) => {
      if (error) {
        logger.error('SSH tunnel connection for MongoDB via SSH host - ' + sshTunnelConfig.host + error);
        process.exit(1);
      } else {
        logger.info('SSH tunnel ready for MongoDB via SSH host - ' + sshTunnelConfig.host);
      }
    });
  }

  logger.debug('mongoConfig.mongodb - ' + mongoConfig.mongodb);


  mongoose.connect(
    mongoConfig.mongodb,
    mongoStartOptions
  ).then(() => {
    if (TUNNEL) {
      logger.info('MongoDB connection successfully established via SSH Tunnel');
    } else {
      logger.info('MongoDB connection successfully established');
    }
  }).catch(err => {
    logger.error('MongoDB connection error - ' + err.message);
    process.exit(1);
  });

  mongoose.Promise = global.Promise;
  app.set('mongooseClient', mongoose);
};
