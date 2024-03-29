import { DiaryStatus } from '@prisma/client';
import immutate from 'immutability-helper';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import DiaryForm from 'fragments/Pages/Diary/DiaryForm';
import {
  DiaryFormContext,
  InitialDiaryFormState,
} from 'fragments/Pages/Diary/DiaryForm.context';
import { useDiaryCategories } from 'utils/hooks';
import { getServerSideHelpers } from 'utils/ssr';
import { trpc } from 'utils/trpc';

const DiaryEntryEdit: NextPageWithLayout<DiaryEntryEditProps> = ({ id }) => {
  const [state, setState] = useState(InitialDiaryFormState);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = trpc.useContext();
  const { data: diaryCategories = [] } = useDiaryCategories();

  const { mutate: updateDiaryEntry, isLoading: isUpdateLoading } =
    trpc.diary.update.useMutation({
      onSuccess: ({ title, status, entryNumber }) => {
        void trpcContext.diary.findMany.refetch();
        const isPublished = status === DiaryStatus.PUBLISHED;
        const verb = isPublished ? 'published' : 'updated';
        enqueueSnackbar(`Successfully ${verb} '#${entryNumber}: ${title}'.`, {
          variant: 'success',
        });
        void router.push(`/diary/${entryNumber}`);
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });
  const { data: entry } = trpc.diary.find.useQuery({
    params: {
      include: { categories: true },
      where: { id },
    },
  });

  useEffect(() => {
    if (!entry) return;
    setState((state) =>
      immutate(state, {
        entry: {
          $set: {
            ...entry,
            categories: {},
            tags: entry.tags ?? [],
          },
        },
        categories: { $set: entry.categories.map(({ id }) => id) },
      }),
    );
  }, [entry]);

  function onSubmit(isPublish: boolean) {
    updateDiaryEntry({
      diary: {
        data: {
          ...state.entry,
          categories: {
            set: diaryCategories
              .filter(({ id }) => state.categories.includes(id))
              .map(({ id }) => ({ id })),
          },
        },
        where: { id },
      },
      isPublish,
    });
  }

  return (
    <AdminGateway>
      <DiaryFormContext.Provider value={[state, setState]}>
        <DiaryForm
          onSubmit={onSubmit}
          submitText={'Update'}
          heading={'Edit Diary Entry'}
          isActionLoading={isUpdateLoading}
        />
      </DiaryFormContext.Provider>
    </AdminGateway>
  );
};

export const getServerSideProps: GetServerSideProps<
  DiaryEntryEditProps
> = async (ctx) => {
  const { query } = ctx;
  const id = Number(query.id);

  const helpers = getServerSideHelpers(ctx);
  await helpers.diary.find.prefetch({
    params: {
      include: { categories: true },
      where: { id },
    },
  });

  return {
    props: {
      id,
      pathDefinition: { title: 'Edit Diary Entry' },
      trpcState: helpers.dehydrate(),
    },
  };
};

DiaryEntryEdit.getLayout = Layout.addPartials;
export default DiaryEntryEdit;

interface DiaryEntryEditProps extends AppPageProps {
  id: number;
}
