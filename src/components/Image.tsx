import type { BoxProps } from '@mui/material';
import { Box, useTheme } from '@mui/material';
import type { ImageProps as NextImageProps } from 'next/image';
import NextDefaultImage from 'next/image';
import { useEffect, useState } from 'react';

export function NextImage(props: NextImageProps) {
  const [state, setState] = useState({
    height: props.height ?? 0,
    width: props.width ?? 0,
  });

  useEffect(() => {
    const img = new Image();
    img.onload = () => setState({ height: img.height, width: img.width });
    if (state.height && state.width) return;
    if (typeof props.src === 'string') {
      img.src = props.src;
    }
  }, [props.src, state.height, state.width]);

  return (
    <NextDefaultImage
      {...props}
      {...state}
      placeholder={props.blurDataURL ? 'blur' : 'empty'}
      style={{
        height: '100%',
        objectFit: 'contain',
        width: '100%',
        ...props.style,
      }}
    />
  );
}

export function Signature(props: BoxProps) {
  const theme = useTheme();
  const oppositeTheme = theme.palette.mode === 'light' ? 'dark' : 'light';

  return (
    <Box {...props}>
      <NextDefaultImage
        width={392}
        height={309}
        src={`static/logos/signature-${oppositeTheme}`}
        alt={'Z-Signature'}
        priority={true}
        style={{ height: '100%', width: '100%' }}
      />
    </Box>
  );
}
