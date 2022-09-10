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

const classes = ['alert', css['toast-message']];

namespace Alert {
  /**
   * Show success alert.
   * @param message The message to show.
   */
  export function success(message: string): void {
    toast(message, { className: classnames('alert-success', classes) });
  }

  /**
   * Show error alert.
   * @param message The message to show.
   */
  export function error(message: string | Error): void {
    toast(message.toString(), {
      className: classnames('alert-danger', classes),
    });
  }

  /**
   * Show information alert.
   * @param message The message to show.
   */
  export function info(message: string): void {
    toast(message, { className: classnames('alert-info', classes) });
  }

  /**
   * Set an alert for the next page.
   * @param props The alert props.
   */
  export function set({ type, message }: AlertProps): void {
    sessionStorage.setItem('alert', JSON.stringify({ type, message }));
  }

  /**
   * Check for set alerts.
   */
  export function check(): void {
    const notification: AlertProps = JSON.parse(
      sessionStorage.getItem('alert') as string,
    );
    if (notification) {
      const { type, message } = notification;
      if (type && message) {
        Alert[type](message);
      }
      sessionStorage.clear();
    }
  }

  /**
   * Display an error message. Explicit if specified or on development only.
   * @param message The message to display.
   * @param shouldBeExplicit True if the raw error message should be displayed.
   */
  export function report(message: string, shouldBeExplicit?: boolean): void {
    if (process.env.NEXT_PUBLIC_APP_ENV === 'production' && !shouldBeExplicit) {
      Alert.error('There was a problem. Please try again later.');
      console.error(message);
    } else {
      Alert.error(message);
    }
  }
}

export enum AlertType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

export default Alert;

interface AlertProps {
  type: AlertType;
  message: string;
}
