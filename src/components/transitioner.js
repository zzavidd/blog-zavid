import React, { Component } from 'react';
import { Transition } from 'react-transition-group';

/** Fade transition */
export class Fader extends Component {
  render() {
    const { duration, delay = 0, postTransitions } = this.props;

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
        {...this.props}
        defaultStyle={defaultStyle}
        transitionStyles={transitionStyles}
      />
    );
  }
}

/** Zoom transition */
export class Zoomer extends Component {
  render() {
    const { duration, delay = 0, postTransitions } = this.props;

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
        {...this.props}
        defaultStyle={defaultStyle}
        transitionStyles={transitionStyles}
      />
    );
  }
}

/** Slide transition */
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
  notDiv,
  style,
  transitionStyles
}) => {
  return (
    <Transition in={determinant} timeout={{}}>
      {(state) => {
        if (notDiv) {
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
