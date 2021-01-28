import Vue from 'vue';

const lget = require('lodash.get');
const { booleanPointInPolygon } = require('@turf/turf');

const localUuid = () => {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

const createGeoJSONCircle = (center, radiusInKm, points) => {
  if (!points) points = 64;

  let coords = {
    latitude: center[1],
    longitude: center[0]
  };

  let km = radiusInKm;

  let ret = [];
  let distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
  let distanceY = km / 110.574;

  let theta, x, y;
  for (let i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI);
    x = distanceX * Math.cos(theta);
    y = distanceY * Math.sin(theta);

    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]);

  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ret]
      }
    }]
  };
};

export default async () => {
  Vue.prototype.$createGeoJSONCircle = (center, radiusKm, points) => {
    if (center && radiusKm) {
      return createGeoJSONCircle(center, radiusKm, points);
    } else return null;
  };

  Vue.prototype.$orgTypeCheck = (obj) => {
    let org = lget(obj, 'org');
    let type = lget(obj, 'type');
    return lget(org, 'types', []).includes(type);
  };

  Vue.prototype.$orgServingPoint = (org, location) => {
    let test = false;
    let def = lget(org, 'settings.offerings.geo.features', []);
    // console.log('def', def)
    def.forEach(feature => {
      console.log('feature', feature, location, booleanPointInPolygon(location, feature));
      if (booleanPointInPolygon(location, feature)) return test = true;
    });
    if (!test) {
      let boundaries = lget(org, 'settings.boundaries', []);
      boundaries.forEach(setting => {
        let geo = lget(setting, 'geo.features', []);
        geo.forEach(feature => {
          if (booleanPointInPolygon(location, feature)) return test = true;
        });
      });
    }
    console.log('returning test', test);
    return test;
  };

  Vue.prototype.$getOrgPricing = (offerings, location) => {
    let pricing = null;
    if (lget(offerings, [0])) {
      for (let i = 0; i < offerings.length; i++) {
        let geo = lget(offerings, [i, 'geo', 'features'], []);
        geo.forEach(feature => {
          if (booleanPointInPolygon(location, feature)) pricing = lget(offerings, [i]);
        });
      }
    }
    // console.log('returning pricing', pricing)
    return pricing;
  };
  // expected that position comes in [lat,lng]
  Vue.prototype.$tomtomToAddress = (address) => {
    let addressObj = {
      uuid: localUuid(),
      formatted: lget(address, 'address.freeformAddress', null),
      address1: lget(address, 'address.streetNumber', '') + ' ' + lget(address, 'address.streetName', ''),
      region: lget(address, 'address.countrySubdivision', ''),
      city: lget(address, 'address.municipality', ''),
      postal: lget(address, 'address.postalCode', ''),
      country: lget(address, 'address.country', ''),
      latitude: Number(address.position.lat),
      longitude: Number(address.position.lon),
      tomtomAddress: address.address
    };
    return addressObj;
  };
};
