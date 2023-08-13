import {
  Add,
  AttachEmail,
  Email as EmailIcon,
  Send,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import type { Exclusive } from '@prisma/client';
import immutate from 'immutability-helper';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';

import { LinkButton } from 'components/Link';
import TableView from 'fragments/Shared/TableView';
import type {
  MoreMenuItem,
  TableViewState,
} from 'fragments/Shared/TableView.context';
import {
  TableViewContext,
  createInitialTableViewState,
} from 'fragments/Shared/TableView.context';
import { trpc } from 'utils/trpc';

import { useExclusivesTableFields } from './ExclusivesAdmin.hooks';

const initialState = createInitialTableViewState<Exclusive>({
  sort: {
    order: 'desc',
    property: 'date',
  },
});

export default function ExclusivesAdmin() {
  const [state, setState] = useState({ isSendModalOpen: false });
  const [context, setContext] = useState(initialState);
  const trpcContext = trpc.useContext();
  const { enqueueSnackbar } = useSnackbar();

  const exclusivesTableFields = useExclusivesTableFields();
  const result = trpc.exclusive.findMany.useQuery({
    orderBy: { [context.sort.property!]: context.sort.order },
    select: {
      id: true,
      subject: true,
      preview: true,
      date: true,
      status: true,
      slug: true,
    },
  });

  const { mutate: notifyExclusive } = trpc.exclusive.publish.useMutation();
  const { mutate: deleteExclusive, isLoading: isDeleteOpLoading } =
    trpc.exclusive.delete.useMutation({
      onSuccess: () => {
        void trpcContext.exclusive.findMany.refetch();
        const { subject } = context.selectedEntity!;
        const message = `You've deleted exclusive '${subject}'.`;
        enqueueSnackbar(message, { variant: 'success' });
        setContext((s) => ({ ...s, isDeleteModalVisible: false }));
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  function onDeleteConfirm() {
    if (context.selectedEntity) {
      deleteExclusive({ where: { id: context.selectedEntity.id } });
    }
  }

  function onPreviewEtherealClick() {
    if (!context.selectedEntity) return;
    notifyExclusive(
      {
        id: context.selectedEntity.id,
        options: { isPreview: true, previewType: 'Ethereal' },
      },
      {
        onSuccess: (url) => {
          window.open(url, '_blank');
        },
      },
    );
  }

  function onPreviewGmailClick() {
    if (!context.selectedEntity) return;
    notifyExclusive(
      {
        id: context.selectedEntity.id,
        options: { isPreview: true, previewType: 'Gmail' },
      },
      {
        onSuccess: () => {
          enqueueSnackbar(
            `Sent "${context.selectedEntity?.subject}" to administrator email.`,
            { variant: 'success' },
          );
        },
      },
    );
  }

  function toggleSendModal(open: boolean) {
    setState({ isSendModalOpen: open });
  }

  const additionalMenuItems: MoreMenuItem[] = [
    {
      label: 'Send to subscribers...',
      Icon: Send,
      onClick: () => toggleSendModal(true),
      disabled: context.selectedEntity?.status !== 'PUBLISHED',
    },
    {
      label: 'Preview Ethereal',
      Icon: EmailIcon,
      onClick: onPreviewEtherealClick,
      disabled: process.env.NEXT_PUBLIC_APP_ENV === 'production',
    },
    {
      label: 'Preview Gmail',
      Icon: AttachEmail,
      onClick: onPreviewGmailClick,
    },
  ];

  const tableViewContext: ReactUseState<TableViewState<Exclusive>> = [
    {
      ...context,
      additionalMenuItems,
      buttons: (
        <React.Fragment>
          <LinkButton href={'/admin/exclusives/add'} startIcon={<Add />}>
            Add exclusive
          </LinkButton>
        </React.Fragment>
      ),
      deleteConfirmMessage: `Are you sure you want to delete the exclusive '${context.selectedEntity?.subject}'?`,
      editHref: `/admin/exclusives/edit/${context.selectedEntity?.id}`,
      isDeleteOpLoading,
      noEntitiesMessage: 'No exclusives found.',
      onDeleteConfirm,
      pageTitle: 'List of Exclusives',
      queryResult: result,
      tableFields: exclusivesTableFields,
    },
    setContext,
  ];

  return (
    <TableViewContext.Provider value={tableViewContext}>
      <TableView />
      <SendModal
        open={state.isSendModalOpen}
        onClose={() => toggleSendModal(false)}
      />
    </TableViewContext.Provider>
  );
}

function SendModal({ open, onClose }: SendModalProps) {
  const [state, setState] = useState<SendModalState>({
    selectedSubscribers: {},
  });
  const [context] =
    useContext<ReactUseState<TableViewState<Exclusive>>>(TableViewContext);
  const { data: subscribers = [] } = trpc.subscriber.findMany.useQuery({});
  const { enqueueSnackbar } = useSnackbar();

  const quantitySelected = Object.values(state.selectedSubscribers).filter(
    (e) => e === true,
  ).length;

  const { mutate: sendExclusive, isLoading } =
    trpc.exclusive.publish.useMutation({
      onSuccess: () => {
        const message = `You've sent '${context.selectedEntity?.subject}' the exclusive to ${quantitySelected} subscribers.`;
        enqueueSnackbar(message, { variant: 'success' });
        setState((s) => ({ ...s, isDeleteModalVisible: false }));
        onClose();
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  function setSelectedSubscriber(id: string) {
    setState((s) =>
      immutate(s, {
        selectedSubscribers: {
          [id]: { $set: !state.selectedSubscribers[id] },
        },
      }),
    );
  }

  function sendToSubscribers() {
    if (!context.selectedEntity?.id) return;

    const recipients = Object.entries(state.selectedSubscribers)
      .filter(([, value]) => value === true)
      .map(([id]) => Number(id));

    sendExclusive({
      id: context.selectedEntity.id,
      options: { isPreview: false, recipients },
    });
  }

  return (
    <Dialog open={open} maxWidth={'sm'} fullWidth={true}>
      <DialogTitle typography={'body1'}>
        Select the subscriber(s) to send the exclusive to:
      </DialogTitle>
      <DialogContent
        sx={{
          maxHeight: (t) => t.spacing(14),
          padding: (t) => t.spacing(5, 4, 5, 5),
        }}>
        <List sx={{ flex: 1 }}>
          {subscribers.map(({ id, email, firstname, lastname }) => {
            const name = firstname ? `${firstname} ${lastname}` : undefined;
            const checked = state.selectedSubscribers[id];
            return (
              <ListItem disablePadding={true} key={id}>
                <ListItemButton
                  onClick={() => setSelectedSubscriber(String(id))}
                  selected={checked}>
                  <ListItemIcon sx={{ minWidth: (t) => t.spacing(6) }}>
                    <Checkbox checked={checked} edge={'start'} />
                  </ListItemIcon>
                  <ListItemText primary={email} secondary={name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions sx={{ padding: (t) => t.spacing(4, 5, 5, 5) }}>
        <Typography variant={'body2'} sx={{ flex: 1 }}>
          {quantitySelected} subscriber(s) selected
        </Typography>
        <Button variant={'outlined'} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          variant={'contained'}
          onClick={sendToSubscribers}
          color={'primary'}
          loading={isLoading}>
          Send
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

interface SendModalProps {
  open: boolean;
  onClose: () => void;
}

interface SendModalState {
  selectedSubscribers: Record<string, boolean>;
}
