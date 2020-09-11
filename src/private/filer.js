const async = require('async');
const cloudinary = require('cloudinary').v2;
const { zString } = require('zavid-modules');

const { debug } = require('./error');

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
 * @param {boolean} [options.isTest] - Specifies if operation is a test.
 * @returns {Promise} Resolves when function finishes.
 */
exports.uploadImages = (post, options = {}) => {
  const { isTest = false } = options;

  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => generateSlugAndFilename(post))
      .then(({ directory, filename, slug }) => {
        post.slug = Post.isDraft(post) ? null : slug;

        const images = Post.collateImages(post);

        // Discontinue if no images.
        if (!images.length) {
          post.image = null;
          post.contentImages = null;
          return resolve(post);
        }

        async.transform(
          images,
          function (acc, image, key, callback) {
            const { hasChanged, source, isCover } = image;
            if (!hasChanged) {
              acc[key] = source;
              return callback(null);
            }

            const uri = isTest
              ? `test/${filename}`
              : isCover
              ? `dynamic/${directory}/${filename}`
              : `dynamic/${directory}/content/${filename}`;

            const contentImageKey = key.toString().padStart(2, '0');
            const publicId = isCover ? uri : `${uri}-${contentImageKey}`;

            cloudinary.uploader.upload(
              source,
              {
                public_id: publicId,
                unique_filename: false
              },
              (err, result) => {
                if (err) return callback(err);
                const { version, public_id, format } = result;
                acc[key] = `v${version}/${public_id}.${format}`;
                callback(null);
              }
            );
          },
          function (err, results) {
            if (err) return reject(err);

            const contentImageRegex = new RegExp(/.*\-[0-9]{2}\.[a-z]+/);
            const contentImages = [];

            // Store return image information in post object.
            results.forEach((result) => {
              if (contentImageRegex.test(result)) {
                contentImages.push(result);
              } else {
                post.image = result;
              }
            });

            post.contentImages = contentImages.length
              ? JSON.stringify(contentImages)
              : null;
            resolve(post);
          }
        );
      });
  });
};

/**
 * Delete post image from cloudinary.
 * @param {string} image - The post image source.
 * @returns {Promise} Resolves when function finishes.
 */
exports.destroyImage = (image) => {
  return new Promise((resolve, reject) => {
    if (!image) return resolve();

    const regex = new RegExp(
      /(?:v[0-9]+\/)((?:dynamic|static|test)\/.*)(?:\.[a-z]+)/
    );
    if (!regex.test(image)) return resolve();

    const publicId = image.match(regex)[1];
    cloudinary.uploader.destroy(
      publicId,
      { invalidate: true },
      (err, { result }) => {
        if (err) return reject(err);
        if (result !== 'ok') {
          const error = `Attempt to delete Cloudinary image; result is '${result}'. Using public ID: ${publicId}`;
          return reject(new Error(error));
        }

        resolve();
      }
    );
  });
};

/**
 * Replaces image on the cloud.
 * @param {number} id - The ID of the post.
 * @param {object} post - The post object.
 * @param {object} [options] - Upload options.
 * @param {boolean} [options.isTest] - Specifies if test.
 * @returns {Promise} Resolves when function finishes.
 */
exports.replaceImages = (id, post, options) => {
  const { isTest = false } = options;

  return Promise.resolve()
    .then(() => {
      const { getSinglePost } = require('./api/resolvers/post.resolvers').Query;
      return getSinglePost(undefined, { id });
    })
    .then((postInDb) => {
      const imagesInRequest = Post.collateImages(post, { includeNulls: true });
      const imagesInDb = Post.collateImages(postInDb);

      const promises = [];

      // Delete images which have changed.
      imagesInRequest.forEach((image, key) => {
        const shouldDeleteImage =
          image && image.hasChanged && key <= imagesInDb.length - 1;
        if (shouldDeleteImage) {
          const imageToDelete = imagesInDb[key];
          promises.push(this.destroyImage(imageToDelete));
        }
      });
      return Promise.all(promises);
    })
    .then(() => this.uploadImages(post, { isTest }))
    .catch(debug);
};

/**
 * Construct slug and filenames.
 * @param {object} post - The post details.
 * @param {boolean} isCreateOperation - Specifies if operation is update.
 * @returns {Promise} Represents the directory, slug and filename for the post.
 */
const generateSlugAndFilename = (post) => {
  const isPage = Post.isPage(post.type);
  const title = zString.constructCleanSlug(post.title);

  if (isPage) {
    return Promise.resolve()
      .then(() => {
        const {
          getSinglePost
        } = require('./api/resolvers/post.resolvers').Query;
        return getSinglePost(undefined, { id: post.domainId });
      })
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
        const directory = Post.getDirectory(post.type);
        const slug = title;
        const number = post.typeId.toString().padStart(3, '0');
        const filename = `${number}-${title}`;

        return { directory, filename, slug };
      })
      .catch(debug);
  }
};
