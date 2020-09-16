import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React from 'react';

export const Icon = ({ prefix, name, className }) => {
  return (
    <FontAwesomeIcon
      icon={[prefix || 'fas', name]}
      className={classnames(className, 'icon')}
    />
  );
};