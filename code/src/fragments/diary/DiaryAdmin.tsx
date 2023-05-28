import { LoadingButton } from '@mui/lab';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { Diary } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';

import { DiaryAdminContext } from 'fragments/diary/DiaryAdmin.context';
import { useDiaryTableFields } from 'fragments/diary/DiaryAdmin.utils';
import { trpc } from 'utils/trpc';

export default function DiaryAdmin() {
  const [context, setContext] = useContext(DiaryAdminContext);
  const diaryTableFields = useDiaryTableFields(false);
  const { enqueueSnackbar } = useSnackbar();

  const { order, property } = context.sort;
  const { data: diaryEntries, refetch: refetchDiaryEntries } =
    trpc.getDiary.useQuery({ orderBy: { [property]: order } });

  const { mutate: deleteDiaryEntry, isLoading: isDeleteLoading } =
    trpc.deleteDiaryEntry.useMutation({
      onSuccess: async () => {
        await refetchDiaryEntries();
        const { entryNumber } = context.selectedDiaryEntry!;
        const message = `You've deleted diary entry #${entryNumber}.`;
        enqueueSnackbar(message, { variant: 'success' });
        setContext((s) => ({ ...s, deleteModalVisible: false }));
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  function promptDelete(entry: Diary) {
    setContext((s) => ({
      ...s,
      deleteModalVisible: true,
      selectedDiaryEntry: entry,
    }));
  }

  function sortDiaryEntries(property: keyof Diary) {
    setContext((s) => {
      const order =
        s.sort.order === Prisma.SortOrder.asc
          ? Prisma.SortOrder.desc
          : Prisma.SortOrder.asc;
      return { ...s, sort: { property, order } };
    });
  }

  function closeDeleteModal() {
    setContext((s) => ({ ...s, deleteModalVisible: false }));
  }

  function onDeleteConfirm() {
    if (context.selectedDiaryEntry) {
      deleteDiaryEntry([context.selectedDiaryEntry?.id]);
    }
  }

  return (
    <React.Fragment>
      <Container maxWidth={'xl'}>
        <Stack m={5} spacing={5}>
          <Typography variant={'h2'}>List of Diary Entries</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow component={Paper}>
                  {diaryTableFields.map(({ title, property, align }) => (
                    <TableCell align={align} key={property}>
                      <Typography variant={'h6'}>{title}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {diaryEntries
                  ? diaryEntries.map((entry) => (
                      <DiaryEachRow entry={entry} key={entry.id} />
                    ))
                  : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Container>
      <Dialog open={context.deleteModalVisible}>
        <DialogContent>
          <DialogContentText variant={'body1'}>
            Are you sure you want to delete the diary entry #
            {context.selectedDiaryEntry?.entryNumber}?
          </DialogContentText>
          <DialogActions>
            <Button variant={'outlined'} onClick={closeDeleteModal}>
              Cancel
            </Button>
            <LoadingButton
              variant={'contained'}
              onClick={onDeleteConfirm}
              loading={isDeleteLoading}>
              Delete
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

const DiaryEachRow = React.memo<DiaryEachRowProps>(
  function DiaryEachRow({ entry }) {
    const [state, setState] = useState({ isHovered: false });
    const diaryTableFields = useDiaryTableFields(state.isHovered);
    return (
      <TableRow
        hover={true}
        onMouseEnter={() => setState({ isHovered: true })}
        onMouseLeave={() => setState({ isHovered: false })}>
        {diaryTableFields.map(({ align, property, renderValue }) => (
          <TableCell align={align} key={property}>
            {renderValue(entry)}
          </TableCell>
        ))}
      </TableRow>
    );
  },
  (a, b) => a.entry.isFavourite === b.entry.isFavourite,
);

interface DiaryEachRowProps {
  entry: Diary;
}
