const classnames = require('classnames');
const { toast, cssTransition } = require('react-toastify');

const css = require('styles/components/Alert.module.scss');

const isDev = process.env.NODE_ENV !== 'production';

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
    duration: 500
  })
});

interface Alert {
  type: string;
  message: string;
}

const classes = ['alert', css['toast-message']];

export const alert = {
  success: (message: string) => {
    toast(message, { className: classnames('alert-success', classes) });
  },
  error: (message: string | Error) => {
    toast(message.toString(), {
      className: classnames('alert-danger', classes)
    });
  },
  info: (message: string) => {
    toast(message, { className: classnames('alert-info', classes) });
  }
};

export const setAlert = ({ type, message }: Alert): void => {
  sessionStorage.setItem('alert', JSON.stringify({ type, message }));
};

export const reportError = (error: Error): void => {
  if (isDev) {
    alert.error(error);
  } else {
    alert.error('There was a problem. Please try again later.');
    console.error(error);
  }
};

/** Check whether an alert has been set by {@link setAlert}. */
export const checkForSetAlerts = (): void => {
  const notification = JSON.parse(sessionStorage.getItem('alert'));
  if (notification) {
    const { type, message } = notification;
    if (type && message) alert[type](message);
    sessionStorage.clear();
  }
};
