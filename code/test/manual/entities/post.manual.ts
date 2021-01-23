import { PostBuilder, PostStatus } from '../../../classes';
import * as PostHelper from '../../helper/post.helper';

const POST_ID = 1;

export async function submitPost() {
  const post = new PostBuilder().random().build();
  try {
    await PostHelper.createPost(post, {
      extraVariables: { isPublish: true }
    });
    console.info('Notifications sent successfully.'.green);
  } catch (error) {
    console.error((error as string).red);
  }
}

export async function updatePost() {
  const post = new PostBuilder()
    .random()
    .withStatus(PostStatus.PUBLISHED)
    .build();

  try {
    await PostHelper.updatePost(POST_ID, post, {
      extraVariables: { isPublish: true }
    });
    console.info('Notifications sent successfully.'.green);
  } catch (error) {
    console.error((error as string).red);
  }
}
