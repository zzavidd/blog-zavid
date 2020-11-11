import React, { useState } from 'react';
import LazyLoad from 'react-lazyload';
import VisibilitySensor from 'react-visibility-sensor';

import { ReactHook } from 'src/constants/hooks';

interface LazyLoaderProps {
  children: JSX.Element;
  setInView: ReactHook<boolean>;
  height: number;
  offset: number;
}

/**
 * The component wrapper used to lazy load elements.
 * @param {object} props - The component props.
 * @param {any} props.children - The element to be lazy loaded.
 * @param {Function} props.setInView - The hook to set whether the child
 * element is in the viewport.
 * @param {number} [props.height] - The height of the placeholder. Defaults to 400px.
 * @param {number} [props.offset] - The distance from the edge of the viewport
 * before the element is loaded in. Defaults to -100.
 * @returns {React.Component} The lazy loader component.
 */
export const LazyLoader = ({
  children,
  setInView,
  height = 400,
  offset = -100
}: LazyLoaderProps) => {
  const [shouldDetectChange, setDetectivity] = useState(true);

  const toggleVisibility = () => {
    setInView(true);
    setDetectivity(false);
  };

  return (
    <LazyLoad height={height} offset={offset} once>
      <VisibilitySensor
        onChange={toggleVisibility}
        partialVisibility={true}
        active={shouldDetectChange}>
        {children}
      </VisibilitySensor>
    </LazyLoad>
  );
};
