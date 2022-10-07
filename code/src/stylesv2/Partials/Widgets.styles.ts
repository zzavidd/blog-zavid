import styled from 'styled-components';

import { FONTS } from 'stylesv2/Variables.styles';

namespace WidgetStyle {
  export const Navigation = styled.nav`
    align-items: center;
    display: flex;
  `;

  export const NavigationMenu = styled.menu`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    font-family: ${FONTS.TITLE};
    gap: 1.4em;
    list-style-type: none;
    margin: 0;
    padding: 0;
    text-transform: uppercase;
    transition: all 0.3s;
  `;

  export const NavItem = styled.li`
    display: grid;
    font-size: 1.1em;
    gap: 1.4em;
    grid-template-columns: 20px 1fr;
    transform-origin: left center;
    transition: all 0.3s;

    svg {
      color: ${({ theme }) => theme.fadedFontColor};
      font-size: 1.4em;
    }

    a {
      color: ${({ theme }) => theme.bodyFontColor};
      font-size: 1.1em;
      text-decoration: none;
      transition: all 0.3s;
      transform-origin: left center;
    }

    &:hover {
      transform: scale(1.08);

      a {
        border-bottom: 2px solid ${({ theme }) => theme.bodyFontColor};
      }
    }
  `;
}

export default WidgetStyle;
