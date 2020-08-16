const cloudinary = require('cloudinary').v2;
const { zString } = require('zavid-modules');

const controller = require('./api/resolvers');
const knex = require('./singleton/knex').getKnex();

const { POST_TYPES } = require('../constants/strings');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload post image cloudinary.
 * @param {object} post - The post object.
 * @param {object} [options] - Upload options.
 * @param {boolean} [options.imageHasChanged] - Indicates if images has changed.
 * @param {boolean} [options.shouldIncrement] - Whether ID should be incremented in filename generation.
 * @returns {Promise} Resolves when function finishes.
 */
exports.uploadImage = (post, options) => {
  const { imageHasChanged = true, shouldIncrement = true } = options;
  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => generateSlugAndFilename(post, shouldIncrement))
      .then(({ directory, filename, slug }) => {
        post.slug = slug;

        // Discontinue if image has not changed
        const noImageUpload = !imageHasChanged || !post.image;
        if (noImageUpload) return resolve(post);

        // Upload to cloudinary
        cloudinary.uploader.upload(
          post.image,
          {
            public_id: `dynamic/${directory}/${filename}`,
            unique_filename: false
          },
          (err, result) => {
            if (err) return reject(err);
            const { public_id, version, format } = result;
            post.image = `v${version}/${public_id}.${format}`;
            resolve(post);
          }
        );
      });
  });
};

/**
 * Delete post image from cloudinary.
 * @param {string} image - The post image.
 * @returns {Promise} Resolves when function finishes.
 */
exports.destroyImage = (image) => {
  return new Promise((resolve) => {
    if (!image) return resolve();

    const public_id = image.substring(
      image.indexOf('/') + 1,
      image.indexOf('.')
    );
    cloudinary.uploader.destroy(public_id, (err) => {
      if (err) console.warn(err);
      resolve();
    });
  });
};

exports.replaceImage = (id, post, imageHasChanged) => {
  return Promise.resolve()
    .then(() => controller.getSinglePost({ id }))
    .then((post) => this.destroyImage(post.image))
    .then(() =>
      this.uploadImage(post, { imageHasChanged, shouldIncrement: false })
    )
    .catch(console.error);
};

/**
 * Construct slug and filenames.
 * @param {object} post - The post details.
 * @param {boolean} shouldIncrement - Whether the ID should be incremented in filename generation.
 * @returns {Promise} Represents the directory, slug and filename for the post.
 */
const generateSlugAndFilename = (post, shouldIncrement) => {
  return Promise.resolve()
    .then(() => {
      return knex('posts')
        .count('id', { as: 'count' })
        .where('type', post.type);
    })
    .then(([res]) => {
      const number = (shouldIncrement ? res.count + 1 : res.count)
        .toString()
        .padStart(3, '0');
      const slug = zString.constructCleanSlug(post.title);
      const filename = `${number}-${slug}`;

      const directory = Object.values(POST_TYPES).find(
        (POST) => POST.TITLE === post.type
      ).DIRECTORY;

      return { directory, filename, slug };
    })
    .catch(console.error);
};
