import {
  Add as AddIcon,
  Delete,
  Edit,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import {
  Container,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Skeleton,
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

import { ActionDialog } from 'componentsv2/Dialog';
import { LinkButton } from 'componentsv2/Link';
import { trpc } from 'utils/trpc';

import { DiaryAdminContext } from './DiaryAdmin.context';
import { useDiaryTableFields } from './DiaryAdmin.hooks';

export default function DiaryAdmin() {
  const [, setContext] = useContext(DiaryAdminContext);
  const diaryTableFields = useDiaryTableFields();

  function sortDiaryEntries(property: keyof Diary) {
    setContext((s) => {
      const order =
        s.sort.order === Prisma.SortOrder.asc
          ? Prisma.SortOrder.desc
          : Prisma.SortOrder.asc;
      return { ...s, sort: { property, order } };
    });
  }

  return (
    <React.Fragment>
      <Container maxWidth={'xl'}>
        <Stack m={5} spacing={5}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography variant={'h2'}>List of Diary Entries</Typography>
            <LinkButton href={'/diary/add'} startIcon={<AddIcon />}>
              Add entry
            </LinkButton>
          </Stack>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow component={Paper}>
                  {diaryTableFields.map(({ title, property, align }) => (
                    <TableCell align={align} key={property}>
                      <Typography variant={'h6'}>{title}</Typography>
                    </TableCell>
                  ))}
                  <TableCell />
                </TableRow>
              </TableHead>
              <DiaryTableContent />
            </Table>
          </TableContainer>
        </Stack>
      </Container>

      <DeleteModal />
      <DiaryEachMenu />
    </React.Fragment>
  );
}

function DiaryTableContent() {
  const [context] = useContext(DiaryAdminContext);
  const diaryTableFields = useDiaryTableFields();
  const { order, property } = context.sort;
  const { data: diaryEntries, isLoading } = trpc.getDiary.useQuery({
    orderBy: { [property]: order },
    select: {
      id: true,
      title: true,
      status: true,
      date: true,
      entryNumber: true,
      isFavourite: true,
    },
  });

  if (isLoading) {
    return (
      <TableBody>
        {Array(20)
          .fill(null)
          .map((_, key) => (
            <TableRow key={key}>
              {diaryTableFields.map(({ property }) => (
                <TableCell key={property}>
                  <Skeleton variant={'text'} width={'80%'} />
                </TableCell>
              ))}
              <TableCell>
                <Skeleton variant={'text'} width={'80%'} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    );
  }

  if (!diaryEntries?.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell align={'center'} colSpan={diaryTableFields.length + 1}>
            <Typography variant={'body1'}> No diary entries found.</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {diaryEntries
        ? diaryEntries.map((entry) => (
            <DiaryEachRow entry={entry} key={entry.id} />
          ))
        : null}
    </TableBody>
  );
}

/**
 * Memoised component for each diary entry table row.
 */
const DiaryEachRow = React.memo<DiaryEachRowProps>(
  function DiaryEachRow({ entry }) {
    const [state, setState] = useState({ isHovered: false });
    const [, setContext] = useContext(DiaryAdminContext);
    const diaryTableFields = useDiaryTableFields(state.isHovered);

    function setHoverState(isHovered: boolean) {
      setState((s) => ({ ...s, isHovered }));
    }

    function onMoreClick(e: React.MouseEvent) {
      setContext((c) => ({
        ...c,
        isMenuVisible: true,
        menuAnchor: e.target as HTMLButtonElement,
        selectedDiaryEntry: entry,
      }));
    }

    return (
      <TableRow
        hover={true}
        onMouseEnter={() => setHoverState(true)}
        onMouseLeave={() => setHoverState(false)}>
        {diaryTableFields.map(({ align, property, renderValue }) => (
          <TableCell align={align} key={property}>
            {renderValue(entry)}
          </TableCell>
        ))}
        <TableCell align={'center'}>
          <IconButton onClick={onMoreClick}>
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  },
  (a, b) => a.entry.isFavourite === b.entry.isFavourite,
);

/**
 * The delete modal for the diary entry.
 */
function DeleteModal() {
  const [context, setContext] = useContext(DiaryAdminContext);
  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = trpc.useContext();

  const { mutate: deleteDiaryEntry, isLoading: isDeleteLoading } =
    trpc.deleteDiaryEntry.useMutation({
      onSuccess: async () => {
        await trpcContext.getDiary.refetch();
        const { entryNumber } = context.selectedDiaryEntry!;
        const message = `You've deleted diary entry #${entryNumber}.`;
        enqueueSnackbar(message, { variant: 'success' });
        setContext((s) => ({ ...s, isDeleteModalVisible: false }));
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  function closeDeleteModal() {
    setContext((s) => ({ ...s, isDeleteModalVisible: false }));
  }

  function onDeleteConfirm() {
    if (context.selectedDiaryEntry) {
      deleteDiaryEntry([context.selectedDiaryEntry?.id]);
    }
  }

  return (
    <ActionDialog
      open={context.isDeleteModalVisible}
      onConfirm={onDeleteConfirm}
      onCancel={closeDeleteModal}
      confirmText={'Delete'}
      isActionDestructive={true}
      isActionLoading={isDeleteLoading}>
      Are you sure you want to delete the diary entry #
      {context.selectedDiaryEntry?.entryNumber}?
    </ActionDialog>
  );
}

/**
 * The menu shown for each diary entry table row.
 */
function DiaryEachMenu() {
  const [context, setContext] = useContext(DiaryAdminContext);

  function openDeleteModal() {
    setContext((s) => ({ ...s, isDeleteModalVisible: true }));
  }

  function closeMenu() {
    setContext((s) => ({ ...s, isMenuVisible: false }));
  }

  const menuItems = [
    { label: 'Edit', icon: <Edit />, onClick: () => {}, disabled: true },
    { label: 'Delete', icon: <Delete />, onClick: openDeleteModal },
  ];

  return (
    <Menu
      open={context.isMenuVisible}
      anchorEl={context.menuAnchor}
      onClick={closeMenu}
      onClose={closeMenu}
      hideBackdrop={true}>
      <MenuList>
        {menuItems.map(({ label, icon, onClick, disabled }, key) => (
          <MenuItem onClick={onClick} disabled={disabled} key={key}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{label}</ListItemText>
            <ListItemIcon />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

interface DiaryEachRowProps {
  entry: Diary;
}
