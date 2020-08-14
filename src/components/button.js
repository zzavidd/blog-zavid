import classnames from 'classnames';
import React, { useState } from 'react';

import css from 'styles/components/Button.module.scss';

/**
 * The base template for buttons.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
const Button = (props) => {
  const { children, className, onClick, isRequestPending = false } = props;
  const [buttonText, setButtonText] = useState(children);

  return (
    <button
      className={className}
      onClick={() => {
        onClick();
        setButtonText(isRequestPending ? 'Loading...' : buttonText);
      }}>
      {buttonText}
    </button>
  );
};

/**
 * A form confirmation button.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const ConfirmButton = (props) => {
  return (
    <Button {...props} className={css['button-confirm']}>
      {props.children}
    </Button>
  );
};

/**
 * A form cancellation button.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const CancelButton = (props) => {
  return (
    <Button {...props} className={css['button-cancel']}>
      {props.children}
    </Button>
  );
};

/**
 * A delete button.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const DeleteButton = (props) => {
  return (
    <Button {...props} className={css['button-delete']}>
      {props.children}
    </Button>
  );
};

/**
 * An addition button.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const AdminButton = (props) => {
  return (
    <Button {...props} className={css['button-admin']}>
      {props.children}
    </Button>
  );
};

/**
 * An invisible button.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const InvisibleButton = (props) => {
  return (
    <button {...props} className={classnames(css['invisible-button'], props.className)}>
      {props.children}
    </button>
  );
};
