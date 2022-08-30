/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Dispatch } from 'redux';

import type {
  PostContentImageMapping,
  PostDAO,
  PostImage,
  ReactHook,
  ReactInputChangeEvent,
  ReactSelectChangeEvent,
  ReactTextAreaChangeEvent,
} from 'classes';
import type { GenericDAO } from 'classes/interfaces/super';
import type { DateType } from 'components/form/datepicker';
import { saveText } from 'lib/reducers';

export default function Handlers<T extends GenericDAO>(
  hook: ReactHook<T>,
  state: T,
) {
  function handleText(
    event: ReactInputChangeEvent | ReactTextAreaChangeEvent,
  ): void {
    const { name, value } = event.target;
    hook({ ...state, [name]: value });
  }

  function handleNumber(event: ReactInputChangeEvent): void {
    const { name, valueAsNumber } = event.target;
    hook({ ...state, [name]: valueAsNumber });
  }

  function handleSelection(event: ReactSelectChangeEvent): void {
    const { name, value } = event.target;
    hook({ ...state, [name]: value });
  }

  function handleTextSave(
    event: ReactInputChangeEvent | ReactTextAreaChangeEvent,
    dispatch: Dispatch,
  ): void {
    handleText(event);
    dispatch(saveText(event.target.value));
  }

  function handleDate(date: DateType, name = 'date'): void {
    hook({ ...state, [name]: date });
  }

  function handleCheck(event: ReactInputChangeEvent): void {
    const { name, checked } = event.target;
    hook({ ...state, [name]: checked });
  }

  function handleFile(file: string | null, name = 'image'): void {
    hook({
      ...state,
      [name]: {
        source: file,
        hasChanged: true,
      },
    });
  }

  function handleContentImages(file: string, i: number): void {
    const contentImages = (state as PostDAO)
      .contentImages as PostContentImageMapping;

    contentImages[`image${i}`] = {
      source: file,
      hasChanged: true,
    } as PostImage;

    hook({
      ...state,
      contentImages,
    });
  }

  return {
    handleText,
    handleNumber,
    handleTextSave,
    handleSelection,
    handleDate,
    handleCheck,
    handleFile,
    handleContentImages,
    setState: hook,
  };
}
