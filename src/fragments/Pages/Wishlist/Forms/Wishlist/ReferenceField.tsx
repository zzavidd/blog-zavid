import QrCodeIcon from '@mui/icons-material/QrCode';
import {
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import immutate from 'immutability-helper';
import React from 'react';

import { WishlistContext } from '../../WishlistContext';

export default function ReferenceField() {
  const [context, setContext] = React.useContext(WishlistContext);
  const { wishlistItemRequest } = context;

  function onReferenceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setContext((current) =>
      immutate(current, {
        wishlistItemRequest: { href: { $set: e.target.value } },
      }),
    );
  }

  return (
    <FormControl>
      <TextField
        type={'url'}
        name={'href'}
        label={'Reference link:'}
        value={wishlistItemRequest.href}
        placeholder={'https://example.com'}
        onChange={onReferenceChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position={'start'}>
              {wishlistItemRequest.href ? (
                <IconButton
                  href={wishlistItemRequest.href}
                  target={'_blank'}
                  sx={{ p: 0 }}>
                  <QrCodeIcon color={'primary'} />
                </IconButton>
              ) : (
                <QrCodeIcon />
              )}
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
}
