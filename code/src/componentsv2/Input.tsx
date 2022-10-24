import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo } from 'react';
import type { ReactDatePickerProps } from 'react-datepicker';
import ReactDatePicker from 'react-datepicker';

import FORM from 'stylesv2/Components/Form.styles';

import Clickable from './Clickable';

namespace Input {
  /**
   * For text input.
   * @param props The input props.
   * @returns The component.
   */
  export function Text(props: InputProps) {
    return <IInput {...props} type={'text'} />;
  }

  /**
   * For numerical input.
   * @param props The input props.
   * @returns The component.
   */
  export function Number(props: InputProps) {
    const value = useMemo(() => {
      return parseFloat((props.value as string) || '0').toString();
    }, [props.value]);
    return (
      <IInput {...props} type={'number'} value={value} min={props.min ?? 0} />
    );
  }

  /**
   * For email input.
   * @param props The input props.
   * @returns The component.
   */
  export function Email(props: InputProps) {
    return <IInput {...props} type={'email'} />;
  }

  /**
   * For URL inputs.
   * @param props The input props.
   * @returns The component.
   */
  export function Url(props: InputProps) {
    return (
      <IInput
        {...props}
        type={'url'}
        pattern={'https://.*'}
        placeholder={'https://www.example.com'}
      />
    );
  }

  /**
   * Implementation of selection input.
   * @param props The select props.
   * @returns The component.
   */
  export function Select({ options, className, ...props }: SelectProps) {
    return (
      <FORM.SelectContainer className={className}>
        <FORM.Select {...props}>
          {options.map((option) => {
            const label = typeof option === 'object' ? option.label : option;
            const value = typeof option === 'object' ? option.value : option;
            return (
              <option value={value} key={value}>
                {label}
              </option>
            );
          })}
        </FORM.Select>
        <FontAwesomeIcon icon={faAngleDown} />
      </FORM.SelectContainer>
    );
  }

  /**
   * Implementation for date input.
   * @param props The date input props.
   * @returns T
   */
  export function DatePicker({ name, onChange, ...props }: DatePickerProps) {
    return (
      <FORM.Date.Container>
        <FORM.Date.ReactDatepickerGlobalStyle />
        <FORM.Date.LeadingIcon icon={faCalendar} />
        <ReactDatePicker
          {...props}
          onChange={(date) => onChange(date as Date, name)}
          dateFormat={props.dateFormat || 'dd-MM-yyyy'}
          fixedHeight={true}
          placeholderText={'Select a date...'}
          showPopperArrow={false}
          todayButton={'Today'}
          className={'react-dateinput'}
          popperClassName={'react-datepicker'}
        />
      </FORM.Date.Container>
    );
  }
}

function IInput(props: InputProps) {
  return (
    <FORM.Input.Container>
      {props.leadingIcon && (
        <Clickable.Icon
          icon={props.leadingIcon}
          onClick={props.leadingIconAction}
        />
      )}
      <FORM.Input.Standard
        {...props}
        autoCapitalize={'off'}
        autoComplete={'off'}
      />
      {props.trailingIcon && (
        <Clickable.Icon
          icon={props.trailingIcon}
          onClick={props.trailingIconAction}
        />
      )}
    </FORM.Input.Container>
  );
}

export default Input;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: IconDefinition;
  leadingIconAction?: () => void;
  trailingIcon?: IconDefinition;
  trailingIconAction?: () => void;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[] | { label: string; value: string }[];
}

interface DatePickerProps extends Omit<ReactDatePickerProps, 'onChange'> {
  name: string;
  onChange: (date: Date | null, name?: string) => void;
}
