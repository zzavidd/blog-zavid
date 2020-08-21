import React from 'react';
import { useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';

import css from 'styles/components/Form.module.scss';

/**
 * A single-line {@link Textarea} component.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const ShortTextArea = (props) => {
  return <Textarea {...props} minRows={1} />;
};

/**
 * A multi-line {@link Textarea} component.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const LongTextArea = (props) => {
  return <Textarea {...props} minRows={2} />;
};

const Textarea = ({ name, value, onChange, placeholder, minRows }) => {
  const theme = useSelector(({ theme }) => theme);
  return (
    <TextareaAutosize
      name={name}
      minRows={minRows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={css[`textarea-${theme}`]}
    />
  );
};
