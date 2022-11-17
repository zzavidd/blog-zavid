import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';

import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import { DiaryStatic } from 'classes/diary/DiaryStatic';
import { Modal } from 'components/Modal';
import Contexts from 'constants/contexts';
import HandlerFactory from 'constants/handlers';
import Settings from 'constants/settings';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import AdminGateway from 'fragments/AdminGateway';
import DiaryEntryForm, { buildPayload } from 'fragments/diary/DiaryEntryForm';
import Layout from 'fragments/Layout';
import ZDate from 'lib/date';
import ZString from 'lib/string';
import SSR from 'private/ssr';
import ModalStyle from 'styles/Components/Modal.styles';
import { ButtonVariant } from 'styles/Variables.styles';

// eslint-disable-next-line react/function-component-definition
const DiaryEntryEdit: NextPageWithLayout<DiaryEntryEditProps> = ({
  pageProps,
}) => {
  const [state, setState] = useState<DiaryEntryEditState>({
    diaryEntry: {
      ...pageProps.serverDiaryEntry,
      tags: ZString.convertArrayToCsv(pageProps.serverDiaryEntry.tags),
    },
    isRequestPending: false,
    isPublishModalVisible: false,
  });
  const dispatch = Utils.createDispatch(setState);

  const Alerts = useContext(Contexts.Alerts);
  const router = useRouter();

  // Determine if diary entry is being published.
  const isPublish =
    !DiaryStatic.isPublished(pageProps.serverDiaryEntry) &&
    DiaryStatic.isPublished(state.diaryEntry);

  /** Update diary entry on server. */
  async function updateDiaryEntry() {
    try {
      dispatch({ isRequestPending: true });
      Validate.diaryEntry(state.diaryEntry);

      const payload = buildPayload(state.diaryEntry, isPublish, false);
      await Utils.request('/api/diary', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      Alerts.success(
        `You've successfully updated the diary entry for ${ZDate.format(
          state.diaryEntry.date!,
        )}.`,
      );
      const pageUrl = `${Settings.DOMAIN}/diary/${state.diaryEntry.entryNumber}`;
      void router.push(
        document.referrer === pageUrl ? pageUrl : '/admin/diary',
      );
    } catch (e: any) {
      Alerts.error(e.message);
    } finally {
      dispatch({ isRequestPending: false });
    }
  }

  const onSubmit = isPublish
    ? () => dispatch({ isPublishModalVisible: true })
    : updateDiaryEntry;
  const onSubmitText = state.isRequestPending
    ? 'Loading...'
    : isPublish
    ? 'Update & Publish'
    : 'Update';

  return (
    <AdminGateway>
      <DiaryEntryForm
        diaryEntry={state.diaryEntry}
        handlers={HandlerFactory(setState, 'diaryEntry')}
        onSubmit={onSubmit}
        onSubmitText={onSubmitText}
        onCancel={() => router.push('/admin/diary')}
      />
      <Modal
        visible={state.isPublishModalVisible}
        body={
          <p>
            By publishing this diary entry, you&#39;ll be notifying all
            subscribers of this new release. Confirm that you want to publish.
          </p>
        }
        footer={
          <React.Fragment>
            <ModalStyle.FooterButton
              variant={ButtonVariant.CONFIRM}
              onClick={updateDiaryEntry}>
              {onSubmitText}
            </ModalStyle.FooterButton>
            <ModalStyle.FooterButton
              variant={ButtonVariant.CANCEL}
              onClick={() => dispatch({ isPublishModalVisible: false })}>
              Cancel
            </ModalStyle.FooterButton>
          </React.Fragment>
        }
      />
    </AdminGateway>
  );
};

export const getServerSideProps: GetServerSideProps<
  DiaryEntryEditProps
> = async ({ query }) => {
  const id = parseInt(query.id as string);
  const diaryEntry = await SSR.Diary.getById(id);
  return {
    props: {
      pathDefinition: {
        title: 'Edit Diary Entry',
      },
      pageProps: {
        serverDiaryEntry: JSON.parse(diaryEntry),
      },
    },
  };
};

DiaryEntryEdit.getLayout = Layout.addHeaderOnly;
export default DiaryEntryEdit;

interface DiaryEntryEditProps {
  pathDefinition: PathDefinition;
  pageProps: {
    serverDiaryEntry: DiaryDAO;
  };
}

interface DiaryEntryEditState {
  diaryEntry: DiaryDAO;
  isRequestPending: boolean;
  isPublishModalVisible: boolean;
}
