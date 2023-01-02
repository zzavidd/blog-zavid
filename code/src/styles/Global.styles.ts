import Image from 'next/image';
import styled, { createGlobalStyle } from 'styled-components';

import Mixins from './Mixins.styles';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    background-color: ${({ theme }) => theme.Color.Background.Header};
    background-attachment: fixed;
    background-image: ${({ theme }) => `url(${theme.Image.Background})`};
    background-repeat: no-repeat;
    background-size: cover;
    color: ${({ theme }) => theme.Color.Font.Body};
    font-feature-settings: 'lnum';
    height: 100vh;
    margin: 0;
    overscroll-behavior: none;
    position: relative;
    transition: background-image 0.8s;
  }

  div#__next {
    ${Mixins.Responsive(['height', '100%', { sm: 'auto' }])};
    display: flex;
    flex-direction: column;
  }

  h1, h2, h3 {
    ${Mixins.Responsive(['letter-spacing', '0px', { sm: '-1px' }])};
    font-family: ${({ theme }) => theme.Font.Title};
  }

  p {
    font-family: ${({ theme }) => theme.Font.Body};
  }

  img {
    user-select: none;
  }
`;

export const Body = styled.div`
  display: flex;
  flex: 1;
`;

export const BodyContent = styled.div`
  ${Mixins.Responsive(['margin-left', '70px', { sm: 0 }])}
  width: 100%;
`;

export const Signature = styled(Image)`
  pointer-events: none;
`;

export const HoneyPot = styled.input.attrs({
  type: 'text',
  name: 'password',
})`
  display: none;
`;
