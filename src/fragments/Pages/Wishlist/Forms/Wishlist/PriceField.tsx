import {
  FormControl,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useContext } from 'react';

import { useForm } from 'utils/hooks';

import { WishlistContext } from '../../WishlistContext';

export const PRICE_REGEX = new RegExp(/^\d+(\.\d{2})?$/);

export default function PriceField() {
  const [context] = useContext(WishlistContext);
  const { onTextChange } = useForm(WishlistContext, 'wishlistItemRequest');

  const { wishlistItemRequest } = context;
  const isPriceValid = assertPriceValid(wishlistItemRequest.price);
  return (
    <FormControl sx={{ flex: 1 }}>
      <TextField
        type={'text'}
        name={'price'}
        label={'Price:'}
        value={wishlistItemRequest.price}
        onChange={onTextChange}
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
