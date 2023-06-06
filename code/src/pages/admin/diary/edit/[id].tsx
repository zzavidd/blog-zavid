import { DiaryStatus } from '@prisma/client';
import immutate from 'immutability-helper';
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
import { trpc } from 'utils/trpc';

const DiaryEntryEdit: NextPageWithLayout<DiaryEntryEditProps> = ({
  id,
  referer,
}) => {
  const [state, setState] = useState(InitialDiaryFormState);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = trpc.useContext();

  const { mutate: updateDiaryEntry, isLoading: isUpdateLoading } =
    trpc.diary.update.useMutation({
      onSuccess: ({ title, status, entryNumber }) => {
        void trpcContext.diary.findMany.refetch();
        const isPublished = status === DiaryStatus.PUBLISHED;
        const verb = isPublished ? 'published' : 'updated';
        enqueueSnackbar(`Successfully ${verb} '#${entryNumber}: ${title}'.`, {
          variant: 'success',
        });
        void router.push(referer ?? `/diary/${entryNumber}`);
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });
  const { data: entry } = trpc.diary.find.useQuery({
    params: { where: { id } },
  });

  useEffect(() => {
    if (!entry) return;
    setState((state) =>
      immutate(state, {
        entry: {
          $set: {
            ...entry,
            tags: entry.tags ?? [],
          },
        },
      }),
    );
  }, [entry]);

  function onSubmit(isPublish: boolean) {
    updateDiaryEntry({
      diary: { data: state.entry, where: { id } },
      isPublish,
    });
  }

  const isPublish =
    state.entry.status === DiaryStatus.PUBLISHED &&
    entry?.status !== DiaryStatus.PUBLISHED;

  return (
    <AdminGateway>
      <DiaryFormContext.Provider value={[state, setState]}>
        <DiaryForm
          onSubmit={onSubmit}
          submitText={'Update'}
          isActionLoading={isUpdateLoading}
          isPublish={isPublish}
        />
      </DiaryFormContext.Provider>
    </AdminGateway>
  );
};

DiaryEntryEdit.getLayout = Layout.addPartials;
export default DiaryEntryEdit;

interface DiaryEntryEditProps extends AppPageProps {
  id: number;
  referer?: string;
}
