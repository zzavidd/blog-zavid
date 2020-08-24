const cloudinary = require('cloudinary').v2;
const { zString } = require('zavid-modules');

const controller = require('./api/resolvers');
const { debug } = require('./error');
const knex = require('./singleton').getKnex();

const { Post } = require('../classes');

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
 * @param {boolean} [options.isCreateOperation] - Specifies if operation is update.
 * @returns {Promise} Resolves when function finishes.
 */
exports.uploadImage = (post, options = {}) => {
  const { imageHasChanged = true, isCreateOperation = true } = options;
  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => generateSlugAndFilename(post, isCreateOperation))
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
  if (!imageHasChanged) {
    return Promise.resolve()
      .then(() => generateSlugAndFilename(post, false))
      .then(({ slug }) => {
        post.slug = slug;
        return post;
      })
      .catch(debug);
  }

  return Promise.resolve()
    .then(() => controller.getSinglePost({ id }))
    .then((post) => this.destroyImage(post.image))
    .then(() =>
      this.uploadImage(post, { imageHasChanged, isCreateOperation: false })
    )
    .catch(debug);
};

/**
 * Construct slug and filenames.
 * @param {object} post - The post details.
 * @param {boolean} isCreateOperation - Specifies if operation is update.
 * @returns {Promise} Represents the directory, slug and filename for the post.
 */
const generateSlugAndFilename = (post, isCreateOperation) => {
  const isPage = Post.isPage(post.type);
  const title = zString.constructCleanSlug(post.title);

  if (isPage) {
    return Promise.resolve()
      .then(() => controller.getSinglePost({ id: post.domainId }))
      .then((postDomain) => {
        const slug = title;
        const filename = zString.constructCleanSlug(
          `${postDomain.title} ${post.title}`
        );
        const directory = Post.TYPES.PAGE.DIRECTORY;
        return { directory, filename, slug };
      })
      .catch(debug);
  } else {
    return Promise.resolve()
      .then(() => {
        return knex('posts')
          .count('id', { as: 'count' })
          .where('type', post.type);
      })
      .then(([{ count }]) => {
        const number = (isCreateOperation ? count + 1 : count)
          .toString()
          .padStart(3, '0');
        const directory = Post.getDirectory(post.type);
        const slug = title;
        const filename = `${number}-${title}`;

        return { directory, filename, slug };
      })
      .catch(debug);
  }
};
