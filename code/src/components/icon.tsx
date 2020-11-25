import type { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React from 'react';

interface IconProps {
  name: IconName;
  prefix?: IconPrefix;
  withRightSpace?: boolean;
  className?: string;
}

export const Icon = ({
  prefix = 'fas',
  name,
  withRightSpace = true,
  className
}: IconProps) => {
  const classes = classnames(
    className,
    withRightSpace ? 'icon-right-space' : null
  );
  return <FontAwesomeIcon icon={[prefix, name]} className={classes} />;
};
