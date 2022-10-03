import styled from 'styled-components';

import CPX from './Components/Components.styles';
import Mixins from './Mixins.styles';
import { COLOR, FONTS, SIZES } from './Variables.styles';

export namespace HeaderStyle {
  export const Header = styled.header`
    background-color: #202020;
    border-bottom: 1px solid ${COLOR.WHITE};
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
    ${Mixins.Responsive(['max-width', '900px', { lg: '700px' }])};
    display: flex;
    justify-content: space-between;
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

export namespace FooterStyle {
  export const Container = styled.footer`
    background-color: #111;
    border-top: 1px solid ${COLOR.WHITE};
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
    ${Mixins.ClickBehavior(COLOR.BUTTON.confirm)};
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
