import Cloudinary from 'cloudinary';
import * as dotenv from 'dotenv';

import { fetch } from '..';
import { TRUNCATE_POST_TABLE_QUERY } from '../../src/private/api/queries/post.queries';

const cloudinary = Cloudinary.v2;

dotenv.config({ path: '../../config.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function clearAllData() {
  console.info(`Deleting all data from POST table...`);
  await Promise.all([
    fetch(TRUNCATE_POST_TABLE_QUERY),
    cloudinary.api.delete_resources_by_prefix('test')
  ]);
  console.info("Cleared all data from database.");
}
