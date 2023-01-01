import styled from 'styled-components';

import CPX from 'styles/Components/Components.styles';
import Mixins from 'styles/Mixins.styles';
import { COLOR, FONTS } from 'styles/Variables.styles';

namespace SubscribeStyle {
  export const Container = styled.div`
    display: flex;
    justify-content: center;
    padding: 0.5em;
  `;

  export const Heading = styled.h2`
    font-family: ${FONTS.TITLE};
    font-size: 2.4em;
    margin: 0;
  `;

  export const Text = styled.p`
    font-size: 1.1em;
    margin: 0;
  `;

  export const Button = styled(CPX.Button)`
    ${({ theme }) => Mixins.ClickBehavior(theme.button.confirm)};
    border: 1px solid ${COLOR.WHITE};
    border-radius: 15px;
    color: ${COLOR.WHITE};
    font-size: 1.1em;
    padding: 1em 2em;
  `;
}

export namespace SubscribePrefStyle {
  export const Container = styled.div`
    display: flex;
    justify-content: center;
    padding: 1em;
  `;

  export const Main = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.5em;
  `;

  export const Heading = styled.h2`
    font-family: ${FONTS.TITLE};
    font-size: 2.4em;
    margin: 0;
  `;

  export const Email = styled.p`
    font-size: 1.1em;
    font-style: italic;
  `;

  export const Text = styled.p`
    font-size: 1.1em;
    margin: 0;
  `;

  export const PrefList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    list-style-type: none;
    padding: 0.5em 0;

    li {
      font-family: ${FONTS.BODY};
      font-size: 1.2em;
    }
  `;

  export const Button = styled(CPX.Button)`
    ${({ theme }) => Mixins.ClickBehavior(theme.button.confirm)};
    border: 1px solid ${COLOR.WHITE};
    border-radius: 15px;
    color: ${COLOR.WHITE};
    font-size: 1.1em;
    padding: 1em 2em;
  `;

  export const HyperlinkButton = styled.p`
    color: ${({ theme }) => theme.Hyperlink};
    cursor: pointer;
    font-size: 1em;
    margin-top: 1em;
    text-decoration: underline;
  `;
}

export default SubscribeStyle;
