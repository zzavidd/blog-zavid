import { Add, AttachEmail, Email as EmailIcon } from '@mui/icons-material';
import type { Exclusive } from '@prisma/client';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

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
  const [state, setState] = useState(initialState);
  const trpcContext = trpc.useContext();
  const { enqueueSnackbar } = useSnackbar();

  const exclusivesTableFields = useExclusivesTableFields();
  const result = trpc.exclusive.findMany.useQuery({
    orderBy: { [state.sort.property!]: state.sort.order },
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
        const { subject } = state.selectedEntity!;
        const message = `You've deleted exclusive '${subject}'.`;
        enqueueSnackbar(message, { variant: 'success' });
        setState((s) => ({ ...s, isDeleteModalVisible: false }));
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  function onDeleteConfirm() {
    if (state.selectedEntity) {
      deleteExclusive({ where: { id: state.selectedEntity.id } });
    }
  }

  function onPreviewEtherealClick() {
    if (!state.selectedEntity) return;
    notifyExclusive(
      { id: state.selectedEntity.id, type: 'Ethereal' },
      {
        onSuccess: (url) => {
          window.open(url, '_blank');
        },
      },
    );
  }

  function onPreviewGmailClick() {
    if (!state.selectedEntity) return;
    notifyExclusive(
      { id: state.selectedEntity.id, type: 'Gmail' },
      {
        onSuccess: () => {
          enqueueSnackbar(
            `Sent "${state.selectedEntity?.subject}" to administrator email.`,
            { variant: 'success' },
          );
        },
      },
    );
  }

  const additionalMenuItems: MoreMenuItem[] = [
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

  const context: ReactUseState<TableViewState<Exclusive>> = [
    {
      ...state,
      additionalMenuItems,
      buttons: (
        <React.Fragment>
          <LinkButton href={'/admin/exclusives/add'} startIcon={<Add />}>
            Add exclusive
          </LinkButton>
        </React.Fragment>
      ),
      deleteConfirmMessage: `Are you sure you want to delete the exclusive '${state.selectedEntity?.subject}'?`,
      editHref: `/admin/exclusives/edit/${state.selectedEntity?.id}`,
      isDeleteOpLoading,
      noEntitiesMessage: 'No exclusives found.',
      onDeleteConfirm,
      pageTitle: 'List of Exclusives',
      queryResult: result,
      tableFields: exclusivesTableFields,
    },
    setState,
  ];

  return (
    <TableViewContext.Provider value={context}>
      <TableView />
    </TableViewContext.Provider>
  );
}
