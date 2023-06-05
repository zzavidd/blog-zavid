import type { SvgIconComponent } from '@mui/icons-material';
import type { Prisma } from '@prisma/client';
import type { UseTRPCQueryResult } from '@trpc/react-query/shared';
import React, { useContext } from 'react';

export function createInitialTableViewState<T extends { id: number }>(
  props?: Partial<TableViewState<T>>,
): TableViewState<T> {
  return {
    additionalMenuItems: [],
    deleteConfirmMessage: '',
    editHref: '',
    hoveredEntityId: null,
    isDeleteModalVisible: false,
    isDeleteOpLoading: false,
    isMenuVisible: false,
    menuAnchor: null,
    onDeleteConfirm: () => {},
    props: null,
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

export function useTableContext<T extends { id: number }>(): ReactUseState<
  TableViewState<T>
> {
  return useContext<ReactUseState<TableViewState<T>>>(TableViewContext);
}

export interface TableViewState<T extends { id: number } = any> {
  additionalMenuItems: MoreMenuItem[];
  deleteConfirmMessage: string;
  editHref: string;
  hoveredEntityId: number | null;
  isDeleteModalVisible: boolean;
  isDeleteOpLoading: boolean;
  isMenuVisible: boolean;
  menuAnchor: HTMLButtonElement | null;
  onDeleteConfirm: () => void;
  queryResult: UseTRPCQueryResult<T[], unknown> | null;
  props: TableViewProps | null;
  selectedEntity: T | null;
  sort: TableViewSortValue<T>;
  tableFields: TableField<T>[];
}

export interface MoreMenuItem {
  label: string;
  onClick: () => void;
  Icon: SvgIconComponent;
}

interface TableViewProps {
  addButtonText: string;
  addButtonHref: string;
  noEntitiesMessage: string;
  pageTitle: string;
}

interface TableViewSortValue<T> {
  property: keyof T | null;
  order: Prisma.SortOrder;
}
