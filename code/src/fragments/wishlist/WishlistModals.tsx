import { signIn, useSession } from 'next-auth/react';
import React, { useContext, useEffect, useMemo } from 'react';
import { mutate } from 'swr';

import Checkbox from 'componentsv2/Checkbox';
import Input from 'componentsv2/Input';
import { Modal } from 'componentsv2/Modal';
import Alert from 'constants/alert';
import HandlersV2 from 'constants/handlersv2';
import Utils from 'constants/utils';
import {
  initialState,
  WishlistPageContext,
} from 'fragments/wishlist/WishlistContext';
import type { ClaimWishlistItemPayload } from 'private/api/wishlist';
import FORM from 'stylesv2/Components/Form.styles';
import ModalStyle from 'stylesv2/Components/Modal.styles';
import WL from 'stylesv2/Pages/Wishlist.styles';
import { ButtonVariant } from 'stylesv2/Variables.styles';

export function DeleteWishlistItemModal() {
  const [context, setContext] = useContext(WishlistPageContext);
  const consign = Utils.createDispatch(setContext);

  /**
   * Deletes the selected wishlist item.
   */
  async function deleteWishlistItem() {
    try {
      if (!context.selectedWishlistItem) {
        throw new Error('No wishlist item selected.');
      }

      await Utils.request('/api/wishlist', {
        method: 'DELETE',
        body: JSON.stringify({ id: context.selectedWishlistItem.id }),
      });
      consign({ isDeletePromptVisible: false });
      await mutate('/api/wishlist');
      Alert.success(
        `You've successfully deleted '${context.selectedWishlistItem.name}'.`,
      );
    } catch (e: any) {
      Alert.error(e.message);
    }
  }

  /**
   * Closes the delete prompt.
   */
  function onCancelDeleteClick() {
    consign({ isDeletePromptVisible: false });
  }

  return (
    <Modal
      visible={context.isDeletePromptVisible}
      body={`Are you sure you want to delete '${context.selectedWishlistItem?.name}'?`}
      footer={
        <React.Fragment>
          <ModalStyle.FooterButton
            variant={ButtonVariant.DELETE}
            onClick={deleteWishlistItem}>
            Delete
          </ModalStyle.FooterButton>
          <ModalStyle.FooterButton
            variant={ButtonVariant.CANCEL}
            onClick={onCancelDeleteClick}>
            Cancel
          </ModalStyle.FooterButton>
        </React.Fragment>
      }
    />
  );
}

export function ClaimWishlistItemModal() {
  const [context, setContext] = useContext(WishlistPageContext);
  const consign = Utils.createDispatch(setContext);

  const { data: session } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (context.isClaimPromptVisible) {
      consign({ claim: initialState.claim });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.isClaimPromptVisible]);

  /**
   * Claims an item by assigning a reservee to it.
   */
  async function claimItem() {
    try {
      if (!context.selectedWishlistItem) {
        throw new Error('No item to claim.');
      }

      if (!email) {
        return signIn('google');
      }

      await Utils.request<ClaimWishlistItemPayload>('/api/wishlist/claim', {
        method: 'PUT',
        body: {
          id: context.selectedWishlistItem.id,
          email,
          quantity: context.selectedWishlistItem.quantity,
          anonymous: false,
        },
      });
      await mutate('/api/wishlist');
    } catch (e: any) {
      Alert.error(e.message);
    } finally {
      consign({ isClaimPromptVisible: false });
    }
  }

  /**
   * Closes the claim prompt.
   */
  function onCancelClaimClick() {
    consign({ isClaimPromptVisible: false });
  }

  return (
    <Modal
      visible={context.isClaimPromptVisible}
      body={<ClaimForm />}
      footer={
        <React.Fragment>
          <ModalStyle.FooterButton
            variant={ButtonVariant.CONFIRM}
            onClick={claimItem}>
            Claim
          </ModalStyle.FooterButton>
          <ModalStyle.FooterButton
            variant={ButtonVariant.CANCEL}
            onClick={onCancelClaimClick}>
            Cancel
          </ModalStyle.FooterButton>
        </React.Fragment>
      }
    />
  );
}

function ClaimForm() {
  const [context, setContext] = useContext(WishlistPageContext);
  const Handlers = HandlersV2(setContext, 'claim');

  const maxClaimQuantity = useMemo(() => {
    if (!context.selectedWishlistItem) return;
    const { reservees, quantity: maxQuantity } = context.selectedWishlistItem;
    const numberOfClaimed = Object.values(reservees).reduce(
      (acc, { quantity }) => {
        return acc + quantity;
      },
      0,
    );
    return maxQuantity - numberOfClaimed;
  }, [context.selectedWishlistItem]);

  if (!context.selectedWishlistItem) return null;

  return (
    <WL.Claim.Container>
      <WL.Claim.Partition>
        <WL.Claim.Text>
          You are about to claim this item:&nbsp;
          <strong>{context.selectedWishlistItem?.name}</strong>.
        </WL.Claim.Text>
        {maxClaimQuantity && maxClaimQuantity >= 2 ? (
          <FORM.FieldRow>
            <FORM.Field>
              <FORM.Label>How many will you claim?</FORM.Label>
              <Input.Number
                name={'quantity'}
                value={context.claim.quantity}
                onChange={Handlers.number}
                min={1}
                max={maxClaimQuantity}
                disabled={maxClaimQuantity === 1}
              />
            </FORM.Field>
          </FORM.FieldRow>
        ) : null}
        <FORM.FieldRow>
          <FORM.Field>
            <Checkbox
              name={'isAnonymous'}
              checked={context.claim.isAnonymous}
              onChange={Handlers.check}
              label={'Claim anonymously?'}
            />
          </FORM.Field>
        </FORM.FieldRow>
      </WL.Claim.Partition>
      <WL.Claim.ImageContainer>
        <WL.Claim.Image
          src={context.selectedWishlistItem.image}
          alt={context.selectedWishlistItem.name}
        />
      </WL.Claim.ImageContainer>
    </WL.Claim.Container>
  );
}
