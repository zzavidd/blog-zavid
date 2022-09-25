import styled, { keyframes, css } from 'styled-components';

import { COLOR } from 'constants/styling';

const fadeInOut = keyframes`
  0% {opacity: 0}
  16% {opacity: 0}
  25% {opacity: 1}
  91% {opacity: 1}
  100% {opacity: 0}
`;
const fadeIn = keyframes`
  0% {opacity: 0}
  100% {opacity: 1}
`;

namespace AppStyles {
  export const Snackbar = styled.div`
    bottom: 3%;
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    left: 2%;
    pointer-events: none;
    position: fixed;
    z-index: 2;
  `;

  export const Snack = styled.div<{ duration?: number | 'indefinite' }>`
    ${({ duration }) =>
      duration === 'indefinite'
        ? css`
            animation: ${fadeIn} 0.3s ease 0s 1 normal both;
          `
        : css`
            animation: ${fadeInOut} ${duration || 6000}ms ease 0s 1 normal both;
          `};
    background-color: rgba(0, 0, 0, 0.85);
    border-radius: 10px;
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    color: ${COLOR.WHITE};
    display: flex;
    font-size: 0.9em;
    gap: 0.4em;
    padding: 1em;
    pointer-events: auto;
    transition: all 0.3s;
  `;
}

export default AppStyles;
