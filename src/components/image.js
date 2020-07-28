/* eslint-disable import/order */
import React from 'react';
import { Image, CloudinaryContext, Transformation } from 'cloudinary-react';

export const baseUrl = 'https://res.cloudinary.com/zavid/image/upload';

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

export const CloudinaryImage = ({
  alt,
  className,
  lazy,
  ref,
  src,
  style,
  title,
  version
}) => {
  if (!src) return null;

  const publicId = version ? `${version}/${src}` : src;
  const { width, height } = lazy || {};
  return (
    <CloudinaryContext
      cloudName={'zavid'}
      className={className}
      style={style}>
      <Image
        publicId={publicId}
        alt={alt}
        title={title}
        width={'100%'}
        ref={ref}>
        <Transformation width={width} height={height} crop={'lfill'} />
      </Image>
    </CloudinaryContext>
  );
};