const assert = require('assert');
const app = require('../../src/app');

describe('\'crayv-offers\' service', () => {
  it('registered the service', () => {
    const service = app.service('crayv-offers');

    assert.ok(service, 'Registered the service');
  });
});
