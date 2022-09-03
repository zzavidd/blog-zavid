import classnames from 'classnames';
import type { CSSProperties } from 'react';
import React from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';
import { zString } from 'zavid-modules';

import css from 'styles/components/Form.module.scss';

export function RadioGroup({
  name,
  onChange,
  options,
  value,
  className,
  grid = false,
}: RadioGroupProps): JSX.Element {
  const radioGroupClasses = classnames(
    className,
    grid && css['radio-group-inline'],
  );
  return (
    <div className={radioGroupClasses}>
      {options.map((option, key) => {
        const isChecked = value === option;
        return (
          <RadioButton
            name={name!}
            value={option}
            checked={isChecked}
            onChange={onChange!}
            key={key}
          />
        );
      })}
    </div>
  );
}

function RadioButton({
  name,
  value,
  checked,
  onChange,
  checkClassName,
}: RadioButtonProps) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const checkClasses = classnames(
    css['radio-mark'],
    css[`radio-mark-${theme}`],
    checkClassName,
  );
  return (
    <label className={css['radio-button']}>
      <span className={css['radio-button-label']}>
        {zString.toTitleCase(value)}
      </span>
      <input
        type={'radio'}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={checkClasses}
      />
      <span className={checkClasses} />
    </label>
  );
}

interface RadioGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options: string[];
  grid?: boolean;
}

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  checkClassName?: CSSProperties;
}
