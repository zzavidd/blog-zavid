import React from 'react';

import type {
  SubscriberDAO,
  SubscriberPayload,
  SubscriptionsMapping,
} from 'classes';
import { SubscriberBuilder } from 'classes';
import type { GenericFormProps } from 'classes/interfaces/super';
import { Form, FieldRow, Field, Label, TextInput } from 'components/form';
import type Handlers from 'lib/hooks';

import SubscriptionPreferences from '../../lib/pages/subscribers/preferences';

export default function (props: SubscribeFormProps) {
  const { subscriber, handlers } = props;
  const { handleText, setState } = handlers;

  function setPreferences(prefs: SubscriptionsMapping) {
    setState((current) => ({
      ...current,
      subscriptions: prefs,
    }));
  }

  return (
    <Form {...props}>
      <FieldRow>
        <Field>
          <Label>Email:</Label>
          <TextInput
            name={'email'}
            value={subscriber.email!}
            onChange={handleText}
            placeholder={'Enter the email address'}
          />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field md={6}>
          <Label>First Name:</Label>
          <TextInput
            name={'firstname'}
            value={subscriber.firstname!}
            onChange={handleText}
            placeholder={'Enter the first name'}
          />
        </Field>
        <Field md={6}>
          <Label>Last Name:</Label>
          <TextInput
            name={'lastname'}
            value={subscriber.lastname!}
            onChange={handleText}
            placeholder={'Enter the last name'}
          />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field>
          <Label>Preferences:</Label>
          <SubscriptionPreferences
            preferences={subscriber.subscriptions as SubscriptionsMapping}
            setPreferences={setPreferences}
          />
        </Field>
      </FieldRow>
    </Form>
  );
}

export function buildPayload(
  clientSubscriber: SubscriberDAO,
  isCreateOperation: boolean,
): SubscriberPayload {
  const { id, email, firstname, lastname, subscriptions } = clientSubscriber;

  const subscriber = new SubscriberBuilder()
    .withEmail(email)
    .withFirstName(firstname)
    .withLastName(lastname)
    .withSubscriptions(subscriptions as SubscriptionsMapping)
    .build();

  const payload: SubscriberPayload = { subscriber };
  if (!isCreateOperation) {
    payload.id = id;
  }

  return payload;
}

interface SubscribeFormProps extends GenericFormProps {
  subscriber: SubscriberDAO;
  handlers: ReturnType<typeof Handlers<SubscriberDAO>>;
}
