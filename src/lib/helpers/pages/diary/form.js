import React from 'react';

import { Diary } from 'classes';
import {
  Form,
  FieldRow,
  Field,
  Label,
  Select,
  LongTextArea,
  TextInput,
  NumberInput
} from 'components/form';
import DatePicker from 'components/form/picker/datepicker';
import { Fader } from 'components/transitioner';

const PostForm = (props) => {
  const { diaryEntry, handlers, isLoaded } = props;
  const { handleText, handleDate } = handlers;

  return (
    <Fader determinant={isLoaded} duration={500} hollow={true}>
      <Form {...props} previewText={diaryEntry.content}>
        <FieldRow>
          <Field>
            <Label>Content:</Label>
            <LongTextArea
              name={'content'}
              value={diaryEntry.content}
              onChange={handleText}
              placeholder={'Scribe your thoughts and feelings...'}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field sm={9}>
            <Label>Title:</Label>
            <TextInput
              name={'title'}
              value={diaryEntry.title}
              onChange={handleText}
              placeholder={'Enter the title'}
            />
          </Field>
          <Field sm={3}>
            <Label>Entry No.:</Label>
            <NumberInput
              name={'entryNumber'}
              value={diaryEntry.entryNumber}
              onChange={handleText}
              placeholder={'No.'}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field md={6}>
            <Label>Status:</Label>
            <Select
              name={'status'}
              items={Diary.statusList}
              value={diaryEntry.status}
              onChange={handleText}
            />
          </Field>
          <Field md={6}>
            <Label>Date:</Label>
            <DatePicker
              name={'date'}
              date={diaryEntry.date}
              onConfirm={(e) => handleDate(e, 'date')}
              placeholderText={'Select the date...'}
            />
          </Field>
        </FieldRow>
      </Form>
    </Fader>
  );
};

export default PostForm;
