import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { zDate, zString } from 'zavid-modules';

import type { DiaryDAO, ReactTextAreaChangeEvent } from 'classes';
import { DiaryEntryBuilder, DiaryStatic } from 'classes';
import type { GenericFormProps } from 'classes/interfaces/super';
import {
  Checkbox,
  Field,
  FieldRow,
  Form,
  Label,
  LongTextArea,
  NumberInput,
  Select,
  ShortTextArea,
  TextInput,
} from 'components/form';
import type { DateType } from 'components/form/datepicker';
import DatePicker from 'components/form/datepicker';
import { Foldable } from 'components/form/foldable';
import type { Handlers } from 'lib/hooks';
import { ScreenWidth } from 'lib/library';
import TagBlock from 'lib/pages/diary/tags';
import css from 'styles/pages/Diary.module.scss';

export default function DiaryEntryForm(props: DiaryFormProps) {
  const { diaryEntry, handlers } = props;
  const {
    handleText,
    handleNumber,
    handleCheck,
    handleSelection,
    handleTextSave,
    handleDate,
  } = handlers;

  const [isFootnoteVisible, setFootnoteVisible] = useState(false);
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const dispatch = useDispatch();

  const toggleFootnote = () => {
    setFootnoteVisible(!isFootnoteVisible);
  };

  const isXXXLarge = useMediaQuery({ query: ScreenWidth.XXXLARGE });
  const fieldSpan = isPreviewVisible ? (isXXXLarge ? 12 : 6) : 6;
  const contentOrder = isPreviewVisible ? (isXXXLarge ? 1 : 2) : 1;

  return (
    <Form
      {...props}
      previewTitle={diaryEntry.title}
      previewText={diaryEntry.content}
      previewFootnotes={diaryEntry.footnote}
      onPreviewToggle={setPreviewVisible}
      formClassName={{
        previewOn: css['diary-form-pv'],
      }}
      editorClassName={{
        previewOff: css['diary-form-editor'],
      }}>
      <FieldRow>
        <Field xl={{ span: fieldSpan, order: contentOrder }}>
          <FieldRow>
            <Field>
              <Label>Content:</Label>
              <LongTextArea
                name={'content'}
                value={diaryEntry.content!}
                onChange={(e: ReactTextAreaChangeEvent) =>
                  handleTextSave(e, dispatch)
                }
                placeholder={'Scribe your thoughts and feelings...'}
              />
            </Field>
          </FieldRow>
        </Field>
        <Field xl={{ span: fieldSpan, order: contentOrder === 1 ? 2 : 1 }}>
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
                onChange={handleNumber}
                placeholder={'No.'}
              />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field>
              <Foldable
                label={'Add footnote'}
                visible={isFootnoteVisible}
                switcher={toggleFootnote}>
                <Label>Footnote:</Label>
                <LongTextArea
                  name={'footnote'}
                  value={diaryEntry.footnote!}
                  onChange={handleText}
                  placeholder={
                    'Add any footnotes to come after the signature...'
                  }
                />
              </Foldable>
            </Field>
          </FieldRow>
          <FieldRow>
            <Field md={4}>
              <Label>Status:</Label>
              <Select
                name={'status'}
                items={DiaryStatic.STATUSES}
                value={diaryEntry.status}
                onChange={handleSelection}
              />
            </Field>
            <Field md={8}>
              <Label>Date:</Label>
              <DatePicker
                name={'date'}
                date={diaryEntry.date!}
                onConfirm={(date: DateType) =>
                  handleDate(date as DateType, 'date')
                }
                placeholderText={'Select the date...'}
              />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field>
              <Label>Favourite?</Label>
              <Checkbox
                name={'isFavourite'}
                label={'This diary entry is a favourite.'}
                checked={diaryEntry.isFavourite!}
                onChange={handleCheck}
              />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field>
              <Label>Tags:</Label>
              <ShortTextArea
                name={'tags'}
                value={diaryEntry.tags! as string}
                onChange={handleText}
                placeholder={'Add tags to index the entry...'}
              />
              <TagBlock
                tags={diaryEntry.tags!}
                asCSV={true}
                className={css['diary-form-tags']}
              />
            </Field>
          </FieldRow>
        </Field>
      </FieldRow>
    </Form>
  );
}

export function buildPayload(
  clientDiaryEntry: DiaryDAO,
  isPublish: boolean,
  isCreateOperation: boolean,
): DiaryRequest {
  const {
    id,
    title,
    content,
    footnote,
    status,
    date,
    entryNumber,
    isFavourite,
    tags,
  } = clientDiaryEntry;

  const diaryEntry = new DiaryEntryBuilder()
    .withTitle(title)
    .withContent(content)
    .withFootnote(footnote)
    .withDate(zDate.formatISODate(date!))
    .withStatus(status)
    .withEntryNumber(entryNumber)
    .setIsFavourite(isFavourite)
    .withTags(zString.convertCsvToArray(tags as string))
    .build();

  const payload: DiaryRequest = { diaryEntry, isPublish };

  if (!isCreateOperation) {
    payload.id = id;
  }

  return payload;
}

interface DiaryFormProps extends GenericFormProps {
  diaryEntry: DiaryDAO;
  handlers: Handlers;
}

interface DiaryRequest {
  id?: number;
  diaryEntry: DiaryDAO;
  isPublish: boolean;
}
