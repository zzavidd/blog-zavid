import classnames from 'classnames';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Responsive } from 'components/layout';
import css from 'styles/components/Button.module.scss';

import { Icon } from './icon';

/**
 * The base template for buttons.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
const Button = (props) => {
  const { children, className, onClick, isRequestPending } = props;
  const [buttonText, setButtonText] = useState(children);

  useEffect(() => {
    setButtonText(isRequestPending ? 'Loading...' : children);
  }, [isRequestPending]);

  return (
    <button className={className} onClick={onClick}>
      {buttonText}
    </button>
  );
};

/**
 * A container for spacing child buttons.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const ButtonSpacer = (props) => {
  const { children, className } = props;
  const classes = classnames(css[`button-spacer`], className);
  return <div className={classes}>{children}</div>;
};

/**
 * A form confirmation button.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const ConfirmButton = (props) => {
  const theme = useSelector(({ theme }) => theme);
  return (
    <Button {...props} className={css[`button-confirm-${theme}`]}>
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
  const theme = useSelector(({ theme }) => theme);
  return (
    <Button {...props} className={css[`button-cancel-${theme}`]}>
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
  const theme = useSelector(({ theme }) => theme);
  return (
    <Button {...props} className={css[`button-delete-${theme}`]}>
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
  const { mobileText, children } = props;
  const theme = useSelector(({ theme }) => theme);
  const classes = classnames(css[`button-admin-${theme}`], props.className);

  return (
    <Responsive
      defaultView={
        <button {...props} className={classes}>
          {children}
        </button>
      }
      mobileView={
        <button {...props} className={classes}>
          {mobileText || children}
        </button>
      }
    />
  );
};

export const BackButton = (props) => {
  return (
    <InvisibleButton
      {...props}
      className={classnames(css['button-back'], props.className)}>
      <span>
        <Icon name={'chevron-left'} />
      </span>
      <span>{props.children}</span>
    </InvisibleButton>
  );
};

/**
 * An invisible button.
 * @param {object} props - The component props.
 * @returns {React.Component} The component.
 */
export const InvisibleButton = (props) => {
  return (
    <button
      {...props}
      className={classnames(css['invisible-button'], props.className)}>
      {props.children}
    </button>
  );
};
