import {
  faHashtag,
  faImages,
  faLink,
  faPoundSign,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';

import {
  WishlistItemPriority,
  WishlistItemVisibility,
} from 'classes/wishlist/WishlistDAO';
import Clickable from 'componentsv2/Clickable';
import Input from 'componentsv2/Input';
import HandlersV2 from 'constants/handlersv2';
import Utils from 'constants/utils';
import FORM from 'stylesv2/Form.styles';

import { WishlistPageContext } from './WishlistContext';

export default function WishlistForm() {
  const [context, setContext] = useContext(WishlistPageContext);
  const consign = Utils.createDispatch(setContext);

  const Handlers = HandlersV2(setContext, 'wishlistItem');

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
        <FORM.Field flex={3}>
          <FORM.Label>Price:</FORM.Label>
          <Input.Number
            name={'price'}
            value={context.wishlistItem.price}
            onChange={Handlers.number}
            step={0.01}
            leadingIcon={faPoundSign}
          />
        </FORM.Field>
        <FORM.Field flex={4}>
          <FORM.Label>Quantity:</FORM.Label>
          <Input.Number
            name={'quantity'}
            value={context.wishlistItem.quantity}
            onChange={Handlers.number}
            min={0}
            leadingIcon={faHashtag}
          />
        </FORM.Field>
        <FORM.Field flex={5}>
          <FORM.Label>Visibility:</FORM.Label>
          <Input.Select
            name={'visibility'}
            options={Object.values(WishlistItemVisibility)}
            value={context.wishlistItem.visibility}
            onChange={Handlers.select}
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
            leadingIcon={faLink}
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
            leadingIcon={faImages}
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
          <FORM.Label>Priority:</FORM.Label>
          <Input.Select
            name={'priority'}
            options={Object.entries(WishlistItemPriority)
              .filter(([key]) => isNaN(Number(key)))
              .map(([key, value]) => ({
                label: key,
                value: String(value),
              }))}
            value={context.wishlistItem.priority}
            onChange={Handlers.select}
          />
        </FORM.Field>
        <FORM.Field>
          <FORM.Label>Purchase Date:</FORM.Label>
          <Input.DatePicker
            name={'purchaseDate'}
            selected={
              context.wishlistItem.purchaseDate
                ? new Date(context.wishlistItem.purchaseDate)
                : null
            }
            onChange={Handlers.date}
            maxDate={new Date()}
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
                        onClick={() => {
                          const reservees = {
                            ...context.wishlistItem.reservees,
                          };
                          delete reservees[email];
                          consign({
                            wishlistItem: {
                              ...context.wishlistItem,
                              reservees,
                            },
                          });
                        }}
                      />
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
    </FORM.Container>
  );
}
