const cloudinary = require('cloudinary').v2;

const { assert } = require('..');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.retrieveResource = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.api.resources_by_ids(publicId, function (err, { resources }) {
      if (err) return reject(err);
      return resolve(resources);
    });
  });
};

exports.extractPublicId = (image) => {
  const ex = new Error(`Could not get public ID from ${image}`);
  if (!image) throw ex;

  const regex = new RegExp(
    /^(?:v[0-9]+\/)?((?:dynamic|static|test)\/.*)(?:\.[a-z]+)$/
  );
  const match = image.match(regex);
  assert.isOk(match);
  return match[1];
};