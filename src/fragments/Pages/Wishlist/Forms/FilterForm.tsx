import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import type { SelectChangeEvent } from '@mui/material';
import {
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Radio,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import {
  WishlistPriority,
  WishlistVisibility,
  type Prisma,
  type WishlistItem,
} from '@prisma/client';
import immutate from 'immutability-helper';
import { isEqual } from 'lodash';
import React, { useContext } from 'react';

import { DrawerFormActions } from 'components/Form';
import { useIsAdmin } from 'utils/hooks';
import ZString from 'utils/lib/string';
import { AppActions, useAppDispatch, useAppSelector } from 'utils/reducers';

import { WishlistContext } from '../WishlistContext';

const SORT_OPTIONS = [
  { label: 'Date Added', value: 'createTime' },
  { label: 'Price', value: 'price' },
  { label: 'Priority', value: 'priority' },
  { label: 'Quantity', value: 'quantity' },
  { label: 'Title', value: 'name' },
] as const;

export default function FilterForm() {
  const [, setContext] = useContext(WishlistContext);
  const dispatch = useAppDispatch();

  function onCloseTray() {
    setContext((c) => immutate(c, { trayFormContent: { $set: null } }));
  }

  function resetFilters() {
    dispatch(AppActions.resetWishlistParams());
  }

  return (
    <React.Fragment>
      <Stack spacing={4} py={5} px={6} flex={1} divider={<Divider />}>
        <Typography variant={'h3'}>Filter & Sort Items</Typography>
        <SortSection />
        <FilterSection />
      </Stack>
      <DrawerFormActions>
        <ButtonGroup fullWidth={true}>
          <Button variant={'contained'} onClick={resetFilters}>
            Reset
          </Button>
          <Button variant={'outlined'} onClick={onCloseTray}>
            Close
          </Button>
        </ButtonGroup>
      </DrawerFormActions>
    </React.Fragment>
  );
}

function SortSection() {
  const { orderBy = {} } = useAppSelector((state) => state.wishlist.params);
  const dispatch = useAppDispatch();

  const sortProperty = Object.keys(
    orderBy,
  )[0] as keyof Prisma.WishlistItemOrderByWithRelationAndSearchRelevanceInput;
  const sortOrder = orderBy[sortProperty];
  const isAscending = sortOrder === 'asc';

  function onSortPropertyChange(e: SelectChangeEvent<string>) {
    dispatch(
      AppActions.setWishlistParams({
        orderBy: {
          $set: {
            [e.target.value]: sortOrder,
          },
        },
      }),
    );
  }

  function onSortOrderChange() {
    dispatch(
      AppActions.setWishlistParams({
        orderBy: {
          [sortProperty]: { $set: isAscending ? 'desc' : 'asc' },
        },
      }),
    );
  }

  return (
    <Stack direction={'row'} columnGap={2}>
      <FormControl sx={{ flex: 1 }}>
        <InputLabel>Sort by:</InputLabel>
        <Select
          label={'Sort by:'}
          value={Object.keys(orderBy)[0]}
          onChange={onSortPropertyChange}>
          {SORT_OPTIONS.map(({ label, value }) => (
            <MenuItem value={value} key={status}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        onClick={onSortOrderChange}
        startIcon={sortOrder === 'asc' ? <NorthIcon /> : <SouthIcon />}
        variant={'contained'}>
        {isAscending ? 'ASC' : 'DESC'}
      </Button>
    </Stack>
  );
}

function FilterSection() {
  const filters = useFilters();
  const isAdmin = useIsAdmin();
  const { where } = useAppSelector((state) => state.wishlist.params);

  const dispatch = useAppDispatch();

  function onCheckboxFilterChange(
    property: keyof Prisma.WishlistItemWhereInput,
    value: unknown,
  ) {
    const filter = [...getCheckboxFilter(where, property)];
    if (filter.includes(value)) {
      filter.splice(filter.indexOf(value), 1);
    } else {
      filter.push(value);
    }

    dispatch(
      AppActions.setWishlistParams({
        where: {
          [property]: filter.length
            ? { $set: { in: filter } }
            : { $unset: ['in'] },
        },
      }),
    );
  }

  function onRadioFilterChange(
    property: keyof Prisma.WishlistItemWhereInput,
    value: unknown | null | undefined,
  ) {
    dispatch(
      AppActions.setWishlistParams({
        where: { [property]: { $set: value } },
      }),
    );
  }

  return (
    <Stack spacing={4}>
      {filters.map(({ group, options, property, adminOnly, type }) => {
        if (adminOnly && !isAdmin) return null;
        return (
          <Stack key={property}>
            <Typography
              variant={'overline'}
              fontSize={16}
              lineHeight={1.7}
              sx={{
                backgroundColor: (t) => t.palette.grey[800],
                borderRadius: 0.5,
                p: 2,
              }}>
              {group}
            </Typography>
            <List sx={{ pl: 2 }}>
              {options.map(({ label, value }) => {
                if (type === 'radio') {
                  const checked = isEqual(where?.[property], value);
                  return (
                    <ListItem disablePadding={true} key={label}>
                      <FormControlLabel
                        label={label}
                        control={
                          <Radio
                            value={value}
                            checked={checked}
                            onChange={() =>
                              onRadioFilterChange(property, value)
                            }
                            sx={{ px: 1, py: 2, mr: 1 }}
                          />
                        }
                      />
                    </ListItem>
                  );
                }

                const checked = getCheckboxFilter(where, property).includes(
                  value,
                );
                return (
                  <ListItem disablePadding={true} key={label}>
                    <FormControlLabel
                      label={label}
                      control={
                        <Checkbox
                          value={value}
                          checked={checked}
                          onChange={() =>
                            onCheckboxFilterChange(property, value)
                          }
                          sx={{ mr: 1 }}
                        />
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Stack>
        );
      })}
    </Stack>
  );
}

function useFilters(): FilterGroup[] {
  const [context] = useContext(WishlistContext);
  return [
    {
      group: 'Filter by Category',
      options: Object.values(context.categories)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ id, name }) => ({ label: name, value: Number(id) })),
      property: 'categoryId',
      type: 'checkbox',
    },
    {
      group: 'Filter by Priority',
      options: Object.entries(WishlistPriority).map(([id, name]) => ({
        label: ZString.toTitleCase(name),
        value: id,
      })),
      property: 'priority',
      type: 'checkbox',
    },
    {
      group: 'Filter by Visibility',
      options: Object.values(WishlistVisibility).map((name) => ({
        label: ZString.toTitleCase(name),
        value: name,
      })),
      property: 'visibility',
      adminOnly: true,
      type: 'checkbox',
    },
    {
      group: 'Filter by Purchase',
      options: [
        { label: 'All items', value: undefined },
        { label: 'Not yet purchased', value: null },
        { label: 'Only purchased', value: { not: null } },
      ],
      property: 'purchaseDate',
      type: 'radio',
    },
  ];
}

function getCheckboxFilter(
  where: Prisma.WishlistItemWhereInput | undefined,
  property: keyof Prisma.WishlistItemWhereInput,
): unknown[] {
  if (!where) return [];
  const filter = where[property] as Prisma.IntFilter | Prisma.StringFilter;
  if (!filter) return [];
  return (filter.in as string[] | number[]) || [];
}

interface FilterGroup {
  group: string;
  property: keyof WishlistItem;
  options: { label: string; value: unknown }[];
  adminOnly?: boolean;
  type: 'checkbox' | 'radio';
}
