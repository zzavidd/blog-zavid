import React from 'react';

import {
  Form,
  FieldRow,
  Field,
  Label,
  ShortTextArea,
  LongTextArea,
  TextInput,
  Checkbox
} from 'components/form';
import { Fader } from 'components/transitioner';

export default (props) => {
  const { page, handlers, isLoaded } = props;
  const { handleText, handleCheck } = handlers;

  return (
    <Fader determinant={isLoaded} duration={500} hollow={true}>
      <Form {...props} previewText={page.content}>
        <FieldRow>
          <Field sm={5}>
            <Label>Title:</Label>
            <TextInput
              name={'title'}
              value={page.title}
              onChange={handleText}
              placeholder={'Enter the title'}
            />
          </Field>
          <Field sm={4}>
            <Label>Slug:</Label>
            <TextInput
              name={'slug'}
              value={page.slug}
              onChange={handleText}
              placeholder={'Enter the slug'}
              leadingComponent={<span>/</span>}
            />
          </Field>
          <Field sm={3}>
            <Label>Just An Embed?</Label>
            <Checkbox
              name={'isEmbed'}
              label={'This page is just embedded text'}
              checked={page.isEmbed}
              onChange={handleCheck}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field>
            <Label>Content:</Label>
            <LongTextArea
              name={'content'}
              value={page.content}
              onChange={handleText}
              placeholder={"Write out the page's content..."}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field>
            <Label>Excerpt:</Label>
            <ShortTextArea
              name={'excerpt'}
              value={page.excerpt}
              onChange={handleText}
              placeholder={"Enter the post's excerpt..."}
            />
          </Field>
        </FieldRow>
      </Form>
    </Fader>
  );
};
