import {
  faHashtag,
  faImages,
  faLink,
  faPoundSign,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';

import {
  WishlistItemCategory,
  WishlistItemPriority,
  WishlistItemVisibility,
} from 'classes/wishlist/WishlistDAO';
import Clickable from 'components/Clickable';
import Input from 'components/Input';
import { ShortTextArea } from 'components/Textarea';
import HandlerFactory from 'constants/handlers';
import Utils from 'constants/utils';
import FORM from 'styles/Components/Form.styles';

import { WishlistPageContext } from './WishlistContext';

export default function WishlistForm() {
  const [context, setContext] = useContext(WishlistPageContext);
  const consign = Utils.createDispatch(setContext);

  const Handlers = HandlerFactory(setContext, 'wishlistItemRequest');

  return (
    <FORM.Container>
      <FORM.Main>
        <FORM.FieldRow>
          <FORM.Field>
            <FORM.Label>Name:</FORM.Label>
            <Input.Text
              name={'name'}
              value={context.wishlistItemRequest.name}
              onChange={Handlers.text}
              placeholder={'Enter the name'}
            />
          </FORM.Field>
        </FORM.FieldRow>
        <FORM.FieldRow>
          <FORM.Field flex={4}>
            <FORM.Label>Price:</FORM.Label>
            <Input.Number
              name={'price'}
              value={context.wishlistItemRequest.price}
              onChange={Handlers.number}
              step={0.01}
              leadingIcon={faPoundSign}
            />
          </FORM.Field>
          <FORM.Field flex={4}>
            <FORM.Label>Quantity:</FORM.Label>
            <Input.Number
              name={'quantity'}
              value={context.wishlistItemRequest.quantity}
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
              value={context.wishlistItemRequest.visibility}
              onChange={Handlers.select}
            />
          </FORM.Field>
        </FORM.FieldRow>
        <FORM.FieldRow>
          <FORM.Field flex={2}>
            <FORM.Label>Category:</FORM.Label>
            <Input.Select
              name={'category'}
              options={Object.values(WishlistItemCategory)}
              value={context.wishlistItemRequest.category}
              onChange={Handlers.select}
            />
          </FORM.Field>
          <FORM.Field flex={1}>
            <FORM.Label>Priority:</FORM.Label>
            <Input.Select
              name={'priority'}
              options={Object.entries(WishlistItemPriority)
                .filter(([key]) => isNaN(Number(key)))
                .map(([key, value]) => ({
                  label: key,
                  value: String(value),
                }))}
              value={context.wishlistItemRequest.priority}
              onChange={Handlers.select}
            />
          </FORM.Field>
        </FORM.FieldRow>
        <FORM.FieldRow>
          <FORM.Field>
            <FORM.Label>Reference Link:</FORM.Label>
            <Input.Url
              name={'href'}
              value={context.wishlistItemRequest.href}
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
              value={context.wishlistItemRequest.image}
              onChange={Handlers.text}
              leadingIcon={faImages}
            />
          </FORM.Field>
        </FORM.FieldRow>
        <FORM.FieldRow>
          <FORM.Field>
            <FORM.Label>Comments:</FORM.Label>
            <ShortTextArea
              name={'comments'}
              value={context.wishlistItemRequest.comments}
              onChange={Handlers.text}
              placeholder={'Add comments about this wishlist item...'}
              rows={2}
            />
          </FORM.Field>
        </FORM.FieldRow>
        <FORM.FieldRow>
          <FORM.Field>
            <FORM.Label>Purchase Date:</FORM.Label>
            <Input.DatePicker
              name={'purchaseDate'}
              selected={
                context.wishlistItemRequest.purchaseDate
                  ? new Date(context.wishlistItemRequest.purchaseDate)
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
            {Object.keys(context.wishlistItemRequest.reservees).length ? (
              <ul>
                {Object.entries(context.wishlistItemRequest.reservees).map(
                  ([email, { anonymous }], key) => {
                    return (
                      <li key={key}>
                        <span>{anonymous ? '[Anonymous]' : email}</span>
                        <Clickable.Icon
                          icon={faTimes}
                          onClick={() => {
                            const reservees = {
                              ...context.wishlistItemRequest.reservees,
                            };
                            delete reservees[email];
                            consign({
                              wishlistItemRequest: {
                                ...context.wishlistItemRequest,
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
      </FORM.Main>
    </FORM.Container>
  );
}
