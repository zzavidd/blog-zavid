/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type React from 'react';
import type { Dispatch } from 'redux';

import type { DateType } from 'components/form/datepicker';
import { saveText } from 'constants/reducers';

import type { ReactHook } from './types';

export default function HandlersV2<T>(
  setState: ReactHook<T>,
  property: keyof T,
) {
  const hook = (name: string, value: unknown) => {
    setState((current) => ({
      ...current,
      [property]: {
        ...current[property],
        [name]: value,
      },
    }));
  };

  function text(event: TextChangeEvent): void {
    const { name, value } = event.target;
    hook(name, value);
  }

  function number(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, valueAsNumber } = event.target;
    hook(name, valueAsNumber);
  }

  function float(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    hook(name, parseFloat(value).toFixed(2));
  }

  function select(event: React.ChangeEvent<HTMLSelectElement>): void {
    const { name, value } = event.target;
    hook(name, value);
  }

  function textSave(event: TextChangeEvent, dispatch: Dispatch): void {
    text(event);
    dispatch(saveText(event.target.value));
  }

  function date(date: DateType, name = 'date'): void {
    hook(name, date);
  }

  function check(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, checked } = event.target;
    hook(name, checked);
  }

  function file(file: string | null, name = 'image'): void {
    hook(name, {
      source: file,
      hasChanged: true,
    });
  }

  function imageURL(name: string, url: string) {
    hook(name, url);
  }

  return {
    text,
    number,
    float,
    textSave,
    select,
    date,
    check,
    file,
    imageURL,
  };
}

type TextChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;
