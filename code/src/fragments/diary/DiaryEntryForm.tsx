import { useDispatch } from 'react-redux';

import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import { DiaryEntryBuilder } from 'classes/diary/DiaryEntryBuilder';
import { DiaryStatic } from 'classes/diary/DiaryStatic';
import type { EntityFormProps } from 'classes/entity';
import Checkbox from 'components/Checkbox';
import Input from 'components/Input';
import { LongTextArea, ShortTextArea } from 'components/Textarea';
import type HandlerFactory from 'constants/handlers';
import ZDate from 'lib/date';
import ZString from 'lib/string';
import FORM from 'styles/Components/Form.styles';

export default function DiaryEntryForm(props: DiaryFormProps) {
  const { diaryEntry, handlers } = props;

  const appDispatch = useDispatch();

  return (
    <FORM.Container>
      <FORM.Main>
        <FORM.FieldRow>
          <FORM.FieldSet>
            <FORM.FieldRow>
              <FORM.Field>
                <FORM.Label>Content:</FORM.Label>
                <LongTextArea
                  name={'content'}
                  value={diaryEntry.content!}
                  onChange={(e) => handlers.textSave(e, appDispatch)}
                  placeholder={'Scribe your thoughts and feelings...'}
                />
              </FORM.Field>
            </FORM.FieldRow>
          </FORM.FieldSet>
          <FORM.FieldSet>
            <FORM.FieldRow>
              <FORM.Field flex={3}>
                <FORM.Label>Title:</FORM.Label>
                <Input.Text
                  name={'title'}
                  value={diaryEntry.title}
                  onChange={handlers.text}
                  placeholder={'Enter the title'}
                />
              </FORM.Field>
              <FORM.Field flex={1}>
                <FORM.Label>Entry No.:</FORM.Label>
                <Input.Number
                  name={'entryNumber'}
                  value={diaryEntry.entryNumber}
                  onChange={handlers.number}
                  placeholder={'No.'}
                  min={1}
                />
              </FORM.Field>
            </FORM.FieldRow>
            <FORM.FieldRow>
              <FORM.Field>
                <FORM.Label>Footnote:</FORM.Label>
                <LongTextArea
                  name={'footnote'}
                  value={diaryEntry.footnote!}
                  onChange={handlers.text}
                  placeholder={
                    'Add any footnotes to come after the signature...'
                  }
                />
              </FORM.Field>
            </FORM.FieldRow>
            <FORM.FieldRow>
              <FORM.Field flex={1}>
                <FORM.Label>Status:</FORM.Label>
                <Input.Select
                  name={'status'}
                  options={DiaryStatic.STATUSES}
                  value={diaryEntry.status}
                  onChange={handlers.select}
                />
              </FORM.Field>
              <FORM.Field flex={2}>
                <FORM.Label>Date:</FORM.Label>
                <Input.DatePicker
                  name={'date'}
                  selected={new Date(diaryEntry.date)}
                  onChange={handlers.date}
                  placeholderText={'Select the date...'}
                  maxDate={new Date()}
                />
              </FORM.Field>
            </FORM.FieldRow>
            <FORM.FieldRow>
              <FORM.Field>
                <Checkbox
                  name={'isFavourite'}
                  label={'This diary entry is a favourite.'}
                  checked={diaryEntry.isFavourite!}
                  onChange={handlers.check}
                />
              </FORM.Field>
            </FORM.FieldRow>
            <FORM.FieldRow>
              <FORM.Field>
                <FORM.Label>Tags:</FORM.Label>
                <ShortTextArea
                  name={'tags'}
                  value={diaryEntry.tags as string}
                  onChange={handlers.text}
                  placeholder={'Add tags to index the entry...'}
                />
                {/* <TagBlock
                tags={diaryEntry.tags!}
                asCSV={true}
                className={css['diary-form-tags']}
              /> */}
              </FORM.Field>
            </FORM.FieldRow>
          </FORM.FieldSet>
        </FORM.FieldRow>
      </FORM.Main>
      <FORM.Footer>
        <FORM.SubmitButton onClick={props.onSubmit}>
          {props.onSubmitText}
        </FORM.SubmitButton>
        <FORM.CancelButton onClick={props.onCancel}>Cancel</FORM.CancelButton>
      </FORM.Footer>
    </FORM.Container>
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
    .withDate(ZDate.formatISO(date))
    .withStatus(status)
    .withEntryNumber(entryNumber)
    .setIsFavourite(isFavourite)
    .withTags(ZString.convertCsvToArray(tags))
    .build();

  const payload: DiaryRequest = { diaryEntry, isPublish };

  if (!isCreateOperation) {
    payload.id = id;
  }

  return payload;
}

interface DiaryFormProps extends EntityFormProps {
  diaryEntry: DiaryDAO;
  handlers: ReturnType<typeof HandlerFactory<DiaryDAO>>;
}

interface DiaryRequest {
  id?: number;
  diaryEntry: DiaryDAO;
  isPublish: boolean;
}
