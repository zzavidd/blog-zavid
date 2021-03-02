import React, { useEffect, useRef, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';

import { OnTextAreaChangeType } from 'classes';
import css from 'src/styles/components/Form.module.scss';

export const ShortTextArea = (props: TextArea) => {
  return <TextArea {...props} minRows={1} />;
};

export const LongTextArea = (props: TextArea) => {
  return <TextArea {...props} minRows={2} />;
};

// TODO: Allow holding onto Ctrl key
// TODO: Implement de-emphasis
const TextArea = ({
  name,
  value,
  onChange,
  placeholder,
  minRows = 1
}: TextArea) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});
  const [shouldSetCursor, setShouldSetCursor] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      const lineCount = textArea.value.split(/\r*\n/).length;
      textArea.rows = Math.max(lineCount, minRows);
    }
  }, [value]);

  useEffect(() => {
    if (!shouldSetCursor) return;

    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.focus();
      textArea.setSelectionRange(cursorPosition, cursorPosition);
    }
    setShouldSetCursor(false);
  }, [shouldSetCursor]);

  const recordKeysPressed = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setKeysPressed({ ...keysPressed, [e.key]: true });

    const COMMAND_KEY = navigator.platform.includes('Mac') ? 'Meta' : 'Control';
    if (keysPressed[COMMAND_KEY]) {
      switch (e.key) {
        case 'b':
          applyRichTextMarkup(e, { symphasis: '**' });
          break;
        case 'i':
          applyRichTextMarkup(e, { symphasis: '*' });
          break;
        case 'u':
          applyRichTextMarkup(e, { symphasis: '_' });
          break;
        case 's':
          applyRichTextMarkup(e, { symphasis: '~' });
          break;
      }
    }
  };

  const clearRecordedKeys = () => {
    setKeysPressed({});
  };

  /**
   * Embeds copied text as a hyperlink into highlighted text.
   * @param e The textarea element.
   */
  const embedLinkInText = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const clipboardText = e.clipboardData.getData('text');
    applyRichTextMarkup(e, {
      fullReplacement: `[$&](${clipboardText})`,
      stopIfNoTextSelected: true
    });
  };

  const applyRichTextMarkup = (
    e: React.SyntheticEvent<HTMLTextAreaElement>,
    options: RichTextMarkupOptions = {}
  ) => {
    const {
      fullReplacement,
      symphasis,
      stopIfNoTextSelected = false
    } = options;

    const { selectionStart, selectionEnd, textContent } = e.currentTarget;
    const text = textContent ?? '';
    if (!text && stopIfNoTextSelected) return;

    const highlitText = text?.substring(selectionStart, selectionEnd) ?? '';
    let newContent = '';

    // Derive second argument for string replacement.
    let replacement = '';
    if (symphasis) {
      replacement = `${symphasis}$&${symphasis}`;
    } else if (fullReplacement) {
      replacement = fullReplacement;
    } else {
      return;
    }

    // Get the new content to overwrite the existing text content with.
    if (!highlitText) {
      if (stopIfNoTextSelected) return;

      newContent = [
        text.slice(0, selectionStart),
        ''.replace('', replacement),
        text?.slice(selectionStart)
      ].join('');
    } else {
      newContent = text!.replace(highlitText, replacement);
    }

    const changeEvent = {
      target: {
        name,
        value: newContent
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;

    onChange(changeEvent);
    setCursorPosition(selectionEnd);
    setShouldSetCursor(true);

    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <textarea
      name={name}
      rows={minRows}
      value={value}
      onChange={onChange}
      onKeyUp={clearRecordedKeys}
      onKeyDown={recordKeysPressed}
      placeholder={placeholder}
      className={css[`textarea-${theme}`]}
      onPaste={embedLinkInText}
      ref={textAreaRef}
    />
  );
};

type TextArea = {
  name: string;
  value: string;
  onChange: OnTextAreaChangeType;
  placeholder?: string;
  minRows?: number;
};

type RichTextMarkupOptions = {
  symphasis?: string;
  fullReplacement?: string;
  stopIfNoTextSelected?: boolean;
};
