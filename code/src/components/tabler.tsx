import { IconName } from '@fortawesome/fontawesome-svg-core';
import React, { CSSProperties, memo, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { forceCheck } from 'react-lazyload';
import { RootStateOrAny, useSelector } from 'react-redux';

import css from 'src/styles/components/Tabler.module.scss';

import { Icon } from './icon';
import CloudImage, { AspectRatio } from './image';
import { Responsive } from './layout';
import { LazyLoader } from './loader';
import { Title } from './text';
import { Fader } from './transitioner';

export default (props: Tabler) => {
  const {
    columns,
    heading = '',
    items,
    emptyMessage = '',
    itemsLoaded
  } = props;

  if (!itemsLoaded) {
    return (
      <div className={css['tabler-loading']}>
        <Spinner animation={'border'} size={'sm'} />
        <span>Loading...</span>
      </div>
    );
  } else if (!items.length) {
    return (
      <div className={css['tabler-loading']}>
        <span>{emptyMessage}</span>
      </div>
    );
  }

  const centerAlignedIndices = columns.map((header, key) => {
    const { centerAlign } = header;
    if (centerAlign) return key;
  });

  const TablerItemRows = (): JSX.Element => (
    <TablerItemList {...props} centerAlignedIndices={centerAlignedIndices} />
  );

  return (
    <>
      <div className={css['tabler-container']}>
        <TableHeading heading={heading} numOfItems={items.length} />
        <Responsive
          defaultView={
            <div className={css['tabler-grid']}>
              <TablerHeaderRow {...props} />
              <TablerItemRows />
            </div>
          }
          mobileView={
            <div className={css['tabler-list']}>
              <TablerItemRows />
            </div>
          }
        />
      </div>
    </>
  );
};

interface TablerHeading {
  heading: string;
  numOfItems: number;
}

const TableHeading = ({ heading, numOfItems }: TablerHeading) => {
  if (!heading) return null;
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const plurality = numOfItems === 1 ? 'result' : 'results';
  return (
    <div className={css[`tabler-heading-wrapper-${theme}`]}>
      <Title className={css['tabler-heading']}>{heading}</Title>
      <div className={css['tabler-item-count']}>
        {numOfItems} {plurality}
      </div>
    </div>
  );
};

const TablerHeaderRow = ({ columns, distribution }: TablerHeaderRow) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <div
      className={css[`tabler-header-row-${theme}`]}
      style={{ gridTemplateColumns: distribution }}>
      {columns.map((column: TablerColumnHeader, key: number) => {
        const { label, centerAlign = false } = column;
        const style: CSSProperties = {
          textAlign: centerAlign ? 'center' : 'left'
        };
        return (
          <span style={style} key={key}>
            {label}
          </span>
        );
      })}
    </div>
  );
};

const TablerItemList = ({
  centerAlignedIndices,
  distribution,
  items
}: TablerItemList) => {
  return (
    <>
      {items.map((fields, key) => {
        return (
          <TablerItemRow
            centerAlignedIndices={centerAlignedIndices}
            distribution={{ gridTemplateColumns: distribution }}
            fields={fields}
            index={key}
            key={key}
          />
        );
      })}
    </>
  );
};

const TablerItemRow = memo(
  ({ centerAlignedIndices, fields, distribution, index }: TablerItemRow) => {
    const theme = useSelector(({ theme }: RootStateOrAny) => theme);
    const [isLoaded, setLoaded] = useState(false);
    useEffect(() => {
      forceCheck();
      setLoaded(true);
    }, [isLoaded]);

    const [isInView, setInView] = useState(false);

    return (
      <LazyLoader setInView={setInView} height={200} offset={100}>
        <Fader
          key={index}
          determinant={isInView}
          duration={500}
          delay={30}
          className={css[`tabler-item-row-${theme}`]}
          postTransitions={'background-color .1s ease'}
          style={distribution}>
          <TablerItemFields
            fields={fields}
            centerAlignedIndices={centerAlignedIndices}
          />
          <Responsive mobileView={<CrudButtons fields={fields} />} />
        </Fader>
      </LazyLoader>
    );
  }
);

