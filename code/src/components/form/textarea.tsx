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
// TODO: Implement undo
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
  const [textHistory, setTextHistory] = useState<Array<string>>([]);
  const [isUndo, setIsUndo] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea on content change.
  // Record text history on content change.
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      const lineCount = textArea.value.split(/\r*\n/).length;
      textArea.rows = Math.max(lineCount, minRows);
    }

    if (!isUndo) {
      setTextHistory([...textHistory, value]);
    }
    setIsUndo(false);
  }, [value]);

  // Refocus and set the cursor appropriately.
  useEffect(() => {
    if (!shouldSetCursor) return;

    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.focus();
      textArea.setSelectionRange(cursorPosition, cursorPosition);
    }
    setShouldSetCursor(false);
  }, [shouldSetCursor]);

  /**
   * Set the textarea content by replicating and manually triggering an onChange
   * event.
   * @param text The text to set.
   */
  const setText = (text: string) => {
    const changeEvent = {
      target: {
        name,
        value: text
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(changeEvent);
  };

  /**
   * Record key presses. Key combinations can trigger rich text auto-formatting.
   * @param e The textarea keyboard event.
   */
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setKeysPressed({ ...keysPressed, [e.key]: true });

    const COMMAND_KEY = navigator.platform.includes('Mac') ? 'Meta' : 'Control';
    if (keysPressed[COMMAND_KEY]) {
      switch (e.key) {
        case 'b':
          applyRichTextMarkup(e, { symphasis: '*', quantity: 2 });
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
        case 'z':
          setIsUndo(true);
          const lastTextState = textHistory.pop() ?? '';
          const newHistory = textHistory;
          setText(lastTextState);
          setTextHistory(newHistory);
          break;
      }
    }
  };

  /** Clear the recorded key presses. */
  const onKeyUp = () => {
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

  /**
   * Trigger the application of rich text markup.
   * @param e The textarea's event.
   * @param options The rich text markup options.
   */
  const applyRichTextMarkup = (
    e: React.SyntheticEvent<HTMLTextAreaElement>,
    options: RichTextMarkupOptions = {}
  ) => {
    const {
      fullReplacement,
      quantity = 1,
      symphasis,
      stopIfNoTextSelected = false
    } = options;

    const { selectionStart, selectionEnd, textContent } = e.currentTarget;
    const text = textContent ?? '';
    if (!text && stopIfNoTextSelected) return;

    const highlitText = text.substring(selectionStart, selectionEnd) ?? '';

    // Derive second argument for string replacement.
    // If the highlighted text is already formatted, deformat it.
    // If not, apply rich text formatting.
    let replacement = '';
    if (symphasis) {
      const escapedSymbol = `\\${symphasis}`.repeat(quantity);
      const regex = new RegExp(`${escapedSymbol}(.*?)${escapedSymbol}`);
      if (regex.test(highlitText)) {
        const [, word] = highlitText.match(regex)!;
        replacement = word;
      } else {
        const symbol = symphasis.repeat(quantity);
        replacement = `${symbol}$&${symbol}`;
      }
    } else if (fullReplacement) {
      replacement = fullReplacement;
    } else {
      return;
    }

    let newContent = '';

    // Get the new content to overwrite the existing text content with.
    // If text is highlighted, replace the text with derived replacement.
    // If not, insert the rich text formatting closures at cursor position.
    if (highlitText) {
      newContent = text!.replace(highlitText, replacement);
    } else {
      if (stopIfNoTextSelected) return;
      const precedent = text.slice(0, selectionStart);
      const succedent = text.slice(selectionStart);
      const closures = ''.replace('', replacement);
      newContent = [precedent, closures, succedent].join('');
    }

    setText(newContent);
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
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
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
  fullReplacement?: string;
  quantity?: number;
  stopIfNoTextSelected?: boolean;
  symphasis?: string;
};
