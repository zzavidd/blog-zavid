import styled from 'styled-components';

import * as NavWidgets from 'fragments/shared/NavWidgets';
import CPX from 'stylesv2/Components/Components.styles';
import { IThemeSwitch } from 'stylesv2/Global.styles';
import Mixins from 'stylesv2/Mixins.styles';
import { COLOR, SIZES, FONTS } from 'stylesv2/Variables.styles';

namespace HeaderStyle {
  export const Header = styled.header`
    ${Mixins.Responsive(['display', 'none', { sm: 'flex' }])};
    background-color: ${({ theme }) => theme.headerBackgroundColor};
    border-bottom: 1px solid ${({ theme }) => theme.bodyFontColor};
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    flex: 0 0 ${SIZES.HEADER_HEIGHT};
    justify-content: center;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 2;
  `;

  export const HeaderContent = styled.header`
    ${Mixins.Responsive(
      ['max-width', '900px', { lg: '700px' }],
      ['padding-inline', '0', { sm: '1em' }],
    )};
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 100%;
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

  export const Navigation = styled(NavWidgets.NavigationLinks)`
    align-items: center;
    display: flex;

    ${CPX.Button} {
      ${Mixins.Responsive(['display', 'none', { md: 'block' }])};
      background-color: transparent;
      border: 1px solid ${({ theme }) => theme.bodyFontColor};
      border-radius: 10px;
      box-shadow: 0 0 1px 0 ${COLOR.BLACK};
      color: ${({ theme }) => theme.bodyFontColor};
      font-size: 1em;
      padding: 0.5em 0.8em;
    }

    menu {
      display: none;
    }
  `;

  export const NavigationMenu = styled.menu<{ open: boolean }>`
    ${Mixins.Responsive(['display', 'flex', { sm: 'none' }])};
    align-items: center;
    font-family: ${FONTS.TITLE};
    gap: 1em;
    list-style-type: none;
    margin: 0;
    padding: 0;
    text-transform: uppercase;
    transition: all 0.3s;
  `;

  export const NavigationMenuLink = styled.li`
    font-size: 1.1em;
    transition: all 0.3s;

    a {
      color: ${({ theme }) => theme.bodyFontColor};
      text-decoration: none;
      transition: all 0.3s;
    }

    &:hover {
      transform: scale(1.08);

      a {
        border-bottom: 2px solid ${({ theme }) => theme.bodyFontColor};
      }
    }
  `;

  export const ThemeSwitch = styled(IThemeSwitch)`
    flex: 0 1 60px;
    gap: 0.3em;
    padding: 0.8em;
    user-select: none;

    svg {
      font-size: 125%;
    }
  `;
}

export default HeaderStyle;
