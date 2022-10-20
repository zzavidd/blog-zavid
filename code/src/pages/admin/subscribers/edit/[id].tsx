export {};
// import type { GetServerSideProps } from 'next';
// import { useRouter } from 'next/router';
// import { useState } from 'react';

// import type { SubscriberDAO } from 'classes/subscribers/SubscriberDAO';
// import Alert, { AlertType } from 'constants/alert';
// import hooks from 'constants/handlers';
// import type { NextPageWithLayout, PathDefinition } from 'constants/types';
// import Utils from 'constants/utils';
// import Validate from 'constants/validations';
// import AdminGateway from 'fragments/AdminGateway';
// import Layout from 'fragments/Layout';
// import PageMetadata from 'fragments/PageMetadata';
// import SubscriberForm, {
//   buildPayload,
// } from 'fragments/subscribers/SubscriberForm';
// import SSR from 'private/ssr';

// // eslint-disable-next-line react/function-component-definition
// const SubscriberEdit: NextPageWithLayout<SubscriberEditProps> = ({
//   pathDefinition,
//   pageProps,
// }) => {
//   const { subscriber: serverSubscriber } = pageProps;
//   const [clientSubscriber, setSubscriber] =
//     useState<SubscriberDAO>(serverSubscriber);
//   const [isRequestPending, setRequestPending] = useState(false);

//   const router = useRouter();

//   /** Update subscriber on server. */
//   async function updateSubscriber() {
//     try {
//       Validate.subscriber(clientSubscriber, true);
//       setRequestPending(true);

//       const payload = buildPayload(clientSubscriber, false);
//       await Utils.request('/api/subscribers', {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });
//       Alert.set({
//         type: AlertType.SUCCESS,
//         message: `You've successfully updated the subscriber with email: ${clientSubscriber.email}.`,
//       });
//       returnToAdmin();
//     } catch (e: any) {
//       Alert.error(e.message);
//     } finally {
//       setRequestPending(false);
//     }
//   }

//   function returnToAdmin() {
//     void router.push('/admin/subscribers');
//   }

//   return (
//     <AdminGateway>
//       <PageMetadata {...pathDefinition} />
//       <SubscriberForm
//         subscriber={clientSubscriber}
//         handlers={hooks(setSubscriber, clientSubscriber)}
//         confirmFunction={updateSubscriber}
//         confirmButtonText={'Update'}
//         cancelFunction={returnToAdmin}
//         isRequestPending={isRequestPending}
//       />
//     </AdminGateway>
//   );
// };

// export const getServerSideProps: GetServerSideProps<
//   SubscriberEditProps
// > = async ({ query }) => {
//   const subscriber = JSON.parse(
//     await SSR.Subscribers.getById(parseInt(query.id as string)),
//   );
//   return {
//     props: {
//       pathDefinition: {
//         title: 'Edit Subscriber',
//       },
//       pageProps: {
//         subscriber,
//       },
//     },
//   };
// };

// SubscriberEdit.getLayout = Layout.addHeaderOnly;
// export default SubscriberEdit;

// interface SubscriberEditProps {
//   pathDefinition: PathDefinition;
//   pageProps: {
//     subscriber: SubscriberDAO;
//   };
// }
