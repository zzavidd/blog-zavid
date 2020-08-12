/* eslint-disable jsdoc/require-returns */
import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';

import { alert } from 'components/alert.js';
import {
  ConfirmButton,
  CancelButton,
  InvisibleButton
} from 'components/button.js';
import { Field, FieldRow, Select, TextInput } from 'components/form';
import { Icon } from 'components/icon';
import { Modal, ConfirmModal } from 'components/modal.js';
import { creationDate } from 'constants/settings.js';
import css from 'styles/components/Form.module.scss';

export default ({ name, date, onConfirm }) => {
  return (
    <DatePicker
      name={name}
      date={date}
      onConfirm={onConfirm}
      placeholderText={'Select the date written.'}
      minDate={creationDate}
      maxDate={new Date()}
      withDayOfWeek
    />
  );
};

const DatePicker = (props) => {
  const { date, name, onConfirm, placeholderText, withDayOfWeek } = props;

  const [selectedDay, setDay] = useState(1);
  const [selectedMonth, setMonth] = useState(1);
  const [selectedYear, setYear] = useState(2000);

  const [datePickerVisible, setDatePickerVisibility] = useState(false);
  const [clearDateModalVisible, setClearDateModalVisibility] = useState(false);

  useEffect(() => {
    const {
      day: initialDay,
      month: initialMonth,
      year: initialYear
    } = extractDates(date);
    setDay(initialDay);
    setMonth(initialMonth);
    setYear(initialYear);
  }, [datePickerVisible]);

  /** Clear the date */
  const clearDate = () => {
    onConfirm(null, name);
    setClearDateModalVisibility(false);
  };

  return (
    <>
      <div className={css['datepicker-field']}>
        <TextInput
          value={date ? zDate.formatDate(date, withDayOfWeek) : null}
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
          readOnly
        />
      </div>

      <Modal
        visible={datePickerVisible}
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
}) => {
  const startYear = minDate && minDate.getFullYear();
  const endYear = maxDate && maxDate.getFullYear();

  return (
    <FieldRow className={css['datepicker-modal']}>
      <Field xs={3}>
        <Select
          name={'day'}
          value={selectedDay}
          items={zDate.getDatesForMonth(selectedMonth)}
          placeholder={'DD'}
          onChange={(event) => setDay(event.target.value)}
        />
      </Field>
      <Field xs={6}>
        <Select
          name={'month'}
          value={selectedMonth}
          items={zDate.getAllMonths()}
          placeholder={'MMMM'}
          onChange={(event) => setMonth(event.target.value)}
        />
      </Field>
      <Field xs={3}>
        <Select
          name={'year'}
          value={selectedYear}
          items={zDate.getYearsInRange(startYear, endYear)}
          placeholder={'YYYY'}
          onChange={(event) => setYear(event.target.value)}
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
}) => {
  /** Close the datepicker. */
  const closeDatePicker = () => setDatePickerVisibility(false);

  /** Update component dates on confirmation */
  const confirmDateSelection = () => {
    if (!day) return alert.error('Please set the day of the month.');
    if (!month) return alert.error('Please set the month of the year.');
    if (!year) return alert.error('Please set the year.');

    month = zDate.MONTHS[month.toUpperCase()].NUMBER - 1;
    day = parseInt(day.replace(/([0-9]+)(.*)/g, '$1'));

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

const ClearDateButton = ({ date, setClearDateModalVisibility }) => {
  if (date === null) return null;
  return (
    <InvisibleButton onClick={() => setClearDateModalVisibility(true)}>
      <Icon name={'times'} />
    </InvisibleButton>
  );
};

/**
 * Extract the day, month and year from a specified date.
 * @param {Date} date - The specified date.
 * @returns {object[]} The day, month and year.
 */
const extractDates = (date) => {
  let day, month, year;

  if (date !== null) {
    date = new Date(date);
    const dayNum = date.getDate();
    const monthNum = date.getMonth() + 1;

    day = zDate.getDateAndSuffix(dayNum);
    month = zDate.getMonthByNumber(monthNum);
    year = date.getFullYear();
  }

  return { day, month, year };
};
