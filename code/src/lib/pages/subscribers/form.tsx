import React from 'react';

import { SubscriberDAO, SubscriptionsMapping } from 'classes';
import { GenericForm } from 'classes/interfaces/super';
import { Form, FieldRow, Field, Label, TextInput } from 'src/components/form';
import { Fader } from 'src/components/transitioner';
import { Handlers } from 'src/lib/hooks';

import PreferenceChecks from './preferences';

export default (props: SubscribeForm) => {
  const { subscriber, preferences, handlers, isLoaded } = props;
  const { handleText, setPreferences } = handlers;

  return (
    <Fader determinant={isLoaded} duration={500} hollow={true}>
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
    </Fader>
  );
};

interface SubscribeForm extends GenericForm {
  subscriber: SubscriberDAO
  preferences: SubscriptionsMapping
  handlers: Handlers
  isLoaded: boolean
}