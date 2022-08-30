import React from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';
import { zComponents } from 'zavid-modules';
import type { TablerProps } from 'zavid-modules/_dist/components/tabler';

import tablerClasses from 'styles/components/Tabler.module.scss';

const {
  TablerColumnHeader,
  TablerItemCell,
  TablerFieldType,
  Icon,
  LazyLoader,
  Responsive,
  ScreenWidth,
} = zComponents;

function Tabler<L extends number>({
  columns,
  distribution,
  heading,
  items,
  itemsLoaded,
}: TablerProps<L>) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <zComponents.Tabler<L>
      heading={heading}
      itemsLoaded={itemsLoaded}
      emptyMessage={'No entries found.'}
      columns={columns}
      items={items}
      distribution={distribution}
      classes={{
        tablerContainer: tablerClasses['tabler-container'],
        tablerLoading: tablerClasses['tabler-loading'],
        tablerDefaultGrid: tablerClasses['tabler-grid'],
        tablerMobileList: tablerClasses['tabler-list'],
        tablerHeadingWrapper: tablerClasses[`tabler-heading-wrapper-${theme}`],
        tablerHeadingTitle: tablerClasses['tabler-heading'],
        tablerHeadingItemCount: tablerClasses['tabler-item-count'],
        tablerRowHeader: tablerClasses[`tabler-header-row-${theme}`],
        tablerRowItem: tablerClasses[`tabler-item-row-${theme}`],
        tablerItemValue: tablerClasses['tabler-item-value'],
        tablerItemSubvalue: tablerClasses['tabler-item-subvalue'],
        tablerItemIndex: tablerClasses['tabler-item-index'],
        tablerMobileField: tablerClasses['tabler-field-mobile'],
        tablerCrudButtons: tablerClasses['tabler-item-buttons'],
      }}
    />
  );
}

export {
  Tabler,
  TablerColumnHeader,
  TablerItemCell,
  TablerFieldType,
  Icon,
  LazyLoader,
  Responsive,
  ScreenWidth,
};
