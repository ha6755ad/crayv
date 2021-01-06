const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeoLocation = {
  type: { type: String, default: 'FeatureCollection' },
  allowFeatures: [{ type: String, enum: ['Point', 'MultiPoint', 'Polygon'] }],
  features: [{
    type: Object, contains: {
      schedule_items: { type: Array }, //uuid
      geometry: {
        type: { type: String, required: true, enum: ['Point', 'Polygon'], default: 'Point' },
        coordinates: { type: Array, required: false },
      },
      properties: { type: Object, required: false },
      addresses: [],
    }
  }
  ]
};

const UniquePhone = new Schema({
  phoneType: { type: String, required: false },
  number: {
    input: { type: String, required: false },
    international: { type: String, required: false },
    national: { type: String, required: false },
    e164: { type: String, required: false, unique: true },
    rfc3966: { type: String, required: false },
    significant: { type: String, required: false },
  },
  regionCode: { type: String, required: false },
  valid: { type: Boolean, required: false },
  possible: { type: Boolean, required: false },
  possibility: { type: String, required: false },
  isValid: { type: Boolean, required: false },
  country: {
    name: { type: String, required: false },
    iso2: { type: String, required: false },
    dialCode: { type: String, required: false },
    priority: { type: Number, required: false },
    areaCodes: { type: String, required: false },
  },
  canBeInternationallyDialled: { type: Boolean, required: false },
  type: { type: String, required: false },
}, {_id: false});

const Phone = new Schema({
  phoneType: { type: String, required: false },
  number: {
    input: { type: String, required: false },
    international: { type: String, required: false },
    national: { type: String, required: false },
    e164: { type: String, required: true },
    rfc3966: { type: String, required: false },
    significant: { type: String, required: false },
  },
  regionCode: { type: String, required: false },
  valid: { type: Boolean, required: false },
  possible: { type: Boolean, required: false },
  possibility: { type: String, required: false },
  isValid: { type: Boolean, required: false },
  country: {
    name: { type: String, required: false },
    iso2: { type: String, required: false },
    dialCode: { type: String, required: false },
    priority: { type: Number, required: false },
    areaCodes: { type: String, required: false },
  },
  canBeInternationallyDialled: { type: Boolean, required: false },
  type: { type: String, required: false },
}, {_id: false});

const Images = new Schema({
  large: {
    _id: { type: Schema.Types.ObjectId, required: false, ref: 'file-uploader' },
    file: { type: String, required: false }
  }
}, {_id: false});

const Address = new Schema({
  address1: { type: String, required: false },
  city: { type: String, required: false },
  country: { type: String, required: false },
  formatted: { type: String, required: false },
  latitude: { type: Number, required: false },
  longitude: { type: Number, required: false },
  name: { type: String, required: false },
  postal: { type: String, required: false },
  region: { type: String, required: false },
  googleAddress: { type: Object, required: false },
  uuid: { type: String, required: false }
});

const Files = new Schema({
  createdAt: Date,
  file: String,
  fileId: String,
  info: {},
  name: String,
  originalName: String,
  storage: String,
  updatedAt: Date,
  uploadChannel: String,
}, {_id: false});

const RRULE = new Schema({
  //https://icalendar.org/rrule-tool.html
  FREQ: { type: String, enum: ['YEARLY', 'WEEKLY', 'MONTHLY', 'DAILY', 'HOURLY', 'MINUTELY', null, ''] },
  INTERVAL: Number,
  UNTIL: Date,
  COUNT: Number,
  BYMONTH: [{ type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }], //month of an annual recurrance
  BYMINUTE: [Number],
  BYHOUR: [Number],
  BYDAY: [String], //ex [TU,TH] first & last sunday [1SU, -1SU]
  BYMONTHDAY: [{ type: Number, min: 1, max: 31 }],
  BYYEARDAY: [{ type: Number, min: 1, max: 365 }],
  BYWEEKNO: [{ type: Number, min: 1, max: 52 }],
  BYSTEPPOS: Number, //The third instance into the month of one of Tuesday, Wednesday, or Thursday, for the next 3 months:
  WKST: String, //day of the week to start weekly recurrance
}, { _id: false });

const Pricing = new Schema({
  currency: {type: String, enum: ['usd', 'ngn']},
  basePrice: Number
}, {_id: false});

const ProductVariant = new Schema({
  type: { type: String, enum: ['size', 'flavor', 'custom'], default: 'custom' },
  product: { type: Schema.Types.ObjectId, ref: 'products' },
  price: Pricing,
  settings: {
    default: Boolean,
  },
  images: [{type: Images}],
  name: String,
  description: String
});

const ProductOption = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'products' },
  price: Pricing,
  settings: {
    default: Boolean
  }
});

const productOrder = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'products' },
  productModel: {type: String, enum: ['crayv-products', 'crayv-product-groups']},
  quantity: Number,
  name: String,
  description: String,
  price: {
    basePrice: Number,
    promotion: { total: Number, id: {type: Schema.Types.ObjectId, ref: 'promotions'} },
    pricePaid: Number
  },
  promos: [],
  event: {id: String},
  priceObj: {
    value: Number,
    discount: Number,
    total: Number,
    taxTotal: Number,
    message: String,
    promo: Object,
    exp: Date,
    tax: {
      sales: { flat: Number, percentage: Number, notes: String },
      local: { flat: Number, percentage: Number, notes: String },
      other: { flat: Number, percentage: Number, notes: String },
    }
  },
  types: [{name: String, description: String}],
  settings: {},
  shipping: {},
  images: [{ type: Images }],
  variants: [{
    name: String,
    description: String,
    pricePaid: Number
  }],
  options: [{
    name: String,
    description: String,
    pricePaid: Number
  }],
  subscription: {
    id: {type: Schema.Types.ObjectId, ref: 'subscriptions'}
  },
  vendor: {
    id: {type: Schema.Types.ObjectId, ref: 'vendors'},
    name: { type: String }
  }
}, {timestamps: true});

const ProductSettings = new Schema({
  taxes: [{
    areaIds: [{type: String }], //'*' for all
    sales: {percentage: Number, flat: Number, notes: String},
    local: {percentage: Number, flat: Number, notes: String},
    other: {percentage: Number, flat: Number, notes: String}
  }],
  schedule: {type: Object},
  boundaries: { type: GeoLocation }
}, {_id: false});

const VendorSettings = new Schema({
  taxes: [{
    areaId: {type: String},
    area: {
      regions: [{ type: String }],
      countries: [{ type: String }],
      cities: [{ type: String }],
      postal_codes: [{ type: String }]
    },
    sales: {percentage: Number, flat: Number, notes: String},
    local: {percentage: Number, flat: Number, notes: String},
    other: {percentage: Number, flat: Number, notes: String}
  }],
  schedule: {type: Object},
  locations: [{type: Address}],
});

const privacyEnum = ['public', 'permission', 'private'];
const currencyEnum = ['usd', 'ngn'];

module.exports = {
  Phone,
  Images,
  RRULE,
  Address,
  Pricing,
  ProductOption,
  ProductSettings,
  ProductVariant,
  productOrder,
  VendorSettings,
  GeoLocation,
  UniquePhone,
  privacyEnum,
  currencyEnum,
  Files
};