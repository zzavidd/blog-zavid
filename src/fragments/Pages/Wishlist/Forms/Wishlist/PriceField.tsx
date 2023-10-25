import {
  FormControl,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

import { WishlistPageContext } from 'utils/contexts';
import HandlerFactory from 'utils/handlers';

export const PRICE_REGEX = new RegExp(/^\d+(\.\d{2})?$/);

export default function PriceField() {
  const [context, setContext] = React.useContext(WishlistPageContext);
  const { wishlistItemRequest } = context;
  const Handlers = HandlerFactory(setContext, 'wishlistItemRequest');

  const isPriceValid = assertPriceValid(wishlistItemRequest.price);
  return (
    <FormControl>
      <TextField
        type={'text'}
        name={'price'}
        label={'Price:'}
        value={wishlistItemRequest.price}
        onChange={Handlers.text}
        error={!isPriceValid}
        helperText={isPriceValid ? '' : 'Invalid price'}
        InputProps={{
          inputProps: { min: 0 },
          startAdornment: (
            <InputAdornment position={'start'}>
              <Typography
                variant={'h6'}
                component={'p'}
                color={'primary.light'}>
                £
              </Typography>
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
}

function assertPriceValid(price: number) {
  return PRICE_REGEX.test(String(price));
}
