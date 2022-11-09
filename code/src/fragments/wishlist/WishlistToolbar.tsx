import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { WishlistStatic } from 'classes/wishlist/WishlistStatic';
import type { AppState } from 'constants/reducers';
import { AppActions } from 'constants/reducers';
import Utils from 'constants/utils';
import AdminLock from 'fragments/AdminLock';
import WL from 'styles/Pages/Wishlist.styles';

import { WishlistPageContext } from './WishlistContext';
import { SORT_OPTIONS } from './WishlistSort';

export default function WishlistToolbar() {
  const [context, setContext] = useContext(WishlistPageContext);
  const consign = Utils.createDispatch(setContext);
  const { sortProperty, sortOrderAscending } = useSelector(
    (state: AppState) => state.local.wishlist,
  );
  const appDispatch = useDispatch();

  /**
   * Opens the form tray when the action button is clicked.
   */
  function onAddButtonClick() {
    consign({
      isFormTrayOpen: true,
      selectedWishlistItem: null,
      wishlistItem: WishlistStatic.initial(),
    });
  }

  function onSortPropertyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    appDispatch(
      AppActions.setWishlistSort({
        name: 'sortProperty',
        value: e.target.value as SortProperty,
      }),
    );
  }

  function onSortOrderChange(e: React.ChangeEvent<HTMLSelectElement>) {
    appDispatch(
      AppActions.setWishlistSort({
        name: 'sortOrderAscending',
        value: e.target.value === 'ASC',
      }),
    );
  }

  return (
    <WL.Toolbar.Container>
      <WL.Toolbar.SortBox>
        <WL.Toolbar.Dropdown
          value={sortProperty}
          options={SORT_OPTIONS}
          onChange={onSortPropertyChange}
        />
        <WL.Toolbar.Dropdown
          value={sortOrderAscending ? 'ASC' : 'DESC'}
          options={['ASC', 'DESC']}
          onChange={onSortOrderChange}
        />
      </WL.Toolbar.SortBox>
      <AdminLock>
        <WL.Toolbar.AddButton
          onClick={onAddButtonClick}
          visible={!context.isFormTrayOpen}>
          <FontAwesomeIcon icon={faPlus} />
          <span>Add Wishlist Item</span>
        </WL.Toolbar.AddButton>
      </AdminLock>
    </WL.Toolbar.Container>
  );
}
