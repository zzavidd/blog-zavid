import React from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';

import { OnTextAreaChangeType } from 'classes';
import css from 'src/styles/components/Form.module.scss';

export const ShortTextArea = (props: TextArea) => {
  return <TextArea {...props} minRows={1} />;
};

export const LongTextArea = (props: TextArea) => {
  return <TextArea {...props} minRows={2} />;
};

const TextArea = ({
  name,
  value,
  onChange,
  placeholder,
  minRows
}: TextArea) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
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

interface TextArea {
  name: string;
  value: string;
  onChange: OnTextAreaChangeType;
  placeholder?: string;
  minRows?: number;
}
