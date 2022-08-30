import classnames from 'classnames';
import type { CSSProperties } from 'react';
import React from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';

import type { OnClickType, OnInputChangeType, OnKeyPressType } from 'classes';
import { InvisibleButton } from 'components/button';
import { Icon } from 'components/library';
import css from 'styles/components/Form.module.scss';

export function TextInput(props: TextInputProps) {
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
}

export function NumberInput(props: InputProps) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <div className={css[`text-input-field-${theme}`]}>
      <Input {...props} type={'number'} min={1} />
    </div>
  );
}

export function SearchBar(props: SearchBarProps) {
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
}

function SearchBarTrailingComponent(props: SearchBarProps) {
  const { onClearInput, value, withRightSpace = true } = props;
  if (!value) return null;
  return (
    <InvisibleButton onClick={onClearInput}>
      <Icon name={'times'} withRightSpace={withRightSpace} />
    </InvisibleButton>
  );
}

function Input({
  name,
  type,
  value,
  onChange,
  placeholder,
  onClick,
  onKeyPress,
}: InputProps) {
  if (value === null) value = '';
  return (
    <input
      name={name}
      type={type}
      value={value as string}
      onChange={onChange}
      onKeyPress={onKeyPress}
      className={css[`text-input`]}
      autoComplete={'off'}
      placeholder={placeholder}
      readOnly={!!onClick}
    />
  );
}

interface InputProps {
  value: unknown;
  placeholder: string;
  name?: string;
  type?: string;
  onChange?: OnInputChangeType;
  onClick?: OnClickType;
  onKeyPress?: OnKeyPressType;
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
  withRightSpace?: boolean;
}
