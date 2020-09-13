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
export const TRANSFORMATIONS = {
  SMALL_SQUARE: { width: 400, height: 400 },
  SMALL_WIDE: { width: 640, height: 360 },
  MEDIUM_SMALL: { width: 800, height: 800 },
  MEDIUM_WIDE: { width: 1280, height: 720 }
};

export default ({
  alt,
  containerClassName,
  imageClassName,
  lazy,
  src,
  style,
  title,
  transformations,
  version
}) => {
  if (!src) return null;

  const publicId = version ? `v${version}/${src}` : src;
  const { width, height } = lazy || {};
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
        <Transformation
          width={width}
          height={height}
          crop={'lfill'}
          {...transformations}
        />
      </Image>
    </CloudinaryContext>
  );
};
