import type { ImageProps as NextImageProps } from 'next/image';
import Image from 'next/image';
import { useSelector } from 'react-redux';

import { Theme } from 'classes/theme';
import type { AppState } from 'constants/reducers';
import Settings from 'constants/settings';

export function NextImage({ src, alt, ...props }: NextImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      src={`${Settings.CLOUDINARY_BASE_URL}/${src}`}
      placeholder={props.blurDataURL ? 'blur' : 'empty'}
    />
  );
}

export function SignatureImage({
  className,
  ...props
}: Omit<NextImageProps, 'src' | 'alt'>) {
  const theme = useSelector((state: AppState) =>
    Theme.switchTheme(state.local.appTheme),
  );
  return (
    <div className={className}>
      <NextImage
        width={392}
        height={309}
        {...props}
        src={`static/logos/signature-${theme}`}
        alt={'Z-Signature'}
      />
    </div>
  );
}

export function validateCloudinaryImage(image: string) {
  if (!image) return false;

  const regex = new RegExp(/(v[0-9]+|dynamic|static|test)\//);
  const match = image.match(regex);
  if (match === null) return false;

  return image.startsWith(match[0]);
}
