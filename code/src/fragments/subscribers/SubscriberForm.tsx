// import React from 'react';

// import type { EntityFormProps } from 'classes/entity';
// import { SubscriberBuilder } from 'classes/subscribers/SubscriberBuilder';
// import type {
//   SubscriptionsMapping,
//   SubscriberDAO,
//   SubscriberPayload,
// } from 'classes/subscribers/SubscriberDAO';
// import { Form, FieldRow, Field, Label, TextInput } from 'components/form';
// import type Handlers from 'constants/handlers';

// import SubscriptionPreferences from './SubscriptionPreferences';

// export default function SubscriberForm(props: SubscriberFormProps) {
//   const { subscriber, handlers } = props;
//   const { handleText, setState } = handlers;

//   function setPreferences(prefs: SubscriptionsMapping) {
//     setState((current) => ({
//       ...current,
//       subscriptions: prefs,
//     }));
//   }

//   return (
//     <Form {...props}>
//       <FieldRow>
//         <Field>
//           <Label>Email:</Label>
//           <TextInput
//             name={'email'}
//             value={subscriber.email!}
//             onChange={handleText}
//             placeholder={'Enter the email address'}
//           />
//         </Field>
//       </FieldRow>
//       <FieldRow>
//         <Field md={6}>
//           <Label>First Name:</Label>
//           <TextInput
//             name={'firstname'}
//             value={subscriber.firstname!}
//             onChange={handleText}
//             placeholder={'Enter the first name'}
//           />
//         </Field>
//         <Field md={6}>
//           <Label>Last Name:</Label>
//           <TextInput
//             name={'lastname'}
//             value={subscriber.lastname!}
//             onChange={handleText}
//             placeholder={'Enter the last name'}
//           />
//         </Field>
//       </FieldRow>
//       <FieldRow>
//         <Field>
//           <Label>Preferences:</Label>
//           <SubscriptionPreferences
//             preferences={subscriber.subscriptions as SubscriptionsMapping}
//             setPreferences={setPreferences}
//           />
//         </Field>
//       </FieldRow>
//     </Form>
//   );
// }

// export function buildPayload(
//   clientSubscriber: SubscriberDAO,
//   isCreateOperation: boolean,
// ): SubscriberPayload {
//   const { id, email, firstname, lastname, subscriptions } = clientSubscriber;

//   const subscriber = new SubscriberBuilder()
//     .withEmail(email)
//     .withFirstName(firstname)
//     .withLastName(lastname)
//     .withSubscriptions(subscriptions as SubscriptionsMapping)
//     .build();

//   const payload: SubscriberPayload = { subscriber };
//   if (!isCreateOperation) {
//     payload.id = id;
//   }

//   return payload;
// }

// interface SubscriberFormProps extends EntityFormProps {
//   subscriber: SubscriberDAO;
//   handlers: ReturnType<typeof Handlers<SubscriberDAO>>;
// }
