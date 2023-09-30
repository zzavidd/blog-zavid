import { Add, Article as ArticleIcon } from '@mui/icons-material';
import { Typography } from '@mui/material';
import type { Page } from '@prisma/client';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { Link, LinkButton } from 'components/Link';
import TableView from 'fragments/Shared/TableView';
import type { TableViewState } from 'fragments/Shared/TableView.context';
import {
  TableViewContext,
  createInitialTableViewState,
} from 'fragments/Shared/TableView.context';
import ZDate from 'utils/lib/date';
import { trpc } from 'utils/trpc';

const initialState = createInitialTableViewState<Page>({
  sort: {
    order: 'asc',
    property: 'title',
  },
});

export default function PageAdmin() {
  const [state, setState] = useState(initialState);
  const { enqueueSnackbar } = useSnackbar();

  const pageTableFields = usePageTableFields();
  const trpcContext = trpc.useContext();

  const { order, property } = state.sort;
  const result = trpc.page.findMany.useQuery({
    orderBy: { [property!]: order },
  });

  const { mutate: deletePage, isLoading: isDeleteOpLoading } =
    trpc.page.delete.useMutation({
      onSuccess: () => {
        void trpcContext.page.findMany.refetch();
        const { title } = state.selectedEntity!;
        const message = `You've deleted the '${title}' page.`;
        enqueueSnackbar(message, { variant: 'success' });
        setState((s) => ({ ...s, isDeleteModalVisible: false }));
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  function onDeleteConfirm() {
    if (state.selectedEntity) {
      deletePage({ where: { id: state.selectedEntity.id } });
    }
  }

  const context: ReactUseState<TableViewState<Page>> = [
    {
      ...state,
      buttons: (
        <LinkButton href={'/admin/pages/add'} startIcon={<Add />}>
          Add page
        </LinkButton>
      ),
      deleteConfirmMessage: `Are you sure you want to delete the "${state.selectedEntity?.title}" page?`,
      editHref: `/admin/pages/edit/${state.selectedEntity?.id}`,
      isDeleteOpLoading,
      noEntitiesMessage: 'No pages found.',
      onDeleteConfirm,
      pageTitle: 'List of Pages',
      queryResult: result,
      tableFields: pageTableFields,
    },
    setState,
  ];

  return (
    <TableViewContext.Provider value={context}>
      <TableView />
    </TableViewContext.Provider>
  );
}

function usePageTableFields(): TableField<Page>[] {
  return [
    {
      title: <Typography variant={'h6'}>#</Typography>,
      property: null,
      renderValue: (_, i) => <Typography variant={'body1'}>{i}</Typography>,
    },
    {
      title: <Typography variant={'h6'}>Title</Typography>,
      property: 'title',
      renderValue: (e) => <Typography variant={'body1'}>{e.title}</Typography>,
    },
    {
      title: <Typography variant={'h6'}>Slug</Typography>,
      property: 'slug',
      renderValue: (e) => {
        const href = `/${e.slug}`;
        return (
          <Link href={href} variant={'body1'}>
            {href}
          </Link>
        );
      },
    },
    {
      title: <Typography variant={'h6'}>Full Page?</Typography>,
      property: 'isEmbed',
      align: 'center',
      renderValue: (e) => (e.isEmbed ? null : <ArticleIcon />),
    },
    {
      title: <Typography variant={'h6'}>Last Modified</Typography>,
      property: 'lastModified',
      renderValue: (e) => (
        <Typography variant={'body1'}>
          {ZDate.format(e.lastModified)}
        </Typography>
      ),
    },
  ];
}
