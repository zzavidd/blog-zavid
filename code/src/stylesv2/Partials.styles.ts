import styled from 'styled-components';

import Mixins from './Mixins.styles';
import { COLOR, FONTS } from './Variables.styles';

export namespace HeaderStyle {
  export const Header = styled.header`
    background-color: #202020;
    border-bottom: 1px solid ${COLOR.WHITE};
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    display: flex;
    flex: 0 0 70px;
    justify-content: center;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 2;
  `;

  export const HeaderContent = styled.header`
    display: flex;
    justify-content: space-between;
    max-width: 800px;
    width: 100%;
  `;

  export const BrandContainer = styled.a`
    align-items: center;
    cursor: pointer;
    display: flex;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.08);
    }
  `;

  export const Navigation = styled.nav`
    align-items: center;
    display: flex;
  `;

  export const NavToggle = styled.button`
    ${Mixins.Responsive(['display', 'none', { md: 'block' }])}
  `;

  export const NavigationMenu = styled.menu<{ open: boolean }>`
    align-items: center;
    display: flex;
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
}
