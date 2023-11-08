import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import TuneIcon from '@mui/icons-material/Tune';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { WishlistPriority, WishlistVisibility } from '@prisma/client';
import dayjs from 'dayjs';
import { default as ImmutabilityHelper } from 'immutability-helper';
import { useSnackbar } from 'notistack';
import React, { useContext } from 'react';

import { FormRow } from 'components/Form';
import { useForm } from 'utils/hooks';
import { trpc } from 'utils/trpc';

import { TrayFormContent, WishlistContext } from '../WishlistContext';

import CategoryField from './Wishlist/CategoryField';
import PriceField from './Wishlist/PriceField';

export default function WishlistForm() {
  const [{ wishlistItemRequest }, setContext] = useContext(WishlistContext);
  const { onTextChange, onDateChange } = useForm(
    WishlistContext,
    'wishlistItemRequest',
  );

  function switchToCategoryForm() {
    setContext((current) =>
      ImmutabilityHelper(current, {
        trayFormContent: { $set: TrayFormContent.CATEGORIES },
      }),
    );
  }

  const purchaseDate = wishlistItemRequest.purchaseDate
    ? dayjs(wishlistItemRequest.purchaseDate)
    : null;

  return (
    <React.Fragment>
      <Stack spacing={5} p={5}>
        <Typography variant={'h3'}>Add Wishlist Item</Typography>
        <TextField
          name={'name'}
          label={'Item name:'}
          value={wishlistItemRequest.name}
          onChange={onTextChange}
          placeholder={'Enter the name'}
          required={true}
          InputLabelProps={{ shrink: true }}
        />
        <FormRow>
          <PriceField />
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>Priority:</InputLabel>
            <Select
              name={'priority'}
              label={'Priority:'}
              value={wishlistItemRequest.priority}
              onChange={onTextChange}>
              {Object.values(WishlistPriority)
                .reverse()
                .map((option) => (
                  <MenuItem value={option} key={option}>
                    {option}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </FormRow>
        <FormRow>
          <TextField
            type={'number'}
            name={'quantity'}
            label={'Quantity:'}
            value={wishlistItemRequest.quantity}
            onChange={onTextChange}
            InputProps={{ inputProps: { min: 0 } }}
            sx={{ flex: 1 }}
          />
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>Visibility:</InputLabel>
            <Select
              name={'visibility'}
              label={'Visibility:'}
              value={wishlistItemRequest.visibility}
              onChange={onTextChange}>
              {Object.values(WishlistVisibility).map((option) => (
                <MenuItem value={option} key={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormRow>
        <FormRow>
          <CategoryField />
          <Button onClick={switchToCategoryForm}>
            <Stack justifyContent={'center'} alignItems={'center'}>
              <TuneIcon />
              <Typography variant={'caption'} fontSize={10} noWrap={false}>
                Customise
                <br />
                categories
              </Typography>
            </Stack>
          </Button>
        </FormRow>
        {/* <ReferenceField />
        <ImageField /> */}
        <Divider />
        <Stack spacing={5}>
          <FormControlLabel
            label={'Already purchased?'}
            control={
              <Checkbox
                name={'purchaseDate'}
                checked={!!purchaseDate}
                onChange={() => onDateChange(purchaseDate ? null : dayjs())}
              />
            }
          />
          {purchaseDate ? (
            <FormControl>
              <DatePicker
                label={'Date of purchase:'}
                value={purchaseDate}
                onChange={(value) => onDateChange(value)}
                disableFuture={true}
                format={'D MMMM YYYY'}
              />
            </FormControl>
          ) : null}
        </Stack>
        <FormControl>
          <TextField
            name={'comments'}
            label={'Comments'}
            value={wishlistItemRequest.comments}
            onChange={onTextChange}
            placeholder={'Add comments about this item...'}
            rows={3}
            multiline={true}
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
        <ReserveesList />
      </Stack>
      <FormFooter />
    </React.Fragment>
  );
}

function FormFooter() {
  const [context, setContext] = useContext(WishlistContext);
  const { enqueueSnackbar } = useSnackbar();

  const trpcContext = trpc.useContext();
  const { mutate: create, isLoading: isCreateLoading } =
    trpc.wishlist.create.useMutation({
      onSuccess: (wishlistItem) => {
        void trpcContext.wishlist.findMany.refetch();
        enqueueSnackbar(`You've successfully added "${wishlistItem.name}.".`, {
          variant: 'success',
        });
        closeTray();
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });
  const { mutate: update, isLoading: isUpdateLoading } =
    trpc.wishlist.update.useMutation({
      onSuccess: (wishlistItem) => {
        void trpcContext.wishlist.findMany.refetch();
        enqueueSnackbar(
          `You've successfully updated "${wishlistItem.name}.".`,
          {
            variant: 'success',
          },
        );
        closeTray();
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  function createWishlistItem() {
    const { price, quantity } = context.wishlistItemRequest;
    create({
      data: {
        ...context.wishlistItemRequest,
        price: Number(price),
        quantity: Number(quantity),
      },
    });
  }

  /**
   * Updates the selected wishlist item.
   */
  function updateWishlistItem() {
    if (!context.selectedWishlistItem) return;
    const { price, quantity } = context.wishlistItemRequest;
    update({
      data: {
        ...context.wishlistItemRequest,
        price: Number(price),
        quantity: Number(quantity),
      },
      where: { id: context.selectedWishlistItem.id },
    });
  }

  function closeTray() {
    setContext((current) =>
      ImmutabilityHelper(current, { trayFormContent: { $set: null } }),
    );
  }

  return (
    <ButtonGroup fullWidth={true}>
      {context.selectedWishlistItem === null ? (
        <LoadingButton
          variant={'contained'}
          onClick={createWishlistItem}
          loading={isCreateLoading}
          loadingIndicator={'Submitting...'}>
          Submit
        </LoadingButton>
      ) : (
        <LoadingButton
          variant={'contained'}
          onClick={updateWishlistItem}
          disabled={!context.selectedWishlistItem}
          loading={isUpdateLoading}
          loadingIndicator={'Updating...'}>
          Update
        </LoadingButton>
      )}
      <Button onClick={closeTray}>Close</Button>
    </ButtonGroup>
  );
}

function ReserveesList() {
  const [{ wishlistItemRequest }, setContext] = useContext(WishlistContext);
  const reservees = wishlistItemRequest.reservees as WishlistReservees;

  function onDeleteClick(email: string) {
    const reserveesList = { ...reservees };
    delete reserveesList[email];

    setContext((current) =>
      ImmutabilityHelper(current, {
        wishlistItemRequest: { reservees: { $set: reserveesList } },
      }),
    );
  }

  if (!Object.keys(reservees).length) {
    return null;
  }

  return (
    <React.Fragment>
      <Divider />
      <Stack>
        <Typography variant={'subtitle1'} component={'p'} fontWeight={'bold'}>
          List of reservees:
        </Typography>
        <List>
          {Object.entries(
            wishlistItemRequest.reservees as WishlistReservees,
          ).map(([email, { anonymous }], key) => {
            return (
              <ListItem disablePadding={true} key={key}>
                <ListItemIcon sx={{ minWidth: (t) => t.spacing(6) }}>
                  <CircleIcon fontSize={'small'} />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant={'body2'}>
                    {anonymous ? '[Anonymous]' : email}
                  </Typography>
                </ListItemText>
                <ListItemIcon>
                  <IconButton onClick={() => onDeleteClick(email)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemIcon>
              </ListItem>
            );
          })}
        </List>
      </Stack>
    </React.Fragment>
  );
}
