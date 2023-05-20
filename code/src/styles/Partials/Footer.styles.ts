import styled from 'styled-components';

import CPX from 'styles/Components/Components.styles';
import Mixins from 'styles/Mixins.styles';
import { COLOR } from 'styles/Variables.styles';

namespace FooterStyle {
  export const Container = styled.footer`
    display: flex;
    flex: 0;
    justify-content: center;
    transition: all 0.8s;
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
      ${Mixins.Responsive(['font-size', '1.1em', { md: '1em' }])}
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
    border: 1px solid ${COLOR.WHITE};
    border-radius: 20px;
    color: ${COLOR.WHITE};
    font-size: 1em;
    margin-top: 1em;
    padding: 1em 2em;
  `;

  export const CopyrightBox = styled.section`
    display: flex;
    justify-content: flex-start;
    padding-block: 1em;
  `;

  export const Copyright = styled.small`
    font-size: 1em;
  `;
}

export default FooterStyle;
