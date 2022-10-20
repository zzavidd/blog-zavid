export {};
// import type { GetStaticProps } from 'next';
// import { useRouter } from 'next/router';
// import { useState } from 'react';

// import type { SubscriberDAO } from 'classes/subscribers/SubscriberDAO';
// import { SubscriberStatic } from 'classes/subscribers/SubscriberStatic';
// import Alert from 'constants/alert';
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

// // eslint-disable-next-line react/function-component-definition
// const SubscriberAdd: NextPageWithLayout<SubscriberAddProps> = ({
//   pathDefinition,
// }) => {
//   const [clientSubscriber, setSubscriber] = useState<SubscriberDAO>({
//     email: '',
//     firstname: '',
//     lastname: '',
//     subscriptions: SubscriberStatic.defaultSubscriptions(),
//   });
//   const [isRequestPending, setRequestPending] = useState(false);

//   const router = useRouter();

//   /** Create new subscriber on server. */
//   async function submitSubscriber() {
//     try {
//       Validate.subscriber(clientSubscriber, true);
//       setRequestPending(true);

//       const payload = buildPayload(clientSubscriber, true);
//       await Utils.request('/api/subscribers', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });
//       Alert.success("You've successfully added a new subscriber.");
//       clearSubscriberForm();
//     } catch (e: any) {
//       Alert.error(e.message);
//     } finally {
//       setRequestPending(false);
//     }
//   }

//   function clearSubscriberForm() {
//     setSubscriber({
//       email: '',
//       firstname: '',
//       lastname: '',
//       subscriptions: SubscriberStatic.defaultSubscriptions(),
//     });
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
//         confirmFunction={submitSubscriber}
//         confirmButtonText={'Submit'}
//         cancelFunction={returnToAdmin}
//         isRequestPending={isRequestPending}
//       />
//     </AdminGateway>
//   );
// };

// export const getStaticProps: GetStaticProps<SubscriberAddProps> = () => {
//   return {
//     props: {
//       pathDefinition: {
//         title: 'Add New Subscriber',
//       },
//     },
//   };
// };

// SubscriberAdd.getLayout = Layout.addHeaderOnly;
// export default SubscriberAdd;

// interface SubscriberAddProps {
//   pathDefinition: PathDefinition;
// }
