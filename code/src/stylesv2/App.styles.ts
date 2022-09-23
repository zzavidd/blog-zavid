import styled, { keyframes } from 'styled-components';

import { COLOR } from 'constants/styling';

const fade = keyframes`
  0% {opacity: 0}
  16% {opacity: 0}
  25% {opacity: 1}
  91% {opacity: 1}
  100% {opacity: 0}
`;

namespace AppStyles {
  export const Snackbar = styled.div`
    bottom: 3%;
    left: 2%;
    position: fixed;
    z-index: 2;
  `;

  export const Snack = styled.div`
    animation: ${fade} 6s ease 0s 1 normal both;
    background-color: rgba(0, 0, 0, 0.85);
    border-radius: 10px;
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    color: ${COLOR.WHITE};
    font-size: 0.9em;
    padding: 1em;
    transition: all 0.3s;
  `;
}

export default AppStyles;
