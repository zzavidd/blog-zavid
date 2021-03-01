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

  /**
   * Embeds copied text as a hyperlink into highlighted text.
   * @param e The textarea element.
   */
  const embedLinkInText = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const { selectionStart, selectionEnd, textContent } = e.currentTarget;
    if (!textContent) return;

    const highlitText = textContent.substring(selectionStart, selectionEnd);
    if (!highlitText) return;

    e.preventDefault();
    e.stopPropagation();

    const clipboardText = e.clipboardData.getData('text');
    const changeEvent = {
      target: {
        name,
        value: textContent.replace(highlitText, `[$&](${clipboardText})`)
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(changeEvent);
  };

  return (
    <TextareaAutosize
      name={name}
      minRows={minRows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={css[`textarea-${theme}`]}
      onPaste={embedLinkInText}
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
