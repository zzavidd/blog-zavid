import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

export const Icon = ({ prefix, name, className }) => {
  return (
    <FontAwesomeIcon
      icon={[prefix || 'fas', name]}
      className={classnames(className, 'icon')}
    />
  );
};

export const ThemedIcon = (props) => {
  const theme = useSelector(({ theme }) => theme);
  return (
    <Icon {...props} className={classnames(props.className, `icon-${theme}`)} />
  );
};
