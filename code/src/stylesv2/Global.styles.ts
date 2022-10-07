import Image from 'next/image';
import { darken } from 'polished';
import styled, { createGlobalStyle } from 'styled-components';

import * as Widgets from 'fragments/shared/NavWidgets';
import { FONTS } from 'stylesv2/Variables.styles';

import Mixins from './Mixins.styles';

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
    position: relative;
    transition: background 0.8s;
  }

  div#__next {
    display: flex;
    flex-direction: column;
  }

  h1 {
    font-family: ${FONTS.TITLE};
  }

  p {
    font-family: ${FONTS.BODY};
  }

  img {
    user-select: none;
  }
`;

export const Body = styled.div`
  display: flex;
`;

export const BodyContent = styled.div`
  ${Mixins.Responsive(['margin-left', '70px', { sm: 0 }])}
  width: 100%;
`;

export const Signature = styled(Image)`
  pointer-events: none;
`;

export const IThemeSwitch = styled(Widgets.ThemeSwitch)`
  align-items: center;
  background: none;
  border-radius: 10px;
  box-shadow: 0 0 1px 0 ${({ theme }) => theme.bodyFontColor};
  color: ${({ theme }) => theme.fadedFontColor};
  display: flex;
  height: fit-content;
  justify-content: center;
  padding: 0.8em;
  transition: all 0.3s;

  &:hover {
    background: ${({ theme }) => darken(-0.1, theme.headerBackgroundColor)};
    color: ${({ theme }) => theme.bodyFontColor};
  }

  &:active {
    background: ${({ theme }) => darken(-0.2, theme.headerBackgroundColor)};
    box-shadow: none;
  }
`;
