import React from 'react';
import { useDispatch } from 'react-redux';

import { DiaryDAO, DiaryStatic, ReactTextAreaChangeEvent } from 'classes';
import { GenericForm } from 'classes/interfaces/super';
import {
  Field,
  FieldRow,
  Form,
  Label,
  LongTextArea,
  NumberInput,
  Select,
  TextInput
} from 'src/components/form';
import DatePicker from 'src/components/form/datepicker';
import { Fader } from 'src/components/transitioner';
import { Handlers } from 'src/constants/hooks';

const DiaryEntryForm = (props: DiaryForm) => {
  const { diaryEntry, handlers, isLoaded } = props;
  const { handleText, handleSelection, handleTextSave, handleDate } = handlers;

  const dispatch = useDispatch();

  return (
    <Fader determinant={isLoaded} duration={500} hollow={true}>
      <Form {...props} previewText={diaryEntry.content}>
        <FieldRow>
          <Field>
            <Label>Content:</Label>
            <LongTextArea
              name={'content'}
              value={diaryEntry.content!}
              onChange={(e: ReactTextAreaChangeEvent) =>
                handleTextSave(e as ReactTextAreaChangeEvent, dispatch)
              }
              placeholder={'Scribe your thoughts and feelings...'}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field sm={9}>
            <Label>Title:</Label>
            <TextInput
              name={'title'}
              value={diaryEntry.title!}
              onChange={handleText}
              placeholder={'Enter the title'}
            />
          </Field>
          <Field sm={3}>
            <Label>Entry No.:</Label>
            <NumberInput
              name={'entryNumber'}
              value={diaryEntry.entryNumber!}
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
              items={DiaryStatic.STATUSES}
              value={diaryEntry.status}
              onChange={handleSelection}
            />
          </Field>
          <Field md={6}>
            <Label>Date:</Label>
            <DatePicker
              name={'date'}
              date={diaryEntry.date!}
              onConfirm={(date: string | Date) => handleDate(date as string, 'date')}
              placeholderText={'Select the date...'}
            />
          </Field>
        </FieldRow>
      </Form>
    </Fader>
  );
};

export default DiaryEntryForm;

interface DiaryForm extends GenericForm {
  diaryEntry: DiaryDAO;
  handlers: Handlers;
  isLoaded: boolean;
}
