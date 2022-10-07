import styled, { keyframes } from 'styled-components';

import * as NavWidgets from 'fragments/shared/NavWidgets';
import { IThemeSwitch } from 'stylesv2/Global.styles';
import Mixins from 'stylesv2/Mixins.styles';
import { COLOR, FONTS } from 'stylesv2/Variables.styles';

const MAX_NAV_WIDTH = '250px';

const pulse = keyframes`0%,100%{ transform: scale(1);} 50%{transform: scale(1.04)}`;

namespace NavStyle {
  export const ThemeSwitch = styled(IThemeSwitch)`
    font-size: 0.7em;
    gap: 0.4em;
    padding: 1em;
  `;

  export const BrandBox = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
    gap: 0.5em;
    overflow: hidden;
    transition: all 0.3s;
    width: ${MAX_NAV_WIDTH};

    &:hover {
      animation: ${pulse} 1s ease 0s infinite normal both;

      h3 {
        text-decoration: underline;
      }
    }
  `;

  export const BrandButton = styled(NavWidgets.BrandButton)`
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-self: baseline;
    transition: all 0.3s;
  `;

  export const BrandTagline = styled.h3`
    color: ${({ theme }) => theme.bodyFontColor};
    font-family: ${FONTS.TITLE};
    font-size: 0.8em;
    margin: 0;
    transform: scale(0);
    transform-origin: left center;
    transition: all 0.3s;
  `;

  export const NavBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
  `;

  export const Navigation = styled(NavWidgets.NavigationLinks)`
    padding: 1em;

    svg {
      justify-self: center;
    }

    a {
      transform: scale(0);
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
    overflow: hidden;
    padding: 1em 0.5em;
    position: fixed;
    top: 0;
    transition: all 0.2s, background-color 0.8s;
    width: 70px;
    z-index: 2;

    &:hover {
      box-shadow: 0 0 2px 0 ${COLOR.BLACK};
      padding: 1em;
      width: ${MAX_NAV_WIDTH};

      ${NavStyle.ThemeSwitch} {
        font-size: 1em;
        padding: 1em;
      }

      ${NavStyle.BrandTagline},
      ${NavStyle.Navigation} a {
        transform: scale(1);
      }
    }
  `;
}

export default NavStyle;
