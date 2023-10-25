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
import { Priority, Visibility } from '@prisma/client';
import dayjs from 'dayjs';
import ImmutabilityHelper from 'immutability-helper';
import React, { useContext, useState } from 'react';
import * as SWR from 'swr';
import { Route, TrayFormContent } from 'utils/constants';
import HandlerFactory from 'utils/handlers';
import { zWishlistItemUpsert } from 'utils/validations';

import Contexts, { WishlistPageContext } from 'utils/contexts';
import Utils from 'utils/functions';

import Styles from './Form.styles';
import CategoryField from './Wishlist/CategoryField';
import ImageField from './Wishlist/ImageField';
import PriceField from './Wishlist/PriceField';
import ReferenceField from './Wishlist/ReferenceField';

export default function WishlistForm() {
  const [context, setContext] = useContext(WishlistPageContext);
  const Handlers = HandlerFactory(setContext, 'wishlistItemRequest');

  /**
   * Switches to tray content to the category edit form.
   */
  function switchToCategoryForm() {
    setContext((current) =>
      ImmutabilityHelper(current, {
        trayFormContent: { $set: TrayFormContent.CATEGORIES },
      }),
    );
  }

  const { wishlistItemRequest } = context;
  const purchaseDate = wishlistItemRequest.purchaseDate
    ? dayjs(wishlistItemRequest.purchaseDate)
    : null;

  return (
    <React.Fragment>
      <Styles.Main spacing={5}>
        <Styles.FormTitle variant={'h5'}>Add Wishlist Item</Styles.FormTitle>
        <Styles.Fieldset>
          <FormControl>
            <TextField
              name={'name'}
              label={'Item name:'}
              value={wishlistItemRequest.name}
              onChange={Handlers.text}
              placeholder={'Enter the name'}
              required={true}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <Styles.FormGroup row={true}>
            <PriceField />
            <FormControl>
              <FormControl>
                <InputLabel>Priority:</InputLabel>
                <Select
                  name={'priority'}
                  label={'Priority:'}
                  value={wishlistItemRequest.priority}
                  onChange={Handlers.select}>
                  {Object.values(Priority)
                    .reverse()
                    .map((option) => (
                      <MenuItem value={option} key={option}>
                        {option}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </FormControl>
          </Styles.FormGroup>
          <Styles.FormGroup row={true}>
            <FormControl>
              <TextField
                type={'number'}
                name={'quantity'}
                label={'Quantity:'}
                value={wishlistItemRequest.quantity}
                onChange={Handlers.number}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </FormControl>
            <FormControl>
              <InputLabel>Visibility:</InputLabel>
              <Select
                name={'visibility'}
                label={'Visibility:'}
                value={wishlistItemRequest.visibility}
                onChange={Handlers.select}>
                {Object.values(Visibility).map((option) => (
                  <MenuItem value={option} key={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Styles.FormGroup>
          <Styles.FormGroup row={true}>
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
          </Styles.FormGroup>
          <ReferenceField />
          <ImageField />
        </Styles.Fieldset>
        <Divider />
        <Styles.Fieldset>
          <Stack spacing={5}>
            <FormControlLabel
              label={'Already purchased?'}
              control={
                <Checkbox
                  checked={!!purchaseDate}
                  onChange={() => {
                    Handlers.date(
                      purchaseDate ? null : dayjs(),
                      'purchaseDate',
                    );
                  }}
                />
              }
            />
            {purchaseDate ? (
              <FormControl>
                <DatePicker
                  label={'Date of purchase:'}
                  value={purchaseDate}
                  onChange={(value) => Handlers.date(value, 'purchaseDate')}
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
              onChange={Handlers.text}
              placeholder={'Add comments about this item...'}
              rows={3}
              multiline={true}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
        </Styles.Fieldset>
        <ReserveesList />
      </Styles.Main>
      <FormFooter />
    </React.Fragment>
  );
}

function FormFooter() {
  const [state, setState] = useState({ isRequestPending: false });
  const [context, setContext] = useContext(WishlistPageContext);
  const Snacks = useContext(Contexts.Snacks);

  const { wishlistItemRequest } = context;

  /**
   * Submits the wishlist item.
   */
  async function submitWishlistItem() {
    try {
      setState({ isRequestPending: true });
      const item = zWishlistItemUpsert.parse(wishlistItemRequest);

      await Utils.request<ItemPayload.Create>(Route.Wishlist, {
        method: 'POST',
        body: { item },
      });
      await SWR.mutate(Route.Wishlist);
      Snacks.success("You've successfully added a new wishlist item.");
      closeTray();
    } catch (e) {
      Utils.handleError(e, Snacks);
    } finally {
      setState({ isRequestPending: false });
    }
  }

  /**
   * Updates the selected wishlist item.
   */
  async function updateWishlistItem() {
    try {
      if (!context.selectedWishlistItem) {
        throw new Error('No wishlist item to update.');
      }

      setState({ isRequestPending: true });
      const item = zWishlistItemUpsert.parse(wishlistItemRequest);

      await Utils.request<ItemPayload.Update>(Route.Wishlist, {
        method: 'PUT',
        body: {
          id: context.selectedWishlistItem.id,
          item,
        },
      });
      await SWR.mutate(Route.Wishlist);
      Snacks.success(
        `You've successfully edited '${wishlistItemRequest.name}'.`,
      );
      closeTray();
    } catch (e) {
      Utils.handleError(e, Snacks);
    } finally {
      setState({ isRequestPending: false });
    }
  }

  function closeTray() {
    setContext((current) =>
      ImmutabilityHelper(current, { trayFormContent: { $set: null } }),
    );
  }

  return (
    <Styles.FormFooterButtonGroup>
      <ButtonGroup fullWidth={true}>
        {context.selectedWishlistItem === null ? (
          <LoadingButton
            variant={'contained'}
            onClick={submitWishlistItem}
            loading={state.isRequestPending}
            loadingIndicator={'Submitting...'}>
            Submit
          </LoadingButton>
        ) : (
          <LoadingButton
            variant={'contained'}
            onClick={updateWishlistItem}
            disabled={!context.selectedWishlistItem}
            loading={state.isRequestPending}
            loadingIndicator={'Updating...'}>
            Update
          </LoadingButton>
        )}
        <Button onClick={closeTray}>Close</Button>
      </ButtonGroup>
    </Styles.FormFooterButtonGroup>
  );
}

function ReserveesList() {
  const [{ wishlistItemRequest }, setContext] = useContext(WishlistPageContext);
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
