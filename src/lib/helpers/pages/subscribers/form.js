import React from 'react';

import { Form, FieldRow, Field, Label, TextInput } from 'components/form';
import { Fader } from 'components/transitioner';

export default (props) => {
  const { subscriber, handlers, isLoaded } = props;
  const { handleText } = handlers;

  return (
    <Fader determinant={isLoaded} duration={500} hollow={true}>
      <Form {...props}>
        <FieldRow>
          <Field>
            <Label>Email:</Label>
            <TextInput
              name={'email'}
              value={subscriber.email}
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
              value={subscriber.firstname}
              onChange={handleText}
              placeholder={'Enter the first name'}
            />
          </Field>
          <Field md={6}>
            <Label>Last Name:</Label>
            <TextInput
              name={'lastname'}
              value={subscriber.lastname}
              onChange={handleText}
              placeholder={'Enter the last name'}
            />
          </Field>
        </FieldRow>
      </Form>
    </Fader>
  );
};
