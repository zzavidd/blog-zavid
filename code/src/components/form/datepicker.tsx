import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';

import { ReactSelectChangeEvent, ReactHook } from 'classes';
import { Icon } from 'src/lib/library';
import { creationDate } from 'src/settings';
import css from 'src/styles/components/Form.module.scss';

import { Field, FieldRow, Select, TextInput } from '.';
import { alert } from '../alert';
import { ConfirmButton, CancelButton, InvisibleButton } from '../button';
import { Modal, ConfirmModal } from '../modal';

export default ({ name, date, onConfirm, placeholderText }: DatePicker) => {
  return (
    <DatePicker
      name={name}
      date={date}
      onConfirm={onConfirm}
      placeholderText={placeholderText}
      minDate={creationDate}
      maxDate={new Date()}
      withDayOfWeek
    />
  );
};

const DatePicker = (props: BaseDatePicker) => {
  const { date, name, onConfirm, placeholderText, withDayOfWeek } = props;

  const [selectedDay, setDay] = useState(1);
  const [selectedMonth, setMonth] = useState(1);
  const [selectedYear, setYear] = useState(2000);

  const [datePickerVisible, setDatePickerVisibility] = useState(false);
  const [clearDateModalVisible, setClearDateModalVisibility] = useState(false);

  const {
    day: initialDay,
    month: initialMonth,
    year: initialYear
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
    <>
      <div className={css['datepicker-field']}>
        <TextInput
          value={
            date ? zDate.formatDate(date, { withWeekday: withDayOfWeek }) : null
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
    </>
  );
};

const DatePickerBody = ({
  minDate,
  maxDate,
  selectedDay,
  selectedMonth,
  selectedYear,
  setDay,
  setMonth,
  setYear
}: DatePickerBody) => {
  const startYear = minDate && minDate.getFullYear();
  const endYear = maxDate && maxDate.getFullYear();

  const dayList = zDate
    .getDatesForMonth(zDate.getMonthByNumber(selectedMonth as number))
    .map((label, key) => {
      return {
        label,
        value: key + 1
      };
    });

  const monthList = zDate.getAllMonths().map((label, key) => {
    return {
      label,
      value: key + 1
    };
  });

  const changeDatePart = (
    event: ReactSelectChangeEvent,
    hook: ReactHook<number>
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
};

const DatePickerFooter = ({
  name,
  day,
  month,
  year,
  onConfirm,
  setDatePickerVisibility
}: DatePickerFooter) => {
  /** Close the datepicker. */
  const closeDatePicker = (): void => setDatePickerVisibility(false);

  /** Update component dates on confirmation */
  const confirmDateSelection = () => {
    if (!day) return alert.error('Please set the day of the month.');
    if (!month) return alert.error('Please set the month of the year.');
    if (!year) return alert.error('Please set the year.');

    const date = new Date(year, month - 1, day);
    onConfirm(date, name);
    closeDatePicker();
  };

  return (
    <>
      <ConfirmButton onClick={confirmDateSelection}>Confirm</ConfirmButton>
      <CancelButton onClick={closeDatePicker}>Close</CancelButton>
    </>
  );
};

const ClearDateButton = ({
  date,
  setClearDateModalVisibility
}: ClearDateButton) => {
  if (date === null) return null;
  return (
    <InvisibleButton onClick={() => setClearDateModalVisibility(true)}>
      <Icon name={'times'} />
    </InvisibleButton>
  );
};

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

interface DatePicker {
  name: string;
  date: DateType;
  onConfirm: (date: DateType, name?: string) => void;
  placeholderText: string;
}

interface BaseDatePicker extends DatePicker {
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
