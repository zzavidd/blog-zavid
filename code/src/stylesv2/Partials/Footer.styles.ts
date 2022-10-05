import styled from 'styled-components';

import CPX from 'stylesv2/Components/Components.styles';
import Mixins from 'stylesv2/Mixins.styles';
import { FONTS, COLOR } from 'stylesv2/Variables.styles';

namespace FooterStyle {
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

export default FooterStyle;
