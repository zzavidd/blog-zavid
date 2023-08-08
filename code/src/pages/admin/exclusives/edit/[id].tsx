import { ExclusiveStatus } from '@prisma/client';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import ExclusiveForm from 'fragments/Pages/Exclusives/ExclusiveForm';
import {
  ExclusiveFormContext,
  InitialExclusiveFormState,
} from 'fragments/Pages/Exclusives/ExclusiveForm.context';
import { getServerSideHelpers } from 'utils/ssr';
import { trpc } from 'utils/trpc';

const ExclusiveEdit: NextPageWithLayout<ExclusiveEditProps> = ({
  id,
  params,
}) => {
  const [state, setState] = useState(InitialExclusiveFormState);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = trpc.useContext();

  const { mutate: updateExclusive, isLoading: isUpdateLoading } =
    trpc.exclusive.update.useMutation({
      onSuccess: (exclusive) => {
        const { subject, status } = exclusive;
        void trpcContext.exclusive.findMany.refetch();
        const isPublished = status === ExclusiveStatus.PUBLISHED;
        const verb = isPublished ? 'published' : 'updated';
        enqueueSnackbar(`Successfully ${verb} '${subject}'.`, {
          variant: 'success',
        });
        void router.push('/admin/exclusives');
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });
  const { data: exclusive } = trpc.exclusive.find.useQuery(params);

  useEffect(() => {
    if (!exclusive) return;
    setState({ exclusive });
  }, [exclusive]);

  function onSubmit(isPublish: boolean) {
    updateExclusive({
      exclusive: {
        data: state.exclusive,
        where: { id },
      },
      isPublish,
    });
  }

  return (
    <AdminGateway>
      <ExclusiveFormContext.Provider value={[state, setState]}>
        <ExclusiveForm
          onSubmit={onSubmit}
          submitText={'Update'}
          heading={'Edit Exclusive'}
          isActionLoading={isUpdateLoading}
        />
      </ExclusiveFormContext.Provider>
    </AdminGateway>
  );
};

export const getServerSideProps: GetServerSideProps<
  ExclusiveEditProps
> = async (ctx) => {
  const { query } = ctx;
  const id = Number(query.id);
  const params: ExclusiveFindInput = { where: { id } };

  const helpers = getServerSideHelpers(ctx);
  await helpers.exclusive.find.prefetch(params);

  return {
    props: {
      id,
      params,
      pathDefinition: { title: 'Edit Exclusive' },
      trpcState: helpers.dehydrate(),
    },
  };
};

ExclusiveEdit.getLayout = Layout.addPartials;
export default ExclusiveEdit;

interface ExclusiveEditProps extends AppPageProps {
  id: number;
  params: ExclusiveFindInput;
}
