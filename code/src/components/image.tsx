import classnames from 'classnames';
import { Image, CloudinaryContext, Transformation } from 'cloudinary-react';
import React, { CSSProperties } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';

export { cloudinaryBaseUrl } from 'src/constants/settings';

interface CloudImageProps {
  src: string;
  alt?: string;
  aspectRatio?: AspectRatio;
  containerClassName?: string;
  imageClassName?: string;
  style?: CSSProperties;
  title?: string;
  version?: number;
}

export enum AspectRatio {
  SQUARE = '1:1',
  WIDE = '16:9'
}

export const validateCloudinaryImage = (image) => {
  if (!image) return false;

  const regex = new RegExp(/(v[0-9]+|dynamic|static|test)\//);
  const match = image.match(regex);
  if (match === null) return false;

  return image.startsWith(match[0]);
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
}: CloudImageProps) => {
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
  let theme = useSelector(({ theme }: RootStateOrAny) => theme);
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
