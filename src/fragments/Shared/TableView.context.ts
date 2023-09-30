import type { SvgIconComponent } from '@mui/icons-material';
import type { Prisma } from '@prisma/client';
import type { UseTRPCQueryResult } from '@trpc/react-query/shared';
import React, { useContext } from 'react';

export function createInitialTableViewState<TEntity extends { id: number }>(
  props?: Partial<TableViewState<TEntity>>,
): TableViewState<TEntity> {
  return {
    additionalMenuItems: [],
    buttons: null,
    deleteConfirmMessage: '',
    editHref: '',
    noEntitiesMessage: '',
    hoveredEntityId: null,
    isDeleteModalVisible: false,
    isDeleteOpLoading: false,
    isMenuVisible: false,
    menuAnchor: null,
    onDeleteConfirm: () => {},
    pageTitle: '',
    queryResult: null,
    selectedEntity: null,
    sort: {
      order: 'desc',
      property: null,
    },
    tableFields: [],

    ...props,
  };
}

export const TableViewContext = React.createContext<
  ReactUseState<TableViewState>
>([createInitialTableViewState(), () => {}]);

export function useTableContext<
  TEntity extends { id: number },
>(): ReactUseState<TableViewState<TEntity>> {
  return useContext<ReactUseState<TableViewState<TEntity>>>(TableViewContext);
}

export interface TableViewState<TEntity extends { id: number } = any> {
  additionalMenuItems: MoreMenuItem[];
  buttons: React.ReactNode;
  deleteConfirmMessage: string;
  editHref: string;
  hoveredEntityId: number | null;
  isDeleteModalVisible: boolean;
  isDeleteOpLoading: boolean;
  isMenuVisible: boolean;
  menuAnchor: HTMLButtonElement | null;
  noEntitiesMessage: string;
  onDeleteConfirm: () => void;
  pageTitle: string;
  queryResult: UseTRPCQueryResult<TEntity[], unknown> | null;
  selectedEntity: TEntity | null;
  sort: TableViewSortValue<TEntity>;
  tableFields: TableField<TEntity>[];
}

export interface MoreMenuItem {
  label: string;
  onClick: () => void;
  Icon: SvgIconComponent;
  disabled?: boolean;
}

interface TableViewSortValue<T> {
  property: keyof T | null;
  order: Prisma.SortOrder;
}
