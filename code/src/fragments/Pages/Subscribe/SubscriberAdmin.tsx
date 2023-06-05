import {
  Check as CheckIcon,
  Unsubscribe as UnsubscribeIcon,
} from '@mui/icons-material';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import type { Prisma, Subscriber } from '@prisma/client';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import TableView from 'fragments/Shared/TableView';
import type { TableViewState } from 'fragments/Shared/TableView.utils';
import {
  TableViewContext,
  createInitialTableViewState,
} from 'fragments/Shared/TableView.utils';
import ZDate from 'utils/lib/date';
import { trpc } from 'utils/trpc';

const initialState = createInitialTableViewState<Subscriber>({
  sort: {
    order: 'desc',
    property: 'createTime',
  },
});

export default function SubscriberAdmin() {
  const [state, setState] = useState(initialState);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const subscriberTableFields = useSubscriberTableFields();
  const trpcContext = trpc.useContext();

  const { order, property } = state.sort;
  const result = trpc.subscriber.findMany.useQuery({
    orderBy: { [property!]: order },
  });

  const { mutate: deleteSubscriber, isLoading: isDeleteOpLoading } =
    trpc.subscriber.delete.useMutation({
      onSuccess: () => {
        void trpcContext.subscriber.findMany.refetch();
        const { email } = state.selectedEntity!;
        const message = `You've deleted '${email}' from your subscribers list.`;
        enqueueSnackbar(message, { variant: 'success' });
        setState((s) => ({ ...s, isDeleteModalVisible: false }));
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  function onDeleteConfirm() {
    if (state.selectedEntity) {
      deleteSubscriber({ where: { id: state.selectedEntity.id } });
    }
  }

  function navigateToUnsubscribePage() {
    if (state.selectedEntity) {
      void router.push(`/subscriptions?token=${state.selectedEntity.token}`);
    }
  }

  const context: ReactUseState<TableViewState<Subscriber>> = [
    {
      ...state,
      addButtonHref: '/admin/subscribers/add',
      addButtonText: 'Add subscriber',
      additionalMenuItems: [
        {
          label: 'Unsubscribe',
          Icon: UnsubscribeIcon,
          onClick: navigateToUnsubscribePage,
        },
      ],
      deleteConfirmMessage: `Are you sure you want to delete "${state.selectedEntity?.email}" from your subscribers list?`,
      editHref: `/admin/subscribers/edit/${state.selectedEntity?.id}`,
      isDeleteOpLoading,
      noEntitiesMessage: 'No subscribers found.',
      onDeleteConfirm,
      pageTitle: 'List of Subscribers',
      queryResult: result,
      tableFields: subscriberTableFields,
    },
    setState,
  ];

  return (
    <TableViewContext.Provider value={context}>
      <TableView />
    </TableViewContext.Provider>
  );
}

function useSubscriberTableFields(): TableField<Subscriber>[] {
  return [
    {
      title: <Typography variant={'h6'}>#</Typography>,
      property: null,
      renderValue: (_, i) => <Typography variant={'body1'}>{i}</Typography>,
    },
    {
      title: <Typography variant={'h6'}>Email</Typography>,
      property: 'email',
      renderValue: (e) => <Typography variant={'body1'}>{e.email}</Typography>,
    },
    {
      title: <Typography variant={'h6'}>First Name</Typography>,
      property: 'firstname',
      renderValue: (e) => (
        <Typography variant={'body1'}>{e.firstname}</Typography>
      ),
    },
    {
      title: <Typography variant={'h6'}>Last Name</Typography>,
      property: 'lastname',
      renderValue: (e) => (
        <Typography variant={'body1'}>{e.lastname}</Typography>
      ),
    },

    {
      title: <Typography variant={'h6'}>Subscriptions</Typography>,
      property: 'subscriptions',
      renderValue: (e) => (
        <List disablePadding={true} dense={true}>
          {Object.entries(e.subscriptions as Prisma.JsonObject).map(
            ([type, checked]) => {
              if (!checked) return null;
              return (
                <ListItem disablePadding={true} key={type}>
                  <ListItemIcon sx={{ minWidth: (t) => t.spacing(6) }}>
                    {checked ? <CheckIcon fontSize={'small'} /> : null}
                  </ListItemIcon>
                  <ListItemText>{type}</ListItemText>
                </ListItem>
              );
            },
          )}
        </List>
      ),
    },
    {
      title: <Typography variant={'h6'}>Date Subscribed</Typography>,
      property: 'createTime',
      renderValue: (e) => (
        <Typography variant={'body1'}>{ZDate.format(e.createTime)}</Typography>
      ),
    },
  ];
}
