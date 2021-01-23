import { PostBuilder, PostStatus } from '../../../classes';
import * as PostHelper from '../../helper/post.helper';
import { tryWrapper } from '../helper';

const POST_ID = 1;

export async function submitPost() {
  const post = new PostBuilder().random().build();
  await tryWrapper(
    PostHelper.createPost(post, {
      extraVariables: { isPublish: true }
    })
  );
}

export async function updatePost() {
  const post = new PostBuilder()
    .random()
    .withStatus(PostStatus.PUBLISHED)
    .build();

  await tryWrapper(
    PostHelper.updatePost(POST_ID, post, {
      extraVariables: { isPublish: true }
    })
  );
}
