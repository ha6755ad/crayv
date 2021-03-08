const assert = require('assert');
const app = require('../../src/app');

describe('\'crayv-crowd-buy\' service', () => {
  it('registered the service', () => {
    const service = app.service('crayv-crowd-buy');

    assert.ok(service, 'Registered the service');
  });
});
