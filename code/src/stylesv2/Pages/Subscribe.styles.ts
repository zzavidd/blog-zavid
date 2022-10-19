import styled from 'styled-components';

import CPX from 'stylesv2/Components/Components.styles';
import Mixins from 'stylesv2/Mixins.styles';
import { COLOR, FONTS } from 'stylesv2/Variables.styles';

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

export default SubscribeStyle;
