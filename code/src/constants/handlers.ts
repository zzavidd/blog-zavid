/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type React from 'react';
import type { Dispatch } from 'redux';

import type { EntityDAO } from 'classes/entity';
import type {
  PostDAO,
  PostContentImageMapping,
  PostImage,
} from 'classes/posts/PostDAO';
import type { DateType } from 'components/form/datepicker';

import { AppActions } from './reducers';
import type { ReactHook } from './types';

export default function Handlers<T extends EntityDAO>(
  hook: ReactHook<T>,
  state: T,
) {
  function handleText(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ): void {
    const { name, value } = event.target;
    hook({ ...state, [name]: value });
  }

  function handleNumber(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, valueAsNumber } = event.target;
    hook({ ...state, [name]: valueAsNumber });
  }

  function handleSelection(event: React.ChangeEvent<HTMLSelectElement>): void {
    const { name, value } = event.target;
    hook({ ...state, [name]: value });
  }

  function handleTextSave(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    dispatch: Dispatch,
  ): void {
    handleText(event);
    dispatch(AppActions.saveInputText(event.target.value));
  }

  function handleDate(date: DateType, name = 'date'): void {
    hook({ ...state, [name]: date });
  }

  function handleCheck(event: React.ChangeEvent<HTMLInputElement>): void {
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
    const contentImages = (state as unknown as PostDAO)
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
