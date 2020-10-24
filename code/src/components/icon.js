import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React from 'react';

export const Icon = ({ prefix, name, withRightSpace = true, className }) => {
  const classes = classnames(
    className,
    withRightSpace ? 'icon-right-space' : null
  );
  return <FontAwesomeIcon icon={[prefix || 'fas', name]} className={classes} />;
};