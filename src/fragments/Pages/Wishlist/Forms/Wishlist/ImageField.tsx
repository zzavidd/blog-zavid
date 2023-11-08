import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import immutate from 'immutability-helper';
import type { BaseSyntheticEvent } from 'react';
import React, { useEffect } from 'react';

import { WishlistContext } from '../../WishlistContext';

const HELPER_TEXT = (
  <Typography variant={'caption'}>
    Press <strong>Enter</strong> to load image.
  </Typography>
);
const ERROR_TEXT = 'Failed to fetch image. Is the URL valid?';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img.src);
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
};

export default function ImageField() {
  const [state, setState] = React.useState<ImageFieldState>({
    image: null,
    error: undefined,
    showHelperText: false,
  });

  const [context, setContext] = React.useContext(WishlistContext);
  const { wishlistItemRequest } = context;

  useEffect(() => {
    setState((current) => ({ ...current, error: undefined }));
  }, [wishlistItemRequest.image]);

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setContext((current) =>
      immutate(current, {
        wishlistItemRequest: {
          image: { $set: e.target.value },
        },
      }),
    );
  }

  async function loadImage() {
    const res = await fetch(wishlistItemRequest.image);
    const blob = await res.blob();
    const data = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img.src);
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });

    setState((current) => ({
      ...current,
      image: data,
    }));
  }

  function removeImage() {
    setState((current) => ({
      ...current,
      image: undefined,
    }));
  }

  async function onEnterPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      await loadImage();
    }
  }

  function onImageError(e: BaseSyntheticEvent) {
    setState((current) => ({
      ...current,
      error: e,
      image: undefined,
    }));
  }

  function onFocus() {
    setState((current) => ({
      ...current,
      showHelperText: true,
    }));
  }

  function onBlur() {
    setState((current) => ({
      ...current,
      showHelperText: false,
    }));
  }

  function Image() {
    if (!state.image || imageLoadError) {
      return null;
    }

    return (
      <Stack>
        <IconButton onClick={removeImage}>
          <CloseIcon />
        </IconButton>
        <img src={state.image} onError={onImageError} />
      </Stack>
    );
  }

  const helperText = isError ? ERROR_TEXT : HELPER_TEXT;

  return (
    <FormControl>
      <Stack spacing={4}>
        <TextField
          type={'url'}
          name={'image'}
          label={'Image URL:'}
          placeholder={'https://example.com'}
          value={wishlistItemRequest.image}
          onChange={onImageChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onEnterPress}
          error={isError}
          helperText={state.showHelperText ? helperText : null}
          InputProps={{
            startAdornment: (
              <InputAdornment position={'start'}>
                <ImageIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position={'end'}>
                {isImageLoading ? (
                  <CircularProgress size={12} />
                ) : (
                  <Tooltip title={'Load image'}>
                    <IconButton onClick={loadImage} size={'small'}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </InputAdornment>
            ),
          }}
        />
        <Image />
      </Stack>
    </FormControl>
  );
}

interface ImageFieldState {
  image: string | null;
  error: BaseSyntheticEvent | undefined;
  showHelperText: boolean;
}
