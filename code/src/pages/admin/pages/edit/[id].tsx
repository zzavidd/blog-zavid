export {};
// import type { GetServerSideProps } from 'next';
// import { useRouter } from 'next/router';
// import { useState } from 'react';

// import type { PageDAO } from 'classes/pages/PageDAO';
// import Alert, { AlertType } from 'constants/alert';
// import hooks from 'constants/handlers';
// import type { NextPageWithLayout, PathDefinition } from 'constants/types';
// import Utils from 'constants/utils';
// import Validate from 'constants/validations';
// import AdminGateway from 'fragments/AdminGateway';
// import Layout from 'fragments/Layout';
// import PageMetadata from 'fragments/PageMetadata';
// import PageForm, { buildPayload } from 'fragments/pages/PageForm';
// import SSR from 'private/ssr';

// // eslint-disable-next-line react/function-component-definition
// const PageEdit: NextPageWithLayout<PageEditProps> = ({
//   pathDefinition,
//   pageProps,
// }) => {
//   const { page: serverPage } = pageProps;
//   const [clientPage, setPage] = useState<PageDAO>(serverPage);
//   const [isRequestPending, setRequestPending] = useState(false);

//   const router = useRouter();

//   /** Update page on server. */
//   async function updatePage() {
//     try {
//       Validate.page(clientPage);
//       setRequestPending(true);

//       const payload = buildPayload(clientPage, false);
//       await Utils.request('/api/pages', {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });
//       Alert.set({
//         type: AlertType.SUCCESS,
//         message: `You've successfully updated the ${clientPage.title} page.`,
//       });
//       returnToPageAdmin();
//     } catch (e: any) {
//       Alert.error(e.message);
//     } finally {
//       setRequestPending(false);
//     }
//   }

//   function returnToPageAdmin() {
//     void router.push('/admin/pages');
//   }

//   return (
//     <AdminGateway>
//       <PageMetadata {...pathDefinition} />
//       <PageForm
//         page={clientPage}
//         handlers={hooks(setPage, clientPage)}
//         confirmFunction={updatePage}
//         confirmButtonText={'Update'}
//         cancelFunction={returnToPageAdmin}
//         isRequestPending={isRequestPending}
//       />
//     </AdminGateway>
//   );
// };

// export const getServerSideProps: GetServerSideProps<PageEditProps> = async ({
//   query,
// }) => {
//   const page = JSON.parse(
//     await SSR.Pages.getById(parseInt(query.id as string)),
//   );
//   return {
//     props: {
//       pathDefinition: {
//         title: 'List of Pages',
//       },
//       pageProps: {
//         page,
//       },
//     },
//   };
// };

// PageEdit.getLayout = Layout.addHeaderOnly;
// export default PageEdit;

// interface PageEditProps {
//   pathDefinition: PathDefinition;
//   pageProps: {
//     page: PageDAO;
//   };
// }