const TablerItemFields = ({
  fields,
  centerAlignedIndices
}: TablerItemFields) => {
  const itemFields = fields
    .filter((e) => e)
    .map((cell: TablerItemCell, key: number) => {
      let { value } = cell;
      const {
        type,
        imageOptions = {
          css: ''
        },
        subvalue = ''
      } = cell.options;

      switch (type) {
        case TablerType.IMAGE:
          value = (
            <CloudImage
              src={value as string}
              containerClassName={imageOptions.css}
            />
          );
          break;
      }

      const isCenterAligned = centerAlignedIndices.includes(key);
      const style = { textAlign: isCenterAligned ? 'center' : 'left' };

      return (
        <Responsive
          key={key}
          defaultView={
            <DefaultView
              style={style as CSSProperties}
              value={value}
              subvalue={subvalue}
            />
          }
          mobileView={<MobileView field={cell} key={key} />}
        />
      );
    });

  return <>{itemFields}</>;
};

const DefaultView = ({ value, style, subvalue }: DefaultView) => {
  if (!subvalue)
    return (
      <span className={css['tabler-item-value']} style={style}>
        {value}
      </span>
    );

  return (
    <div className={css['tabler-item-value']}>
      <span style={style}>{value}</span>
      <div className={css['tabler-item-subvalue']}>{subvalue}</div>
    </div>
  );
};

const MobileView = ({ field }: MobileView) => {
  const {
    value,
    options: {
      icon,
      type,
      hideIfEmpty = false,
      hideOnMobile = false,
      imageOptions = {
        css: '',
        lazy: ''
      }
    }
  } = field;

  if (!value && hideIfEmpty) return null;
  if (hideOnMobile) return null;

  switch (type) {
    case TablerType.BUTTON:
      return null;
    case TablerType.IMAGE:
      return (
        <CloudImage
          src={value as string}
          containerClassName={imageOptions.css}
        />
      );
    case TablerType.INDEX:
      return <div className={css['tabler-item-index']}>{value}</div>;
    default:
      return (
        <div className={css['tabler-field-mobile']}>
          <span>
            <Icon name={icon!} />
          </span>
          <span>{value}</span>
        </div>
      );
  }
};

const CrudButtons = memo(({ fields }: CrudButtons) => {
  return (
    <div className={css['tabler-item-buttons']}>
      {fields
        .filter(({ options }) => options.type === TablerType.BUTTON)
        .map(({ value }, key) => {
          return <span key={key}>{value}</span>;
        })}
    </div>
  );
});

export class TablerColumnHeader {
  label: string;
  centerAlign: boolean;

  constructor(label: string, options: TablerColumnHeaderOptions = {}) {
    this.label = label;
    this.centerAlign = options.centerAlign ?? false;
  }
}

export class TablerItemCell {
  value: TableItemValue;
  options: TablerItemFieldOptions;

  constructor(value: TableItemValue, options: TablerItemFieldOptions = {}) {
    this.value = value;
    this.options = options;
  }
}

export enum TablerType {
  BUTTON = 'button',
  IMAGE = 'image',
  INDEX = 'index'
}

interface Tabler {
  columns: TablerColumnHeader[];
  distribution: string;
  emptyMessage: string;
  heading: string;
  items: TablerItemCell[][];
  itemsLoaded: boolean;
}

interface TablerItemList extends Tabler {
  centerAlignedIndices: CenterAlignedIndices;
}

interface TablerColumnHeaderOptions {
  centerAlign?: boolean;
}

interface TablerHeaderRow {
  columns: TablerColumnHeader[];
  distribution: string;
}

interface TablerItemRow {
  centerAlignedIndices: CenterAlignedIndices;
  distribution: CSSProperties;
  fields: TablerItemCell[];
  index: number;
}

interface TablerItemFields {
  centerAlignedIndices: CenterAlignedIndices;
  fields: TablerItemCell[];
}

interface TablerItemFieldOptions {
  type?: TablerType;
  icon?: IconName;
  subvalue?: string;
  hideIfEmpty?: boolean;
  hideOnMobile?: boolean;
  imageOptions?: TablerImageOptions;
}

interface TablerImageOptions {
  css?: string;
  aspectRatio?: AspectRatio;
}

interface DefaultView {
  value: TableItemValue;
  subvalue: string;
  style: CSSProperties;
}

interface MobileView {
  field: TablerItemCell;
}

interface CrudButtons {
  fields: TablerItemCell[];
}

type TableItemValue = string | number | JSX.Element | null | undefined;
type CenterAlignedIndices = (number | undefined)[];
