import styled from 'styled-components';

import * as NavWidgets from 'fragments/shared/NavWidgets';
import { IThemeSwitch } from 'stylesv2/Global.styles';
import Mixins from 'stylesv2/Mixins.styles';
import { COLOR } from 'stylesv2/Variables.styles';

namespace NavStyle {
  export const ThemeSwitch = styled(IThemeSwitch)`
    font-size: 0.7em;
    gap: 0.4em;
    padding: 1em;
  `;

  export const BrandButton = styled(NavWidgets.BrandButton)`
    align-items: center;
    cursor: pointer;
    display: flex;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.08);
    }
  `;

  export const Container = styled.aside`
    ${Mixins.Responsive(['display', 'flex', { sm: 'none' }])}
    background-color: ${({ theme }) => theme.headerBackgroundColor};
    border-right: 1px solid ${({ theme }) => theme.bodyFontColor};
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: space-between;
    padding: 1em 0.5em;
    position: fixed;
    top: 0;
    transition: all 0.2s, background-color 0.8s;
    width: 70px;
    z-index: 2;

    &:hover {
      box-shadow: 0 0 2px 0 ${COLOR.BLACK};
      padding: 1em;
      width: 250px;

      ${NavStyle.ThemeSwitch} {
        font-size: 1em;
        padding: 1em;
      }
    }
  `;
}

export default NavStyle;
