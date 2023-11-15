import { Check, ChevronLeft, Delete, Edit } from '@mui/icons-material';
import type { SxProps, Theme } from '@mui/material';
import {
  Button,
  ClickAwayListener,
  Container,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  TextField,
  Typography,
  alpha,
  lighten,
} from '@mui/material';
import type { DiaryCategory } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import { useSnackbar } from 'notistack';
import type React from 'react';
import { useState } from 'react';
import invariant from 'tiny-invariant';

import { ActionDialog } from 'components/Dialog';
import { LinkButton } from 'components/Link';
import { getServerSideHelpers } from 'utils/ssr';
import { trpc } from 'utils/trpc';

const listItemSxProps: SxProps<Theme> = {
  'borderRadius': (t) => `${t.shape.borderRadius}px`,
  'py': 3,
  '&:hover': {
    backgroundColor: (t) =>
      alpha(lighten(t.palette.background.paper, 0.05), 0.7),
  },
};

const DiaryCategoryEdit: NextPageWithLayout = () => {
  const [state, setState] = useState<DiaryCategoryEditProps>({
    currentText: '',
    isDeleteModalVisible: false,
    isAdding: false,
    selectedCategoryToEdit: null,
    selectedCategoryToDelete: null,
  });

  const { data: categories = [] } = trpc.diaryCategory.findMany.useQuery();
  const { mutate: createCategory } = trpc.diaryCategory.create.useMutation();
  const { mutate: updateCategory } = trpc.diaryCategory.update.useMutation();
  const { mutate: deleteCategory } = trpc.diaryCategory.delete.useMutation();

  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = trpc.useContext();

  function onTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState((s) => ({ ...s, currentText: e.target.value }));
  }

  function onAddClick() {
    setState((s) => ({ ...s, currentText: '', isAdding: true }));
  }

  function onEditClick(category: DiaryCategory) {
    setState((s) => ({
      ...s,
      currentText: category.name,
      selectedCategoryToEdit: category,
    }));
  }

  function showDeleteModal(category: DiaryCategory) {
    setState((s) => ({
      ...s,
      isDeleteModalVisible: true,
      selectedCategoryToDelete: category,
    }));
  }

  function hideDeleteModal() {
    setState((s) => ({ ...s, isDeleteModalVisible: false }));
  }

  function onCreateCategory() {
    createCategory(
      { data: { name: state.currentText } },
      {
        onSuccess: async (category) => {
          await trpcContext.diaryCategory.findMany.refetch();
          enqueueSnackbar(`Successfully created category "${category.name}".`, {
            variant: 'success',
          });
          setState((s) => ({ ...s, isAdding: false }));
        },
      },
    );
  }

  function onUpdateCategory() {
    invariant(state.selectedCategoryToEdit, 'No category selected');
    const { id, name } = state.selectedCategoryToEdit;
    updateCategory(
      { data: { name: state.currentText }, where: { id } },
      {
        onSuccess: async () => {
          await trpcContext.diary.findMany.refetch();
          await trpcContext.diaryCategory.findMany.refetch();
          enqueueSnackbar(`Successfully updated category "${name}".`, {
            variant: 'success',
          });
          setState((s) => ({ ...s, selectedCategoryToEdit: null }));
        },
      },
    );
  }

  function onDeleteCategory() {
    invariant(state.selectedCategoryToDelete, 'No category selected');
    const { id, name } = state.selectedCategoryToDelete;
    deleteCategory(
      { where: { id } },
      {
        onSuccess: async () => {
          await trpcContext.diary.findMany.refetch();
          await trpcContext.diaryCategory.findMany.refetch();
          enqueueSnackbar(`Successfully deleted category ${name}.`, {
            variant: 'success',
          });
          setState((s) => ({
            ...s,
            isDeleteModalVisible: false,
            selectedCategoryToDelete: null,
          }));
        },
      },
    );
  }

  return (
    <Container maxWidth={'sm'}>
      <Stack p={5}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <LinkButton
            variant={'text'}
            href={'/admin/diary'}
            startIcon={<ChevronLeft />}>
            Back to Diary Admin
          </LinkButton>
          <Button variant={'outlined'} onClick={onAddClick}>
            Add category
          </Button>
        </Stack>
        <List>
          {state.isAdding ? (
            <ListItem divider={true} sx={listItemSxProps}>
              <ListItemIcon>{categories.length + 1}</ListItemIcon>
              <ClickAwayListener
                onClickAway={() =>
                  setState((s) => ({ ...s, isAdding: false }))
                }>
                <TextField
                  value={state.currentText}
                  onChange={onTextChange}
                  helperText={'New category'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position={'end'}>
                        <IconButton
                          onClick={onCreateCategory}
                          sx={{
                            visibility: state.currentText
                              ? 'visible'
                              : 'hidden',
                          }}>
                          <Check color={'primary'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </ClickAwayListener>
            </ListItem>
          ) : null}
          {categories.map((category, key) => {
            const entryCount = `${category._count?.entries} entries`;
            return (
              <ListItem divider={true} sx={listItemSxProps} key={key}>
                <ListItemIcon>{key + 1}</ListItemIcon>
                {state.selectedCategoryToEdit?.id === category.id ? (
                  <ClickAwayListener
                    onClickAway={() =>
                      setState((s) => ({ ...s, selectedCategoryToEdit: null }))
                    }>
                    <TextField
                      value={state.currentText}
                      onChange={onTextChange}
                      helperText={entryCount}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position={'end'}>
                            <IconButton
                              onClick={onUpdateCategory}
                              sx={{
                                visibility:
                                  state.currentText &&
                                  state.currentText !== category.name
                                    ? 'visible'
                                    : 'hidden',
                              }}>
                              <Check color={'primary'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </ClickAwayListener>
                ) : (
                  <ListItemText
                    primary={category.name}
                    secondary={entryCount}
                    primaryTypographyProps={{
                      variant: 'overline',
                      fontSize: 16,
                    }}
                  />
                )}
                <ListItemSecondaryAction>
                  <IconButton onClick={() => onEditClick(category)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => showDeleteModal(category)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </Stack>
      <ActionDialog
        open={state.isDeleteModalVisible}
        onConfirm={onDeleteCategory}
        onCancel={hideDeleteModal}>
        <Typography>
          Are you sure you want to delete category &ldquo;
          {state.selectedCategoryToDelete?.name}&rdquo;?
        </Typography>
      </ActionDialog>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<AppPageProps> = async (
  ctx,
) => {
  const helpers = getServerSideHelpers(ctx);
  await helpers.diaryCategory.findMany.prefetch();

  return {
    props: {
      pathDefinition: {
        title: 'Edit Diary Categories',
      },
    },
  };
};

export default DiaryCategoryEdit;

interface DiaryCategoryEditProps {
  currentText: string;
  isDeleteModalVisible: boolean;
  isAdding: boolean;
  selectedCategoryToEdit: DiaryCategory | null;
  selectedCategoryToDelete: DiaryCategory | null;
}
