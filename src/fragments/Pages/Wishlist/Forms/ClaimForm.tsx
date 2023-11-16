import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import immutate from 'immutability-helper';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useMemo } from 'react';

import { FormRow } from 'components/Form';
import { useForm, useSessionEmail } from 'utils/hooks';

import { WishlistItemContext } from '../Item/WishlistItem.utils';
import { WishlistContext } from '../WishlistContext';

export default function ClaimForm() {
  const [context, setContext] = useContext(WishlistContext);
  const wishlistItem = useContext(WishlistItemContext);
  const session = useSession();
  const maxClaimQuantity = useMaxClaimQuantity();
  const { onTextChange, onCheckboxChange } = useForm(
    WishlistContext,
    'claimRequest',
  );

  const userEmail = session.data?.user?.email;

  useEffect(() => {
    // if (!userEmail && !appLocalState.userEmail) return;
    if (!userEmail) return;

    setContext((current) =>
      immutate(current, {
        claimRequest: {
          id: { $set: wishlistItem.id },
          email: { $set: userEmail },
        },
      }),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  const price = wishlistItem.price * context.claimRequest.quantity;
  const shownPrice = price.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });

  const showQuantityField = maxClaimQuantity && maxClaimQuantity >= 2;

  return (
    <Stack rowGap={3}>
      <Typography>
        You are about to claim&nbsp;
        <Box display={'inline'} fontWeight={'bold'}>
          {wishlistItem.name}
        </Box>
        .
      </Typography>
      <Divider />
      <Box height={'30vh'} width={'100%'} my={2}>
        <img
          src={wishlistItem.image}
          alt={wishlistItem.name}
          style={{ objectFit: 'contain', height: '100%', width: '100%' }}
        />
      </Box>
      <Stack rowGap={4}>
        {showQuantityField ? (
          <TextField
            name={'quantity'}
            label={'How many will you claim?'}
            type={'number'}
            value={context.claimRequest.quantity}
            onChange={onTextChange}
            disabled={maxClaimQuantity === 1}
            helperText={`Maximum: ${maxClaimQuantity}`}
            InputProps={{
              inputProps: {
                min: 1,
                max: maxClaimQuantity,
              },
            }}
          />
        ) : null}
        <TextField
          name={'email'}
          type={'email'}
          label={'Email'}
          value={context.claimRequest.email}
          onChange={onTextChange}
          placeholder={'Enter your email'}
        />
      </Stack>
      <FormRow justifyContent={'space-between'}>
        <FormControlLabel
          label={'Claim anonymously?'}
          componentsProps={{ typography: { fontSize: 16 } }}
          control={
            <Checkbox
              name={'anonymous'}
              checked={context.claimRequest.anonymous}
              onChange={onCheckboxChange}
            />
          }
        />
        <Stack alignItems={'flex-end'}>
          <Typography variant={'overline'}>Approx. Total:</Typography>
          <Typography fontSize={20} fontWeight={'bold'}>
            {shownPrice}
          </Typography>
        </Stack>
      </FormRow>
    </Stack>
  );
}

function useMaxClaimQuantity() {
  const wishlistItem = useContext(WishlistItemContext);
  const userEmail = useSessionEmail();

  return useMemo(() => {
    const { reservees, quantity: maxQuantity } = wishlistItem;
    const numberOfClaimed = Object.entries(
      reservees as WishlistReservees,
    ).reduce((acc, [claimant, { quantity }]) => {
      // if (claimant === userEmail || claimant === appLocalState.userEmail)
      if (claimant === userEmail) return acc;
      return acc + quantity;
    }, 0);
    return maxQuantity - numberOfClaimed;
    // }, [context.selectedWishlistItem, userEmail, appLocalState.userEmail]);
  }, [wishlistItem, userEmail]);
}
