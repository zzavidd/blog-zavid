import { ExpandMore } from '@mui/icons-material';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import type { SelectChangeEvent } from '@mui/material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { type Prisma } from '@prisma/client';
import immutate from 'immutability-helper';
import React, { useContext } from 'react';

import { useIsAdmin } from 'utils/hooks';
import { AppActions, useAppDispatch, useAppSelector } from 'utils/reducers';

import { WishlistContext } from '../WishlistContext';

import { useFilters } from './FilterForm.utils';

const SORT_OPTIONS = [
  { label: 'Date Added', value: 'createTime' },
  { label: 'Price', value: 'price' },
  { label: 'Priority', value: 'priority' },
  { label: 'Quantity', value: 'quantity' },
  { label: 'Title', value: 'name' },
] as const;

export default function FilterForm() {
  const [, setContext] = useContext(WishlistContext);

  function onCloseTray() {
    setContext((c) => immutate(c, { trayFormContent: { $set: null } }));
  }

  return (
    <React.Fragment>
      <Stack spacing={4} p={5} flex={1} divider={<Divider />}>
        <Typography variant={'h3'}>Filter & Sort Items</Typography>
        <SortSection />
        <FilterSection />
      </Stack>
      <Paper
        elevation={7}
        sx={{
          borderRadius: 0,
          position: 'sticky',
          bottom: 0,
          p: 3,

          top: 'auto',
        }}>
        <ButtonGroup fullWidth={true}>
          <Button variant={'contained'} onClick={onCloseTray}>
            Apply
          </Button>
          <Button variant={'outlined'} onClick={onCloseTray}>
            Close
          </Button>
        </ButtonGroup>
      </Paper>
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
    <Stack>
      <FormControl>
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
        startIcon={sortOrder === 'asc' ? <NorthIcon /> : <SouthIcon />}>
        {isAscending ? 'Ascending order' : 'Descending order'}
      </Button>
    </Stack>
  );
}

function FilterSection() {
  const filters = useFilters();
  const isAdmin = useIsAdmin();
  const { where } = useAppSelector((state) => state.wishlist.params);

  const dispatch = useAppDispatch();

  function onFilterChange(
    property: keyof Prisma.WishlistItemWhereInput,
    value: string | number,
  ) {
    const filter = [...getFilter(where, property)];
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

  return (
    <Stack spacing={4}>
      {filters.map(({ group, options, property, adminOnly }) => {
        if (adminOnly && !isAdmin) return null;
        return (
          <Accordion defaultExpanded={true} key={property}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>{group}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ paddingInline: 5 }}>
              <List>
                {options.map(({ label, value }) => {
                  const checked = getFilter(where, property).includes(value);
                  return (
                    <ListItem disablePadding={true} key={label}>
                      <FormControlLabel
                        label={label}
                        control={
                          <Checkbox
                            value={value}
                            checked={checked}
                            onChange={() => onFilterChange(property, value)}
                          />
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}

function getFilter(
  where: Prisma.WishlistItemWhereInput | undefined,
  property: keyof Prisma.WishlistItemWhereInput,
): (string | number)[] {
  if (!where) return [];
  const filter = where[property] as Prisma.IntFilter | Prisma.StringFilter;
  if (!filter) return [];
  return (filter.in as string[] | number[]) || [];
}
