import React from 'react';

import type { SubscriberDAO, SubscriptionsMapping } from 'classes';
import type { GenericFormProps } from 'classes/interfaces/super';
import { Form, FieldRow, Field, Label, TextInput } from 'components/form';
import type Handlers from 'lib/hooks';

import PreferenceChecks from './preferences';

export default function (props: SubscribeFormProps) {
  const { subscriber, preferences, handlers } = props;
  const { handleText, setPreferences } = handlers;

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
          <PreferenceChecks
            preferences={preferences}
            setPreferences={setPreferences!}
          />
        </Field>
      </FieldRow>
    </Form>
  );
}

interface SubscribeFormProps extends GenericFormProps {
  subscriber: SubscriberDAO;
  preferences: SubscriptionsMapping;
  handlers: ReturnType<typeof Handlers<SubscriberDAO>>;
}
