import {
  Check,
  Favorite,
  FavoriteBorder,
  FilterList,
  Sort,
} from '@mui/icons-material';
import type { TypographyProps } from '@mui/material';
import {
  Badge,
  Button,
  Checkbox,
  FormControlLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Toolbar,
  Typography,
  badgeClasses,
  lighten,
} from '@mui/material';
import type { Prisma } from '@prisma/client';
import { useContext, useRef, useState } from 'react';

import { useDiaryCategories } from 'utils/hooks';
import { AppActions, useAppDispatch, useAppSelector } from 'utils/reducers';

import { DiaryIndexContext, useSortMenuOptions } from './DiaryIndex.utils';

export default function DiaryToolbar() {
  const [state, setState] = useState({
    isSortMenuOpen: false,
    isFilterMenuOpen: false,
  });
  const { filter, sort } = useAppSelector((state) => state.diary);
  const dispatch = useAppDispatch();
  const { searchTerm } = useContext(DiaryIndexContext);

  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const { data: categories = [] } = useDiaryCategories();
  const sortMenuOptions = useSortMenuOptions(searchTerm);
  const selectedCategoryIds = useSelectedCategoryIds();

  function onFavouriteToggle(_: React.ChangeEvent, checked: boolean) {
    dispatch(
      AppActions.setDiarySieve({
        filter: { isFavourite: { $set: checked || undefined } },
      }),
    );
  }

  function onSortChange(
    value: Prisma.DiaryOrderByWithRelationAndSearchRelevanceInput,
  ) {
    dispatch(AppActions.setDiarySieve({ sort: { $set: value } }));
  }

  function onFilterChange(id: number) {
    const ids = [...selectedCategoryIds];
    if (ids.includes(id)) {
      ids.splice(ids.indexOf(id), 1);
    } else {
      ids.push(id);
    }

    dispatch(
      AppActions.setDiarySieve({
        filter: {
          categories: ids.length
            ? {
                $set: { some: { id: { in: ids } } },
              }
            : {
                $unset: ['some'],
              },
        },
      }),
    );
  }

  function toggleSortMenu(open: boolean) {
    setState((s) => ({ ...s, isSortMenuOpen: open }));
  }

  function toggleFilterMenu(open: boolean) {
    setState((s) => ({ ...s, isFilterMenuOpen: open }));
  }

  const fontSize: TypographyProps['fontSize'] = { xs: 12, md: 14 };

  return (
    <Paper
      square={true}
      variant={'outlined'}
      sx={{
        backgroundColor: (t) => lighten(t.palette.background.paper, 0.05),
        borderInline: 0,
      }}>
      <Toolbar>
        <Stack
          direction={'row'}
          justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
          spacing={4}
          width={'100%'}
          mx={3}>
          <Button
            onClick={() => toggleSortMenu(true)}
            color={sort.entryNumber === 'asc' ? 'primary' : 'inherit'}
            startIcon={<Sort />}
            sx={{ fontSize }}
            ref={sortButtonRef}>
            Sort
          </Button>
          <Button
            onClick={() => toggleFilterMenu(true)}
            color={selectedCategoryIds.length ? 'primary' : 'inherit'}
            startIcon={<FilterList />}
            sx={{ fontSize }}
            ref={filterButtonRef}>
            <Badge
              badgeContent={selectedCategoryIds.length}
              color={'primary'}
              showZero={false}
              sx={{
                [`.${badgeClasses.badge}`]: {
                  right: -12,
                },
              }}>
              Filter
            </Badge>
          </Button>
          <FormControlLabel
            label={
              <Typography
                color={filter.isFavourite ? 'primary' : 'inherit'}
                fontSize={fontSize}
                variant={'button'}>
                Favourites
              </Typography>
            }
            control={
              <Checkbox
                checked={Boolean(filter.isFavourite)}
                onChange={onFavouriteToggle}
                icon={<FavoriteBorder fontSize={'small'} />}
                checkedIcon={<Favorite fontSize={'small'} />}
                sx={{ mr: 1 }}
              />
            }
          />
        </Stack>
      </Toolbar>
      <Menu
        open={state.isSortMenuOpen}
        anchorEl={sortButtonRef.current}
        onClick={() => toggleSortMenu(false)}
        onClose={() => toggleSortMenu(false)}>
        {Object.values(sortMenuOptions).map(
          ({ label, value, selected, hideOption }, key) => {
            if (hideOption) return null;
            return (
              <MenuItem
                onClick={() => onSortChange(value)}
                selected={selected}
                sx={{ py: 4 }}
                key={key}>
                <ListItemIcon>{selected ? <Check /> : null}</ListItemIcon>
                <ListItemText>{label}</ListItemText>
              </MenuItem>
            );
          },
        )}
      </Menu>
      <Menu
        open={state.isFilterMenuOpen}
        anchorEl={filterButtonRef.current}
        onClose={() => toggleFilterMenu(false)}
        sx={{ maxHeight: (t) => t.spacing(14) }}>
        <MenuItem
          selected={false}
          divider={true}
          sx={{ m: 0, pointerEvents: 'none' }}>
          <Typography variant={'overline'}>
            {categories.length} categories
          </Typography>
        </MenuItem>
        {categories.map(({ id, name, _count }) => {
          const checked = selectedCategoryIds.includes(id);
          const entryCount = `${_count.entries} entries`;
          return (
            <MenuItem
              onClick={() => onFilterChange(id)}
              selected={checked}
              sx={{ py: 3 }}
              key={id}>
              <ListItemIcon sx={{ pr: 3 }}>
                <Checkbox checked={checked} />
              </ListItemIcon>
              <ListItemText
                primary={name}
                primaryTypographyProps={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  variant: 'overline',
                }}
                secondary={entryCount}
                secondaryTypographyProps={{ fontSize: 12 }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </Paper>
  );
}

function useSelectedCategoryIds(): number[] {
  const { filter } = useAppSelector((state) => state.diary);
  if (!filter.categories || !filter.categories.some) return [];
  const intFilter = filter.categories.some.id as Prisma.IntFilter;

  if (!intFilter) return [];
  return (intFilter.in as number[]) || [];
}
