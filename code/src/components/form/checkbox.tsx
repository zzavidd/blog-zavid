import type { IconName } from '@fortawesome/fontawesome-svg-core';
import classnames from 'classnames';
import React from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';

import type { OnClickType, OnInputChangeType } from 'classes';
import { Icon } from 'lib/library';
import css from 'styles/components/Form.module.scss';

import { InvisibleButton } from '../button';

export function Checkbox({
  name,
  label,
  checked,
  onChange,
  className,
  boxClassName,
}: Checkbox): JSX.Element {
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
}: Switch) {
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

interface Checkbox {
  label: string;
  checked: boolean;
  onChange: OnInputChangeType;
  name?: string;
  className?: string;
  boxClassName?: string;
}

interface Switch {
  checkedIcon: IconName;
  uncheckedIcon: IconName;
  checked: boolean;
  onChange: OnClickType;
}
