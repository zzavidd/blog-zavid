import { darken } from 'polished';
import styled from 'styled-components';

import * as NavWidgets from 'fragments/shared/NavWidgets';

export const INavStyle = styled.aside`
  background-color: ${({ theme }) => theme.Color.Background.Header};
  border-right: 1px solid ${({ theme }) => theme.Color.Font.Body};
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
  border: 1px solid ${({ theme }) => theme.Color.Border.Faded};
  border-radius: 10px;
  box-shadow: 0 0 1px 0 ${({ theme }) => theme.Color.Font.Body};
  color: ${({ theme }) => theme.Color.Font.Faded};
  display: flex;
  height: fit-content;
  justify-content: center;
  padding: 0.8em;
  transition: all 0.3s;

  &:hover {
    background: ${({ theme }) => darken(-0.1, theme.Color.Background.Header)};
    color: ${({ theme }) => theme.Color.Font.Body};
  }

  &:active {
    background: ${({ theme }) => darken(-0.2, theme.Color.Background.Header)};
    box-shadow: none;
  }
`;
