import classnames from 'classnames';
import React, { CSSProperties } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';

import { OnInputChangeType, OnClickType } from 'classes';
import { InvisibleButton } from 'src/components/button';
import css from 'src/styles/components/Form.module.scss';

export const TextInput = (props: TextInput) => {
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

export const NumberInput = (props: Input) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <div className={css[`text-input-field-${theme}`]}>
      <Input {...props} type={'number'} min={1} />
    </div>
  );
};

const Input = ({
  name,
  type,
  value,
  onChange,
  placeholder,
  onClick
}: Input) => {
  if (value === null) value = '';
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={css[`text-input`]}
      autoComplete={'off'}
      placeholder={placeholder}
      readOnly={!!onClick}
    />
  );
};

interface BaseInput {
  value: string | number;
  placeholder: string;
  name?: string;
  type?: string;
  onChange?: OnInputChangeType;
  onClick?: OnClickType;
  className?: string
  style?: CSSProperties
  readOnly?: boolean
}

interface Input extends BaseInput {
  min?: number
}

interface TextInput extends BaseInput {
  leadingComponent?: JSX.Element
  trailingComponent?: JSX.Element
}