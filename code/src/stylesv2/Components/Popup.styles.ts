import { darken } from 'polished';
import styled, { keyframes, css } from 'styled-components';

import type { AlertType } from 'constants/types';
import Mixins from 'stylesv2/Mixins.styles';
import { COLOR, FONTS } from 'stylesv2/Variables.styles';

const alertFadeInOut = keyframes`
  0%, 16% {opacity: 0; pointer-events: auto;}
  16%, 91% {opacity: 1; pointer-events: auto;}
  100% {opacity: 0; pointer-events: none;}
`;

const snackFadeInOut = keyframes`
  0%, 16% {opacity: 0; pointer-events: auto;}
  25%, 91% {opacity: 1; pointer-events: auto;}
  100% {opacity: 0; pointer-events: none;}
`;
const fadeIn = keyframes`
  0% {opacity: 0;}
  100% {opacity: 1;}
`;

export namespace Alert {
  export const Container = styled.div`
    align-items: center;
    bottom: 3%;
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    justify-content: center;
    pointer-events: none;
    position: fixed;
    width: 100vw;
    z-index: 2;
  `;

  export const Dialog = styled.div<{ type: AlertType }>`
    animation: ${alertFadeInOut} ${4500}ms ease 0s 1 normal both;
    background-color: ${({ type }) => COLOR.ALERT[type]};
    border-radius: 10px;
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    color: ${({ type }) => darken(1, COLOR.ALERT[type])};
    cursor: pointer;
    display: flex;
    font-family: ${FONTS.BODY};
    font-size: 0.9em;
    font-weight: bold;
    gap: 0.4em;
    justify-content: center;
    max-width: 500px;
    padding: 1.2em;
    pointer-events: auto;
    text-align: center;
    transition: all 0.3s;
    width: 100%;
  `;
}

export namespace CookieStyle {
  export const Container = styled.div<{ visible: boolean }>`
    ${({ visible }) =>
      visible
        ? css`
            animation: ${fadeIn} 0.3s ease 2s 1 normal both;
            pointer-events: auto;
          `
        : css`
            opacity: 0;
            pointer-events: none;
          `}
    align-items: center;
    background-color: rgba(0, 0, 0, 0.9);
    bottom: 0;
    display: flex;
    justify-content: center;
    position: fixed;
    width: 100%;
    z-index: 2;
  `;

  export const Dialog = styled.div`
    display: flex;
    gap: 0.5em;
    max-width: 650px;
    padding: 1em;
  `;

  export const Text = styled.p`
    color: ${COLOR.WHITE};
    ${Mixins.Responsive(['font-size', '1em', { sm: '0.8em' }])}
    margin: 0;
  `;
}

export namespace Snack {
  export const Container = styled.div`
    bottom: 3%;
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    left: 2%;
    pointer-events: none;
    position: fixed;
    z-index: 2;
  `;

  export const Dialog = styled.div<{ duration?: number | 'indefinite' }>`
    ${({ duration }) =>
      duration === 'indefinite'
        ? css`
            animation: ${fadeIn} 0.3s ease 0s 1 normal both;
          `
        : css`
            animation: ${snackFadeInOut} ${duration || 6000}ms ease 0s 1 normal
              both;
          `};
    background-color: rgba(0, 0, 0, 0.85);
    border-radius: 10px;
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    color: ${COLOR.WHITE};
    display: flex;
    font-family: ${FONTS.BODY};
    font-size: 0.9em;
    gap: 0.4em;
    padding: 1em;
    pointer-events: auto;
    transition: all 0.3s;

    svg {
      color: ${COLOR.WHITE};
    }
  `;
}
