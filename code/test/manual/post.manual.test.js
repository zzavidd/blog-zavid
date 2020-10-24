const { Post, PostBuilder } = require('../../classes');
const { updatePost } = require('../helper/post.helper');

const POST_ID = 943;

const post = new PostBuilder()
  .random()
  .withType(Post.TYPES.REVERIE.TITLE)
  .withStatus(Post.STATUSES.PUBLISHED)
  .build();

updatePost(
  POST_ID,
  post,
  () => {
    console.info('Completed.');
    process.exit(0);
  },
  true
);
