import { keyframes } from 'styled-components';

namespace Animations {
  export const fadeIn = keyframes`
    0% {opacity: 0;}
    100% {opacity: 1;}
  `;
}

export default Animations;
