const assert = require('assert');
const app = require('../../src/app');

describe('\'mapbox-boundaries\' service', () => {
  it('registered the service', () => {
    const service = app.service('mapbox-boundaries');

    assert.ok(service, 'Registered the service');
  });
});
