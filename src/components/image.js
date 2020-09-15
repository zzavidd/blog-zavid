/* eslint-disable import/order */
import React from 'react';
import { Image, CloudinaryContext, Transformation } from 'cloudinary-react';

import { cloudinaryBaseUrl as url } from 'constants/settings';

export const cloudinaryBaseUrl = url;

export const validateCloudinaryImage = (image) => {
  if (!image) return false;

  const regex = new RegExp(/(v[0-9]+|dynamic|static|test)\//);
  const match = image.match(regex);
  if (match === null) return false;

  return image.startsWith(match[0]);
};

/**
 * Constants for Cloudinary lazy transformations.
 * Size: s = small, m = medium
 * Shape: s = square, w = wide
 */
export const ASPECT_RATIO = {
  SQUARE: '1:1',
  WIDE: '16:9'
};

export default ({
  alt,
  aspectRatio,
  containerClassName,
  imageClassName,
  src,
  style,
  title,
  version
}) => {
  if (!src) return null;

  const publicId = version ? `v${version}/${src}` : src;
  return (
    <CloudinaryContext
      cloudName={'zavid'}
      className={containerClassName}
      style={style}>
      <Image
        publicId={publicId}
        alt={alt}
        title={title}
        width={'100%'}
        className={imageClassName}>
        <Transformation aspectRatio={aspectRatio} crop={'lfill'} />
      </Image>
    </CloudinaryContext>
  );
};
