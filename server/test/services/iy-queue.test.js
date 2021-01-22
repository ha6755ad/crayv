const assert = require('assert');
const app = require('../../src/app');

describe('\'iy-queue\' service', () => {
  it('registered the service', () => {
    const service = app.service('iy-queue');

    assert.ok(service, 'Registered the service');
  });
});
