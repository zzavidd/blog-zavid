import Image from 'next/image';
import styled, { createGlobalStyle } from 'styled-components';

import { FONTS } from 'stylesv2/Variables.styles';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    background-attachment: fixed;
    background-image: ${({ theme }) => `url(${theme.backgroundImage})`};
    background-repeat: no-repeat;
    background-size: cover;
    color: ${({ theme }) => theme.bodyFontColor};
    font-feature-settings: 'lnum';
    height: 100vh;
    margin: 0;
    overscroll-behavior: none;
    transition: all 0.8s;
  }

  div#__next {
    height: 100%;
  }

  h1 {
    font-size: 2.5em;
    font-family: ${FONTS.TITLE};
  }

  p {
    font-family: ${FONTS.BODY};
  }

  img {
    user-select: none;
  }
`;

export const Signature = styled(Image)`
  pointer-events: none;
`;
