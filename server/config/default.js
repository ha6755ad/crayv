const serverHost = process.env.HOST || 'localhost';
const serverPort = process.env.PORT || 3030;
const serverUrl = process.env.SERVER_URL || 'http://' + serverHost + ':' + serverPort;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:8080';

const STORAGE_TYPES = {
  's3': 's3',
  'local-private': 'local-private',
  'local-public': 'local-public',
  'google-cloud': 'google-cloud',
  'others': 'others'
};

module.exports = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3030,
  serverUrl: process.env.URL || 'http://localhost:3030',
  public: '../public/',
  paginate: {
    default: 500,
    max: 1000
  },
  s3: {
    bucket: process.env.AWS_BUCKET_NAME,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signedUrlExpires: 900
  },
  'sms': {
    'default': 'twilio',
    'from': process.env.FROM_NUMBER,
    'verifyResetUrl': process.env.SMS_URL || clientUrl || serverUrl,
    'identifyUserProps': ['_id', 'username', 'email', 'phone.number.e164'],
    'shortTokenLen': process.env.SMS_SHORTTOKEN_LENGTH || 6,
    'shortTokenDigits': process.env.SMS_SHORTTOKEN_DIGITS || true,
    'twilio': {
      'apiKey': process.env.TWILIO_API_KEY,
      'domain': process.env.TWILIO_DOMAIN,
      'sid': process.env.TWILIO_SID,
      'authToken': process.env.TWILIO_AUTH_TOKEN,
      'bulkSms': {
        'notifyServiceSid': process.env.TWILIO_NOTIFY_SERVICE_SID
      }
    },
  },
  'stripe': {
    'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY || 'STRIPE_SECRET_KEY'
  },
  'mailer': {
    'default': 'ses',
    'from': process.env.FROM_EMAIL,
    'verifyResetUrl': process.env.MAILER_URL || clientUrl || serverUrl,
    'helpEmail': process.env.HELP_EMAIL || 'help@MyCompany.com',
    'logo': process.env.MAILER_LOGO || 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/legacy/legacy_coin.png',
    'mailgun': {
      'host': process.env.MAILGUN_HOST,
      'apiKey': process.env.MAILGUN_API_KEY,
      'domain': process.env.MAILGUN_DOMAIN
    },
    'sendgrid': {
      'host': process.env.SENDGRID_HOST,
      'apikey': process.env.SENDGRID_API_KEY
    },
    'ses': {
      'host': process.env.SES_HOST,
      'port': process.env.SES_PORT,
      'user': process.env.SES_SMTP_USER,
      'pass': process.env.SES_SMTP_PASS
    }
  },
  authentication: {
    entity: 'user',
    service: 'users',
    secret: process.env.AUTH_SECRET || '12fd709f45d74a4fc68c5efe295f9435e51364742ev5984ab11bed9b813f65a442t31a3c8075304f10c1d520dbe1282b50a38dc6a9ebf1c017fe2ab7e58a4310ef494ee232d32540df611ffa2361a6d0b8aec80ebdcf5534220eb567ee9f1b4b35b371811e510a8158419fd96d33fa37596a8681c6fff1bd704fcd123ce27d1892a3e06f89326fdf8ce43e452c429cde5c1e1be3579174b4622feebe498430ee840bff48cf622aa8a6cb16212bfa8ccad04321e84b2r804f60b92f8afe8a59b92d57d665b9cf09e0640ba292f38bbeafa81d1eb0a681c3a1bff253bd7f25c0d19d2c876ff08dfeb379e4618df02fe924d2e365914fd5ccc04d436edb3c0bd390',
    authStrategies: [
      'jwt',
      'local',
    ],
    jwtOptions: {
      header: {
        typ: 'access'
      },
      audience: process.env.AUTH_JWT_OPTIONS_AUDIENCE || 'https://ionrev.com',
      issuer: process.env.AUTH_JWT_OPTIONS_ISSUER || 'ionrev',
      algorithm: process.env.AUTH_JWT_OPTIONS_ALGORITHM || 'HS256',
      expiresIn: process.env.AUTH_JWT_OPTIONS_EXPIRESIN || '1d'
    },
    local: {
      usernameField: 'email',
      passwordField: 'password'
    },
  },
  redis: {
    secret: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST || process.env.REDIS_DB_HOST || 'localhost',
    port: process.env.REDIS_PORT || process.env.REDIS_DB_PORT || 6379,
    password: process.env.REDIS_PASSWORD || 'my password',
    db: process.env.REDIS_DB || 1,
    sshTunnelConfig: {
      agent: process.env.REDIS_SSH_AUTH_SOCK || process.env.SSH_AUTH_SOCK,
      username: process.env.REDIS_SSH_USERNAME || process.env.SSH_USERNAME,
      privateKey: process.env.REDIS_SSH_PRIVATE_KEY || process.env.SSH_PRIVATE_KEY,
      passphrase: process.env.REDIS_SSH_KEY_PASSPHRASE || process.env.SSH_KEY_PASSPHRASE,
      host: process.env.REDIS_SSH_HOST || process.env.SSH_HOST,
      port: process.env.REDIS_SSH_PORT || process.env.SSH_PORT,
      dstHost: process.env.REDIS_SSH_DST_HOST || process.env.SSH_DST_HOST,
      dstPort: process.env.REDIS_SSH_DST_PORT || 6379,
      localHost: process.env.REDIS_DB_HOST || 'localhost',
      localPort: process.env.REDIS_DB_PORT || 6380,
    }
  },
  'mailgun': {
    'apiKey': process.env.MAILGUN_API_KEY || '33b8266164bbff41e301d600f1713ad1-3939b93a-eceddde6',
    'domain': process.env.MAILGUN_DOMAIN || 'sandboxd5991780fa8c4835865c326bee6a24e5.mailgun.org'
  },
  uploads: {
    privateFolder: '../private-files',
    services: {
      's3': true,
      'local-private': true,
      'local-public': true,
      'google-cloud': false
    },
    defaultFileService: 'local-public',
    blockDeleteDocumentWhenDeleteFileFailed: false,
    blockUpdateDocumentWhenReplaceFileFailed: false,
    enums: {
      STORAGE_TYPES,
      UPLOAD_SERVICES: {
        [STORAGE_TYPES['local-private']]: 'upload-local-private',
        [STORAGE_TYPES['local-public']]: 'upload-local-public',
        [STORAGE_TYPES.s3]: 'uploads-s3',
        [STORAGE_TYPES['google-cloud']]: 'uploads-google'
      },
      UPLOAD_PUBLIC_FILE_KEY: Symbol.for('public-file')
    }
  },
  'mongo': {
    'mongodb': process.env.MONGO_DB_URI || 'MONGO_DB_URI',
    'MONGO_DNS_CONSTRUCTED_SEED_LIST': (process.env.MONGO_DNS_CONSTRUCTED_SEED_LIST === 'true'),
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
};
