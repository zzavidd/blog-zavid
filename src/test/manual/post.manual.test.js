const { Post, PostBuilder } = require('../../classes');
const { submitPost, updatePost } = require('../helper/post.helper');

const POST_ID = 918;

publishUpdate();

function publishSubmit() {
  const post = new PostBuilder()
    .random({ withImage: true })
    .withStatus(Post.STATUSES.PUBLISHED)
    .build();

  submitPost(
    post,
    () => {
      finish();
    },
    true
  );
}

function publishUpdate() {
  const postForUpdate = new PostBuilder()
    .random({ withImage: true })
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
}

function finish() {
  process.exit(0);
}
