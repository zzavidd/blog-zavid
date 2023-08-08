import { ExclusiveStatus } from '@prisma/client';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import ExclusiveForm from 'fragments/Pages/Exclusives/ExclusiveForm';
import {
  ExclusiveFormContext,
  InitialExclusiveFormState,
} from 'fragments/Pages/Exclusives/ExclusiveForm.context';
import { trpc } from 'utils/trpc';

const ExclusiveAdd: NextPageWithLayout = () => {
  const [state, setState] = useState(InitialExclusiveFormState);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = trpc.useContext();

  const { mutate: createExclusive, isLoading: isCreateLoading } =
    trpc.exclusive.create.useMutation({
      onSuccess: (exclusive) => {
        void trpcContext.exclusive.findMany.refetch();
        const verb =
          exclusive.status === ExclusiveStatus.PUBLISHED
            ? 'published'
            : 'drafted';
        enqueueSnackbar(
          `Successfully ${verb} exclusive '${exclusive.subject}'.`,
          { variant: 'success' },
        );
        void router.push('/admin/exclusives');
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  function onSubmit(isPublish: boolean) {
    createExclusive({
      exclusive: { data: state.exclusive },
      isPublish,
    });
  }

  return (
    <AdminGateway>
      <ExclusiveFormContext.Provider value={[state, setState]}>
        <ExclusiveForm
          onSubmit={onSubmit}
          submitText={'Submit'}
          heading={'Add New Post'}
          isActionLoading={isCreateLoading}
        />
      </ExclusiveFormContext.Provider>
    </AdminGateway>
  );
};

export const getStaticProps: GetStaticProps<AppPageProps> = () => {
  return {
    props: {
      pathDefinition: {
        title: 'Create Exclusive',
      },
    },
  };
};

ExclusiveAdd.getLayout = Layout.addPartials;
export default ExclusiveAdd;
