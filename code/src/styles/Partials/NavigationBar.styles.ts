import { darken } from 'polished';
import styled, { css, keyframes } from 'styled-components';

import * as NavWidgets from 'fragments/shared/NavWidgets';
import Mixins from 'styles/Mixins.styles';
import { COLOR, FONTS, SIZES } from 'styles/Variables.styles';

import { INavStyle, IThemeSwitch } from './Shared.styles';

const pulse = keyframes`0%,100%{ transform: scale(1);} 50%{transform: scale(1.04)}`;

namespace NavStyle {
  export const BrandBox = styled.div`
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s;
    width: ${SIZES.MAX_NAV_WIDTH};

    &:hover {
      animation: ${pulse} 1s ease 0s infinite normal both;
      width: 100%;
    }
  `;

  export const BrandLink = styled.a`
    align-items: center;
    display: flex;
    gap: 0.5em;
    text-decoration: none;
  `;

  export const BrandImage = styled(NavWidgets.BrandImage)`
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-self: baseline;
    transition: all 0.3s;
  `;

  export const BrandTagline = styled.h3`
    color: ${({ theme }) => theme.bodyFontColor};
    font-family: ${FONTS.TITLE};
    font-size: 0.85em;
    line-height: 140%;
    margin: 0;
    transform: scale(0);
    transform-origin: left center;
    transition: all 0.3s;

    &:hover {
      text-decoration: underline;
    }
  `;

  export const NavBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  `;

  export const NavigationMenu = styled.menu`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    font-family: ${FONTS.TITLE};
    gap: 1.4em;
    list-style-type: none;
    margin: 0;
    padding: 1em;
    text-transform: uppercase;
    transition: all 0.3s;
  `;

  export const NavItem = styled.a`
    color: ${({ theme }) => theme.bodyFontColor};
    display: grid;
    font-size: 1.1em;
    gap: 1.4em;
    grid-template-columns: 20px 1fr;
    position: relative;
    text-decoration: none;
    transition: all 0.3s;

    svg {
      color: ${({ theme }) => theme.fadedFontColor};
      font-size: 1.4em;
      justify-self: center;
    }

    &:hover {
      transform: scale(1.08);

      span {
        border-bottom: 2px solid ${({ theme }) => theme.bodyFontColor};
      }
    }
  `;

  export const NavItemLabel = styled.span`
    transform: scale(0);
    transform-origin: left center;
    transition: all 0.3s;
  `;

  export const NavItemNewSymbol = styled.sup`
    background-color: #ff3e3e;
    border-radius: 15px;
    color: #e5ff00;
    font-size: 0.5em;
    margin-left: 0.8em;
    padding: 0.2em 0.4em;
  `;

  export const ThemeSwitch = styled(IThemeSwitch)`
    box-sizing: content-box;
    font-size: 0.7em;
    gap: 0.4em;
    max-height: 20px;
    padding: 1em;
  `;

  export const AdminButtonBox = styled.div`
    display: flex;
  `;

  export const AdminButton = styled(NavWidgets.AdminButton)`
    align-items: center;
    background: none;
    border: 1px solid ${({ theme }) => theme.fadedBorderColor};
    border-radius: 10px;
    color: ${({ theme }) => theme.fadedFontColor};
    display: flex;
    flex: 0 1 auto;
    gap: 0;
    justify-content: center;
    max-height: 40px;
    padding: 1em;
    width: 100%;

    &:hover {
      background: ${({ theme }) => darken(-0.1, theme.headerBackgroundColor)};
      color: ${({ theme }) => theme.bodyFontColor};
    }

    &:active {
      background: ${({ theme }) => darken(-0.2, theme.headerBackgroundColor)};
      box-shadow: none;
    }

    &:first-of-type {
      transform: scale(0);
      transform-origin: left center;
      transition: transform 0.3s;
      order: 2;
    }

    &:last-of-type {
      order: 1;
    }

    svg {
      flex: 0;
    }
  `;

  export const AdminButtonLabel = styled.label`
    flex: 0 0;
    min-width: 0;
    pointer-events: none;
    transform: scale(0);
    transform-origin: left center;
    transition: transform 0.3s;
  `;

  const IChildrenStyles = css`
    ${NavStyle.ThemeSwitch} {
      font-size: 1em;
    }

    ${NavStyle.AdminButtonBox} {
      gap: 0.4em;
    }

    ${NavStyle.AdminButton} {
      font-size: 0.9em;
      flex: 1 1 auto;
      gap: 0.7em;
      max-height: 50px;

      &:first-of-type {
        transform: scale(1);
        order: 1;
      }

      &:last-of-type {
        order: 2;
      }
    }

    ${NavStyle.AdminButtonLabel} {
      flex: 0 0 max-content;
      transform: scale(1);
    }

    ${NavStyle.BrandTagline},
    ${NavStyle.NavItemLabel} {
      transform: scale(1);
    }
  `;

  export const Container = styled(INavStyle)<{ focused: boolean }>`
    ${Mixins.Responsive(['display', 'flex', { sm: 'none' }])};
    left: 0;
    padding: 1em 0.5em;
    width: 70px;
    z-index: 3;

    ${({ focused }) =>
      focused &&
      css`
        box-shadow: 0 0 2px 0 ${COLOR.BLACK};
        padding: 1em;
        width: ${SIZES.MAX_NAV_WIDTH};

        ${IChildrenStyles};
      `}
  `;

  export const MobileNavigationBar = styled(INavStyle)<{ open: boolean }>`
    ${Mixins.Responsive(['display', 'none', { sm: 'flex' }])};
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    height: calc(100vh - ${SIZES.HEADER_HEIGHT});
    padding: 1em;
    top: ${SIZES.HEADER_HEIGHT};
    width: ${SIZES.MAX_NAV_WIDTH};
    ${({ open }) =>
      open
        ? css`
            transform: translateX(0);
          `
        : css`
            transform: translateX(-100%);
          `};

    ${IChildrenStyles};
  `;
}

export default NavStyle;
