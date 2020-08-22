import React from 'react';

import { Post } from 'classes';
import {
  Form,
  FieldRow,
  Field,
  DynamicField,
  Label,
  TextInput,
  Select,
  ShortTextArea,
  LongTextArea
} from 'components/form';
import { FileSelector, ASPECT_RATIO } from 'components/form/fileselector';
import DatePicker from 'components/form/picker/datepicker';
import { Fader } from 'components/transitioner';

const PostForm = (props) => {
  const { post, domains, handlers, operation, isLoaded } = props;
  const { handleText, handleDate, handleFile } = handlers;

  return (
    <Fader determinant={isLoaded} duration={500} hollow={true}>
      <Form {...props} previewText={post.content}>
        <FieldRow>
          <Field sm={8}>
            <Label>Title:</Label>
            <TextInput
              name={'title'}
              value={post.title}
              onChange={handleText}
              placeholder={'Enter the title'}
            />
          </Field>
          <Field sm={4}>
            <Label>Type:</Label>
            <Select
              name={'type'}
              items={Post.typeList}
              value={post.type}
              onChange={handleText}
              placeholder={'Select post type'}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <DynamicField
            md={8}
            precondition={Post.isPage(post.type)}
            dependency={post.type}>
            <Label>Domain</Label>
            <Select
              name={'domainId'}
              items={domains}
              value={post.domainId}
              onChange={handleText}
              placeholder={'Select page domain'}
            />
          </DynamicField>
        </FieldRow>
        <FieldRow>
          <Field>
            <Label>Content:</Label>
            <LongTextArea
              name={'content'}
              value={post.content}
              onChange={handleText}
              placeholder={"Write out the post's content..."}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field md={6}>
            <Label>Status:</Label>
            <Select
              name={'status'}
              items={Post.statusList}
              value={post.status}
              onChange={handleText}
            />
          </Field>
          <DynamicField
            md={6}
            precondition={Post.isPublish(post.status)}
            dependency={post.status}>
            <Label>Date Published:</Label>
            <DatePicker
              name={'datePublished'}
              date={post.datePublished}
              onConfirm={handleDate}
              placeholderText={'Select the publish date...'}
            />
          </DynamicField>
        </FieldRow>
        <FieldRow>
          <Field>
            <Label>Excerpt:</Label>
            <ShortTextArea
              name={'excerpt'}
              value={post.excerpt}
              onChange={handleText}
              placeholder={"Enter the post's excerpt..."}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field sm={6}>
            <Label>Image:</Label>
            <FileSelector
              image={post.image}
              operation={operation}
              onChange={handleFile}
              aspectRatio={ASPECT_RATIO.WIDE}
            />
          </Field>
        </FieldRow>
      </Form>
    </Fader>
  );
};

export default PostForm;
