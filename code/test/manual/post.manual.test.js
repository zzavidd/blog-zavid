const { classes } = require('..');
const { updatePost } = require('../helper/post.helper');

const { PostStatic, PostBuilder } = classes;

const POST_ID = 943;

const post = new PostBuilder()
  .random()
  .withType(PostStatic.TYPE.REVERIE)
  .withStatus(PostStatic.STATUS.PUBLISHED)
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
