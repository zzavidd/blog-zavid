const { Post } = require('../../classes');
const { assert } = require('../setup');

describe('Unit Tests: Post', function () {
  it('Check post type', function (finish) {
    const reverie = new Post().random().withType(Post.TYPES.REVERIE.TITLE).build();
    assert.isTrue(Post.isReverie(reverie));
    assert.isTrue(Post.isReverie(reverie.type));

    const page = new Post().random().withType(Post.TYPES.PAGE.TITLE).build();
    assert.isTrue(Post.isPage(page));
    assert.isTrue(Post.isPage(page.type));
    finish();
  });

  it('Check post status', function (finish) {
    const draftPost = new Post().random().withStatus(Post.STATUSES.DRAFT).build();
    assert.isTrue(Post.isDraft(draftPost));
    assert.isTrue(Post.isDraft(draftPost.status));

    const privatePost = new Post().random().withStatus(Post.STATUSES.PRIVATE).build();
    assert.isTrue(Post.isPrivate(privatePost));
    assert.isTrue(Post.isPrivate(privatePost.status));

    const publishPost = new Post().random().withStatus(Post.STATUSES.PUBLISHED).build();
    assert.isTrue(Post.isPublish(publishPost));
    assert.isTrue(Post.isPublish(publishPost.status));
    finish();
  });
});