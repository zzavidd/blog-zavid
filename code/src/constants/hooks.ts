import { Dispatch } from 'redux';

import { PostContentImageMapping, PostDAO, PostImage, ReactInputChangeEvent } from 'classes';
import { GenericDAO } from 'classes/interfaces/super';
import { saveText } from 'src/lib/reducers';

export type ReactHook<T> = React.Dispatch<React.SetStateAction<T>>;

export default <T extends GenericDAO>(hook: ReactHook<T>, state: T) => {
  
  const handleText = (event: ReactInputChangeEvent): void => {
    const { name, value } = event.target;
    hook(Object.assign({}, state, { [name]: value }));
  };

  const handleTextSave = (event: ReactInputChangeEvent, dispatch: Dispatch): void => {
    handleText(event);
    dispatch(saveText(event.target.value));
  };

  const handleSelection = handleText;

  const handleDate = (date: string, name = 'date'): void => {
    hook(Object.assign({}, state, { [name]: date }));
  };

  const handleCheck = (event: ReactInputChangeEvent): void => {
    const { name, checked } = event.target;
    hook(Object.assign({}, state, { [name]: checked }));
  };

  const handleFile = (file: string, name = 'image'): void => {
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
    const contentImages = (state as PostDAO).contentImages as PostContentImageMapping;

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
    handleTextSave,
    handleSelection,
    handleDate,
    handleCheck,
    handleFile,
    handleContentImages
  };
};