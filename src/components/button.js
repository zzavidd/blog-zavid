import React from 'react';

import css from 'styles/components/Button.module.scss';

/**
 * A form confirmation button.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const ConfirmButton = (props) => {
  return (
    <button {...props} className={css['button-confirm']}>
      {props.children}
    </button>
  );
};

/**
 * A form cancellation button.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const CancelButton = (props) => {
  return (
    <button {...props} className={css['button-cancel']}>
      {props.children}
    </button>
  );
};

/**
 * A delete button.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const DeleteButton = (props) => {
  return (
    <button {...props} className={css['button-delete']}>
      {props.children}
    </button>
  );
};
/**
 * An invisible button.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const InvisibleButton = (props) => {
  return (
    <button {...props} className={css['invisible-button']}>
      {props.children}
    </button>
  );
};
