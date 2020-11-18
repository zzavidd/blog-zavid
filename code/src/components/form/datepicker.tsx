import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';
import { MONTH } from 'zavid-modules/_dist/constants/date';

import { ReactSelectChangeEvent, ReactHook } from 'classes';
import { creationDate } from 'src/constants/settings';
import css from 'src/styles/components/Form.module.scss';

import { Field, FieldRow, Select, TextInput } from '.';
import { alert } from '../alert';
import { ConfirmButton, CancelButton, InvisibleButton } from '../button';
import { Icon } from '../icon';
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
    onConfirm(null, name);
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

  const dayList = zDate.getDatesForMonth(zDate.getMonthByNumber(selectedMonth));

  return (
    <FieldRow className={css['datepicker-modal']}>
      <Field xs={3}>
        <Select
          name={'day'}
          value={selectedDay}
          items={dayList}
          placeholder={'DD'}
          onChange={(event: ReactSelectChangeEvent) =>
            setDay(parseInt(event.target.value))
          }
        />
      </Field>
      <Field xs={6}>
        <Select
          name={'month'}
          value={selectedMonth}
          items={zDate.getAllMonths()}
          placeholder={'MMMM'}
          onChange={(event) => setMonth(parseInt(event.target.value))}
        />
      </Field>
      <Field xs={3}>
        <Select
          name={'year'}
          value={selectedYear}
          items={zDate.getYearsInRange(startYear, endYear)}
          placeholder={'YYYY'}
          onChange={(event) => setYear(parseInt(event.target.value))}
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

    month = zDate.Months[(month as MONTH)].index - 1;
    day = parseInt((day as string).replace(/([0-9]+)(.*)/g, '$1'));

    const date = new Date(year, month, day);
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

const extractDates = (date: string | Date): ExtractedDate => {
  let day = 1;
  let month = 1;
  let year = 2000;

  if (date !== null) {
    date = new Date(date);

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
  date: string | Date;
  onConfirm: (date: string | Date, name?: string) => void;
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
  day: string | number;
  month: string | number;
  year: number;
  onConfirm: (date: string | Date, name?: string) => void;
  setDatePickerVisibility: ReactHook<boolean>;
}

interface ClearDateButton {
  date: string | Date;
  setClearDateModalVisibility: ReactHook<boolean>;
}
