import React, { useEffect, useState } from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';
import Textarea from 'react-textarea-autosize';

import css from 'styles/components/Form.module.scss';

export function ShortTextArea(props: TextAreaProps) {
  return <TextArea {...props} minRows={1} />;
}

export function LongTextArea(props: TextAreaProps) {
  return <TextArea {...props} minRows={2} />;
}

function TextArea({
  name,
  value,
  onChange: onSuperChange,
  placeholder,
  minRows = 1,
}: TextAreaProps) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});
  const [shouldSetCursor, setShouldSetCursor] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [textHistory, setTextHistory] = useState<Array<string>>(['']);
  const [justUndid, setJustUndid] = useState(false);
  const [textAreaElement, setTextAreaElement] =
    useState<HTMLTextAreaElement | null>(null);

  // Refocus and set the cursor appropriately.
  useEffect(() => {
    if (!shouldSetCursor) return;

    if (textAreaElement) {
      textAreaElement.focus();
      textAreaElement.setSelectionRange(cursorPosition, cursorPosition);
    }
    setShouldSetCursor(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldSetCursor]);

  /**
   * Set the textarea content by replicating and manually triggering an onChange
   * event.
   * @param content The text to set.
   */
  const setContent = (content: string) => {
    const changeEvent = {
      target: {
        name,
        value: content,
      },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onSuperChange!(changeEvent);
  };

  /**
   * Update the text history with a new state
   * @param textState The new text state.
   */
  const addToTextHistory = (textState: string) => {
    setTextHistory([...textHistory, textState]);
  };

  /**
   * Embeds copied text as a hyperlink into highlighted text.
   * @param e The textarea element.
   */
  const embedLinkInText = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const clipboardText = e.clipboardData.getData('text');
    applyRichTextMarkup(e, {
      fullReplacement: `[$&](${clipboardText})`,
      stopIfNoTextSelected: true,
    });
  };

  /**
   * Trigger the application of rich text markup.
   * @param e The textarea's event.
   * @param options The rich text markup options.
   */
  const applyRichTextMarkup = (
    e: React.SyntheticEvent<HTMLTextAreaElement>,
    options: RichTextMarkupOptions = {},
  ) => {
    const {
      fullReplacement,
      quantity = 1,
      symphasis,
      stopIfNoTextSelected = false,
    } = options;

    const { selectionStart, selectionEnd, textContent } = e.currentTarget;
    const text = textContent ?? '';
    if (!text && stopIfNoTextSelected) return;

    const highlitText = text.substring(selectionStart, selectionEnd) ?? '';

    let replacement = '';
    let cursorPosition = 0;

    // Derive second argument for string replacement.
    // If the highlighted text is already formatted, deformat it.
    // If not, apply rich text formatting.
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
      cursorPosition = selectionEnd + symphasis?.length * quantity;
    } else if (fullReplacement) {
      replacement = fullReplacement;
      cursorPosition = selectionEnd + fullReplacement.length - 2;
    } else {
      return;
    }

    let newContent = '';

    // Get the new content to overwrite the existing text content with.
    // If text is highlighted, replace the text with derived replacement.
    // If not, insert the rich text formatting closures at cursor position.
    if (!highlitText && stopIfNoTextSelected) return;
    const subject = highlitText ?? '';
    const precedent = text.slice(0, selectionStart);
    const succedent = text.slice(selectionEnd);
    const closures = subject.replace(subject, replacement);
    newContent = [precedent, closures, succedent].join('');

    addToTextHistory(value);
    setContent(newContent);
    setCursorPosition(cursorPosition);
    setShouldSetCursor(true);

    e.preventDefault();
    e.stopPropagation();
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
          executeUndo();
          break;
      }
    }
  };

  /**
   * Trigger a text undo.
   */
  const executeUndo = () => {
    const lastState = textHistory[textHistory.length - 1];
    setContent(lastState);

    if (lastState !== '') {
      const newTextHistory = textHistory.slice(0, textHistory.length - 1);
      setTextHistory(newTextHistory);
      setJustUndid(true);
    }
  };

  /**
   * Clears the recorded key presses.
   */
  const onKeyUp = () => {
    setKeysPressed({});
  };

  /**
   * Records text history after each word.
   * @param e The textarea content change event.
   */
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (justUndid) {
      setJustUndid(false);
    } else {
      const lastChar = value[value.length - 1];
      const lastState = textHistory[textHistory.length - 1];
      if (/\s/.test(lastChar) && lastState !== value) {
        addToTextHistory(value);
      }
    }
    onSuperChange!(e);
  };

  return (
    <Textarea
      name={name}
      minRows={minRows}
      value={value}
      onChange={onChange}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={css[`textarea-${theme}`]}
      onPaste={embedLinkInText}
      ref={(element) => setTextAreaElement(element)}
    />
  );
}

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  value: string;
}

interface RichTextMarkupOptions {
  fullReplacement?: string;
  quantity?: number;
  stopIfNoTextSelected?: boolean;
  symphasis?: string;
}
