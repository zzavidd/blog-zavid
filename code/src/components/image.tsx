import classnames from 'classnames';
import { Image, CloudinaryContext, Transformation } from 'cloudinary-react';
import type { CSSProperties } from 'react';
import React from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';

import { Theme } from 'classes/theme';

export { CLOUDINARY_BASE_URL as cloudinaryBaseUrl } from 'constants/settings';

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
  TALL = '9:16',
  WIDE = '16:9',
}

export const validateCloudinaryImage = (image: string) => {
  if (!image) return false;

  const regex = new RegExp(/(v[0-9]+|dynamic|static|test)\//);
  const match = image.match(regex);
  if (match === null) return false;

  return image.startsWith(match[0]);
};

function CloudImage({
  alt,
  aspectRatio,
  containerClassName,
  imageClassName,
  src,
  style,
  title,
  version,
}: CloudImageProps) {
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
}

export function Signature({ className }: Signature) {
  const theme = useSelector(({ theme }: RootStateOrAny) =>
    Theme.switchTheme(theme),
  );

  const classes = classnames('signature', className);
  return (
    <CloudImage
      src={`static/logos/signature-${theme}`}
      containerClassName={classes}
      alt={'Z-Signature'}
    />
  );
}

interface Signature {
  className?: string;
}

export default CloudImage;
