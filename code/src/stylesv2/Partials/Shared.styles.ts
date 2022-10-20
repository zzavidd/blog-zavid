import { darken } from 'polished';
import styled from 'styled-components';

import * as NavWidgets from 'fragments/shared/NavWidgets';

export const INavStyle = styled.aside`
  background-color: ${({ theme }) => theme.headerBackgroundColor};
  border-right: 1px solid ${({ theme }) => theme.bodyFontColor};
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  overflow: hidden;
  position: fixed;
  transition: all 0.2s, background-color 0.8s;
  z-index: 2;
`;

export const IThemeSwitch = styled(NavWidgets.ThemeSwitch)`
  align-items: center;
  background: none;
  border: 1px solid ${({ theme }) => theme.fadedBorderColor};
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
