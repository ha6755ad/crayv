const assert = require('assert');
const app = require('../../src/app');

describe('\'iy-cron-tasks\' service', () => {
  it('registered the service', () => {
    const service = app.service('iy-cron-tasks');

    assert.ok(service, 'Registered the service');
  });
});
