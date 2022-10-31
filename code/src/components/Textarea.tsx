import React, { useEffect, useRef, useState } from 'react';

import Utils from 'constants/utils';
import FORM from 'styles/Components/Form.styles';

export function ShortTextArea(props: TextAreaProps) {
  return <TextArea {...props} minRows={1} />;
}

export function LongTextArea(props: TextAreaProps) {
  return <TextArea {...props} minRows={3} />;
}

function TextArea({
  name,
  value,
  placeholder,
  minRows = 1,
  ...props
}: TextAreaProps) {
  const [state, setState] = useState<TextAreaState>({
    cursorPosition: 0,
    justUndid: false,
    keysPressed: {},
    shouldSetCursor: false,
    textHistory: [''],
  });
  const dispatch = Utils.createDispatch(setState);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Refocus and set the cursor appropriately.
  useEffect(() => {
    if (!state.shouldSetCursor) return;

    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(state.cursorPosition, state.cursorPosition);
    }

    dispatch({ shouldSetCursor: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.shouldSetCursor]);

  /**
   * Set the textarea content by replicating and manually triggering an onChange
   * event.
   * @param content The text to set.
   */
  function setContent(content: string) {
    const changeEvent = {
      target: {
        name,
        value: content,
      },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    props.onChange!(changeEvent);
  }

  /**
   * Embeds copied text as a hyperlink into highlighted text.
   * @param e The textarea element.
   */
  function embedLinkInText(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const clipboardText = e.clipboardData.getData('text');
    applyRichTextMarkup(e, {
      fullReplacement: `[$&](${clipboardText})`,
      stopIfNoTextSelected: true,
    });
  }

  /**
   * Trigger the application of rich text markup.
   * @param e The textarea's event.
   * @param options The rich text markup options.
   */
  function applyRichTextMarkup(
    e: React.SyntheticEvent<HTMLTextAreaElement>,
    options: RichTextMarkupOptions = {},
  ) {
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

    dispatch({
      textHistory: [...state.textHistory, value],
      cursorPosition,
      shouldSetCursor: true,
    });
    setContent(newContent);

    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * Record key presses. Key combinations can trigger rich text auto-formatting.
   * @param e The textarea keyboard event.
   */
  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    dispatch({ keysPressed: { ...state.keysPressed, [e.key]: true } });

    const commandKey = navigator.platform.includes('Mac') ? 'Meta' : 'Control';
    if (!state.keysPressed[commandKey]) return;

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

  /**
   * Trigger a text undo.
   */
  function executeUndo() {
    const lastState = state.textHistory[state.textHistory.length - 1];
    setContent(lastState);

    if (lastState) {
      const newTextHistory = state.textHistory.slice(
        0,
        state.textHistory.length - 1,
      );
      dispatch({
        justUndid: true,
        textHistory: newTextHistory,
      });
    }
  }

  /**
   * Clears the recorded key presses.
   */
  function onKeyUp() {
    dispatch({ keysPressed: {} });
  }

  /**
   * Records text history after each word.
   * @param e The textarea content change event.
   */
  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (state.justUndid) {
      dispatch({ justUndid: false });
    } else {
      const lastChar = value[value.length - 1];
      const lastState = state.textHistory[state.textHistory.length - 1];
      if (/\s/.test(lastChar) && lastState !== value) {
        dispatch({ textHistory: [...state.textHistory, value] });
      }
    }
    props.onChange!(e);
  }

  return (
    <FORM.Input.Textarea
      name={name}
      value={value}
      placeholder={placeholder}
      minRows={minRows}
      onChange={onChange}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onPaste={embedLinkInText}
      ref={textAreaRef}
    />
  );
}

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  value: string;
}

interface TextAreaState {
  keysPressed: Record<string, boolean>;
  shouldSetCursor: boolean;
  cursorPosition: number;
  textHistory: string[];
  justUndid: boolean;
}

interface RichTextMarkupOptions {
  fullReplacement?: string;
  quantity?: number;
  stopIfNoTextSelected?: boolean;
  symphasis?: string;
}
