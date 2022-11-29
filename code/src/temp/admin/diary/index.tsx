export {};
// import type { GetServerSideProps } from 'next';
// import { useState } from 'react';
// import { zDate, zText } from 'zavid-modules';

//
// import { AdminButton, InvisibleButton } from 'components/button';
// import { Spacer, Toolbar } from 'components/layout';
// import {
//   Icon,
//   Tabler,
//   TablerColumnHeader,
//   TablerFieldType,
//   TablerItemCell,
// } from 'components/library';
// import { ConfirmModal } from 'components/modal';
// import { VanillaLink } from 'components/text';
// import Alert from 'constants/alert';
// import type {
//   EditButtonProps,
//   NextPageWithLayout,
//   PathDefinition,
//   ReactHook,
// } from 'constants/types';
// import { QueryOrder } from 'constants/types';
// import Utils from 'constants/utils';
// import AdminGateway from 'fragments/AdminGateway';
// import Layout from 'fragments/Layout';
// import PageMetadata from 'fragments/PageMetadata';
// import SSR from 'private/ssr';

// // eslint-disable-next-line react/function-component-definition
// const DiaryAdmin: NextPageWithLayout<DiaryAdminProps> = ({
//   pathDefinition,
//   pageProps,
// }) => {
//   const { diaryEntries } = pageProps;
//   const [selectedDiaryEntry, setSelectedDiaryEntry] = useState({} as DiaryDAO);
//   const [deleteModalVisible, setDeleteModalVisibility] = useState(false);

//   async function deleteDiaryEntry() {
//     const { id, date } = selectedDiaryEntry;

//     try {
//       await Utils.request('/api/diary', {
//         method: 'DELETE',
//         body: JSON.stringify({ id }),
//       });
//       Alert.success(
//         `You've deleted the diary entry for ${zDate.formatDate(date!, {
//           withWeekday: true,
//         })}.`,
//       );
//       setDeleteModalVisibility(false);
//     } catch (e: any) {
//       Alert.error(e.message);
//     }
//   }

//   return (
//     <AdminGateway>
//       <PageMetadata {...pathDefinition} />
//       <Spacer>
//         <Tabler<9>
//           heading={'List of Diary Entries'}
//           itemsLoaded={true}
//           emptyMessage={'No diary entries found.'}
//           columns={[
//             new TablerColumnHeader('#', { centerAlign: true }),
//             new TablerColumnHeader('Date'),
//             new TablerColumnHeader('Title'),
//             new TablerColumnHeader(<Icon name={'star'} key={0} />, {
//               centerAlign: true,
//             }),
//             new TablerColumnHeader('Status'),
//             new TablerColumnHeader('Content'),
//           ]}
//           items={diaryEntries.map((diaryEntry: DiaryDAO, key: number) => {
//             const content = zText.truncateText(diaryEntry.content!, {
//               limit: 20,
//             });
//             const date = zDate.formatDate(diaryEntry.date!, {
//               withWeekday: true,
//             });
//             return [
//               new TablerItemCell(key + 1, {
//                 type: TablerFieldType.INDEX,
//               }),
//               new TablerItemCell(date, {
//                 icon: 'calendar-alt',
//               }),
//               new TablerItemCell(diaryEntry.title, { icon: 'heading' }),
//               new TablerItemCell(<Icon name={'star'} key={0} />, {
//                 showOnCondition: {
//                   condition: diaryEntry.isFavourite!,
//                 },
//               }),
//               new TablerItemCell(diaryEntry.status, { icon: 'lock' }),
//               new TablerItemCell(content, { hideOnMobile: true }),
//               new TablerItemCell(
//                 <LinkButton diaryEntry={diaryEntry} key={key} />,
//                 { type: TablerFieldType.BUTTON },
//               ),
//               new TablerItemCell(<EditButton id={diaryEntry.id!} key={key} />, {
//                 type: TablerFieldType.BUTTON,
//               }),
//               new TablerItemCell(
//                 (
//                   <DeleteButton
//                     diaryEntry={diaryEntry}
//                     key={key}
//                     setDeleteModalVisibility={setDeleteModalVisibility}
//                     setSelectedDiaryEntry={setSelectedDiaryEntry}
//                   />
//                 ),
//                 { type: TablerFieldType.BUTTON },
//               ),
//             ];
//           })}
//           distribution={[
//             '6%',
//             '20%',
//             '1fr',
//             '6%',
//             '10%',
//             '30%',
//             '4%',
//             '4%',
//             '4%',
//           ]}
//         />
//         <Toolbar>
//           <AdminButton onClick={navigateToCreateForm}>
//             Add New Entry
//           </AdminButton>
//         </Toolbar>
//       </Spacer>
//       <ConfirmModal
//         visible={deleteModalVisible}
//         message={`Are you sure you want to delete the diary entry for **${zDate.formatDate(
//           selectedDiaryEntry.date as string,
//           { withWeekday: true },
//         )}**?`}
//         confirmFunction={deleteDiaryEntry}
//         confirmText={'Delete'}
//         closeFunction={() => setDeleteModalVisibility(false)}
//       />
//     </AdminGateway>
//   );
// };

// function navigateToCreateForm() {
//   location.href = '/admin/diary/add';
// }

// function LinkButton({ diaryEntry }: LinkButton) {
//   return (
//     <VanillaLink href={`/diary/${diaryEntry.entryNumber}`}>
//       <Icon name={'paper-plane'} />
//     </VanillaLink>
//   );
// }

// function EditButton({ id }: EditButtonProps) {
//   const navigateToLink = () => (location.href = `/admin/diary/edit/${id}`);
//   return (
//     <InvisibleButton onClick={navigateToLink}>
//       <Icon name={'pen-alt'} />
//     </InvisibleButton>
//   );
// }

// function DeleteButton({
//   diaryEntry,
//   setDeleteModalVisibility,
//   setSelectedDiaryEntry,
// }: DeleteButton) {
//   const attemptDelete = () => {
//     setDeleteModalVisibility(true);
//     setSelectedDiaryEntry(diaryEntry);
//   };

//   return (
//     <InvisibleButton onClick={attemptDelete}>
//       <Icon name={'trash'} />
//     </InvisibleButton>
//   );
// }

// export const getServerSideProps: GetServerSideProps<
//   DiaryAdminProps
// > = async () => {
//   const diaryEntries = JSON.parse(
//     await SSR.Diary.getAll({
//       sort: {
//         field: 'date',
//         order: QueryOrder.DESCENDING,
//       },
//     }),
//   );

//   return {
//     props: {
//       pathDefinition: {
//         title: 'List of Diary Entries',
//       },
//       pageProps: {
//         diaryEntries,
//       },
//     },
//   };
// };

// DiaryAdmin.getLayout = Layout.addHeaderOnly;
// export default DiaryAdmin;

// interface DiaryAdminProps {
//   pathDefinition: PathDefinition;
//   pageProps: {
//     diaryEntries: DiaryDAO[];
//   };
// }

// interface LinkButton {
//   diaryEntry: DiaryDAO;
// }

// interface DeleteButton {
//   diaryEntry: DiaryDAO;
//   setDeleteModalVisibility: (event: boolean) => void;
//   setSelectedDiaryEntry: ReactHook<DiaryDAO>;
// }
