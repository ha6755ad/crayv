const assert = require('assert');
const app = require('../../src/app');

describe('\'iy-queue-logs\' service', () => {
  it('registered the service', () => {
    const service = app.service('iy-queue-logs');

    assert.ok(service, 'Registered the service');
  });
});
