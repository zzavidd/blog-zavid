import classnames from 'classnames';
import React from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';

import { InvisibleButton } from 'components/button';
import { Icon } from 'components/library';
import css from 'styles/components/Form.module.scss';

export function TextInput({ onClick, ...props }: TextInputProps) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);

  const classes = classnames(css[`text-input-field-${theme}`], props.className);

  return (
    <div className={classes}>
      {onClick ? (
        <InvisibleButton onClick={onClick} className={css['text-click-input']}>
          <Input type={'text'} {...props} />
        </InvisibleButton>
      ) : (
        <Input type={'text'} {...props} />
      )}
    </div>
  );
}

export function NumberInput(props: InputProps) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <div className={css[`text-input-field-${theme}`]}>
      <Input {...props} type={'number'} />
    </div>
  );
}

export function SearchBar({ onClearInput, ...props }: SearchBarProps) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const classes = classnames(css[`search-bar-${theme}`], props.className);

  return (
    <TextInput
      {...props}
      className={classes}
      leadingComponent={
        <Icon name={'search'} className={css['search-bar-icon']} />
      }
      trailingComponent={
        <SearchBarTrailingComponent {...props} onClearInput={onClearInput} />
      }
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

// TODO: Use onKeyDown
function Input({
  onClick,
  leadingComponent,
  trailingComponent,
  value,
  ...props
}: InputProps) {
  if (value === null) value = '';
  return (
    <React.Fragment>
      {leadingComponent}
      <input
        {...props}
        value={value}
        className={css['text-input']}
        autoComplete={'off'}
        readOnly={!!onClick}
      />
      {trailingComponent}
    </React.Fragment>
  );
}

interface TextInputProps extends Omit<InputProps, 'onClick'> {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

interface SearchBarProps extends TextInputProps {
  onClearInput: () => void;
  withRightSpace?: boolean;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingComponent?: JSX.Element;
  trailingComponent?: JSX.Element;
}
