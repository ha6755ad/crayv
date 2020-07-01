module.exports = {
  'host': process.env.HOST || 'localhost',
  'port': process.env.PORT || 3030,
  'serverUrl': process.env.SERVERURL || 'http://localhost:3030',
  'public': '../public/',
  'paginate': {
    'default': 10,
    'max': 50
  },
  's3': {
    'bucket': process.env.AWS_BUCKET_NAME,
    'accessKeyId': process.env.AWS_ACCESS_KEY,
    'secretAccessKey': process.env.AWS_SECRET_ACCESS_KEY,
    'signedUrlExpires': 900
  },
  'authentication': {
    'entity': 'user',
    'service': 'users',
    'secret': process.env.APP_SECRET || 'secretsksdfjoaksnfsecretsksdfjoaksnfsecretsksdfjoaksnf',
    'authStrategies': [
      'jwt',
      'local'
    ],
    'jwtOptions': {
      'header': {
        'typ': 'access'
      },
      'audience': process.env.JWT_AUDIANCE || 'http://localhost:8080',
      'issuer': process.env.JWT_ISSUER || 'feathers',
      'algorithm': 'HS256',
      'expiresIn': '1d'
    },
    'local': {
      'usernameField': 'email',
      'passwordField': 'password'
    },
  },
  'mailgun': {
    'apiKey': process.env.MAILGUN_API_KEY || '33b8266164bbff41e301d600f1713ad1-3939b93a-eceddde6',
    'domain': process.env.MAILGUN_DOMAIN || 'sandboxd5991780fa8c4835865c326bee6a24e5.mailgun.org'
  },
  'mongo': {
    'mongodb': process.env.MONGO_DB_URI || 'MONGO_DB_URI',
    'MONGO_DB_USERNAME': process.env.MONGO_DB_USERNAME || 'MONGO_DB_USERNAME',
    'MONGO_DB_PASSWORD': process.env.MONGO_DB_PASSWORD || 'MONGO_DB_PASSWORD',
    'MONGO_DB_DATABASE': process.env.MONGO_DB_DATABASE || 'MONGO_DB_DATABASE',
    'MONGO_DB_KEEPALIVE': process.env.MONGO_DB_KEEPALIVE || 'MONGO_DB_KEEPALIVE',
    'MONGO_DB_KEEPALIVE_DELAY': process.env.MONGO_DB_KEEPALIVE_DELAY || 'MONGO_DB_KEEPALIVE_DELAY',
    'sshTunnelConfig': {
      'agent': process.env.SSH_AUTH_SOCK || 'SSH_AUTH_SOCK',
      'username': process.env.SSH_USERNAME || 'SSH_USERNAME',
      'privateKey': process.env.SSH_PRIVATE_KEY || 'SSH_PRIVATE_KEY',
      'passphrase': process.env.SSH_KEY_PASSPHRASE || 'SSH_KEY_PASSPHRASE',
      'host': process.env.SSH_HOST || 'SSH_HOST',
      'port': process.env.SSH_PORT || 'SSH_PORT',
      'dstHost': process.env.SSH_DST_HOST || 'SSH_DST_HOST',
      'dstPort': process.env.SSH_DST_PORT || 'SSH_DST_PORT',
      'localHost': process.env.MONGO_DB_HOST || 'MONGO_DB_HOST',
      'localPort': process.env.MONGO_DB_PORT || 'MONGO_DB_PORT'
    }
  },
  'redis': {
    'secret': process.env.REDIS_PASSWORD,
    'host': process.env.REDIS_HOST || process.env.REDIS_DB_HOST || 'localhost',
    'port': process.env.REDIS_PORT || process.env.REDIS_DB_PORT || 6379,
    'password': process.env.REDIS_PASSWORD || 'my password',
    'db': process.env.REDIS_DB || 1,
    'sshTunnelConfig': {
      'agent': process.env.REDIS_SSH_AUTH_SOCK || process.env.SSH_AUTH_SOCK,
      'username': process.env.REDIS_SSH_USERNAME || process.env.SSH_USERNAME,
      'privateKey': process.env.REDIS_SSH_PRIVATE_KEY || process.env.SSH_PRIVATE_KEY,
      'passphrase': process.env.REDIS_SSH_KEY_PASSPHRASE || process.env.SSH_KEY_PASSPHRASE,
      'host': process.env.REDIS_SSH_HOST || process.env.SSH_HOST,
      'port': process.env.REDIS_SSH_PORT || process.env.SSH_PORT,
      'dstHost': process.env.REDIS_SSH_DST_HOST || process.env.SSH_DST_HOST,
      'dstPort': process.env.REDIS_SSH_DST_PORT || 6379,
      'localHost': process.env.REDIS_DB_HOST || 'localhost',
      'localPort': process.env.REDIS_PORT || process.env.REDIS_DB_PORT || 6379,
    }
  },
};
