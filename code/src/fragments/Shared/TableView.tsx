import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import type { PaperProps } from '@mui/material';
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

import type { MoreMenuItem } from './TableView.context';
import { useTableContext } from './TableView.context';

export default function TableView<TEntity extends { id: number }>() {
  const [context, setContext] = useTableContext<TEntity>();
  const { buttons, pageTitle } = context;

  function setSortProperty(property: keyof TEntity | null) {
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
        <Stack p={5} spacing={5}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            rowGap={5}
            justifyContent={'space-between'}>
            <Typography variant={'h2'}>{pageTitle}</Typography>
            <Stack direction={'row'} spacing={3}>
              {buttons}
            </Stack>
          </Stack>
          <TableContainer sx={{ overflowX: 'auto', maxWidth: '100vw' }}>
            <Table>
              <TableHead component={PaperTableHead}>
                <TableRow>
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
              <TableContent fields={context.tableFields} />
            </Table>
          </TableContainer>
        </Stack>
      </Container>
      <DeleteModal />
      <TableRowEachMenu />
    </React.Fragment>
  );
}

function TableContent<TEntity extends { id: number }>({
  fields,
}: TableViewContentProps<TEntity>) {
  const [context] = useTableContext<TEntity>();
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
            <Typography variant={'body1'}>
              {context.noEntitiesMessage}
            </Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {entityList.map((entity, i) => (
        <TableViewRow entity={entity} index={i + 1} key={entity.id} />
      ))}
    </TableBody>
  );
}

/**
 * Memoised component for each entity table row.
 */
const TableViewRow = React.memo(function TableViewRow<
  T extends { id: number },
>({ entity, index }: TableViewRowProps<T>) {
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
        <TableCell align={align} key={`${property}-${index}`}>
          {renderValue(entity, index)}
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
 * The delete modal for the entity.
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
 * The menu shown for each entity table row.
 */
function TableRowEachMenu() {
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
    void router.push(context.editHref);
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
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClick={closeMenu}
      onClose={closeMenu}
      hideBackdrop={true}>
      <MenuList disablePadding={true}>
        {menuItems.map(({ label, Icon, onClick, disabled }, key) => (
          <MenuItem
            onClick={onClick}
            disabled={disabled}
            sx={{
              maxWidth: (t) => t.spacing(12),
              py: 3,
              whiteSpace: 'normal',
            }}
            key={key}>
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

function PaperTableHead(props: PaperProps<'thead'>) {
  return <Paper {...props} component={TableHead} />;
}

interface TableViewRowProps<T> {
  entity: T;
  index: number;
}

interface TableViewContentProps<T> {
  fields: TableField<T>[];
}
