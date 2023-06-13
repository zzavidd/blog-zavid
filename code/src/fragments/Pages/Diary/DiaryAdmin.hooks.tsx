import {
  Article,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit,
  EditNote,
  Favorite,
  FavoriteBorder,
  Lock,
  VisibilityOff,
} from '@mui/icons-material';
import type { SelectChangeEvent, SelectProps } from '@mui/material';
import {
  Box,
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { Diary } from '@prisma/client';
import { DiaryStatus } from '@prisma/client';
import immutate from 'immutability-helper';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { Link } from 'components/Link';
import { useDiaryCategories } from 'utils/hooks';
import ZDate from 'utils/lib/date';
import { trpc } from 'utils/trpc';

const STATUS_ICONS = {
  [DiaryStatus.DRAFT]: EditNote,
  [DiaryStatus.PROTECTED]: Lock,
  [DiaryStatus.PRIVATE]: VisibilityOff,
  [DiaryStatus.PUBLISHED]: Article,
};

/**
 * A hook for retrieving the diary table fields and value renderer.
 * @param hoveredEntryId The ID of the hovered diary entry row.
 * @returns The table fields.
 */
export function useDiaryTableFields(
  hoveredEntryId: number | null,
): TableField<DiaryWithCategories>[] {
  const [state, setState] = useState<DiaryTableFieldsState>({
    entryInEdit: null,
    editedCategories: [],
  });
  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = trpc.useContext();
  const { mutate: updateDiaryEntry } = trpc.diary.update.useMutation({
    onError: (e) => enqueueSnackbar(e.message, { variant: 'error' }),
  });
  const { data: diaryCategories = [] } = useDiaryCategories();

  function onFavouriteClick(e: Diary) {
    updateDiaryEntry(
      {
        diary: {
          data: { isFavourite: !e.isFavourite },
          where: { id: e.id },
        },
        isPublish: false,
      },
      {
        onSuccess: async (entry) => {
          await trpcContext.diary.findMany.refetch();
          const verb = entry.isFavourite ? 'favourited' : 'unfavourited';
          const message = `You've ${verb} diary entry #${entry.entryNumber}.`;
          enqueueSnackbar(message, { variant: 'success' });
        },
      },
    );
  }

  function onCategoriesSave(id: number) {
    updateDiaryEntry(
      {
        diary: {
          data: {
            categories: {
              set: diaryCategories
                .filter(({ id }) => state.editedCategories.includes(id))
                .map(({ id }) => ({ id })),
            },
          },
          where: { id },
        },
        isPublish: false,
      },
      {
        onSuccess: async (entry) => {
          await trpcContext.diary.findMany.refetch();
          const message = `You've updated the categories for diary entry #${entry.entryNumber}.`;
          enqueueSnackbar(message, { variant: 'success' });
          setState((s) => ({ ...s, entryInEdit: null }));
        },
      },
    );
  }

  function enableEditing(e: DiaryWithCategories) {
    setState((s) => ({
      ...s,
      entryInEdit: e.id,
      editedCategories: e.categories?.map(({ id }) => id) || [],
    }));
  }

  function onCategoryChange(e: SelectChangeEvent<number[]>) {
    const { value } = e.target;
    setState((s) =>
      immutate(s, {
        editedCategories: {
          $set: typeof value === 'string' ? [] : value,
        },
      }),
    );
  }

  function cancelCategoryEdit() {
    setState((s) => ({ ...s, entryInEdit: null }));
  }

  return [
    {
      title: <Typography variant={'h6'}>#</Typography>,
      property: 'entryNumber',
      align: 'right',
      renderValue: (e) => (
        <Typography variant={'body1'}>{e.entryNumber}</Typography>
      ),
    },
    {
      title: <Typography variant={'h6'}>Title</Typography>,
      property: 'title',
      align: 'left',
      renderValue: (e) => (
        <Link
          href={`/diary/${e.entryNumber}`}
          variant={'body1'}
          color={'inherit'}
          fontWeight={400}
          underline={'hover'}>
          {e.title}
        </Link>
      ),
    },
    {
      title: <Typography variant={'h6'}>Categories</Typography>,
      property: 'categories',
      align: 'left',
      renderValue: (e) => {
        if (state.entryInEdit === e.id) {
          return (
            <FormControl>
              <TextField
                value={state.editedCategories}
                label={'Categories'}
                select={true}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                SelectProps={
                  {
                    displayEmpty: true,
                    IconComponent: () => null,
                    multiple: true,
                    onChange: onCategoryChange,
                    renderValue: (selected) => (
                      <Stack
                        direction={'row'}
                        flexWrap={'wrap'}
                        spacing={2}
                        useFlexGap={true}>
                        {selected.map((categoryId) => {
                          const name = diaryCategories.find(
                            ({ id }) => id === categoryId,
                          )?.name;
                          return (
                            <Chip
                              variant={'outlined'}
                              label={
                                <Typography variant={'overline'}>
                                  {name}
                                </Typography>
                              }
                              key={categoryId}
                            />
                          );
                        })}
                      </Stack>
                    ),
                  } as Partial<SelectProps<number[]>>
                }
                InputProps={{
                  endAdornment: (
                    <Stack direction={'row'}>
                      <IconButton onClick={() => onCategoriesSave(e.id)}>
                        <CheckIcon color={'primary'} />
                      </IconButton>
                      <IconButton onClick={cancelCategoryEdit}>
                        <CloseIcon color={'primary'} />
                      </IconButton>
                    </Stack>
                  ),
                }}>
                {diaryCategories.map((category) => (
                  <MenuItem value={category.id} key={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          );
        }

        return (
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Stack
              direction={'row'}
              spacing={2}
              flexWrap={'wrap'}
              useFlexGap={true}>
              {e.categories?.map((category) => {
                return (
                  <Chip
                    variant={'outlined'}
                    label={
                      <Typography variant={'overline'}>
                        {category.name}
                      </Typography>
                    }
                    key={category.id}
                  />
                );
              })}
            </Stack>
            <Box visibility={e.id === hoveredEntryId ? 'visible' : 'hidden'}>
              <IconButton onClick={() => enableEditing(e)}>
                <Edit color={'primary'} />
              </IconButton>
            </Box>
          </Stack>
        );
      },
    },
    {
      title: <Favorite fontSize={'medium'} sx={{ mx: 2 }} />,
      property: 'isFavourite',
      align: 'left',
      renderValue: (e) => {
        if (e.isFavourite) {
          return (
            <IconButton onClick={() => onFavouriteClick(e)}>
              <Favorite color={'primary'} fontSize={'medium'} />
            </IconButton>
          );
        }

        return (
          <IconButton
            onClick={() => onFavouriteClick(e)}
            sx={{
              visibility: e.id === hoveredEntryId ? 'visible' : 'hidden',
            }}>
            <FavoriteBorder fontSize={'medium'} />
          </IconButton>
        );
      },
    },
    {
      title: <Typography variant={'h6'}>Date Published</Typography>,
      property: 'date',
      align: 'left',
      renderValue: (e) => (
        <Typography variant={'body1'}>{ZDate.format(e.date)}</Typography>
      ),
    },
    {
      title: <Typography variant={'h6'}>Status</Typography>,
      property: 'status',
      align: 'left',
      renderValue: (e) => {
        const Icon = STATUS_ICONS[e.status];
        return (
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <Icon color={'primary'} />
            <Typography variant={'body1'}>{e.status}</Typography>
          </Stack>
        );
      },
    },
  ];
}

interface DiaryTableFieldsState {
  entryInEdit: number | null;
  editedCategories: number[];
}
