const { Post, PostBuilder } = require('../../classes');
const { submitPost, updatePost, deletePost } = require('../helper/post.helper');

const POST_ID = 918;

describe('Publish post, expect email', function () {
  xit('Create', function (finish) {
    const post = new PostBuilder()
      .random({ withImage: true })
      .withStatus(Post.STATUSES.PUBLISHED)
      .build();

    submitPost(
      post,
      (readPost) => {
        // return deletePost(readPost.id, finish);
        finish();
      },
      true
    );
  });

  it('Without image', function (finish) {
    const postForUpdate = new PostBuilder()
      .random({withImage: true})
      .withType(Post.TYPES.REVERIE.TITLE)
      .withStatus(Post.STATUSES.PUBLISHED)
      .build();

    updatePost(
      POST_ID,
      postForUpdate,
      () => {
        finish();
      },
      true
    );
  });
});
