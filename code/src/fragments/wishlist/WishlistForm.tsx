import {
  faLink,
  faPoundSign,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import {
  Field,
  FieldRow,
  Label,
  NumberInput,
  ShortTextArea,
  TextInput,
} from 'components/form';
import Alert from 'constants/alert';
import type HandlersV2 from 'constants/handlersv2';
import { DOMAIN } from 'constants/settings';
import Utils from 'constants/utils';
import type { WishlistPageState } from 'pages/wishlist';
import CPX from 'stylesv2/Components.styles';

export default function WishlistForm(props: WishlistFormProps) {
  const [state, setState] = useState<WishlistFormState>({
    imageUrls: [],
    areImagesLoading: false,
  });
  const { wishlistItem, handlers: Handlers } = props;

  const dispatch = Utils.createDispatch(setState);

  /**
   * Scrapes the images from the supplied URL.
   */
  async function runImageScrape() {
    dispatch({ areImagesLoading: true });
    const url = new URL('/api/wishlist/images', DOMAIN);
    url.searchParams.append('url', wishlistItem.href);
    try {
      const { images } = await Utils.request<{ images: string[] }>(url.href);
      dispatch({ imageUrls: images });
    } catch (e: any) {
      Alert.error(e);
    } finally {
      dispatch({ areImagesLoading: false });
    }
  }

  async function onEnterKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      await runImageScrape();
    }
  }

  return (
    <React.Fragment>
      <FieldRow>
        <Field>
          <Label>Name:</Label>
          <TextInput
            name={'name'}
            value={wishlistItem.name}
            onChange={Handlers.text}
            placeholder={'Enter the name'}
            datatype={''}
          />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field sm={4}>
          <Label>Price:</Label>
          <NumberInput
            name={'price'}
            value={wishlistItem.price}
            onChange={Handlers.number}
            placeholder={'0.00'}
            min={0}
            step={0.01}
            leadingComponent={<FontAwesomeIcon icon={faPoundSign} />}
          />
        </Field>
        <Field sm={3}>
          <Label>Quantity:</Label>
          <NumberInput
            name={'quantity'}
            value={wishlistItem.quantity}
            onChange={Handlers.number}
            placeholder={'Qty.'}
            min={1}
          />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field>
          <Label>Reference Link:</Label>
          <TextInput
            type={'url'}
            name={'href'}
            value={wishlistItem.href}
            onChange={Handlers.text}
            onKeyDown={onEnterKeyPress}
            leadingComponent={<FontAwesomeIcon icon={faLink} />}
            trailingComponent={
              <CPX.Clickable onClick={runImageScrape}>
                <FontAwesomeIcon icon={faSearch} />
              </CPX.Clickable>
            }
            placeholder={'https://reference.com'}
            pattern={'https://.*'}
          />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field>
          <Label>Image URL:</Label>
          <TextInput
            type={'url'}
            name={'image'}
            value={wishlistItem.image}
            onChange={Handlers.text}
            leadingComponent={<FontAwesomeIcon icon={faLink} />}
            placeholder={'https://image.com'}
            pattern={'https://.*'}
          />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field>
          <Label>Comments:</Label>
          <ShortTextArea
            name={'comments'}
            value={wishlistItem.comments}
            onChange={Handlers.text}
            placeholder={'Add comments about this wishlist item...'}
          />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field>
          <ScrapedImageGrid imageUrls={state.imageUrls} handlers={Handlers} />
        </Field>
      </FieldRow>
    </React.Fragment>
  );
}

function ScrapedImageGrid({
  imageUrls,
  handlers: Handlers,
}: ScrapedImageGridProps) {
  if (!imageUrls.length) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        height: '250px',
        overflowY: 'auto',
      }}>
      {imageUrls.map((url, key) => {
        return (
          <CPX.Clickable
            onClick={() => Handlers.imageURL('image', url)}
            key={key}>
            <img
              src={url}
              style={{
                cursor: 'pointer',
                maxHeight: '100px',
                maxWidth: '100%',
              }}
            />
          </CPX.Clickable>
        );
      })}
    </div>
  );
}

interface WishlistFormProps {
  wishlistItem: WishlistDAO.Request;
  handlers: ReturnType<typeof HandlersV2<WishlistPageState>>;
}

interface WishlistFormState {
  imageUrls: string[];
  areImagesLoading: boolean;
}

interface ScrapedImageGridProps {
  imageUrls: string[];
  handlers: ReturnType<typeof HandlersV2<WishlistPageState>>;
}
