/* eslint-disable jsdoc/require-returns */
import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';

import { alert } from 'components/alert.js';
import { ConfirmButton, CancelButton } from 'components/button.js';
import { Field, FieldRow, Select, TextInput } from 'components/form';
import { Icon } from 'components/icon';
import { Modal, ConfirmModal } from 'components/modal.js';
import css from 'styles/components/Form.module.scss';

export const TimePicker = ({ time, name, onConfirm }) => {
  const { hour: initialHour, minute: initialMinute } = extractTime(time);
  const [stateHour, setHour] = useState(initialHour);
  const [stateMinute, setMinute] = useState(initialMinute);
  const [timePickerVisible, setTimePickerVisibility] = useState(false);
  const [clearTimeModalVisible, setClearTimeModalVisibility] = useState(false);

  useEffect(() => {
    setHour(initialHour);
    setMinute(initialMinute);
  }, [timePickerVisible]);

  /** Apply change to selected time value */
  const confirmTimeSelectiom = () => {
    if (!stateHour) return alert.error('Please set the hour.');
    if (!stateMinute) return alert.error('Please set the minute.');

    const time = new Date();
    time.setHours(stateHour);
    time.setMinutes(stateMinute);

    onConfirm(time, name);
    setTimePickerVisibility(false);
  };

  /** Clear the date */
  const clearTime = () => {
    onConfirm(null, name);
    setClearTimeModalVisibility(false);
  };

  const TimePickerBody = (
    <FieldRow className={css['datepicker-modal']}>
      <Field xs={6}>
        <Select
          name={'hour'}
          items={zDate.getAllHours()}
          value={stateHour}
          placeholder={'HH'}
          onChange={(event) => setHour(event.target.value)}
        />
      </Field>
      <Field xs={6}>
        <Select
          name={'minute'}
          items={zDate.getAllMinutes(5)}
          value={stateMinute}
          placeholder={'mm'}
          onChange={(event) => setMinute(event.target.value)}
        />
      </Field>
    </FieldRow>
  );

  const TimePickerFooter = (
    <>
      <ConfirmButton onClick={confirmTimeSelectiom}>Confirm</ConfirmButton>
      <CancelButton onClick={() => setTimePickerVisibility(false)}>
        Close
      </CancelButton>
    </>
  );

  const ClearTimeButton = () => {
    if (time === null) return null;
    return (
      <button
        onClick={() => setClearTimeModalVisibility(true)}
        className={css['invisible_button']}>
        <Icon name={'times'} />
      </button>
    );
  };

  return (
    <>
      <div className={css['datepicker-field']}>
        <button
          onClick={() => setTimePickerVisibility(true)}
          className={css['datepicker']}>
          <Icon
            prefix={'far'}
            name={'clock'}
            className={css['calendar-icon']}
          />
          <TextInput
            value={time ? zDate.formatISOTime(time, false) : null}
            placeholder={'HH:mm'}
            style={{ textAlign: 'left' }}
            className={css['datepicker-text-input']}
            readOnly
          />
        </button>
        <ClearTimeButton />
      </div>

      <Modal
        show={timePickerVisible}
        body={TimePickerBody}
        footer={TimePickerFooter}
        onlyBody={true}
      />

      <ConfirmModal
        visible={clearTimeModalVisible}
        message={`Clear this time?`}
        confirmFunc={clearTime}
        confirmText={'Clear'}
        close={() => setClearTimeModalVisibility(false)}
      />
    </>
  );
};

/**
 * Extract the hour and minute from a specified time.
 * @param {(string|Date)} time - The specified time.
 * @returns {object[]} The hour and minute.
 */
const extractTime = (time) => {
  let hour, minute;

  if (time !== null) {
    // Extract hour and minute from time value
    if (typeof time === 'string') {
      hour = parseInt(time.substring(0, 2));
      minute = parseInt(time.substring(3, 5));
    } else {
      const date = new Date(time);
      hour = date.getHours();
      minute = date.getMinutes();
    }
  }

  return { hour, minute };
};
