import classnames from 'classnames';
import React, {
  useState,
  useEffect,
  MouseEventHandler,
  ReactNode
} from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';

import css from 'src/styles/components/Button.module.scss';

import { Icon } from './icon';
import { Responsive } from './layout';

const Button = (props: Button) => {
  const { children, className, onClick, isRequestPending } = props;
  const [buttonText, setButtonText] = useState(children);

  useEffect(() => {
    setButtonText(isRequestPending ? 'Loading...' : children);
  }, [isRequestPending, children]);

  return (
    <button className={className} onClick={onClick}>
      {buttonText}
    </button>
  );
};

export const ButtonSpacer = (props: Button) => {
  const { children, className } = props;
  const classes = classnames(css[`button-spacer`], className);
  return <div className={classes}>{children}</div>;
};

export const ConfirmButton = (props: Button) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const classes = classnames(css[`button-confirm-${theme}`], props.className);
  return (
    <Button {...props} className={classes}>
      {props.children}
    </Button>
  );
};

export const CancelButton = (props: Button) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <Button
      {...props}
      className={classnames(props.className, css[`button-cancel-${theme}`])}>
      {props.children}
    </Button>
  );
};

export const DeleteButton = (props: Button) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <Button {...props} className={css[`button-delete-${theme}`]}>
      {props.children}
    </Button>
  );
};

export const AdminButton = (props: AdminButton) => {
  const { mobileText, children } = props;
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
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

export const BackButton = (props: Button) => {
  return (
    <InvisibleButton
      {...props}
      className={classnames(css['button-back'], props.className)}>
      <span>
        <Icon name={'chevron-left'} withRightSpace={true} />
      </span>
      <span>{props.children}</span>
    </InvisibleButton>
  );
};

export const InvisibleButton = (props: Button): JSX.Element => {
  return (
    <button
      {...props}
      className={classnames(css['invisible-button'], props.className)}>
      {props.children}
    </button>
  );
};

interface Button {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isRequestPending?: boolean;
}

interface AdminButton extends Button {
  mobileText?: string;
}
