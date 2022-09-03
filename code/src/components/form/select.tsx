import classnames from 'classnames';
import React from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';

import css from 'styles/components/Form.module.scss';

export function Select(props: SelectProps) {
  const {
    name,
    items,
    value = '',
    onChange,
    className,
    placeholder = '',
    isPlaceholderSelectable = false,
    isRound = false,
  } = props;

  const theme = useSelector(({ theme }: RootStateOrAny) => theme);

  // Make widgets account for values of '00' (time)
  const selectedValue = value === 0 ? '00' : value;
  const color = !selectedValue && placeholder ? '#8E8E8E' : 'inherit';

  const classes = classnames(
    css[isRound ? `select-round` : `select`],
    css[isRound ? `select-round-${theme}` : `select-${theme}`],
    className,
  );

  return (
    <select
      name={name}
      value={selectedValue as string}
      onChange={onChange}
      className={classes}
      style={{ color }}>
      {placeholder ? (
        <option value={''} disabled={!isPlaceholderSelectable}>
          {placeholder}
        </option>
      ) : null}
      {items.map((item: unknown, key: number) => {
        const label = (item as SelectItem).label || item;
        const value = (item as SelectItem).value || item;
        return (
          <option key={key} value={value as string}>
            {label as string}
          </option>
        );
      })}
    </select>
  );
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  items: SelectItemType;
  isPlaceholderSelectable?: boolean;
  isRound?: boolean;
}

export interface SelectItem {
  label: string | number;
  value: string | number;
}

type SelectItemType = unknown[];
