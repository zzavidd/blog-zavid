import { darken } from 'polished';
import styled from 'styled-components';

import CPX from './Components/Components.styles';
import Mixins from './Mixins.styles';
import { COLOR, FONTS, SIZES } from './Variables.styles';

export namespace HeaderStyle {
  export const Header = styled.header`
    background-color: ${({ theme }) => theme.headerBackgroundColor};
    border-bottom: 1px solid ${({ theme }) => theme.bodyFontColor};
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    display: flex;
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

  export const BrandContainer = styled.a`
    ${Mixins.Responsive(['order', '1', { sm: '2' }])};
    align-items: center;
    cursor: pointer;
    display: flex;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.08);
    }
  `;

  export const Navigation = styled.nav`
    ${Mixins.Responsive(['order', '2', { sm: '1' }])};
    align-items: center;
    display: flex;
  `;

  export const NavToggle = styled(CPX.Button)`
    ${Mixins.Responsive(['display', 'none', { md: 'block' }])};
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.bodyFontColor};
    border-radius: 10px;
    box-shadow: 0 0 1px 0 ${COLOR.BLACK};
    color: ${({ theme }) => theme.bodyFontColor};
    font-size: 1em;
    padding: 0.5em 0.8em;
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

  export const ThemeSwitch = styled(CPX.Button)`
    align-items: center;
    background: none;
    border-radius: 10px;
    box-shadow: 0 0 1px 0 ${({ theme }) => theme.bodyFontColor};
    color: ${({ theme }) => theme.fadedFontColor};
    display: flex;
    flex: 0 1 60px;
    gap: 0.3em;
    height: fit-content;
    justify-content: center;
    order: 3;
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

  export const ThemeSwitchLabel = styled.label`
    font-size: 0.6em;
    pointer-events: none;
    user-select: none;
  `;
}

export namespace FooterStyle {
  export const Container = styled.footer`
    background-color: ${({ theme }) => theme.footerBackgroundColor};
    border-top: 1px solid ${({ theme }) => theme.bodyFontColor};
    display: flex;
    justify-content: center;
    width: 100%;
  `;

  export const Content = styled.div`
    ${Mixins.Responsive(['max-width', '900px', { lg: '700px' }])};
    display: flex;
    flex-direction: column;
    padding: 1em 2em;
    width: 100%;
  `;

  export const Heading = styled.h3`
    font-family: ${FONTS.TITLE};
    font-size: 1.2em;
    text-transform: uppercase;
  `;

  export const Summary = styled.p`
    margin-bottom: 0.4em;
  `;

  export const Row = styled.section`
    ${Mixins.Responsive(
      ['flex-direction', 'row', { md: 'column' }],
      ['gap', '1em', { md: '2em' }],
    )}
    display: flex;
    justify-content: space-between;
  `;

  export const LinksMenuBox = styled.div`
    ${Mixins.Responsive(['order', 1, { md: 3 }])}
  `;

  export const LinksMenu = styled.menu`
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    list-style-type: none;
    padding: 0;

    a {
      color: ${({ theme }) => theme.bodyFontColor};
      font-family: ${FONTS.BODY};
      font-size: 1.1em;
      font-weight: bold;
      text-decoration: none;
      transition: all 0.3s;

      &:hover {
        text-decoration: underline;
      }
    }
  `;

  export const SocialPlugsBox = styled.div`
    ${Mixins.Responsive(['order', 2, { md: 1 }])}
  `;

  export const SocialIcons = styled.div`
    display: flex;
    gap: 1em;

    a {
      color: ${({ theme }) => theme.bodyFontColor};
      font-size: 3em;
      transition: all 0.3s;

      &:hover {
        transform: scale(1.1);
      }
    }
  `;

  export const SubscribeFormBox = styled.div`
    ${Mixins.Responsive(['order', 3, { md: 1 }])}
  `;

  export const SubscribeButton = styled(CPX.Button)`
    ${({ theme }) => Mixins.ClickBehavior(theme.button.confirm)};
    border: 1px solid ${COLOR.WHITE};
    border-radius: 20px;
    color: ${COLOR.WHITE};
    font-size: 1em;
    margin-top: 1em;
    padding: 1em 2em;
  `;

  export const HoneyPot = styled.input.attrs({
    type: 'text',
    name: 'password',
  })`
    display: none;
  `;

  export const CopyrightBox = styled.section`
    display: flex;
    justify-content: flex-start;
    padding-block: 1em;
  `;

  export const Copyright = styled.small`
    font-family: ${FONTS.TITLE};
    font-size: 1em;
  `;
}
