import type { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import React, { useState } from 'react';
import { zDate, zString } from 'zavid-modules';

import type { DiaryDAO } from 'classes';
import { DiaryStatic } from 'classes';
import { AlertType, reportError, setAlert } from 'components/alert';
import { ConfirmModal } from 'components/modal';
import { UIError } from 'constants/errors';
import Handlers from 'constants/handlers';
import { DOMAIN } from 'constants/settings';
import type { PathDefinition } from 'constants/types';
import * as Utils from 'constants/utils';
import { validateDiaryEntry } from 'constants/validations';
import DiaryEntryForm, { buildPayload } from 'fragments/diary/DiaryEntryForm';
import PageMetadata from 'fragments/PageMetadata';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import { getDiaryEntryByIdSSR } from 'pages/api/diary';

// eslint-disable-next-line react/function-component-definition
const DiaryEntryEdit: NextPage<DiaryEntryEditProps> = ({
  pathDefinition,
  pageProps,
}) => {
  const { serverDiaryEntry } = pageProps;
  const [clientDiaryEntry, setDiaryEntry] = useState<DiaryDAO>({
    ...serverDiaryEntry,
    tags: zString.convertArrayToCsv(
      JSON.parse(serverDiaryEntry.tags as string) || [],
    ),
  });
  const [isRequestPending, setRequestPending] = useState(false);
  const [isPublishModalVisible, setPublishModalVisibility] = useState(false);

  // Determine if diary entry is being published.
  const isPublish =
    !DiaryStatic.isPublished(serverDiaryEntry) &&
    DiaryStatic.isPublished(clientDiaryEntry);

  /** Update diary entry on server. */
  async function updateDiaryEntry() {
    try {
      setRequestPending(true);
      validateDiaryEntry(clientDiaryEntry);

      const payload = buildPayload(clientDiaryEntry, isPublish, false);
      await Utils.request('/api/diary', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setAlert({
        type: AlertType.SUCCESS,
        message: `You've successfully updated the diary entry for ${zDate.formatDate(
          clientDiaryEntry.date!,
        )}.`,
      });
      returnAfterUpdate(clientDiaryEntry.entryNumber!);
    } catch (e: any) {
      reportError(e.message, e instanceof UIError);
    } finally {
      setRequestPending(false);
    }
  }

  const confirmText = `Update${isPublish ? ' & Publish' : ''}`;
  const confirmFunction = isPublish
    ? () => setPublishModalVisibility(true)
    : updateDiaryEntry;

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <DiaryEntryForm
        diaryEntry={clientDiaryEntry}
        handlers={Handlers(setDiaryEntry, clientDiaryEntry)}
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
        confirmFunction={updateDiaryEntry}
        confirmText={'Confirm'}
        closeFunction={() => setPublishModalVisibility(false)}
      />
    </React.Fragment>
  );
};

function returnToDiaryAdmin() {
  location.href = '/admin/diary';
}

function returnAfterUpdate(entryNumber: number) {
  const pageUrl = `${DOMAIN}/diary/${entryNumber}`;
  if (document.referrer === pageUrl) {
    location.href = pageUrl;
  } else {
    location.href = '/admin/diary';
  }
}

export const getServerSideProps: GetServerSideProps<
  DiaryEntryEditProps
> = async ({ query, req, res }) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  const id = parseInt(query.id as string);
  const diaryEntry = await getDiaryEntryByIdSSR(id);
  return {
    props: {
      pathDefinition: {
        title: `Edit Diary Entry`,
      },
      pageProps: {
        serverDiaryEntry: JSON.parse(diaryEntry),
      },
    },
  };
};

export default DiaryEntryEdit;

interface DiaryEntryEditProps {
  pathDefinition: PathDefinition;
  pageProps: {
    serverDiaryEntry: DiaryDAO;
  };
}
