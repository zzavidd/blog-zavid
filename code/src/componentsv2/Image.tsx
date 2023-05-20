import { useTheme } from '@mui/material';
import type { ImageProps as NextImageProps } from 'next/image';
import NextDefaultImage from 'next/image';
import { useEffect, useState } from 'react';

import Settings from 'constants/settings';

export function NextImage(props: NextImageProps) {
  const [state, setState] = useState({
    height: 0,
    width: 0,
  });
  const src = `${Settings.CLOUDINARY_BASE_URL}/${props.src}`;

  useEffect(() => {
    const img = new Image();
    img.onload = () => setState({ height: img.height, width: img.width });
    if (state.height && state.width) return;
    img.src = src;
  }, [src, state.height, state.width]);

  return (
    <NextDefaultImage
      {...props}
      {...state}
      src={src}
      placeholder={props.blurDataURL ? 'blur' : 'empty'}
    />
  );
}

export function Signature(props: Omit<NextImageProps, 'src' | 'alt'>) {
  const theme = useTheme();
  return (
    <NextImage
      width={392}
      height={309}
      {...props}
      src={`static/logos/signature-${theme.palette.mode}`}
      alt={'Z-Signature'}
    />
  );
}
