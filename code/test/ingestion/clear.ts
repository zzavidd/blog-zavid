import Cloudinary from 'cloudinary';
import * as dotenv from 'dotenv';

import { fetch } from '..';
import { CLEAR_DIARY_QUERY } from '../../src/private/api/queries/diary.queries';
import { CLEAR_POSTS_QUERY } from '../../src/private/api/queries/post.queries';
import { CLEAR_SUBSCRIBERS_QUERY } from '../../src/private/api/queries/subscriber.queries';

const cloudinary = Cloudinary.v2;

dotenv.config({ path: '../../.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function clearAllData() {
  console.info(`Deleting all data from database...`);
  await Promise.all([
    fetch(CLEAR_POSTS_QUERY),
    fetch(CLEAR_DIARY_QUERY),
    fetch(CLEAR_SUBSCRIBERS_QUERY),
    cloudinary.api.delete_resources_by_prefix('test'),
  ]);
  console.info('Successfully cleared all data from database.');
}
