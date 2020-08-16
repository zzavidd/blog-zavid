import classnames from 'classnames';
import React, { useState, useEffect, useRef } from 'react';

import { InvisibleButton } from 'components/button.js';
import { Icon } from 'components/icon.js';
import {
  cloudinaryBaseUrl,
  validateCloudinaryImage
} from 'components/image.js';
import { Zoomer } from 'components/transitioner.js';
import { OPERATIONS } from 'constants/strings.js';
import css from 'styles/components/Form.module.scss';

export const ASPECT_RATIO = {
  SQUARE: '50% 0',
  WIDE: '28.125% 0'
};

export const FileSelector = (props) => {
  const { className, image, operation } = props;

  const [sImage, setImage] = useState(image);
  const imageRef = useRef(null);

  useEffect(() => {
    if (operation === OPERATIONS.CREATE) return;

    if (validateCloudinaryImage(image)) {
      const cloudPath = `${cloudinaryBaseUrl}/${image}`;
      setImage(cloudPath);
    }
  }, [image]);

  return (
    <div className={classnames(css['fs-image-container'], className)}>
      <ChoosePrompt {...props} imageRef={imageRef} setImage={setImage} />
      <ChoiceImage
        {...props}
        stateImage={sImage}
        imageRef={imageRef}
        setImage={setImage}
      />
    </div>
  );
};

const ChoosePrompt = ({
  aspectRatio,
  onChange,
  image,
  imageRef,
  placeholder = 'Choose a image...',
  setImage
}) => {
  if (image) return null;

  const fileRef = useRef(null);

  /** Show preview of image. */
  const previewImage = () => {
    const preview = imageRef.current;
    const file = fileRef.current.files[0];
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        const source = reader.result;
        preview.src = source;
        setImage(source);
        onChange(source);
      },
      false
    );

    if (file) reader.readAsDataURL(file);
  };

  return (
    <>
      <label
        className={css['fs-image-text']}
        style={{
          padding: aspectRatio
        }}>
        <input
          type={'file'}
          style={{ display: 'none' }}
          onChange={previewImage}
          ref={fileRef}
          accept={'image/*'}
        />
        <span>{placeholder}</span>
      </label>
    </>
  );
};

const ChoiceImage = ({ stateImage, onChange, imageRef, setImage }) => {
  /** Remove selected image. */
  const removeImage = () => {
    onChange(null);
    setImage(null);
  };

  return (
    <Zoomer
      determinant={stateImage !== null}
      duration={400}
      style={{
        display: stateImage ? 'block' : 'none'
      }}>
      <img
        src={stateImage}
        alt={'Image preview...'}
        ref={imageRef}
        className={css['fs-image']}
      />
      <InvisibleButton
        className={css['fs-image-button']}
        onClick={removeImage}>
        <Icon name={'times'} />
      </InvisibleButton>
    </Zoomer>
  );
};
