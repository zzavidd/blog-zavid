import { DiaryStatus } from '@prisma/client';
import immutate from 'immutability-helper';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import DiaryForm from 'fragments/Pages/Diary/DiaryForm/DiaryForm';
import {
  DiaryFormContext,
  InitialDiaryFormState,
} from 'fragments/Pages/Diary/DiaryForm/DiaryForm.context';
import { getServerSideHelpers } from 'utils/ssr';
import { trpc } from 'utils/trpc';

const DiaryEntryAdd: NextPageWithLayout = () => {
  const [state, setState] = useState(InitialDiaryFormState);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = trpc.useContext();

  const { mutate: createDiaryEntry, isLoading: isCreateLoading } =
    trpc.diary.create.useMutation({
      onSuccess: (entry) => {
        void trpcContext.diary.findMany.refetch();
        const verb =
          entry.status === DiaryStatus.PUBLISHED ? 'published' : 'drafted';
        enqueueSnackbar(
          `Successfully ${verb} '#${entry.entryNumber}: ${entry.title}'.`,
          { variant: 'success' },
        );
        void router.push('/admin/diary');
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });
  const { data: latestEntry } = trpc.diary.find.useQuery({
    orderBy: { entryNumber: 'desc' },
    select: { entryNumber: true },
  });

  useEffect(() => {
    if (!latestEntry) return;
    setState((state) =>
      immutate(state, {
        entry: { entryNumber: { $set: latestEntry.entryNumber + 1 } },
      }),
    );
  }, [latestEntry]);

  function onSubmit(isPublish: boolean) {
    createDiaryEntry({ diary: { data: state.entry }, isPublish });
  }

  const isPublish = state.entry.status === DiaryStatus.PUBLISHED;

  return (
    <AdminGateway>
      <DiaryFormContext.Provider value={[state, setState]}>
        <DiaryForm
          onSubmit={onSubmit}
          submitText={'Submit'}
          isActionLoading={isCreateLoading}
          isPublish={isPublish}
        />
      </DiaryFormContext.Provider>
    </AdminGateway>
  );
};

export const getServerSideProps: GetServerSideProps<AppPageProps> = async (
  ctx,
) => {
  const helpers = getServerSideHelpers(ctx);
  await helpers.diary.find.prefetch({
    orderBy: { entryNumber: 'desc' },
    select: { entryNumber: true },
  });

  return {
    props: {
      pathDefinition: {
        title: 'Add New Diary Entry',
      },
    },
  };
};

DiaryEntryAdd.getLayout = Layout.addPartials;
export default DiaryEntryAdd;
