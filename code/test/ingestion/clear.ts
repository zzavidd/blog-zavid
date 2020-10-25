require('dotenv').config({ path: '../../config.env' });
const cloudinary = require('cloudinary').v2;

const { fetch } = require('..');
const {
  TRUNCATE_POST_TABLE_QUERY
} = require('../../src/private/api/queries/post.queries');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.clearAllData = (): Promise<any> => {
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
