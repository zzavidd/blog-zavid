import React from 'react';
import { Transition } from 'react-transition-group';

export const Fader = (props) => {
  const { duration, delay = 0, postTransitions } = props;

  const defaultStyle = {
    transition: `opacity ${duration}ms ease ${delay}ms`,
    opacity: 0
  };

  const transitionStyles = {
    entered: {
      opacity: 1,
      transition: `${defaultStyle.transition}, ${postTransitions}`
    },
    exited: defaultStyle
  };

  return (
    <Template
      {...props}
      defaultStyle={defaultStyle}
      transitionStyles={transitionStyles}
    />
  );
};

export const Zoomer = (props) => {
  const { duration, delay = 0, postTransitions } = props;

  const defaultStyle = {
    transition: `transform ${duration}ms ease ${delay}ms`,
    transform: 'scale(0)'
  };

  const transitionStyles = {
    entered: {
      transform: 'scale(1)',
      transition: `${defaultStyle.transition}, ${postTransitions}`
    },
    exited: defaultStyle
  };

  return (
    <Template
      {...props}
      defaultStyle={defaultStyle}
      transitionStyles={transitionStyles}
    />
  );
};

export const Slider = (props) => {
  const { duration, delay = 0, direction, postTransitions = '' } = props;

  const defaultStyle = {
    transition: `${direction} ${duration}ms ease ${delay}ms,
        opacity ${duration}ms ease ${delay}ms`,
    opacity: 0,
    position: 'relative'
  };

  const transitionStyles = {
    entering: {
      [direction]: '-100vw'
    },
    entered: {
      [direction]: 0,
      opacity: 1,
      transition: `${defaultStyle.transition}, ${postTransitions}`
    }
  };

  return (
    <Template
      {...props}
      defaultStyle={defaultStyle}
      transitionStyles={transitionStyles}
    />
  );
};

const Template = ({
  children,
  className,
  defaultStyle,
  determinant,
  hollow,
  style,
  transitionStyles
}) => {
  return (
    <Transition in={determinant} timeout={{}}>
      {(state) => {
        if (hollow) {
          return React.cloneElement(children, {
            style: { ...defaultStyle, ...transitionStyles[state], ...style }
          });
        } else {
          return (
            <div
              className={className}
              style={{
                ...defaultStyle,
                ...transitionStyles[state],
                ...style
              }}>
              {children}
            </div>
          );
        }
      }}
    </Transition>
  );
};
