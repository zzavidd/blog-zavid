import {
  Add as AddIcon,
  Delete,
  Edit,
  MoreVert as MoreVertIcon,
  Unsubscribe,
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
import type { Subscriber } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext } from 'react';

import { ActionDialog } from 'components/Dialog';
import { LinkButton } from 'components/Link';
import { trpc } from 'utils/trpc';

import { SubscriberAdminContext } from './SubscriberAdmin.context';
import { useSubscriberTableFields } from './SubscriberAdmin.hooks';

export default function SubscriberAdmin() {
  const [context, setContext] = useContext(SubscriberAdminContext);
  const subscriberTableFields = useSubscriberTableFields();

  function setSortProperty(property: keyof Subscriber) {
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
            <Typography variant={'h2'}>List of Subscribers</Typography>
            <LinkButton href={'/admin/sub/add'} startIcon={<AddIcon />}>
              Add subscriber
            </LinkButton>
          </Stack>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow component={Paper}>
                  {subscriberTableFields.map(({ title, property, align }) => {
                    const isActive = context.sort.property === property;
                    return (
                      <TableCell
                        align={align}
                        sortDirection={isActive ? context.sort.order : false}
                        key={property}>
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
              <SubscriberTableContent />
            </Table>
          </TableContainer>
        </Stack>
      </Container>
      <DeleteModal />
      <SubscriberEachMenu />
    </React.Fragment>
  );
}

function SubscriberTableContent() {
  const [context] = useContext(SubscriberAdminContext);
  const fields = useSubscriberTableFields();
  const { order, property } = context.sort;
  const { data: subscribers, isLoading } = trpc.subscriber.findMany.useQuery({
    orderBy: { [property]: order },
  });

  if (isLoading) {
    return (
      <TableBody>
        {Array(20)
          .fill(null)
          .map((_, key) => (
            <TableRow key={key}>
              {fields.map(({ property }) => (
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

  if (!subscribers?.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell align={'center'} colSpan={fields.length + 1}>
            <Typography variant={'body1'}>No subscribers found.</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {subscribers.map((subscriber, key) => (
        <SubscriberEachRow
          entity={subscriber}
          index={key + 1}
          key={subscriber.id}
        />
      ))}
    </TableBody>
  );
}

/**
 * Memoised component for each subscriber entry table row.
 */
const SubscriberEachRow = React.memo<SubscriberEachRowProps>(
  function SubscriberEachRow({ entity, index }) {
    const [, setContext] = useContext(SubscriberAdminContext);
    const fields = useSubscriberTableFields();

    function onMoreClick(e: React.MouseEvent) {
      setContext((c) => ({
        ...c,
        isMenuVisible: true,
        menuAnchor: e.target as HTMLButtonElement,
        selectedSubscriber: entity,
      }));
    }

    return (
      <TableRow hover={true}>
        {fields.map(({ align, property, renderValue }) => (
          <TableCell align={align} key={property}>
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
  },
);

/**
 * The delete modal for the subscriber.
 */
function DeleteModal() {
  const [context, setContext] = useContext(SubscriberAdminContext);
  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = trpc.useContext();

  const { mutate: deleteSubscriber, isLoading: isDeleteLoading } =
    trpc.subscriber.delete.useMutation({
      onSuccess: () => {
        void trpcContext.subscriber.findMany.refetch();
        const { email } = context.selectedSubscriber!;
        const message = `You've deleted '${email}' as a subscriber.`;
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
    if (context.selectedSubscriber) {
      deleteSubscriber({ where: { id: context.selectedSubscriber.id } });
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
      Are you sure you want to delete&nbsp;
      {context.selectedSubscriber?.email} as a subscriber?
    </ActionDialog>
  );
}

/**
 * The menu shown for each subscriber table row.
 */
function SubscriberEachMenu() {
  const [context, setContext] = useContext(SubscriberAdminContext);
  const router = useRouter();

  function openDeleteModal() {
    setContext((s) => ({ ...s, isDeleteModalVisible: true }));
  }

  function closeMenu() {
    setContext((s) => ({ ...s, isMenuVisible: false }));
  }

  function navigateToEdit() {
    if (context.selectedSubscriber) {
      void router.push(
        `/admin/subscribers/edit/${context.selectedSubscriber.id}`,
      );
    }
  }

  function navigateToUnsubscribePage() {
    if (context.selectedSubscriber) {
      void router.push(
        `/subscriptions?token=${context.selectedSubscriber.token}`,
      );
    }
  }

  const menuItems = [
    { label: 'Edit', icon: <Edit />, onClick: navigateToEdit },
    { label: 'Delete', icon: <Delete />, onClick: openDeleteModal },
    {
      label: 'View subscribe page',
      icon: <Unsubscribe />,
      onClick: navigateToUnsubscribePage,
    },
  ];

  return (
    <Menu
      open={context.isMenuVisible}
      anchorEl={context.menuAnchor}
      onClick={closeMenu}
      onClose={closeMenu}
      hideBackdrop={true}>
      <MenuList>
        {menuItems.map(({ label, icon, onClick }, key) => (
          <MenuItem onClick={onClick} key={key}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{label}</ListItemText>
            <ListItemIcon />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

interface SubscriberEachRowProps {
  entity: Subscriber;
  index: number;
}
