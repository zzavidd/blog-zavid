import classnames from 'classnames';
import { toast, cssTransition } from 'react-toastify';

import css from 'styles/components/Alert.module.scss';

toast.configure({
  autoClose: 2500,
  className: css['toast-container'],
  closeButton: false,
  draggable: false,
  hideProgressBar: true,
  position: toast.POSITION.BOTTOM_CENTER,
  transition: cssTransition({
    enter: css['toast-transition-fadein'],
    exit: css['toast-transition-fadeout'],
    duration: 500,
  }),
});

interface Alert {
  type: AlertType;
  message: string;
}

export enum AlertType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

const classes = ['alert', css['toast-message']];

export const alert = {
  success: (message: string): void => {
    toast(message, { className: classnames('alert-success', classes) });
  },
  error: (message: string | Error): void => {
    toast(message.toString(), {
      className: classnames('alert-danger', classes),
    });
  },
  info: (message: string): void => {
    toast(message, { className: classnames('alert-info', classes) });
  },
};

export const setAlert = ({ type, message }: Alert): void => {
  sessionStorage.setItem('alert', JSON.stringify({ type, message }));
};

export function reportError(message: string, asIs?: boolean): void {
  if (process.env.NEXT_PUBLIC_APP_ENV === 'production' && !asIs) {
    alert.error('There was a problem. Please try again later.');
    console.error(message);
  } else {
    alert.error(message);
  }
}

export const checkForSetAlerts = (): void => {
  const notification: Alert = JSON.parse(
    sessionStorage.getItem('alert') as string,
  );
  if (notification) {
    const { type, message } = notification;
    if (type && message) alert[type](message);
    sessionStorage.clear();
  }
};
