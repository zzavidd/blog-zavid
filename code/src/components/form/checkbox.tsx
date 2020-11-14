import type { IconName } from '@fortawesome/fontawesome-svg-core';
import classnames from 'classnames';
import React from 'react';

import css from 'src/styles/components/Form.module.scss';

import { InvisibleButton } from '../button';

export const Checkbox = ({
  name,
  label,
  checked,
  onChange,
  className
}: Checkbox): JSX.Element => {
  const classes = classnames(css['checkbox-group'], className);
  return (
    <label className={classes}>
      <span className={css['checkbox-label']}>{label}</span>
      <input
        type={'checkbox'}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span className={css['checkbox-mark']} />
    </label>
  );
};

export const Switch = ({ onChange, checked, checkedIcon, uncheckedIcon }: Switch) => {
  return (
    <InvisibleButton onClick={onChange}>
      <div
        className={
          css[checked ? 'switch-panel-checked' : 'switch-panel-unchecked']
        }>
        <div className={css['switch-dial']}>
          {checked ? checkedIcon : uncheckedIcon}
        </div>
      </div>
    </InvisibleButton>
  );
};

interface Checkbox {
  name: string;
  label: string;
  checked: boolean;
  onChange: any;
  className?: string;
}

interface Switch {
  checkedIcon: IconName
  uncheckedIcon: IconName
  checked: boolean;
  onChange: any;
}