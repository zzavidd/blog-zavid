import classnames from 'classnames';
import { Image, CloudinaryContext, Transformation } from 'cloudinary-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { cloudinaryBaseUrl as url } from 'constants/settings';

export const cloudinaryBaseUrl = url;

export const validateCloudinaryImage = (image) => {
  if (!image) return false;

  const regex = new RegExp(/(v[0-9]+|dynamic|static|test)\//);
  const match = image.match(regex);
  if (match === null) return false;

  return image.startsWith(match[0]);
};

export const ASPECT_RATIO = {
  SQUARE: '1:1',
  WIDE: '16:9'
};

const CloudImage = ({
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

export const Signature = ({ className }) => {
  let theme = useSelector(({ theme }) => theme);
  theme = theme === 'light' ? 'dark' : 'light';

  const classes = classnames('signature', className);
  return (
    <CloudImage
      src={`static/logos/signature-${theme}`}
      containerClassName={classes}
    />
  );
};

export default CloudImage;
