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
import ImmutabilityHelper from 'immutability-helper';
import type { BaseSyntheticEvent } from 'react';
import React, { useEffect } from 'react';
import type { Fetcher } from 'swr';
import useSWR from 'swr';

import { WishlistPageContext } from 'utils/contexts';

import * as Styles from '../WishlistForm.styles';

const HELPER_TEXT = (
  <Typography variant={'caption'}>
    Press <strong>Enter</strong> to load image.
  </Typography>
);
const ERROR_TEXT = 'Failed to fetch image. Is the URL valid?';

const fetcher: Fetcher<string, string> = async (url) => {
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
    error: undefined,
    image: undefined,
    shouldFetch: false,
    showHelperText: false,
  });

  const [context, setContext] = React.useContext(WishlistPageContext);
  const { wishlistItemRequest } = context;

  const swrKey = state.shouldFetch ? state.image : null;
  const { error: imageLoadError, isLoading: isImageLoading } = useSWR(
    swrKey,
    fetcher,
    {
      onSuccess: (data) => {
        setState((current) => ({
          ...current,
          image: data,
          shouldFetch: false,
        }));
      },
    },
  );
  const isError = imageLoadError ?? state.error;

  useEffect(() => {
    setState((current) => ({ ...current, error: undefined }));
  }, [wishlistItemRequest.image]);

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setContext((current) =>
      ImmutabilityHelper(current, {
        wishlistItemRequest: {
          image: { $set: e.target.value },
        },
      }),
    );
  }

  function loadImage() {
    setState((current) => ({
      ...current,
      image: wishlistItemRequest.image,
      shouldFetch: true,
    }));
  }

  function removeImage() {
    setState((current) => ({
      ...current,
      image: undefined,
    }));
  }

  function onEnterPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      loadImage();
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
      <Styles.ImagePreviewStack>
        <Styles.RemoveImageButton onClick={removeImage}>
          <CloseIcon />
        </Styles.RemoveImageButton>
        <Styles.ImagePreview src={state.image} onError={onImageError} />
      </Styles.ImagePreviewStack>
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
  error: BaseSyntheticEvent | undefined;
  image: string | undefined;
  shouldFetch: boolean;
  showHelperText: boolean;
}
