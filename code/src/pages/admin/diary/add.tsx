import { DiaryStatus } from '@prisma/client';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { ActionDialog } from 'componentsv2/Dialog';
import AdminGateway from 'fragments/AdminGateway';
import DiaryForm from 'fragments/diary/DiaryForm/DiaryForm';
import {
  DiaryFormContext,
  InitialDiaryFormState,
} from 'fragments/diary/DiaryForm/DiaryForm.context';
import Layout from 'fragments/Layout';
import { trpc } from 'utils/trpc';

const DiaryEntryAdd: NextPageWithLayout = () => {
  const [state, setState] = useState(InitialDiaryFormState);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: createDiaryEntry, isLoading: isCreateLoading } =
    trpc.diary.create.useMutation({
      onSuccess: (entry) => {
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

  const isPublish = state.entry.status === DiaryStatus.PUBLISHED;
  const submitText = isPublish ? 'Submit & Publish' : 'Submit';

  function submitEntry() {
    createDiaryEntry({ data: state.entry });
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
          isActionLoading={isCreateLoading}
        />
        <ActionDialog
          open={state.isPublishModalVisible}
          onConfirm={submitEntry}
          onCancel={closePublishModal}
          confirmText={'Publish'}
          isActionLoading={isCreateLoading}>
          By publishing this diary entry, you&#39;ll be notifying all
          subscribers of this new release. Confirm that you want to publish.
        </ActionDialog>
      </DiaryFormContext.Provider>
    </AdminGateway>
  );
};

export const getStaticProps: GetStaticProps<AppPageProps> = () => {
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
