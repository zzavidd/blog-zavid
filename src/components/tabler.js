import React, { memo, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { forceCheck } from 'react-lazyload';
import { useSelector } from 'react-redux';

import { Icon } from 'components/icon.js';
import CloudImage from 'components/image.js';
import { Responsive } from 'components/layout';
import { LazyLoader } from 'components/loader.js';
import { Title } from 'components/text.js';
import { Fader } from 'components/transitioner';
import css from 'styles/components/Tabler.module.scss';

/** The mobile view of each field. */
class TablerField {
  /**
   * Create a point.
   * @param {any} value - The value of the field.
   * @param {object} options - The options for the field.
   * @param {string} options.icon - The name of the icon to display beside the field.
   * @param {string} [options.type] - The type of the field.
   * @param {boolean} [options.hideIfEmpty] - Hide the field if the value is empty.
   * @param {boolean} [options.hideOnMobile] - Hide the field when shown on mobile.
   * @param {object} [options.imageOptions] - The options for an image.
   * @param {string} [options.imageOptions.css] - The CSS for the image.
   * @param {object} [options.imageOptions.lazy] - The lazy option for the image.
   */
  constructor(value = '', options = {}) {
    this.value = value;
    this.options = options;
    return this;
  }
}

/**
 * A component for tabling entities.
 * @param {object} props - The component props.
 * @param {any[]} props.columns - The table column headings.
 * @param {string} props.distribution - The CSS grid-template-columns value.
 * @param {string} props.emptyMessage - The message shown when there are no rows.
 * @param {string} [props.heading] - The heading to be shown above the table.
 * @param {any[]} props.items - The items to populate the table.
 * @param {boolean} props.itemsLoaded - Indicates if items are loaded.
 * @returns {React.Component} - The component.
 */
const Tabler = (props) => {
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

  const centerAlignedIndices = columns.map(([, options = {}], key) => {
    const { centerAlign = false } = options;
    if (centerAlign) return key;
  });

  return (
    <>
      <div className={css['tabler-container']}>
        <TableHeading heading={heading} numOfItems={items.length} />
        <Responsive
          defaultView={
            <div className={css['tabler-grid']}>
              <HeaderRow {...props} />
              <ItemRows
                {...props}
                centerAlignedIndices={centerAlignedIndices}
              />
            </div>
          }
          mobileView={
            <div className={css['tabler-list']}>
              <ItemRows
                {...props}
                centerAlignedIndices={centerAlignedIndices}
              />
            </div>
          }
        />
      </div>
    </>
  );
};

/**
 * A component for tabling entities.
 * @param {object} props - The component props.
 * @param {string} props.heading - The heading to be shown above the table.
 * @param {number} props.numOfItems - The number of items.
 * @returns {React.Component} - The component.
 */
const TableHeading = ({ heading, numOfItems }) => {
  if (!heading) return null;
  const theme = useSelector(({ theme }) => theme);
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

/**
 * The header row for the table.
 * @param {object} props - The component props.
 * @param {any[]} props.columns - The table column headings.
 * @param {string} props.distribution - The CSS grid-template-columns value.
 * @returns {React.Component} The component.
 */
const HeaderRow = ({ columns, distribution }) => {
  const theme = useSelector(({ theme }) => theme);
  return (
    <div
      className={css[`tabler-header-row-${theme}`]}
      style={{ gridTemplateColumns: distribution }}>
      {columns.map((column, key) => {
        const [value, options = {}] = column;
        const { centerAlign = false } = options;
        const style = { textAlign: centerAlign ? 'center' : 'left' };
        return (
          <span style={style} key={key}>
            {value}
          </span>
        );
      })}
    </div>
  );
};

/**
 * The items rows for the table.
 * @param {object} props - The component props.
 * @param {number[]} props.centerAlignedIndices - The list of indices with center-aligned column headers.
 * @param {string} props.distribution - The CSS grid-template-columns value.
 * @param {object} props.items - The map of items for rows.
 * @returns {React.Component[]} The list of row components.
 */
const ItemRows = ({ centerAlignedIndices, distribution, items }) => {
  return items.map((fields, key) => {
    return (
      <Item
        centerAlignedIndices={centerAlignedIndices}
        distribution={{ gridTemplateColumns: distribution }}
        fields={fields}
        index={key}
        key={key}
      />
    );
  });
};

/**
 * Each row in the {@see Tabler} component.
 * @param {object} props - The component props.
 * @param {number[]} props.centerAlignedIndices - The list of indices with center-aligned column headers.
 * @param {string} props.distribution - The CSS grid-template-columns value.
 * @param {TablerField[]} props.fields - Each field in the row.
 * @param {number} props.index - The row's index.
 * @returns {React.Component} - The component.
 */
const Item = memo(({ centerAlignedIndices, fields, distribution, index }) => {
  const theme = useSelector(({ theme }) => theme);
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
        {fields
          .filter((e) => e)
          .map((field, key) => {
            let [value, { type, imageOptions = {}, subvalue }] = field;

            switch (type) {
              case TYPE.IMAGE:
                value = (
                  <CloudImage
                    src={value}
                    containerClassName={imageOptions.css}
                    lazy={imageOptions.lazy}
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
                    style={style}
                    value={value}
                    subvalue={subvalue}
                  />
                }
                mobileView={
                  <>
                    <MobileView field={field} key={key} />
                    <CrudButtons fields={fields} />
                  </>
                }
              />
            );
          })}
      </Fader>
    </LazyLoader>
  );
});

const DefaultView = ({ style, subvalue, value }) => {
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
 * The mobile view for each {@see Item}.
 * @param {object} props - The component props.
 * @param {TablerField} props.field - Each field in the row.
 * @returns {React.Component} - The component.
 */
const MobileView = ({ field }) => {
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
    case TYPE.BUTTON:
      return null;
    case TYPE.IMAGE:
      return (
        <CloudImage
          src={value}
          containerClassName={imageOptions.css}
          lazy={imageOptions.lazy}
        />
      );
    case TYPE.INDEX:
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
        .filter(([, options]) => options.type === 'button')
        .map(([button], key) => {
          return <span key={key}>{button}</span>;
        })}
    </div>
  );
});

export const TYPE = {
  BUTTON: 'button',
  IMAGE: 'image',
  INDEX: 'index'
};

export default Tabler;
