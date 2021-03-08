const assert = require('assert');
const app = require('../../src/app');

describe('\'iy-events\' service', () => {
  it('registered the service', () => {
    const service = app.service('iy-events');

    assert.ok(service, 'Registered the service');
  });
});
