import { DiaryStatus } from '@prisma/client';
import immutate from 'immutability-helper';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { ActionDialog } from 'components/Dialog';
import AdminGateway from 'fragments/AdminGateway';
import DiaryForm from 'fragments/Diary/DiaryForm/DiaryForm';
import {
  DiaryFormContext,
  InitialDiaryFormState,
} from 'fragments/Diary/DiaryForm/DiaryForm.context';
import Layout from 'fragments/Layout';
import { getServerSideHelpers } from 'utils/ssr';
import { trpc } from 'utils/trpc';

const DiaryEntryEdit: NextPageWithLayout<DiaryEntryEditProps> = ({ id }) => {
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
        void router.push(
          isPublished ? `/diary/${entryNumber}` : '/admin/diary',
        );
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });
  const { data: entry } = trpc.diary.find.useQuery({ where: { id } });

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

  const isPublish = state.entry.status === DiaryStatus.PUBLISHED;
  const submitText = isPublish ? 'Update & Publish' : 'Update';

  function submitEntry() {
    updateDiaryEntry({ data: state.entry, where: { id } });
  }

  function onSubmit() {
    if (isPublish) {
      setState((s) => ({ ...s, isPublishModalVisible: true }));
    } else {
      submitEntry();
    }
  }

  function closePublishModal() {
    setState((s) => ({ ...s, isPublishModalVisible: false }));
  }

  return (
    <AdminGateway>
      <DiaryFormContext.Provider value={[state, setState]}>
        <DiaryForm
          onSubmit={onSubmit}
          submitText={submitText}
          isActionLoading={isUpdateLoading}
        />
        <ActionDialog
          open={state.isPublishModalVisible}
          onConfirm={submitEntry}
          onCancel={closePublishModal}
          confirmText={'Publish'}
          isActionLoading={isUpdateLoading}>
          By publishing this diary entry, you&#39;ll be notifying all
          subscribers of this new release. Confirm that you want to publish.
        </ActionDialog>
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
  await helpers.diary.find.prefetch({ where: { id } });

  return {
    props: {
      id,
      pathDefinition: {
        title: 'Edit Diary Entry',
      },
      trpcState: helpers.dehydrate(),
    },
  };
};

DiaryEntryEdit.getLayout = Layout.addPartials;
export default DiaryEntryEdit;

interface DiaryEntryEditProps extends AppPageProps {
  id: number;
}
