import {
  CloudinaryContext,
  Image as CloudinaryImage,
  Transformation,
} from 'cloudinary-react';
import type { ImageProps as NextImageProps } from 'next/image';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';

import { Theme } from 'classes/theme';
import type { AppState } from 'constants/reducers';
import { CLOUDINARY_BASE_URL } from 'constants/settings';

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
      <CloudinaryImage
        publicId={publicId}
        alt={alt}
        title={title}
        width={'100%'}
        className={imageClassName}>
        <Transformation aspectRatio={aspectRatio} crop={'lfill'} />
      </CloudinaryImage>
    </CloudinaryContext>
  );
}

export function NextImage({ src, ...props }: NextImageProps) {
  return <Image {...props} src={`${CLOUDINARY_BASE_URL}/${src}`} />;
}

export function SignatureImage(props: React.HTMLAttributes<HTMLDivElement>) {
  const theme = useSelector((state: AppState) =>
    Theme.switchTheme(state.appTheme),
  );
  return (
    <div {...props}>
      <Image
        src={`${CLOUDINARY_BASE_URL}/static/logos/signature-${theme}`}
        alt={'Z-Signature'}
        width={392}
        height={309}
        layout={'responsive'}
      />
    </div>
  );
}

export default CloudImage;
