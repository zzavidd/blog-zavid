import classnames from 'classnames';
import React, { CSSProperties } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';

import { OnClickType, OnInputChangeType } from 'classes';
import { InvisibleButton } from 'src/components/button';
import css from 'src/styles/components/Form.module.scss';

import { Icon } from '../icon';

export const TextInput = (props: TextInputProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const { onClick, leadingComponent = null, trailingComponent = null } = props;

  const classes = classnames(css[`text-input-field-${theme}`], props.className);

  return (
    <div className={classes}>
      {leadingComponent}
      {onClick ? (
        <InvisibleButton onClick={onClick} className={css[`text-click-input`]}>
          <Input {...props} type={'text'} />
        </InvisibleButton>
      ) : (
        <Input {...props} type={'text'} />
      )}
      {trailingComponent}
    </div>
  );
};

export const NumberInput = (props: InputProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <div className={css[`text-input-field-${theme}`]}>
      <Input {...props} type={'number'} min={1} />
    </div>
  );
};

export const SearchBar = (props: SearchBarProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const classes = classnames(css[`search-bar-${theme}`], props.className);

  return (
    <TextInput
      {...props}
      className={classes}
      leadingComponent={
        <Icon name={'search'} className={css[`search-bar-icon`]} />
      }
      trailingComponent={<SearchBarTrailingComponent {...props} />}
    />
  );
};

const SearchBarTrailingComponent = (props: SearchBarProps) => {
  if (!props.value) return null;
  return (
    <InvisibleButton onClick={props.onClearInput}>
      <Icon name={'times'} />
    </InvisibleButton>
  );
};

const Input = ({
  name,
  type,
  value,
  onChange,
  placeholder,
  onClick
}: InputProps) => {
  if (value === null) value = '';
  return (
    <input
      name={name}
      type={type}
      value={value as string}
      onChange={onChange}
      className={css[`text-input`]}
      autoComplete={'off'}
      placeholder={placeholder}
      readOnly={!!onClick}
    />
  );
};

interface InputProps {
  value: unknown;
  placeholder: string;
  name?: string;
  type?: string;
  onChange?: OnInputChangeType;
  onClick?: OnClickType;
  className?: string;
  style?: CSSProperties;
  readOnly?: boolean;
  min?: number;
  ref?: React.RefObject<HTMLInputElement>;
}

interface TextInputProps extends InputProps {
  leadingComponent?: JSX.Element;
  trailingComponent?: JSX.Element;
}

interface SearchBarProps extends TextInputProps {
  onClearInput: () => void;
}
