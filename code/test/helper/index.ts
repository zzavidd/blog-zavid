import * as Cloudinary from 'cloudinary';
const cloudinary = Cloudinary.v2;

import { assert } from '..';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const retrieveResource = (publicId: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    cloudinary.api.resources_by_ids(publicId, function (
      err: any,
      { resources }: any
    ) {
      if (err) return reject(err);
      return resolve(resources);
    });
  });
};

export const extractPublicId = (image: string): string => {
  const ex = new Error(`Could not get public ID from ${image}`);
  if (!image) throw ex;

  const regex = new RegExp(
    /^(?:v[0-9]+\/)?((?:dynamic|static|test)\/.*)(?:\.[a-z]+)$/
  );
  const match = image.match(regex);
  assert.isOk(match);
  return match![1];
};
