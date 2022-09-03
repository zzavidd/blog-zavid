import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { zDate } from 'zavid-modules';

import { Alert } from 'components/alert';
import {
  CancelButton,
  ConfirmButton,
  InvisibleButton,
} from 'components/button';
import { Icon } from 'components/library';
import { ConfirmModal } from 'components/modal';
import { BLOG_CREATION_DATE } from 'constants/settings';
import type { ReactHook } from 'constants/types';
import css from 'styles/components/Form.module.scss';

import { Field, FieldRow, Select, TextInput } from '.';

export default function DatePicker({
  name,
  date,
  onConfirm,
  placeholderText,
}: DatePickerProps) {
  return (
    <BaseDatePicker
      name={name}
      date={date}
      onConfirm={onConfirm}
      placeholderText={placeholderText}
      minDate={BLOG_CREATION_DATE}
      maxDate={new Date()}
      withDayOfWeek
    />
  );
}

function BaseDatePicker(props: BaseDatePickerProps) {
  const { date, name, onConfirm, placeholderText, withDayOfWeek } = props;

  const [selectedDay, setDay] = useState(1);
  const [selectedMonth, setMonth] = useState(1);
  const [selectedYear, setYear] = useState(2000);

  const [datePickerVisible, setDatePickerVisibility] = useState(false);
  const [clearDateModalVisible, setClearDateModalVisibility] = useState(false);

  const {
    day: initialDay,
    month: initialMonth,
    year: initialYear,
  } = extractDates(date);

  useEffect(() => {
    setDay(initialDay);
    setMonth(initialMonth);
    setYear(initialYear);
  }, [datePickerVisible]);

  /** Clear the date. */
  const clearDate = () => {
    onConfirm(undefined, name);
    setClearDateModalVisibility(false);
  };

  return (
    <React.Fragment>
      <div className={css['datepicker-field']}>
        <TextInput
          value={
            date
              ? zDate.formatDate(date, { withWeekday: withDayOfWeek })
              : undefined
          }
          placeholder={placeholderText}
          onClick={() => setDatePickerVisibility(true)}
          className={css['datepicker']}
          leadingComponent={
            <Icon
              prefix={'far'}
              name={'calendar-alt'}
              className={css['calendar-icon']}
            />
          }
          trailingComponent={
            <ClearDateButton
              date={date}
              setClearDateModalVisibility={setClearDateModalVisibility}
            />
          }
        />
      </div>

      <Modal
        visible={datePickerVisible}
        onHide={() => setDatePickerVisibility(false)}
        modalBody={
          <DatePickerBody
            {...props}
            selectedDay={selectedDay}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            setDay={setDay}
            setMonth={setMonth}
            setYear={setYear}
          />
        }
        modalFooter={
          <DatePickerFooter
            {...props}
            day={selectedDay}
            month={selectedMonth}
            year={selectedYear}
            setDatePickerVisibility={setDatePickerVisibility}
          />
        }
      />

      <ConfirmModal
        visible={clearDateModalVisible}
        message={`Clear this date?`}
        confirmFunction={clearDate}
        confirmText={'Clear'}
        closeFunction={() => setClearDateModalVisibility(false)}
      />
    </React.Fragment>
  );
}

function DatePickerBody({
  minDate,
  maxDate,
  selectedDay,
  selectedMonth,
  selectedYear,
  setDay,
  setMonth,
  setYear,
}: DatePickerBody) {
  const startYear = minDate && minDate.getFullYear();
  const endYear = maxDate && maxDate.getFullYear();

  const dayList = zDate
    .getDatesForMonth(zDate.getMonthByNumber(selectedMonth as number))
    .map((label, key) => {
      return {
        label,
        value: key + 1,
      };
    });

  const monthList = zDate.getAllMonths().map((label, key) => {
    return {
      label,
      value: key + 1,
    };
  });

  const changeDatePart = (
    event: React.ChangeEvent<HTMLSelectElement>,
    hook: ReactHook<number>,
  ): void => {
    const { value } = event.target;
    hook(parseInt(value));
  };

  return (
    <FieldRow className={css['datepicker-modal']}>
      <Field xs={3}>
        <Select
          name={'day'}
          value={selectedDay}
          items={dayList}
          placeholder={'DD'}
          onChange={(e) => changeDatePart(e, setDay)}
        />
      </Field>
      <Field xs={6}>
        <Select
          name={'month'}
          value={selectedMonth}
          items={monthList}
          placeholder={'MMMM'}
          onChange={(e) => changeDatePart(e, setMonth)}
        />
      </Field>
      <Field xs={3}>
        <Select
          name={'year'}
          value={selectedYear}
          items={zDate.getYearsInRange(startYear, endYear)}
          placeholder={'YYYY'}
          onChange={(e) => changeDatePart(e, setYear)}
        />
      </Field>
    </FieldRow>
  );
}

function DatePickerFooter({
  name,
  day,
  month,
  year,
  onConfirm,
  setDatePickerVisibility,
}: DatePickerFooter) {
  /** Close the datepicker. */
  const closeDatePicker = (): void => setDatePickerVisibility(false);

  /** Update component dates on confirmation */
  const confirmDateSelection = () => {
    if (!day) return Alert.error('Please set the day of the month.');
    if (!month) return Alert.error('Please set the month of the year.');
    if (!year) return Alert.error('Please set the year.');

    const date = new Date(year, month - 1, day);
    onConfirm(date, name);
    closeDatePicker();
  };

  return (
    <React.Fragment>
      <ConfirmButton onClick={confirmDateSelection}>Confirm</ConfirmButton>
      <CancelButton onClick={closeDatePicker}>Close</CancelButton>
    </React.Fragment>
  );
}

function ClearDateButton({
  date,
  setClearDateModalVisibility,
}: ClearDateButton) {
  if (date === null) return null;
  return (
    <InvisibleButton onClick={() => setClearDateModalVisibility(true)}>
      <Icon name={'times'} />
    </InvisibleButton>
  );
}

const extractDates = (date: DateType): ExtractedDate => {
  let day = 1;
  let month = 1;
  let year = 2000;

  if (date !== null) {
    date = new Date(date as string);

    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
  }

  return { day, month, year };
};

interface ExtractedDate {
  day: number;
  month: number;
  year: number;
}

interface DatePickerProps {
  name: string;
  date: DateType;
  onConfirm: (date: DateType, name?: string) => void;
  placeholderText: string;
}

interface BaseDatePickerProps extends DatePickerProps {
  withDayOfWeek?: boolean;
  minDate: Date;
  maxDate: Date;
}

interface DatePickerBody {
  minDate: Date;
  maxDate: Date;
  selectedDay: number;
  selectedMonth: number;
  selectedYear: number;
  setDay: ReactHook<number>;
  setMonth: ReactHook<number>;
  setYear: ReactHook<number>;
}

interface DatePickerFooter {
  name: string;
  day: number;
  month: number;
  year: number;
  onConfirm: (date: DateType, name?: string) => void;
  setDatePickerVisibility: ReactHook<boolean>;
}

interface ClearDateButton {
  date: DateType;
  setClearDateModalVisibility: ReactHook<boolean>;
}

export type DateType = string | Date | undefined;
