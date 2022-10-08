import styled from 'styled-components';

import * as NavWidgets from 'fragments/shared/NavWidgets';
import CPX from 'stylesv2/Components/Components.styles';
import Mixins from 'stylesv2/Mixins.styles';
import { COLOR, SIZES } from 'stylesv2/Variables.styles';

import { IThemeSwitch } from './Shared.styles';

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

  export const NavToggle = styled(CPX.Button)`
    background: none;
    border: 1px solid ${({ theme }) => theme.fadedBorderColor};
    border-radius: 10px;
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    color: ${({ theme }) => theme.bodyFontColor};
    padding: 0.7em 0.9em;
    transition: transform 0.3s;

    &:active {
      background-color: ${({ theme }) => theme.headerBackgroundColor};
      box-shadow: 0 0 0 0 ${COLOR.BLACK};
      transform: scale(0.95);
    }
  `;

  export const BrandButton = styled(NavWidgets.BrandImage)`
    align-items: center;
    cursor: pointer;
    display: flex;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.08);
    }
  `;

  export const ThemeSwitch = styled(IThemeSwitch)`
    flex: 0 1 60px;
    gap: 0.5em;
    padding: 0.8em;
    user-select: none;

    svg {
      font-size: 125%;
    }
  `;
}

export default HeaderStyle;
