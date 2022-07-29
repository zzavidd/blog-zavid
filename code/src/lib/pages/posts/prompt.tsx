import React from 'react';
import { Overlay } from 'react-bootstrap';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { Theme } from 'classes';
import { InvisibleButton } from 'src/components/button';
import { Icon, ScreenWidth } from 'src/lib/library';

const OVERLAY_CONSTANTS = {
  [Theme.LIGHT]: {
    backgroundColor: 'rgb(168 131 187)',
    boxShadowColor: 'rgba(255, 255, 255, 0.2)',
  },
  [Theme.DARK]: {
    backgroundColor: 'rgb(119, 77, 140)',
    boxShadowColor: 'rgba(0, 0, 0, 0.2)',
  },
};

export const CuratePrompt = ({
  target,
  visible,
  onHide,
  onClick,
}: CuratePromptProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const isMedium = useMediaQuery({ query: ScreenWidth.MEDIUM });

  const { backgroundColor, boxShadowColor } = OVERLAY_CONSTANTS[theme];
  return (
    <>
      <Overlay
        target={target!}
        show={visible}
        onHide={onHide}
        placement={isMedium ? 'top-end' : 'right'}
        rootClose={true}>
        {({ ...props }) => {
          return (
            <div
              {...props}
              style={{
                backgroundColor: backgroundColor,
                boxShadow: `0 0 5px 3px ${boxShadowColor}`,
                borderRadius: '5px',
                padding: '0.2em 0.6em',
                ...props.style,
              }}>
              <Icon name={'image'} withRightSpace={false} />
              <InvisibleButton onClick={onClick}>Curate</InvisibleButton>
            </div>
          );
        }}
      </Overlay>
    </>
  );
};

type CuratePromptProps = {
  target: HTMLElement;
  visible: boolean;
  onHide: () => void;
  onClick: () => void;
};
