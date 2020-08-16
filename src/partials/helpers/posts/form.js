import React, { useEffect, useState } from 'react';

import {
  Form,
  FieldRow,
  Field,
  Label,
  TextInput,
  Select,
  ShortTextArea,
  LongTextArea
} from 'components/form';
import { FileSelector, ASPECT_RATIO } from 'components/form/fileselector';
import DatePicker from 'components/form/picker/datepicker';
import { Fader } from 'components/transitioner';
import { POST_STATUS, POST_TYPES } from 'constants/strings';

const PostForm = (props) => {
  const { post, handlers, operation } = props;
  const { handleText, handleDate, handleFile } = handlers;
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  return (
    <Fader determinant={isLoaded} duration={500} hollow={true}>
      <Form {...props}>
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
              items={Object.values(POST_TYPES).map((POST) => POST.TITLE)}
              value={post.type}
              onChange={handleText}
              placeholder={'Select post type'}
            />
          </Field>
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
              items={Object.values(POST_STATUS)}
              value={post.status}
              onChange={handleText}
            />
          </Field>
          <DatePublishedField post={post} handleDate={handleDate} />
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

const DatePublishedField = ({ post, handleDate }) => {
  const [isVisible, setVisibility] = useState(true);

  useEffect(() => {
    setVisibility(post.status === POST_STATUS.PUBLISHED);
  }, [post.status]);

  return (
    <Fader
      determinant={isVisible}
      duration={400}
      hollow={true}
      style={{display: isVisible ? 'block' : 'none'}}>
      <Field md={6}>
        <Label>Date Published:</Label>
        <DatePicker
          name={'datePublished'}
          date={post.datePublished}
          onConfirm={handleDate}
          placeholderText={'Select the publish date...'}
        />
      </Field>
    </Fader>
  );
};

export default PostForm;
