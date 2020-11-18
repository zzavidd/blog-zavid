import * as Dotenv from 'dotenv';
import Cloudinary from 'cloudinary';

import { fetch } from '..';
import { TRUNCATE_POST_TABLE_QUERY } from '../../src/private/api/queries/post.queries';

const cloudinary = Cloudinary.v2;
const dotenv = Dotenv.config({ path: '../../config.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const clearAllData = (): Promise<any> => {
  console.info(`Deleting all data from POST table...`);
  return new Promise((resolve, reject) => {
    Promise.all([
      fetch(TRUNCATE_POST_TABLE_QUERY),
      cloudinary.api.delete_resources_by_prefix('test')
    ])
      .then(() => resolve())
      .catch(reject);
  });
};
