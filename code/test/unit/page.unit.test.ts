import { assert } from '..';
import { PageBuilder } from '../../classes';

describe('Unit Tests: Page', function () {
  describe('Object methods', function () {
    it('Test random construction', function (finish) {
      const page = new PageBuilder().random().build();
      assert.hasAllKeys(page, [
        'title',
        'content',
        'excerpt',
        'slug',
        'isEmbed'
      ]);
      finish();
    });
  });
});
