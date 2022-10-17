import classnames from 'classnames';
import React from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';

import { Icon } from 'components/library';
import css from 'styles/components/Form.module.scss';

import { InvisibleButton } from '../button';

export function Checkbox({
  name,
  label,
  checked,
  onChange,
  className,
  boxClassName,
}: CheckboxProps): JSX.Element {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const classes = classnames(css['checkbox-group'], className);
  const boxClasses = classnames(
    css['checkbox-mark'],
    css[`checkbox-mark-${theme}`],
    boxClassName,
  );
  return (
    <label className={classes}>
      <span>{label}</span>
      <input
        className={boxClasses}
        type={'checkbox'}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span className={boxClasses} />
    </label>
  );
}

export function Switch({
  onChange,
  checked,
  checkedIcon,
  uncheckedIcon,
}: SwitchProps) {
  return (
    <InvisibleButton onClick={onChange}>
      <div
        className={
          css[checked ? 'switch-panel-checked' : 'switch-panel-unchecked']
        }>
        <div className={css['switch-dial']}>
          <Icon name={checked ? checkedIcon : uncheckedIcon} />
        </div>
      </div>
    </InvisibleButton>
  );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  boxClassName?: string;
}

interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checkedIcon: any;
  uncheckedIcon: any;
  onChange?: React.MouseEventHandler<HTMLButtonElement>;
}
