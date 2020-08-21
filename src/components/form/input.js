import React from 'react';
import { useSelector } from 'react-redux';

import { InvisibleButton } from 'components/button';
import css from 'styles/components/Form.module.scss';

/**
 * A text input component.
 * @param {object} props - The component props.
 * @param {string} props.name - The object property this input represents.
 * @param {string} props.value - The current text in the input.
 * @param {Function} props.onClick - The function called on clicking on the input.
 * @param {Function} props.onChange - The function called on text change.
 * @param {string} props.placeholder - The placeholder text.
 * @param {React.Component} [props.leadingComponent] - A component placed before the input.
 * @param {React.Component} [props.trailingComponent] - A component placed after the input.
 * @returns {React.Component} The component.
 */
export const TextInput = (props) => {
  const theme = useSelector(({ theme }) => theme);
  const { onClick, leadingComponent = null, trailingComponent = null } = props;

  return (
    <div className={css[`text-input-field-${theme}`]}>
      {leadingComponent}
      {onClick ? (
        <InvisibleButton onClick={onClick} className={css['text-click-input']}>
          <Input {...props} />
        </InvisibleButton>
      ) : (
        <Input {...props} />
      )}
      {trailingComponent}
    </div>
  );
};

const Input = ({ name, value, onChange, placeholder, onClick }) => {
  if (value === null) value = '';
  return (
    <input
      name={name}
      type={'text'}
      value={value}
      onChange={onChange}
      className={css[`text-input`]}
      autoComplete={'off'}
      placeholder={placeholder}
      readOnly={!!onClick}
    />
  );
};