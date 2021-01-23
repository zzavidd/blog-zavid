import { Dispatch } from 'redux';

import {
  PostContentImageMapping,
  PostDAO,
  PostImage,
  ReactHook,
  ReactInputChangeEvent,
  ReactSelectChangeEvent,
  ReactTextAreaChangeEvent,
  SubscriptionsMapping
} from 'classes';
import { GenericDAO } from 'classes/interfaces/super';
import { DateType } from 'src/components/form/datepicker';
import { saveText } from 'src/lib/reducers';

const handlers = <T extends GenericDAO>(
  hook: ReactHook<T>,
  state: T
): Handlers => {
  const handleText = (
    event: ReactInputChangeEvent | ReactTextAreaChangeEvent
  ): void => {
    const { name, value } = event.target;
    hook(Object.assign({}, state, { [name]: value }));
  };

  const handleNumber = (event: ReactInputChangeEvent) => {
    const { name, valueAsNumber } = event.target;
    hook(Object.assign({}, state, { [name]: valueAsNumber }));
  };

  const handleSelection = (event: ReactSelectChangeEvent): void => {
    const { name, value } = event.target;
    hook(Object.assign({}, state, { [name]: value }));
  };

  const handleTextSave = (
    event: ReactInputChangeEvent | ReactTextAreaChangeEvent,
    dispatch: Dispatch
  ): void => {
    handleText(event);
    dispatch(saveText(event.target.value));
  };

  const handleDate = (date: DateType, name = 'date'): void => {
    hook(Object.assign({}, state, { [name]: date }));
  };

  const handleCheck = (event: ReactInputChangeEvent): void => {
    const { name, checked } = event.target;
    hook(Object.assign({}, state, { [name]: checked }));
  };

  const handleFile = (file: string | null, name = 'image'): void => {
    hook(
      Object.assign({}, state, {
        [name]: {
          source: file,
          hasChanged: true
        }
      })
    );
  };

  const handleContentImages = (file: string, i: number): void => {
    const contentImages = (state as PostDAO)
      .contentImages as PostContentImageMapping;

    contentImages[`image${i}`] = {
      source: file,
      hasChanged: true
    } as PostImage;

    hook(
      Object.assign({}, state, {
        contentImages
      })
    );
  };

  return {
    handleText,
    handleNumber,
    handleTextSave,
    handleSelection,
    handleDate,
    handleCheck,
    handleFile,
    handleContentImages
  };
};

export default handlers;

export interface Handlers {
  handleText: (event: ReactInputChangeEvent | ReactTextAreaChangeEvent) => void;
  handleNumber: (event: ReactInputChangeEvent) => void;
  handleTextSave: (
    event: ReactInputChangeEvent | ReactTextAreaChangeEvent,
    dispatch: Dispatch
  ) => void;
  handleSelection: (event: ReactSelectChangeEvent) => void;
  handleDate: (date: DateType, name: string) => void;
  handleCheck: (event: ReactInputChangeEvent) => void;
  handleFile: (file: string | null, name?: string) => void;
  handleContentImages: (file: string, i: number) => void;
  setPreferences?: ReactHook<SubscriptionsMapping>;
}
