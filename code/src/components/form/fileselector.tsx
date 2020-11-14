import classnames from 'classnames';
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';
import { InvisibleButton } from 'src/components/button.js';
import { Icon } from 'src/components/icon.js';
import {
  cloudinaryBaseUrl,
  validateCloudinaryImage
} from 'src/components/image.js';
import { Zoomer } from 'src/components/transitioner.js';
import css from 'src/styles/components/Form.module.scss';

export const FileSelector = (props: FileSelector) => {
  const { className, image, isCreateOperation } = props;

  const [stateImage, setImage] = useState(image);
  const imageRef = useRef(null);

  useEffect(() => {
    if (isCreateOperation) return;

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
        stateImage={stateImage}
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
  placeholder = 'Choose an image...',
  setImage
}: ChoosePrompt) => {
  if (image) return null;

  const fileRef = useRef<HTMLInputElement>(null);

  /** Show preview of image. */
  const previewImage = () => {
    const preview = imageRef.current;
    const file: Blob = fileRef.current!.files![0];

    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        const source = reader.result;
        preview!.src = source as string;
        setImage(source);
        onChange(source);
      },
      false
    );

    if (file) reader.readAsDataURL(file);
  };

  return (
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
  );
};

const ChoiceImage = ({
  stateImage,
  onChange,
  imageRef,
  setImage
}: ChoiceImage) => {
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
      <InvisibleButton className={css['fs-image-button']} onClick={removeImage}>
        <Icon name={'times'} />
      </InvisibleButton>
    </Zoomer>
  );
};

interface FileSelector {
  className: string;
  onChange: any;
  image: string;
  isCreateOperation: boolean;
  setImage: Dispatch<SetStateAction<any>>;
  imageRef: RefObject<any>;
}

interface ChoosePrompt extends FileSelector {
  aspectRatio?: AspectRatio;
  placeholder?: string;
}

interface ChoiceImage extends FileSelector {
  stateImage: string;
  onChange: any;
}

enum AspectRatio {
  SQUARE = '50% 0',
  WIDE = '28.125% 0'
}
