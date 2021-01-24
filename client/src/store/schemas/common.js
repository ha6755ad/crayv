// const mongoose = require('mongoose');
const RRULE = {
  FREQ: null,
  INTERVAL: null,
  UNTIL: null,
  COUNT: null,
  BYMONTH: [], //month of an annual recurrance
  BYMINUTE: [],
  BYHOUR: [],
  BYDAY: [], //ex [TU,TH] first & last sunday [1SU, -1SU]
  BYMONTHDAY: [],
  BYYEARDAY: [],
  BYWEEKNO: [],
  BYSTEPPOS: null, //The third instance into the month of one of Tuesday, Wednesday, or Thursday, for the next 3 months:
  WKST: null, //day of the week to start weekly recurrance
};

const Pricing = {
  basePrice: null,
  currency: 'usd'
};

const ProductVariant = {
  type: 'custom',
  product: null,
  images: [],
  price: Pricing,
  settings: { default: false },
  name: '',
  description: ''
};

const ProductOptions = {
  product: null,
  price: Pricing,
  settings: {
    default: false
  }
};
const ProductSettings = {
  trackInventory: undefined,
  taxExempt: undefined,
  syncSettings: undefined,
  capacity: undefined,
  taxes: undefined,
  schedule: {
    days: undefined,
    blackoutDates: undefined
  },
};

const VendorSettings = {
  trackInventory: undefined,
  automateTaxes: undefined,
  capacity: undefined,
  taxExempt: undefined,
  syncSettings: undefined,
  taxes: undefined,
  schedule: {
    days: undefined,
    blackoutDates: undefined
  },
};

const currencyEnum = ['usd', 'ngn'];

module.exports = {
  currencyEnum: currencyEnum,
  VendorSettings: VendorSettings,
  ProductSettings: ProductSettings,
  ProductVariant: ProductVariant,
  ProductOptions: ProductOptions,
  RRULE: RRULE,
  GeoLocation: {
    type: 'FeatureCollection',
    allowFeatures: [],
    features: [{
      schedule_items: [],
      geometry: {},
      properties: {},
      addresses: []
    }]
  },
  Phone: {
    phoneType: '',
    number: {
      input: '',
      international: '',
      national: '',
      e164: '',
      rfc3966: '',
      significant: ''
    },
    regionCode: '',
    valid: true,
    possible: null,
    possibility: '',
    isValid: true,
    country: {
      name: '',
      iso2: '',
      dialCode: '',
      priority: 0,
      areaCodes: ''
    },
    canBeInternationallyDialled: false,
    type: ''
  },
  Avatars: {
    raw: {
      file: ''
    }
  },
  Address: {
    address1: '',
    city: '',
    country: '',
    formatted: '',
    latitude: null,
    longitude: null,
    name: '',
    postal: '',
    region: '',
    googleAddress: {},
    uuid: ''
  }
};
