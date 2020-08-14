const cloudinary = require('cloudinary').v2;
const { formatISODate } = require('zavid-modules');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
  uploadImage: (entity, directory, changed, callback) => {
    let filename;

    switch (directory) {
      case 'sessions':
        entity.slug = module.exports.generateSlug(entity.title);
        filename = module.exports.generateSessionFilename(
          entity.dateHeld,
          entity.slug
        );
        break;
    }

    if (!changed) return callback(null, entity);

    const env = process.env.LOCAL_ENV === 'true' ? 'dev' : 'prod';

    cloudinary.uploader.upload(
      entity.image,
      {
        public_id: `${env}/${directory}/${filename}`,
        width: 1000,
        height: 1000,
        crop: 'limit',
        unique_filename: false
      },
      (err, result) => {
        if (err) return callback(err);
        const { public_id, version, format } = result;
        entity.image = `v${version}/${public_id}.${format}`;
        callback(null, entity);
      }
    );
  },

  destroyImage: (image, changed, callback) => {
    if (!image || !changed) return callback(null);

    const public_id = image.substring(
      image.indexOf('/') + 1,
      image.indexOf('.')
    );
    cloudinary.uploader.destroy(public_id, (err) => {
      if (err) console.warn(err);
      callback(null);
    });
  },

  /** Generate slugs for URLs */
  generateSlug: (slug) => {
    return slug
      .toLowerCase() // Turn to lowercase
      .replace(/[^a-zA-Z 0-9]+/g, '') // Remove all non-alphanumeric characters
      .replace(/\s+/g, '-'); // Replace spaces with dashes
  },

  /** Generate filenames from entities */
  generateSessionFilename: (date, slug) => `${formatISODate(date)}_${slug}`,
  generateCandidateFilename: (id, slug) => `${id}_${slug}`,
  generateMemberFilename: (slug) => slug,
  generateReviewFilename: (rating, slug) => `${rating}-${slug}`
};
