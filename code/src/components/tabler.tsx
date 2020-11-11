import { IconName } from '@fortawesome/fontawesome-svg-core';
import React, { CSSProperties, memo, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { forceCheck } from 'react-lazyload';
import { RootStateOrAny, useSelector } from 'react-redux';

import { Icon } from './icon';
import CloudImage, { AspectRatio } from './image';
import { Responsive } from './layout';
import { LazyLoader } from './loader';
import { Title } from './text';
import { Fader } from './transitioner';
import css from 'src/styles/components/Tabler.module.scss';

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
    <ItemRows {...props} centerAlignedIndices={centerAlignedIndices} />
  );

  return (
    <>
      <div className={css['tabler-container']}>
        <TableHeading heading={heading} numOfItems={items.length} />
        <Responsive
          defaultView={
            <div className={css['tabler-grid']}>
              <HeaderRow {...props} />
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

const HeaderRow = ({ columns, distribution }: TablerHeaderRow) => {
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

const ItemRows = ({
  centerAlignedIndices,
  distribution,
  items
}: TablerRows) => {
  return (
    <>
      {items.map((fields, key) => {
        return (
          <Item
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

const Item = memo(
  ({ centerAlignedIndices, fields, distribution, index }: TablerItem) => {
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
          <ItemFields
            fields={fields}
            centerAlignedIndices={centerAlignedIndices}
          />
          <Responsive mobileView={<CrudButtons fields={fields} />} />
        </Fader>
      </LazyLoader>
    );
  }
);

const ItemFields = ({ fields, centerAlignedIndices }: TablerItemFields) => {
  return fields
    .filter((e) => e)
    .map((field: TablerItemField, key: number) => {
      let [value, { type, imageOptions = {}, subvalue }] = field;

      switch (type) {
        case TablerType.IMAGE:
          value = (
            <CloudImage src={value} containerClassName={imageOptions.css} />
          );
          break;
      }

      const isCenterAligned = centerAlignedIndices.includes(key);
      const style = { textAlign: isCenterAligned ? 'center' : 'left' };

      return (
        <Responsive
          key={key}
          defaultView={
            <DefaultView style={style} value={value} subvalue={subvalue} />
          }
          mobileView={<MobileView field={field} key={key} />}
        />
      );
    });
};

/**
 * The default view for each component in {@see ItemFields}.
 * @param {object} props - The component props.
 * @param {string} props.value - The value to be displayed.
 * @param {object} props.style - Styling for the field.
 * @param {string} [props.subvalue] - A possible subvalue to be displayed under the value.
 * @returns {React.Component} - The component.
 */
const DefaultView = ({ value, style, subvalue }) => {
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

/**
 * The mobile view for each component in {@see ItemFields}.
 * @param {object} props - The component props.
 * @param {TablerField} props.field - Each field in the row.
 * @returns {React.Component} - The component.
 */
const MobileView = ({ field }: TablerItemField) => {
  let [
    value,
    {
      icon,
      type,
      hideIfEmpty = false,
      hideOnMobile = false,
      imageOptions = {
        css: '',
        lazy: ''
      }
    } = {}
  ] = field;

  if (!value && hideIfEmpty) return null;
  if (hideOnMobile) return null;

  switch (type) {
    case TablerType.BUTTON:
      return null;
    case TablerType.IMAGE:
      return <CloudImage src={value} containerClassName={imageOptions.css} />;
    case TablerType.INDEX:
      return <div className={css['tabler-item-index']}>{value}</div>;
    default:
      return (
        <div className={css['tabler-field-mobile']}>
          <span>
            <Icon name={icon} />
          </span>
          <span>{value}</span>
        </div>
      );
  }
};

/**
 * The CRUD buttons for each {@see Item}.
 * @param {object} props - The component props.
 * @param {TablerField[]} props.fields - All fields of the {@see Item}.
 * @returns {React.Component} - The component.
 */
const CrudButtons = memo(({ fields }) => {
  return (
    <div className={css['tabler-item-buttons']}>
      {fields
        .filter(([, options]) => options.type === TablerType.BUTTON)
        .map(([button], key) => {
          return <span key={key}>{button}</span>;
        })}
    </div>
  );
});

export class TablerColumnHeader {
  label: string;
  centerAlign: boolean;

  constructor(label: string, options: TablerColumnHeaderOptions = {}) {
    this.label = label;
    this.centerAlign = options.centerAlign;
  }
}

export class TablerItemField {
  value: any;
  options: TablerItemFieldOptions;

  constructor(value: any, options: TablerItemFieldOptions = {}) {
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
  items: TablerItem[];
  itemsLoaded: boolean;
}

interface TablerColumnHeaderOptions {
  centerAlign?: boolean;
}

interface TablerHeaderRow {
  columns: TablerColumnHeader[];
  distribution: string;
}

interface TablerRows {
  centerAlignedIndices: number[];
  columns: TablerColumnHeader[];
  distribution: string;
  items: TablerItem[];
}

interface TablerItem {
  centerAlignedIndices: number[];
  distribution: string;
  fields: TablerItemField[];
  index: number;
}

interface TablerItemFields {
  centerAlignedIndices: number[];
  fields: TablerItemField[];
}

interface TablerItemFieldOptions {
  type?: TablerType;
  icon?: IconName;
  subvalue?: string
  hideIfEmpty?: boolean;
  hideOnMobile?: boolean;
  imageOptions?: TablerImageOptions;
}

interface TablerImageOptions {
  css: string;
  aspectRatio: AspectRatio;
}
