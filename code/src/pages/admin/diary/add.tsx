export {};
// import type { GetServerSideProps } from 'next';
// import { useRouter } from 'next/router';
// import { useState } from 'react';

// import type { DiaryDAO } from 'classes/diary/DiaryDAO';
// import { DiaryEntryBuilder } from 'classes/diary/DiaryEntryBuilder';
// import { DiaryStatic } from 'classes/diary/DiaryStatic';
// import { ConfirmModal } from 'components/modal';
// import Alert, { AlertType } from 'constants/alert';
// import hooks from 'constants/handlers';
// import type { NextPageWithLayout, PathDefinition } from 'constants/types';
// import Utils from 'constants/utils';
// import Validate from 'constants/validations';
// import AdminGateway from 'fragments/AdminGateway';
// import DiaryEntryForm, { buildPayload } from 'fragments/diary/DiaryEntryForm';
// import Layout from 'fragments/Layout';
// import PageMetadata from 'fragments/PageMetadata';
// import DiaryAPI from 'private/api/diary';

// // eslint-disable-next-line react/function-component-definition
// const DiaryEntryAdd: NextPageWithLayout<DiaryEntryAddProps> = ({
//   pathDefinition,
//   pageProps,
// }) => {
//   const { latestEntryNumber } = pageProps;
//   const router = useRouter();

//   const [diaryEntry, setDiaryEntry] = useState<DiaryDAO>({
//     ...new DiaryEntryBuilder().build(),
//     entryNumber: latestEntryNumber + 1,
//   });
//   const [isRequestPending, setRequestPending] = useState(false);
//   const [isPublishModalVisible, setPublishModalVisibility] = useState(false);

//   // Determine if diary entry is being published.
//   const isPublish = DiaryStatic.isPublished(diaryEntry);

//   /** Create new diary entry on server. */
//   async function submitDiaryEntry() {
//     try {
//       setRequestPending(true);
//       Validate.diaryEntry(diaryEntry);

//       const payload = buildPayload(diaryEntry, isPublish, true);
//       await Utils.request('/api/diary', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });
//       Alert.set({
//         type: AlertType.SUCCESS,
//         message: "You've successfully added a new diary entry.",
//       });
//       returnToDiaryAdmin();
//     } catch (e: any) {
//       Alert.error(e.message);
//     } finally {
//       setRequestPending(false);
//     }
//   }

//   function returnToDiaryAdmin() {
//     void router.push('/admin/diary');
//   }

//   const confirmText = `Submit${isPublish ? ' & Publish' : ''}`;
//   const confirmFunction = isPublish
//     ? () => setPublishModalVisibility(true)
//     : submitDiaryEntry;

//   return (
//     <AdminGateway>
//       <PageMetadata {...pathDefinition} />
//       <DiaryEntryForm
//         diaryEntry={diaryEntry}
//         handlers={hooks(setDiaryEntry, diaryEntry)}
//         confirmFunction={confirmFunction}
//         confirmButtonText={confirmText}
//         cancelFunction={returnToDiaryAdmin}
//         isRequestPending={isRequestPending}
//       />
//       <ConfirmModal
//         visible={isPublishModalVisible}
//         message={
//           "By publishing this diary entry, you'll be notifying all subscribers of this new release. Confirm that you want to publish."
//         }
//         confirmFunction={submitDiaryEntry}
//         confirmText={'Confirm'}
//         closeFunction={() => setPublishModalVisibility(false)}
//       />
//     </AdminGateway>
//   );
// };

// export const getServerSideProps: GetServerSideProps<
//   DiaryEntryAddProps
// > = async () => {
//   const latestDiaryEntry = await DiaryAPI.getLatest();
//   return {
//     props: {
//       pathDefinition: {
//         title: 'Add New Diary Entry',
//       },
//       pageProps: {
//         latestEntryNumber: latestDiaryEntry.entryNumber ?? 0,
//       },
//     },
//   };
// };

// DiaryEntryAdd.getLayout = Layout.addHeaderOnly;
// export default DiaryEntryAdd;

// interface DiaryEntryAddProps {
//   pathDefinition: PathDefinition;
//   pageProps: {
//     latestEntryNumber: number;
//   };
// }
