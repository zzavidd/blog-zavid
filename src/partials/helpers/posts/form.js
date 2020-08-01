import React, { useEffect, useState } from 'react';

import {
  Form,
  FieldRow,
  Field,
  Label,
  TextInput,
  Select,
  LongTextArea
} from 'components/form';
import { Fader } from 'components/transitioner';
import { POST_TYPES } from 'constants/strings';

const PostForm = (props) => {
  const {
    post,
    handleText,
    confirmButtonText,
    confirmFunction,
    cancelFunction
  } = props;
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  return (
    <Fader determinant={isLoaded} duration={500} hollow={true}>
      <Form
        confirmButtonText={confirmButtonText}
        confirmFunction={confirmFunction}
        cancelFunction={cancelFunction}>
        <FieldRow>
          <Field md={6}>
            <Label>Title:</Label>
            <TextInput
              name={'title'}
              value={post.title}
              onChange={handleText}
              placeholder={'Enter the title'}
            />
          </Field>
          <Field md={6}>
            <Label>Type:</Label>
            <Select
              name={'type'}
              items={Object.values(POST_TYPES)}
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
      </Form>
    </Fader>
  );
};

export default PostForm;
