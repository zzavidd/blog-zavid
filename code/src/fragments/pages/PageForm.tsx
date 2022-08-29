import React from 'react';

import type { PageDAO } from 'classes';
import { PageBuilder } from 'classes';
import type { GenericFormProps } from 'classes/interfaces/super';
import {
  Form,
  FieldRow,
  Field,
  Label,
  ShortTextArea,
  LongTextArea,
  TextInput,
  Checkbox,
} from 'components/form';
import type Handlers from 'lib/hooks';

export default function PageForm(props: PageFormProps) {
  const { page, handlers } = props;
  const { handleText, handleCheck } = handlers;

  return (
    <Form {...props} previewText={page.content}>
      <FieldRow>
        <Field sm={5}>
          <Label>Title:</Label>
          <TextInput
            name={'title'}
            value={page.title!}
            onChange={handleText}
            placeholder={'Enter the title'}
          />
        </Field>
        <Field sm={4}>
          <Label>Slug:</Label>
          <TextInput
            name={'slug'}
            value={page.slug!}
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
            checked={page.isEmbed!}
            onChange={handleCheck}
          />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field>
          <Label>Content:</Label>
          <LongTextArea
            name={'content'}
            value={page.content!}
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
            value={page.excerpt!}
            onChange={handleText}
            placeholder={"Enter the post's excerpt..."}
          />
        </Field>
      </FieldRow>
    </Form>
  );
}

export function buildPayload(
  clientPage: PageDAO,
  isCreateOperation: boolean,
): PageRequestPayload {
  const { id, title, content, slug, excerpt, isEmbed } = clientPage;

  const page = new PageBuilder()
    .withTitle(title)
    .withContent(content)
    .withExcerpt(excerpt)
    .withSlug(slug)
    .setIsEmbed(isEmbed)
    .build();

  const payload: PageRequestPayload = { page };
  if (!isCreateOperation) {
    payload.id = id;
  }

  return payload;
}

interface PageFormProps extends GenericFormProps {
  page: PageDAO;
  handlers: ReturnType<typeof Handlers<PageDAO>>;
  confirmFunction?: () => void;
  confirmButtonText: string;
  cancelFunction?: () => void;
  isRequestPending: boolean;
}

interface PageRequestPayload {
  id?: number;
  page: PageDAO;
}
