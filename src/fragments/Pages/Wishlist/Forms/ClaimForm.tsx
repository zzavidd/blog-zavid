import {
  Checkbox,
  DialogContent,
  FormControl,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import ImmutabilityHelper from 'immutability-helper';
import React, { useContext, useEffect, useMemo } from 'react';

import { useSessionEmail } from 'utils/hooks';
import { useAppSelector } from 'utils/reducers';

import { WishlistContext } from '../WishlistContext';

import Styles from './ClaimForm.styles';

export default function ClaimForm() {
  const [context, setContext] = useContext(WishlistContext);

  const appLocalState = useAppSelector((state) => state.local);
  const userEmail = useSessionEmail();
  const theme = useTheme();

  const maxClaimQuantity = useMemo(() => {
    if (!context.selectedWishlistItem) return;
    const { reservees, quantity: maxQuantity } = context.selectedWishlistItem;
    const numberOfClaimed = Object.entries(
      reservees as WishlistReservees,
    ).reduce((acc, [claimant, { quantity }]) => {
      if (claimant === userEmail || claimant === appLocalState.userEmail)
        return acc;
      return acc + quantity;
    }, 0);
    return maxQuantity - numberOfClaimed;
  }, [context.selectedWishlistItem, userEmail, appLocalState.userEmail]);

  useEffect(() => {
    if (context.claimRequest.email) return;
    if (!userEmail && !appLocalState.userEmail) return;

    setContext((current) =>
      ImmutabilityHelper(current, {
        claimRequest: { email: { $set: userEmail } },
      }),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.claimRequest, userEmail]);

  if (!context.selectedWishlistItem) return null;

  const price =
    context.selectedWishlistItem.price * context.claimRequest.quantity;
  const shownPrice = price.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });

  return (
    <React.Fragment>
      <DialogContent dividers={true}>
        <Typography>
          You are about to claim&nbsp;
          <Typography display={'inline'} fontWeight={'bold'}>
            {context.selectedWishlistItem.name}
          </Typography>
          .
        </Typography>
        <Stack spacing={5}>
          <Styles.ImageBox>
            <img
              src={context.selectedWishlistItem.image}
              alt={context.selectedWishlistItem.name}
            />
          </Styles.ImageBox>
          {maxClaimQuantity && maxClaimQuantity >= 2 ? (
            <FormControl>
              <TextField
                name={'quantity'}
                label={'How many will you claim?'}
                type={'number'}
                value={context.claimRequest.quantity}
                onChange={Handlers.number}
                disabled={maxClaimQuantity === 1}
                helperText={`Maximum: ${maxClaimQuantity}`}
                InputProps={{
                  inputProps: {
                    min: 1,
                    max: maxClaimQuantity,
                  },
                }}
              />
            </FormControl>
          ) : null}
          <FormControl>
            <TextField
              type={'email'}
              name={'emailAddress'}
              label={'Email'}
              value={context.claimRequest.email}
              onChange={Handlers.text}
              placeholder={'Enter your email'}
            />
          </FormControl>
          <FormControlLabel
            label={'Claim anonymously?'}
            control={
              <Checkbox
                name={'isAnonymous'}
                checked={context.claimRequest.anonymous}
                onChange={Handlers.check}
                edge={'start'}
              />
            }
          />
          <Stack>
            <Typography variant={'overline'}>Approx. Total:</Typography>
            <Typography fontSize={theme.spacing(5)}>{shownPrice}</Typography>
          </Stack>
        </Stack>
      </DialogContent>
    </React.Fragment>
  );
}
