import classnames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

import css from 'styles/components/Form.module.scss';

export const Select = (props) => {
  const {
    name,
    items,
    value = '',
    onChange,
    className,
    placeholder = '',
    isPlaceholderSelectable = false,
    isRound = false
  } = props;

  const theme = useSelector(({ theme }) => theme);

  // Make widgets account for values of '00' (time)
  const selectedValue = value === 0 ? '00' : value;
  const color = !selectedValue && placeholder && '#8E8E8E';

  const classes = classnames(
    css[isRound ? `select-round-${theme}` : `select-${theme}`],
    className
  );

  return (
    <select
      name={name}
      value={selectedValue}
      onChange={onChange}
      className={classes}
      style={{ color }}>
      {placeholder ? (
        <option value={''} disabled={!isPlaceholderSelectable}>
          {placeholder}
        </option>
      ) : null}
      {items.map((item, key) => {
        const label = item.label || item;
        const value = item.value || item;
        return (
          <option key={key} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
};
