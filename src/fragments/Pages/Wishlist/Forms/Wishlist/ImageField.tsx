import { HideImageOutlined } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import {
  Box,
  CircularProgress,
  Fade,
  FormControl,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import immutate from 'immutability-helper';
import type React from 'react';
import { useContext } from 'react';

import { useImage } from 'utils/hooks';

import { WishlistContext } from '../../WishlistContext';

const ERROR_TEXT = 'Failed to fetch image. Is the URL valid?';

export default function ImageField() {
  const [context, setContext] = useContext(WishlistContext);
  const { wishlistItemRequest } = context;

  const { data: image, error, isLoading } = useImage(wishlistItemRequest.image);

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setContext((current) =>
      immutate(current, {
        wishlistItemRequest: {
          image: { $set: e.target.value },
        },
      }),
    );
  }

  function ImagePreview() {
    if (!wishlistItemRequest.image) return null;

    if (isLoading) {
      return (
        <Stack
          justifyContent={'center'}
          alignItems={'center'}
          sx={{ aspectRatio: 1 }}>
          <CircularProgress size={72} />
        </Stack>
      );
    }

    if (!image) {
      return (
        <Stack
          justifyContent={'center'}
          alignItems={'center'}
          sx={{ aspectRatio: 1 }}>
          <HideImageOutlined
            color={'primary'}
            sx={{ height: '60%', width: '100%' }}
          />
        </Stack>
      );
    }

    return (
      <Fade in={true}>
        <Box
          width={'100%'}
          borderRadius={0.5}
          overflow={'hidden'}
          sx={{ aspectRatio: 1 }}>
          <img
            src={image}
            style={{ objectFit: 'cover', height: '100%', width: '100%' }}
          />
        </Box>
      </Fade>
    );
  }

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
          error={!!error}
          helperText={error ? ERROR_TEXT : null}
          InputProps={{
            startAdornment: (
              <InputAdornment position={'start'}>
                <ImageIcon />
              </InputAdornment>
            ),
          }}
        />
        <ImagePreview />
      </Stack>
    </FormControl>
  );
}
