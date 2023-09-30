import immutate from 'immutability-helper';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import PageForm from 'fragments/Pages/Pages/PageForm';
import {
  InitialPageFormState,
  PageFormContext,
} from 'fragments/Pages/Pages/PageForm.context';
import { getServerSideHelpers } from 'utils/ssr';
import { trpc } from 'utils/trpc';

const PageEdit: NextPageWithLayout<PageEditProps> = ({ id }) => {
  const [state, setState] = useState(InitialPageFormState);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = trpc.useContext();

  const { mutate: updatePage, isLoading: isUpdateLoading } =
    trpc.page.update.useMutation({
      onSuccess: ({ title }) => {
        void trpcContext.page.findMany.refetch();
        enqueueSnackbar(`Successfully updated the ${title} page.`, {
          variant: 'success',
        });
        void router.push('/admin/pages');
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  const { data: page } = trpc.page.find.useQuery({
    where: { id },
  });

  useEffect(() => {
    if (!page) return;
    setState((state) => immutate(state, { page: { $set: page } }));
  }, [page]);

  function onSubmit() {
    updatePage({ data: state.page, where: { id } });
  }

  return (
    <AdminGateway>
      <PageFormContext.Provider value={[state, setState]}>
        <PageForm
          onSubmit={onSubmit}
          submitText={'Update'}
          isActionLoading={isUpdateLoading}
        />
      </PageFormContext.Provider>
    </AdminGateway>
  );
};

export const getServerSideProps: GetServerSideProps<PageEditProps> = async (
  ctx,
) => {
  const { query, req } = ctx;
  const id = Number(query.id);

  const helpers = getServerSideHelpers(ctx);
  await helpers.page.find.prefetch({ where: { id } });

  return {
    props: {
      id,
      referer: req.headers.referer || '',
      pathDefinition: { title: 'Edit Page' },
      trpcState: helpers.dehydrate(),
    },
  };
};

PageEdit.getLayout = Layout.addPartials;
export default PageEdit;

interface PageEditProps extends AppPageProps {
  id: number;
}
