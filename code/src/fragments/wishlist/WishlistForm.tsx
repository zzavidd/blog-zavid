import {
  faLink,
  faPoundSign,
  faSearch,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useState } from 'react';

import Clickable from 'componentsv2/Clickable';
import Input from 'componentsv2/Input';
import Alert from 'constants/alert';
import HandlersV2 from 'constants/handlersv2';
import { DOMAIN } from 'constants/settings';
import Utils from 'constants/utils';
import CPX from 'stylesv2/Components.styles';
import FORM from 'stylesv2/Form.styles';

import type { WishlistPageState } from './WishlistContext';
import { WishlistPageContext } from './WishlistContext';

export default function WishlistForm() {
  const [state, setState] = useState<WishlistFormState>({
    imageUrls: [],
    areImagesLoading: false,
  });
  const [context, setContext] = useContext(WishlistPageContext);

  const Handlers = HandlersV2(setContext, 'wishlistItem');
  const dispatch = Utils.createDispatch(setState);

  /**
   * Scrapes the images from the supplied URL.
   */
  async function runImageScrape() {
    dispatch({ areImagesLoading: true });
    const url = new URL('/api/wishlist/images', DOMAIN);
    url.searchParams.append('url', context.wishlistItem.href);
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
    <FORM.Container>
      <FORM.FieldRow>
        <FORM.Field>
          <FORM.Label>Name:</FORM.Label>
          <Input.Text
            name={'name'}
            value={context.wishlistItem.name}
            onChange={Handlers.text}
            placeholder={'Enter the name'}
          />
        </FORM.Field>
      </FORM.FieldRow>
      <FORM.FieldRow>
        <FORM.Field>
          <FORM.Label>Price:</FORM.Label>
          <Input.Number
            name={'price'}
            value={context.wishlistItem.price}
            onChange={Handlers.number}
            step={0.01}
            leadingIcon={faPoundSign}
          />
        </FORM.Field>
        <FORM.Field>
          <FORM.Label>Quantity:</FORM.Label>
          <Input.Number
            name={'quantity'}
            value={context.wishlistItem.quantity}
            onChange={Handlers.number}
            min={1}
          />
        </FORM.Field>
      </FORM.FieldRow>
      <FORM.FieldRow>
        <FORM.Field>
          <FORM.Label>Reference Link:</FORM.Label>
          <Input.Url
            name={'href'}
            value={context.wishlistItem.href}
            onChange={Handlers.text}
            onKeyDown={onEnterKeyPress}
            leadingIcon={faLink}
            trailingIcon={faSearch}
            trailingIconAction={runImageScrape}
          />
        </FORM.Field>
      </FORM.FieldRow>
      <FORM.FieldRow>
        <FORM.Field>
          <FORM.Label>Image URL:</FORM.Label>
          <Input.Url
            name={'image'}
            value={context.wishlistItem.image}
            onChange={Handlers.text}
            leadingIcon={faLink}
          />
        </FORM.Field>
      </FORM.FieldRow>
      <FORM.FieldRow>
        <FORM.Field>
          <FORM.Label>Comments:</FORM.Label>
          <FORM.Input.Paragraph
            name={'comments'}
            value={context.wishlistItem.comments}
            onChange={Handlers.text}
            placeholder={'Add comments about this wishlist item...'}
            rows={2}
          />
        </FORM.Field>
      </FORM.FieldRow>
      <FORM.FieldRow>
        <FORM.Field>
          <FORM.Label>Reservees:</FORM.Label>
          {Object.keys(context.wishlistItem.reservees).length ? (
            <ul>
              {Object.entries(context.wishlistItem.reservees).map(
                ([email, { anonymous }], key) => {
                  return (
                    <li key={key}>
                      <span>{anonymous ? '[Anonymous]' : email}</span>
                      <Clickable.Icon
                        icon={faTimes}
                        onClick={() => {}}></Clickable.Icon>
                    </li>
                  );
                },
              )}
            </ul>
          ) : (
            <p>No reservees.</p>
          )}
        </FORM.Field>
      </FORM.FieldRow>
      <FORM.FieldRow>
        <FORM.Field>
          <ScrapedImageGrid imageUrls={state.imageUrls} handlers={Handlers} />
        </FORM.Field>
      </FORM.FieldRow>
    </FORM.Container>
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

interface WishlistFormState {
  imageUrls: string[];
  areImagesLoading: boolean;
}

interface ScrapedImageGridProps {
  imageUrls: string[];
  handlers: ReturnType<typeof HandlersV2<WishlistPageState>>;
}