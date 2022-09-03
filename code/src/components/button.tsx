import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';

import { Icon, Responsive } from 'components/library';
import css from 'styles/components/Button.module.scss';

function Button(props: ButtonProps) {
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
}

export function ButtonSpacer(props: ButtonProps) {
  const { children, className } = props;
  const classes = classnames(css[`button-spacer`], className);
  return <div className={classes}>{children}</div>;
}

export function ConfirmButton(props: ButtonProps) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const classes = classnames(css[`button-confirm-${theme}`], props.className);
  return (
    <Button {...props} className={classes}>
      {props.children}
    </Button>
  );
}

export function CancelButton(props: ButtonProps) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <Button
      {...props}
      className={classnames(props.className, css[`button-cancel-${theme}`])}>
      {props.children}
    </Button>
  );
}

export function DeleteButton(props: ButtonProps) {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <Button {...props} className={css[`button-delete-${theme}`]}>
      {props.children}
    </Button>
  );
}

export function AdminButton(props: AdminButtonProps) {
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
}

export function BackButton(props: ButtonProps) {
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
}

export function InvisibleButton(props: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      className={classnames(css['invisible-button'], props.className)}>
      {props.children}
    </button>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isRequestPending?: boolean;
}

interface AdminButtonProps extends ButtonProps {
  mobileText?: string;
}
