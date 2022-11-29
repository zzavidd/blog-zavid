export {};
// import type { GetServerSideProps } from 'next';
// import { useState } from 'react';
// import { zDate, zString } from 'zavid-modules';

//
// import { DiaryStatic } from 'classes/diary/DiaryStatic';
// import { ConfirmModal } from 'components/modal';
// import Alert, { AlertType } from 'constants/alert';
// import Handlers from 'constants/handlers';
// import { DOMAIN } from 'constants/settings';
// import type { NextPageWithLayout, PathDefinition } from 'constants/types';
// import Utils from 'constants/utils';
// import Validate from 'constants/validations';
// import AdminGateway from 'fragments/AdminGateway';
// import DiaryEntryForm, { buildPayload } from 'fragments/diary/DiaryEntryForm';
// import Layout from 'fragments/Layout';
// import PageMetadata from 'fragments/PageMetadata';
// import SSR from 'private/ssr';

// // eslint-disable-next-line react/function-component-definition
// const DiaryEntryEdit: NextPageWithLayout<DiaryEntryEditProps> = ({
//   pathDefinition,
//   pageProps,
// }) => {
//   const { serverDiaryEntry } = pageProps;
//   const [clientDiaryEntry, setDiaryEntry] = useState<DiaryDAO>({
//     ...serverDiaryEntry,
//     tags: zString.convertArrayToCsv(
//       JSON.parse(serverDiaryEntry.tags as string) || [],
//     ),
//   });
//   const [isRequestPending, setRequestPending] = useState(false);
//   const [isPublishModalVisible, setPublishModalVisibility] = useState(false);

//   // Determine if diary entry is being published.
//   const isPublish =
//     !DiaryStatic.isPublished(serverDiaryEntry) &&
//     DiaryStatic.isPublished(clientDiaryEntry);

//   /** Update diary entry on server. */
//   async function updateDiaryEntry() {
//     try {
//       setRequestPending(true);
//       Validate.diaryEntry(clientDiaryEntry);

//       const payload = buildPayload(clientDiaryEntry, isPublish, false);
//       await Utils.request('/api/diary', {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });
//       Alert.set({
//         type: AlertType.SUCCESS,
//         message: `You've successfully updated the diary entry for ${zDate.formatDate(
//           clientDiaryEntry.date!,
//         )}.`,
//       });
//       returnAfterUpdate(clientDiaryEntry.entryNumber!);
//     } catch (e: any) {
//       Alert.error(e.message);
//     } finally {
//       setRequestPending(false);
//     }
//   }

//   const confirmText = `Update${isPublish ? ' & Publish' : ''}`;
//   const confirmFunction = isPublish
//     ? () => setPublishModalVisibility(true)
//     : updateDiaryEntry;

//   return (
//     <AdminGateway>
//       <PageMetadata {...pathDefinition} />
//       <DiaryEntryForm
//         diaryEntry={clientDiaryEntry}
//         handlers={Handlers(setDiaryEntry, clientDiaryEntry)}
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
//         confirmFunction={updateDiaryEntry}
//         confirmText={'Confirm'}
//         closeFunction={() => setPublishModalVisibility(false)}
//       />
//     </AdminGateway>
//   );
// };

// function returnToDiaryAdmin() {
//   location.href = '/admin/diary';
// }

// function returnAfterUpdate(entryNumber: number) {
//   const pageUrl = `${DOMAIN}/diary/${entryNumber}`;
//   if (document.referrer === pageUrl) {
//     location.href = pageUrl;
//   } else {
//     location.href = '/admin/diary';
//   }
// }

// export const getServerSideProps: GetServerSideProps<
//   DiaryEntryEditProps
// > = async ({ query }) => {
//   const id = parseInt(query.id as string);
//   const diaryEntry = await SSR.Diary.getById(id);
//   return {
//     props: {
//       pathDefinition: {
//         title: 'Edit Diary Entry',
//       },
//       pageProps: {
//         serverDiaryEntry: JSON.parse(diaryEntry),
//       },
//     },
//   };
// };

// DiaryEntryEdit.getLayout = Layout.addHeaderOnly;
// export default DiaryEntryEdit;

// interface DiaryEntryEditProps {
//   pathDefinition: PathDefinition;
//   pageProps: {
//     serverDiaryEntry: DiaryDAO;
//   };
// }
