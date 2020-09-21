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

const classes = ['alert', css['toast-message']];

exports.alert = {
  success: (message) => {
    toast(message, { className: classnames('alert-success', classes) });
  },
  error: (message) => {
    toast(message.toString(), {
      className: classnames('alert-danger', classes)
    });
  },
  info: (message) => {
    toast(message, { className: classnames('alert-info', classes) });
  }
};

/**
 * Set the alert to be viewed on the next page change.
 * @param {object} alert - The alert object.
 * @param {string} alert.type - The type of the alert.
 * @param {string} alert.message - The contents of the alert message.
 */
exports.setAlert = ({ type, message }) => {
  sessionStorage.setItem('alert', JSON.stringify({ type, message }));
};

exports.reportError = (error) => {
  if (isDev) {
    this.alert.error(error);
  } else {
    this.alert.error('There was a problem. Please try again later.');
    console.error(error);
  }
};

/** Check whether an alert has been set by {@link setAlert}. */
exports.checkAlert = () => {
  const notification = JSON.parse(sessionStorage.getItem('alert'));
  if (notification) {
    const { type, message } = notification;
    if (type && message) this.alert[type](message);
    sessionStorage.clear();
  }
};
