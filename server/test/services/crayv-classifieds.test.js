const assert = require('assert');
const app = require('../../src/app');

describe('\'crayv-classifieds\' service', () => {
  it('registered the service', () => {
    const service = app.service('crayv-classifieds');

    assert.ok(service, 'Registered the service');
  });
});
