import classnames from 'classnames';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import { InvisibleButton } from 'components/button';
import { validateCloudinaryImage } from 'components/image';
import { Icon } from 'components/library';
import { CLOUDINARY_BASE_URL } from 'constants/settings';
import css from 'styles/components/Form.module.scss';

export function FileSelector(props: FileSelector) {
  const { className, image, isCreateOperation } = props;

  const [stateImage, setImage] = useState(image as FSImage);
  const imageRef = useRef(null);

  useEffect(() => {
    if (isCreateOperation) return;

    if (validateCloudinaryImage(image)) {
      const cloudPath = `${CLOUDINARY_BASE_URL}/${image}`;
      setImage(cloudPath);
    }
  }, [image]);

  return (
    <div className={classnames(css['fs-image-container'], className)}>
      <ChoosePrompt {...props} imageRef={imageRef} setImage={setImage} />
      <ChoiceImage
        {...props}
        stateImage={stateImage as string}
        imageRef={imageRef}
        setImage={setImage}
      />
    </div>
  );
}

function ChoosePrompt({
  aspectRatio,
  onChange,
  image,
  imageRef,
  placeholder = 'Choose an image...',
  setImage,
}: ChoosePrompt) {
  const fileRef = useRef<HTMLInputElement>(null);
  if (image) return null;

  /** Show preview of image. */
  const previewImage = () => {
    const preview = imageRef!.current;
    const file: Blob = fileRef.current!.files![0];

    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        const source = reader.result;
        preview!.src = source as string;
        setImage!(source);
        onChange(source as string);
      },
      false,
    );

    if (file) reader.readAsDataURL(file);
  };

  return (
    <label
      className={css['fs-image-text']}
      style={{
        padding: aspectRatio,
      }}>
      <input
        type={'file'}
        onChange={previewImage}
        ref={fileRef}
        accept={'image/*'}
        hidden
      />
      <span>{placeholder}</span>
    </label>
  );
}

function ChoiceImage({
  stateImage,
  onChange,
  imageRef,
  setImage,
}: ChoiceImage) {
  const [isInitialState, setIsInitialState] = useState(true);
  const isImageVisible = stateImage && stateImage !== null;

  useEffect(() => {
    if (isInitialState && isImageVisible) {
      setIsInitialState(false);
    }
  }, [isImageVisible]);

  /** Remove selected image. */
  const removeImage = () => {
    onChange(null);
    setImage!(null);
  };

  const state = isInitialState
    ? 'initial'
    : isImageVisible
    ? 'visible'
    : 'hidden';
  const classes = classnames(
    css['fs-image-wrapper'],
    css[`fs-image-wrapper--${state}`],
  );

  return (
    <div className={classes}>
      <img
        src={stateImage}
        alt={'Image preview...'}
        ref={imageRef}
        className={css['fs-image']}
      />
      <InvisibleButton className={css['fs-image-button']} onClick={removeImage}>
        <Icon name={'times'} />
      </InvisibleButton>
    </div>
  );
}

interface FileSelector {
  image: string;
  onChange: (file: string | null, name?: string) => void;
  isCreateOperation: boolean;
  className?: string;
  setImage?: Dispatch<SetStateAction<FSImage>>;
  imageRef?: RefObject<HTMLImageElement>;
  aspectRatio?: FSAspectRatio;
}

interface ChoosePrompt extends FileSelector {
  placeholder?: string;
}

interface ChoiceImage extends FileSelector {
  stateImage: string;
  onChange: (file: string | null, name?: string) => void;
}

export enum FSAspectRatio {
  SQUARE = '50% 0',
  WIDE = '28.125% 0',
}

type FSImage = string | ArrayBuffer | null;
