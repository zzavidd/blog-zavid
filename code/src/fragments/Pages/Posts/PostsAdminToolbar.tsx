import { FilterList } from '@mui/icons-material';
import {
  AppBar,
  Badge,
  Button,
  Checkbox,
  Container,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  badgeClasses,
} from '@mui/material';
import type { Prisma } from '@prisma/client';
import { PostStatus, PostType } from '@prisma/client';
import React, { useRef, useState } from 'react';

import { AppActions, useAppDispatch, useAppSelector } from 'utils/reducers';
import { trpc } from 'utils/trpc';

export default function PostsAdminToolbar() {
  const [state, setState] = useState<PostsAdminToolbarState>({
    isStatusFilterOpen: false,
    isTypeFilterOpen: false,
  });
  const dispatch = useAppDispatch();
  const statusFilterButtonRef = useRef<HTMLButtonElement>(null);
  const typeFilterButtonRef = useRef<HTMLButtonElement>(null);

  const selectedStatuses = useSelectedStatuses();
  const selectedTypes = useSelectedTypes();

  const { data: statusCount } = trpc.post.count.status.useQuery();
  const { data: typeCount } = trpc.post.count.type.useQuery();

  function onFilterChange<T = PostStatus | PostType>(
    selectedList: Prisma.Enumerable<T>,
    property: keyof Prisma.PostWhereInput,
    value: T,
  ) {
    const list = [...(selectedList as T[])];
    if (list.includes(value)) {
      list.splice(list.indexOf(value), 1);
    } else {
      list.push(value);
    }

    dispatch(
      AppActions.setPostAdminSieve({
        filter: {
          [property]: { $set: list.length ? { in: list as T[] } : undefined },
        },
      }),
    );
  }

  const filterButtons: FilterButton[] = [
    {
      property: 'status',
      propertyList: Object.values(PostStatus),
      selectedList: selectedStatuses,
      toggle: 'isStatusFilterOpen',
      buttonRef: statusFilterButtonRef,
      count: statusCount,
    },
    {
      property: 'type',
      propertyList: Object.values(PostType),
      selectedList: selectedTypes,
      toggle: 'isTypeFilterOpen',
      buttonRef: typeFilterButtonRef,
      count: typeCount,
    },
  ];

  return (
    <AppBar
      position={'sticky'}
      elevation={2}
      sx={{ alignSelf: 'flex-end', top: 'auto', bottom: 0 }}>
      <Toolbar>
        <Container maxWidth={'xl'}>
          <Stack
            flexDirection={'row'}
            justifyContent={{ xs: 'space-around', md: 'flex-end' }}
            columnGap={4}>
            {filterButtons.map((filterButton) => {
              const {
                buttonRef,
                count,
                selectedList,
                property,
                propertyList,
                toggle,
              } = filterButton;
              return (
                <React.Fragment key={property}>
                  <Button
                    onClick={() => setState((s) => ({ ...s, [toggle]: true }))}
                    color={selectedList.length ? 'primary' : 'inherit'}
                    startIcon={<FilterList />}
                    sx={{ xs: 12, md: 14 }}
                    ref={buttonRef}>
                    <Badge
                      badgeContent={selectedList.length}
                      color={'primary'}
                      showZero={false}
                      sx={{ [`.${badgeClasses.badge}`]: { right: -12 } }}>
                      Filter by {property}
                    </Badge>
                  </Button>
                  <Menu
                    open={state[toggle]}
                    anchorEl={buttonRef.current}
                    anchorOrigin={{
                      vertical: 100,
                      horizontal: 'left',
                    }}
                    onClose={() => setState((s) => ({ ...s, [toggle]: false }))}
                    disablePortal={true}
                    disableScrollLock={true}
                    sx={{ maxHeight: (t) => t.spacing(13) }}>
                    {propertyList.map((value) => {
                      const checked = selectedList.includes(value);
                      const entryCount = `${count?.[value] ?? 0} posts`;
                      return (
                        <MenuItem
                          onClick={() =>
                            onFilterChange(selectedList, property, value)
                          }
                          selected={checked}
                          sx={{ py: 3 }}
                          key={value}>
                          <ListItemIcon sx={{ pr: 3 }}>
                            <Checkbox checked={checked} />
                          </ListItemIcon>
                          <ListItemText
                            primary={value}
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
                </React.Fragment>
              );
            })}
          </Stack>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

function useSelectedStatuses(): Prisma.Enumerable<PostStatus> {
  const { filter } = useAppSelector((state) => state.postAdmin);
  if (!filter.status) return [];
  return (filter.status as Prisma.EnumPostStatusFilter).in || [];
}

function useSelectedTypes(): Prisma.Enumerable<PostType> {
  const { filter } = useAppSelector((state) => state.postAdmin);
  if (!filter.type) return [];
  return (filter.type as Prisma.EnumPostTypeFilter).in || [];
}

interface PostsAdminToolbarState {
  isStatusFilterOpen: boolean;
  isTypeFilterOpen: boolean;
}

interface FilterButton<T = PostStatus | PostType> {
  buttonRef: React.RefObject<HTMLButtonElement>;
  count: Record<string, number> | undefined;
  property: keyof Prisma.PostWhereInput;
  propertyList: T[];
  selectedList: Prisma.Enumerable<T>;
  toggle: keyof PostsAdminToolbarState;
}
