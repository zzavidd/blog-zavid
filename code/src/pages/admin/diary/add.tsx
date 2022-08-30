import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type { DiaryDAO } from 'classes';
import { DiaryStatic, DiaryStatus } from 'classes';
import { AlertType, reportError, setAlert } from 'components/alert';
import { ConfirmModal } from 'components/modal';
import { UIError } from 'constants/errors';
import hooks from 'constants/handlers';
import type { PathDefinition } from 'constants/paths';
import * as Utils from 'constants/utils';
import { validateDiaryEntry } from 'constants/validations';
import DiaryEntryForm, { buildPayload } from 'fragments/diary/DiaryEntryForm';
import PageMetadata from 'fragments/PageMetadata';
import { getLatestDiaryEntry } from 'pages/api/diary';

// eslint-disable-next-line react/function-component-definition
const DiaryEntryAdd: NextPage<DiaryEntryAddProps> = ({
  pathDefinition,
  pageProps,
}) => {
  const { latestEntryNumber } = pageProps;
  const router = useRouter();

  const [diaryEntry, setDiaryEntry] = useState({
    title: '',
    content: '',
    footnote: '',
    date: new Date(),
    status: DiaryStatus.PROTECTED,
    entryNumber: latestEntryNumber + 1,
    isFavourite: false,
    tags: '',
  } as DiaryDAO);
  const [isRequestPending, setRequestPending] = useState(false);
  const [isPublishModalVisible, setPublishModalVisibility] = useState(false);

  // Determine if diary entry is being published.
  const isPublish = DiaryStatic.isPublish(diaryEntry);

  /** Create new diary entry on server. */
  async function submitDiaryEntry() {
    try {
      setRequestPending(true);
      validateDiaryEntry(diaryEntry);

      const payload = buildPayload(diaryEntry, isPublish, true);
      await Utils.request('/api/diary', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setAlert({
        type: AlertType.SUCCESS,
        message: `You've successfully added a new diary entry.`,
      });
      returnToDiaryAdmin();
    } catch (e: any) {
      reportError(e.message, e instanceof UIError);
    } finally {
      setRequestPending(false);
    }
  }

  function returnToDiaryAdmin() {
    void router.push('/admin/diary');
  }

  const confirmText = `Submit${isPublish ? ' & Publish' : ''}`;
  const confirmFunction = isPublish
    ? () => setPublishModalVisibility(true)
    : submitDiaryEntry;

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <DiaryEntryForm
        diaryEntry={diaryEntry}
        handlers={hooks(setDiaryEntry, diaryEntry)}
        confirmFunction={confirmFunction}
        confirmButtonText={confirmText}
        cancelFunction={returnToDiaryAdmin}
        isRequestPending={isRequestPending}
      />
      <ConfirmModal
        visible={isPublishModalVisible}
        message={
          "By publishing this diary entry, you'll be notifying all subscribers of this new release. Confirm that you want to publish."
        }
        confirmFunction={submitDiaryEntry}
        confirmText={'Confirm'}
        closeFunction={() => setPublishModalVisibility(false)}
      />
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps<
  DiaryEntryAddProps
> = async () => {
  const latestDiaryEntry = await getLatestDiaryEntry();
  return {
    props: {
      pathDefinition: {
        title: `Add New Diary Entry`,
      },
      pageProps: {
        latestEntryNumber: latestDiaryEntry.entryNumber ?? 0,
      },
    },
  };
};

export default DiaryEntryAdd;

interface DiaryEntryAddProps {
  pathDefinition: PathDefinition;
  pageProps: {
    latestEntryNumber: number;
  };
}
