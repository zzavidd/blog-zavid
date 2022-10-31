import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';

import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import { DiaryEntryBuilder } from 'classes/diary/DiaryEntryBuilder';
import { DiaryStatic } from 'classes/diary/DiaryStatic';
import { Modal } from 'components/Modal';
import Contexts from 'constants/contexts';
import HandlerFactory from 'constants/handlers';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import AdminGateway from 'fragments/AdminGateway';
import DiaryEntryForm, { buildPayload } from 'fragments/diary/DiaryEntryForm';
import Layout from 'fragments/Layout';
import DiaryAPI from 'private/api/diary';
import ModalStyle from 'styles/Components/Modal.styles';
import { ButtonVariant } from 'styles/Variables.styles';

// eslint-disable-next-line react/function-component-definition
const DiaryEntryAdd: NextPageWithLayout<DiaryEntryAddProps> = ({
  pageProps,
}) => {
  const { latestEntryNumber } = pageProps;
  const Alerts = useContext(Contexts.Alerts);
  const router = useRouter();

  const [state, setState] = useState<DiaryEntryAddState>({
    diaryEntry: {
      ...new DiaryEntryBuilder().build(),
      entryNumber: latestEntryNumber + 1,
    },
    isRequestPending: false,
    isPublishModalVisible: false,
  });
  const dispatch = Utils.createDispatch(setState);

  // Determine if diary entry is being published.
  const isPublish = DiaryStatic.isPublished(state.diaryEntry);

  /** Create new diary entry on server. */
  async function submitDiaryEntry() {
    try {
      dispatch({ isRequestPending: true });
      Validate.diaryEntry(state.diaryEntry);

      const payload = buildPayload(state.diaryEntry, isPublish, true);
      await Utils.request('/api/diary', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      Alerts.success("You've successfully added a new diary entry.");
      void router.push('/admin/diary');
    } catch (e: any) {
      Alerts.error(e.message);
    } finally {
      dispatch({ isRequestPending: false });
    }
  }

  const onSubmit = isPublish
    ? () => dispatch({ isPublishModalVisible: true })
    : submitDiaryEntry;
  const onSubmitText = state.isRequestPending
    ? 'Loading...'
    : isPublish
    ? 'Submit & Publish'
    : 'Submit';

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
              onClick={onSubmit}>
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
  DiaryEntryAddProps
> = async () => {
  const latestDiaryEntry = await DiaryAPI.getLatest();
  return {
    props: {
      pathDefinition: {
        title: 'Add New Diary Entry',
      },
      pageProps: {
        latestEntryNumber: latestDiaryEntry.entryNumber ?? 0,
      },
    },
  };
};

DiaryEntryAdd.getLayout = Layout.addHeaderOnly;
export default DiaryEntryAdd;

interface DiaryEntryAddProps {
  pathDefinition: PathDefinition;
  pageProps: {
    latestEntryNumber: number;
  };
}

interface DiaryEntryAddState {
  diaryEntry: DiaryDAO;
  isRequestPending: boolean;
  isPublishModalVisible: boolean;
}
