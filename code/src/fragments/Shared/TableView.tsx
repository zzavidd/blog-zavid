import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
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
  TableSortLabel,
  Typography,
} from '@mui/material';
import { Prisma } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';

import { ActionDialog } from 'components/Dialog';
import { LinkButton } from 'components/Link';

import type { MoreMenuItem } from './TableView.utils';
import { useTableContext } from './TableView.utils';

export default function TableView<T extends { id: number }>() {
  const [context, setContext] = useTableContext<T>();
  const { addButtonHref, addButtonText, pageTitle } = context.props!;

  function setSortProperty(property: keyof T) {
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
            <Typography variant={'h2'}>{pageTitle}</Typography>
            <LinkButton href={addButtonHref} startIcon={<AddIcon />}>
              {addButtonText}
            </LinkButton>
          </Stack>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow component={Paper}>
                  {context.tableFields.map(({ title, property, align }) => {
                    const isActive = context.sort.property === property;
                    return (
                      <TableCell
                        align={align}
                        sortDirection={isActive ? context.sort.order : false}
                        key={String(property)}>
                        <TableSortLabel
                          active={isActive}
                          direction={isActive ? context.sort.order : 'asc'}
                          onClick={() => setSortProperty(property)}>
                          {title}
                        </TableSortLabel>
                      </TableCell>
                    );
                  })}
                  <TableCell />
                </TableRow>
              </TableHead>
              <DiaryTableContent fields={context.tableFields} />
            </Table>
          </TableContainer>
        </Stack>
      </Container>
      <DeleteModal />
      <DiaryEachMenu />
    </React.Fragment>
  );
}

function DiaryTableContent<T extends { id: number }>({
  fields,
}: TableViewContentProps<T>) {
  const [context] = useTableContext<T>();
  const { data: entityList, isLoading } = context.queryResult!;

  if (isLoading) {
    return (
      <TableBody>
        {Array(20)
          .fill(null)
          .map((_, key) => (
            <TableRow key={key}>
              {fields.map(({ property }) => (
                <TableCell key={String(property)}>
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

  if (!entityList?.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell align={'center'} colSpan={fields.length + 1}>
            <Typography variant={'body1'}>No diary entries found.</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {entityList.map((entity) => (
        <TableViewRow entity={entity} key={entity.id} />
      ))}
    </TableBody>
  );
}

/**
 * Memoised component for each diary entry table row.
 */
const TableViewRow = React.memo(function TableViewRow<
  T extends { id: number },
>({ entity }: TableViewRowProps<T>) {
  const [context, setContext] = useTableContext();

  function setHoverState(id: number | null) {
    setContext((c) => ({ ...c, hoveredEntityId: id }));
  }

  function onMoreClick(e: React.MouseEvent) {
    setContext((c) => ({
      ...c,
      isMenuVisible: true,
      menuAnchor: e.target as HTMLButtonElement,
      selectedEntity: entity,
    }));
  }

  return (
    <TableRow
      hover={true}
      onMouseEnter={() => setHoverState(entity.id)}
      onMouseLeave={() => setHoverState(null)}>
      {context.tableFields.map(({ align, property, renderValue }) => (
        <TableCell align={align} key={property}>
          {renderValue(entity)}
        </TableCell>
      ))}
      <TableCell align={'center'}>
        <IconButton onClick={onMoreClick}>
          <MoreVertIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

/**
 * The delete modal for the diary entry.
 */
function DeleteModal() {
  const [context, setContext] = useTableContext();

  function closeDeleteModal() {
    setContext((s) => ({ ...s, isDeleteModalVisible: false }));
  }

  return (
    <ActionDialog
      open={context.isDeleteModalVisible}
      onConfirm={context.onDeleteConfirm}
      onCancel={closeDeleteModal}
      confirmText={'Delete'}
      isActionDestructive={true}
      isActionLoading={context.isDeleteOpLoading}>
      {context.deleteConfirmMessage}
    </ActionDialog>
  );
}

/**
 * The menu shown for each diary entry table row.
 */
function DiaryEachMenu() {
  const [context, setContext] = useTableContext();
  const router = useRouter();

  function openDeleteModal() {
    setContext((s) => ({ ...s, isDeleteModalVisible: true }));
  }

  function closeMenu() {
    setContext((s) => ({ ...s, isMenuVisible: false }));
  }

  function navigateToEdit() {
    if (!context.selectedEntity) return;
    void router.push(`/admin/diary/edit/${context.selectedEntity?.id}`);
  }

  const menuItems: MoreMenuItem[] = [
    { label: 'Edit', Icon: EditIcon, onClick: navigateToEdit },
    { label: 'Delete', Icon: DeleteIcon, onClick: openDeleteModal },
    ...context.additionalMenuItems,
  ];

  return (
    <Menu
      open={context.isMenuVisible}
      anchorEl={context.menuAnchor}
      onClick={closeMenu}
      onClose={closeMenu}
      hideBackdrop={true}>
      <MenuList>
        {menuItems.map(({ label, Icon, onClick }, key) => (
          <MenuItem onClick={onClick} key={key}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText>{label}</ListItemText>
            <ListItemIcon />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

interface TableViewRowProps<T> {
  entity: T;
}

interface TableViewContentProps<T> {
  fields: TableField<T>[];
}
